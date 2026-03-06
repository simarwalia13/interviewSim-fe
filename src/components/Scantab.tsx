// components/form/ScanTab.tsx
// 100% FREE — No API keys, no cost, no data leaves the browser.
// Stack: Tesseract.js (browser OCR) + PDF.js (PDF text) + smart regex parser

'use client';

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  ImageIcon,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
  X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { generateId } from '@/store/utils';

// ─── Type Definitions ─────────────────────────────────────────────────────

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface ExtractedQuestion {
  id: string;
  type: 'text' | 'multiple_choice' | 'yes_no' | 'number';
  title: string;
  required: boolean;
  points: number;
  options?: QuestionOption[];
}

interface TesseractLoggerMessage {
  status: string;
  progress: number;
}

interface PDFItem {
  str: string;
}

// Extend Window interface for PDF.js
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

// ─── Supported file types ─────────────────────────────────────────────────────

const SUPPORTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'application/pdf',
  'text/plain',
];

const SUPPORTED_LABELS = ['PNG', 'JPG', 'WEBP', 'PDF', 'TXT'];

// ─── Lazy-load Tesseract.js ───────────────────────────────────────────────────

let tesseractPromise: Promise<any> | null = null;

function getTesseract() {
  if (!tesseractPromise) {
    tesseractPromise = import('tesseract.js');
  }
  return tesseractPromise;
}

// ─── PDF.js text extraction ───────────────────────────────────────────────────

async function extractTextFromPdf(file: File): Promise<string> {
  if (!window.pdfjsLib) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load PDF.js'));
      document.head.appendChild(script);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: PDFItem) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
}

// ─── OCR image with Tesseract.js ──────────────────────────────────────────────

async function ocrImage(
  file: File,
  onProgress: (progress: number) => void
): Promise<string> {
  const { createWorker } = await getTesseract();
  const worker = await createWorker('eng', 1, {
    logger: (m: TesseractLoggerMessage) => {
      if (m.status === 'recognizing text') {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });
  const url = URL.createObjectURL(file);
  const { data } = await worker.recognize(url);
  await worker.terminate();
  URL.revokeObjectURL(url);
  return data.text;
}

// ─── Smart Regex Question Parser ─────────────────────────────────────────────

interface ParseBlock {
  questionText: string;
  lines: string[];
}

interface ParsedOption {
  key: string;
  text: string;
}

function parseQuestionsFromText(rawText: string): ExtractedQuestion[] {
  const lines = rawText
    .split(/\n/)
    .map((l: string) => l.trim())
    .filter(Boolean);

  // ── Split into question blocks ────────────────────────────────────────────

  const qStartRe =
    /^(?:Q\.?\s*)?(\d+)[.)]\s+(.+)|^(?:Question\s+\d+[.:]\s*)(.+)/i;

  const blocks: ParseBlock[] = [];
  let current: ParseBlock | null = null;

  for (const line of lines) {
    const m = line.match(qStartRe);
    if (m) {
      if (current) blocks.push(current);
      current = { questionText: (m[2] || m[3] || '').trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) blocks.push(current);

  // Fallback: paragraph-based splitting if no numbered questions found
  if (blocks.length === 0) {
    const paragraphs = rawText
      .split(/\n{2,}/)
      .map((p: string) => p.trim())
      .filter(Boolean);
    for (const para of paragraphs) {
      const paraLines = para
        .split('\n')
        .map((l: string) => l.trim())
        .filter(Boolean);
      if (paraLines.length >= 1) {
        blocks.push({ questionText: paraLines[0], lines: paraLines.slice(1) });
      }
    }
  }

  // ── Parse each block into a Question ──────────────────────────────────────

  const optionRe = /^(?:\(([A-Ea-e1-5])\)|([A-Ea-e1-5])[.)]\s+)(.+)/;
  const answerRe =
    /^(?:ans(?:wer)?|correct|key)\s*[\s:-]?\s*\(?([A-Ea-e1-5])\)?/i;
  // Hyphen at the end - no escape needed

  const questions: ExtractedQuestion[] = [];

  for (const block of blocks) {
    if (!block.questionText) continue;

    const options: ParsedOption[] = [];
    let correctKey: string | null = null;
    let questionFull = block.questionText;
    const remaining = [...block.lines];

    // Absorb continuation lines before first option
    while (
      remaining.length &&
      !optionRe.test(remaining[0]) &&
      !answerRe.test(remaining[0])
    ) {
      const cont = remaining.shift();
      if (cont && answerRe.test(cont)) {
        remaining.unshift(cont);
        break;
      }
      if (cont) questionFull += ' ' + cont;
    }

    // Detect inline options: "(A) x (B) y (C) z" inside the question line
    const inlineRe = /\(([A-Ea-e])\)\s*([^(]+)/g;
    let inlineMatch: RegExpExecArray | null;
    let hasInline = false;
    while ((inlineMatch = inlineRe.exec(questionFull)) !== null) {
      hasInline = true;
      options.push({
        key: inlineMatch[1].toUpperCase(),
        text: inlineMatch[2].trim(),
      });
    }
    if (hasInline) {
      questionFull = questionFull
        .replace(/\s*\([A-Ea-e]\)\s*[^(]+/g, '')
        .trim();
    }

    // Parse option + answer lines
    for (const line of remaining) {
      const am = line.match(answerRe);
      if (am) {
        correctKey = am[1].toUpperCase();
        continue;
      }

      const om = line.match(optionRe);
      if (om) {
        options.push({
          key: (om[1] || om[2]).toUpperCase(),
          text: om[3].trim(),
        });
      }
    }

    // Determine question type
    let type: 'text' | 'multiple_choice' | 'yes_no' | 'number' = 'text';
    if (options.length >= 2) type = 'multiple_choice';
    else if (/true|false/i.test(questionFull)) type = 'yes_no';
    else if (
      /\b(how many|calculate|find the value|compute)\b/i.test(questionFull)
    )
      type = 'number';

    // Build final question object
    const q: ExtractedQuestion = {
      id: generateId(),
      type,
      title: questionFull.replace(/\s+/g, ' ').trim(),
      required: true,
      points: 10,
    };

    if (type === 'multiple_choice' && options.length >= 2) {
      q.options = options.map((o) => ({
        id: generateId(),
        text: o.text,
        isCorrect: correctKey ? o.key === correctKey : false,
      }));
    }

    if (type === 'yes_no') {
      q.options = [
        { id: generateId(), text: 'True', isCorrect: false },
        { id: generateId(), text: 'False', isCorrect: false },
      ];
    }

    if (q.title.length > 5) questions.push(q);
  }

  return questions;
}

// ─── Extracted Question Card Props ────────────────────────────────────────────

interface ExtractedQuestionCardProps {
  question: ExtractedQuestion;
  index: number;
  selected: boolean;
  onToggle: (index: number) => void;
}

function ExtractedQuestionCard({
  question,
  index,
  selected,
  onToggle,
}: ExtractedQuestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasOptions = question.options && question.options.length > 0;

  return (
    <div
      className={`rounded-xl border-2 transition-all duration-200 ${
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border bg-card hover:border-primary/30'
      }`}
    >
      <div className='flex items-start gap-3 p-4'>
        {/* Select checkbox */}
        <button
          onClick={() => onToggle(index)}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
            selected
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground/30'
          }`}
          type='button'
        >
          {selected && <CheckCircle2 className='h-3.5 w-3.5' />}
        </button>

        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='outline' className='text-xs capitalize'>
              {question.type.replace('_', ' ')}
            </Badge>
            {hasOptions && question.options?.some((o) => o.isCorrect) && (
              <Badge className='border-emerald-200 bg-emerald-500/10 text-xs text-emerald-600'>
                ✓ Answer detected
              </Badge>
            )}
          </div>

          <p className='mt-1.5 text-sm font-medium leading-snug'>
            {question.title}
          </p>

          {hasOptions && (
            <div className='mt-2'>
              <button
                onClick={() => setExpanded((v) => !v)}
                className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs'
                type='button'
              >
                {expanded ? (
                  <ChevronUp className='h-3 w-3' />
                ) : (
                  <ChevronDown className='h-3 w-3' />
                )}
                {question.options?.length} options
              </button>

              {expanded && (
                <ul className='mt-2 space-y-1'>
                  {question.options?.map((opt, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs ${
                        opt.isCorrect
                          ? 'bg-emerald-50 font-medium text-emerald-700'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {opt.isCorrect ? (
                        <CheckCircle2 className='h-3 w-3 shrink-0 text-emerald-500' />
                      ) : (
                        <span className='h-3 w-3 shrink-0' />
                      )}
                      {opt.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── OCR Progress Bar ─────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number;
  label: string;
}

function ProgressBar({ value, label }: ProgressBarProps) {
  return (
    <div className='space-y-1.5'>
      <div className='text-muted-foreground flex justify-between text-xs'>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className='bg-muted h-2 w-full overflow-hidden rounded-full'>
        <div
          className='bg-primary h-full rounded-full transition-all duration-300'
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main ScanTab Component ───────────────────────────────────────────────────

interface ScanTabProps {
  onQuestionsExtracted: (questions: ExtractedQuestion[]) => void;
}

export default function ScanTab({ onQuestionsExtracted }: ScanTabProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<
    'idle' | 'processing' | 'done' | 'error'
  >('idle');
  const [stage, setStage] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [extracted, setExtracted] = useState<ExtractedQuestion[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [rawTextPreview, setRawTextPreview] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const reset = () => {
    setFile(null);
    setPreview(null);
    setStatus('idle');
    setStage('');
    setOcrProgress(0);
    setExtracted([]);
    setSelected(new Set());
    setRawTextPreview('');
    setErrorMsg('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!SUPPORTED_TYPES.includes(f.type)) {
      toast.error(`Unsupported file. Use: ${SUPPORTED_LABELS.join(', ')}`);
      return;
    }
    if (f.size > 15 * 1024 * 1024) {
      toast.error('File too large. Max 15MB.');
      return;
    }
    setFile(f);
    setExtracted([]);
    setSelected(new Set());
    setErrorMsg('');
    setStatus('idle');
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      const fakeEvent = {
        target: { files: [f] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  };

  const processFile = async () => {
    if (!file) return;
    setStatus('processing');
    setOcrProgress(0);
    setErrorMsg('');

    try {
      let rawText = '';

      if (file.type === 'text/plain') {
        setStage('Reading text file…');
        rawText = await file.text();
      } else if (file.type === 'application/pdf') {
        setStage('Extracting text from PDF…');
        rawText = await extractTextFromPdf(file);
        if (!rawText.trim()) {
          throw new Error(
            'This PDF appears to be scanned (image-based). Please export it as a PNG/JPG and upload that instead.'
          );
        }
      } else if (file.type.startsWith('image/')) {
        setStage('Running OCR — this may take 10–30 seconds…');
        rawText = await ocrImage(file, (pct) => setOcrProgress(pct));
        setOcrProgress(100);
      }

      setRawTextPreview(rawText.slice(0, 400));

      if (!rawText.trim())
        throw new Error('No readable text found in this file.');

      setStage('Parsing questions…');
      await new Promise((r) => setTimeout(r, 150));

      const questions = parseQuestionsFromText(rawText);

      if (questions.length === 0) {
        throw new Error(
          'No questions detected. Check the formatting tips below.'
        );
      }

      setExtracted(questions);
      setSelected(new Set(questions.map((_, i) => i)));
      setStatus('done');
      toast.success(`✨ Found ${questions.length} questions!`);
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Processing failed.');
      setStatus('error');
    }
  };

  const toggleSelect = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const addToForm = () => {
    const toAdd = extracted.filter((_, i) => selected.has(i));
    if (!toAdd.length) {
      toast.error('Select at least one question.');
      return;
    }
    onQuestionsExtracted(toAdd);
    toast.success(`Added ${toAdd.length} questions to your form! 🎉`);
    reset();
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className='space-y-4'>
      {/* ── Upload dropzone ── */}
      {!file ? (
        <Card>
          <CardContent className='pt-6'>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className='border-border hover:border-primary/50 hover:bg-primary/5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200'
            >
              <div className='bg-primary/10 mb-4 rounded-2xl p-4'>
                <Wand2 className='text-primary h-8 w-8' />
              </div>
              <h3 className='font-heading mb-1 text-lg font-semibold'>
                Auto-Extract Questions
              </h3>
              <p className='text-muted-foreground mb-1 max-w-sm text-sm'>
                Upload a question paper and we'll detect and parse all questions
                into your form — 100% free, runs entirely in your browser.
              </p>
              <p className='text-muted-foreground mb-5 text-xs'>
                Works best with typed/digital documents. Handwritten results may
                vary.
              </p>
              <div className='mb-4 flex flex-wrap justify-center gap-2'>
                {SUPPORTED_LABELS.map((l) => (
                  <Badge key={l} variant='secondary' className='text-xs'>
                    {l}
                  </Badge>
                ))}
              </div>
              <Button variant='outline' type='button'>
                <Upload className='mr-2 h-4 w-4' /> Choose File or Drop Here
              </Button>
              <p className='text-muted-foreground mt-3 text-xs'>
                Max 15MB · No data leaves your device 🔒
              </p>
            </div>
            <input
              ref={inputRef}
              type='file'
              accept={SUPPORTED_TYPES.join(',')}
              className='hidden'
              onChange={handleFileChange}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* ── File info bar ── */}
          <Card>
            <CardContent className='flex items-center gap-4 py-4'>
              <div className='bg-primary/10 rounded-lg p-2'>
                {file.type.startsWith('image/') ? (
                  <ImageIcon className='text-primary h-5 w-5' />
                ) : (
                  <FileText className='text-primary h-5 w-5' />
                )}
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{file.name}</p>
                <p className='text-muted-foreground text-xs'>
                  {(file.size / 1024).toFixed(1)} KB ·{' '}
                  {file.type.split('/')[1].toUpperCase()}
                </p>
              </div>
              {status !== 'processing' && (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={reset}
                  type='button'
                >
                  <X className='h-4 w-4' />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* ── Image preview ── */}
          {preview && status !== 'done' && (
            <Card>
              <CardContent className='pt-4'>
                <div className='border-border overflow-hidden rounded-xl border'>
                  <img
                    src={preview}
                    alt='Document preview'
                    className='bg-muted max-h-64 w-full object-contain'
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Processing indicator ── */}
          {status === 'processing' && (
            <Card>
              <CardContent className='space-y-4 py-6'>
                <div className='flex items-center gap-3'>
                  <Loader2 className='text-primary h-5 w-5 shrink-0 animate-spin' />
                  <p className='text-sm font-medium'>{stage}</p>
                </div>
                {file.type.startsWith('image/') && ocrProgress > 0 && (
                  <ProgressBar value={ocrProgress} label='OCR Progress' />
                )}
              </CardContent>
            </Card>
          )}

          {/* ── Extract button ── */}
          {(status === 'idle' || status === 'error') && (
            <Button
              onClick={processFile}
              className='w-full'
              size='lg'
              type='button'
            >
              <Sparkles className='mr-2 h-4 w-4' />
              Extract Questions (Free · Local Processing)
            </Button>
          )}

          {/* ── Error message ── */}
          {status === 'error' && (
            <Card className='border-destructive/40 bg-destructive/5'>
              <CardContent className='flex items-start gap-3 py-4'>
                <AlertCircle className='text-destructive mt-0.5 h-5 w-5 shrink-0' />
                <div className='space-y-2'>
                  <p className='text-destructive text-sm font-medium'>
                    Could not extract questions
                  </p>
                  <p className='text-muted-foreground text-xs'>{errorMsg}</p>
                  <div className='bg-muted text-muted-foreground space-y-1 rounded-lg p-3 text-xs'>
                    <p className='text-foreground font-medium'>
                      Tips to fix this:
                    </p>
                    <p>
                      • Number questions: <code>1.</code> or <code>Q1.</code>
                    </p>
                    <p>
                      • Format options: <code>(A)</code>, <code>A.</code>, or{' '}
                      <code>a)</code>
                    </p>
                    <p>
                      • Mark answers: <code>Ans: B</code> or{' '}
                      <code>Answer: C</code>
                    </p>
                    <p>• For images: use high-resolution, clear scans</p>
                    <p>• For PDFs: ensure they are text-based, not scanned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Results ── */}
          {status === 'done' && extracted.length > 0 && (
            <div className='space-y-4'>
              {/* Stats header */}
              <Card className='border-primary/20 bg-primary/5'>
                <CardContent className='flex items-center justify-between py-4'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 rounded-lg p-2'>
                      <Sparkles className='text-primary h-5 w-5' />
                    </div>
                    <div>
                      <p className='font-semibold'>
                        {extracted.length} questions extracted
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {selected.size} selected ·{' '}
                        {
                          extracted.filter((q) =>
                            q.options?.some((o) => o.isCorrect)
                          ).length
                        }{' '}
                        with answers detected
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        setSelected(new Set(extracted.map((_, i) => i)))
                      }
                      type='button'
                    >
                      All
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setSelected(new Set())}
                      type='button'
                    >
                      None
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Raw text peek */}
              {rawTextPreview && (
                <details className='border-border rounded-xl border p-3'>
                  <summary className='text-muted-foreground cursor-pointer select-none text-xs font-medium'>
                    👁 Preview extracted text (first 400 chars)
                  </summary>
                  <pre className='text-muted-foreground mt-2 whitespace-pre-wrap text-xs leading-relaxed'>
                    {rawTextPreview}…
                  </pre>
                </details>
              )}

              {/* Question list */}
              <div className='space-y-3'>
                {extracted.map((q, i) => (
                  <ExtractedQuestionCard
                    key={q.id}
                    question={q}
                    index={i}
                    selected={selected.has(i)}
                    onToggle={toggleSelect}
                  />
                ))}
              </div>

              {/* Sticky CTA */}
              <div className='sticky bottom-4 flex gap-3'>
                <Button
                  onClick={addToForm}
                  disabled={selected.size === 0}
                  className='flex-1 shadow-lg'
                  size='lg'
                  type='button'
                >
                  <CheckCircle2 className='mr-2 h-4 w-4' />
                  Add {selected.size} Question{selected.size !== 1 ? 's' : ''}{' '}
                  to Form
                </Button>
                <Button
                  variant='outline'
                  size='lg'
                  onClick={reset}
                  type='button'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
