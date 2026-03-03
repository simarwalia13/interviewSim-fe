import { ArrowLeft, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { generateStudyNotes } from '@/data/studyData';

const Notes = () => {
  const router = useRouter();
  const { examName } = router.query;
  const decoded = examName ? decodeURIComponent(examName as string) : '';
  const notes = generateStudyNotes(decoded);
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className='bg-background min-h-screen'>
      <header className='border-border bg-background/80 sticky top-0 z-10 border-b backdrop-blur-md'>
        <div className='mx-auto flex max-w-3xl items-center gap-3 px-4 py-3'>
          <button
            onClick={() => router.push(`/exam/${encodeURIComponent(decoded)}`)}
            className='hover:bg-muted rounded-lg p-2 transition-colors'
          >
            <ArrowLeft className='text-foreground h-4 w-4' />
          </button>
          <div>
            <h1 className='text-foreground flex items-center gap-2 text-base font-medium'>
              <BookOpen className='h-4 w-4' /> Study Notes
            </h1>
            <p className='text-muted-foreground text-xs'>{decoded}</p>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-3xl px-4 py-8'>
        <div className='space-y-3'>
          {notes.map((note, idx) => (
            <div
              key={note.id}
              className='border-border bg-card overflow-hidden rounded-xl border'
            >
              <button
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                className='hover:bg-muted/50 flex w-full items-center justify-between px-5 py-4 text-left transition-colors'
              >
                <div className='flex items-center gap-3'>
                  <span className='bg-primary/10 text-primary flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium'>
                    {idx + 1}
                  </span>
                  <span className='text-foreground text-sm font-medium'>
                    {note.title}
                  </span>
                </div>
                {expanded === idx ? (
                  <ChevronUp className='text-muted-foreground h-4 w-4' />
                ) : (
                  <ChevronDown className='text-muted-foreground h-4 w-4' />
                )}
              </button>
              {expanded === idx && (
                <div className='border-border border-t px-5 pb-5'>
                  <p className='text-muted-foreground mb-4 mt-4 text-sm leading-relaxed'>
                    {note.content}
                  </p>
                  <h4 className='text-foreground mb-2 text-xs font-medium uppercase tracking-wider'>
                    Key Points
                  </h4>
                  <ul className='space-y-1.5'>
                    {note.keyPoints.map((point, i) => (
                      <li
                        key={i}
                        className='text-foreground/80 flex items-start gap-2 text-sm'
                      >
                        <span className='bg-accent mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full' />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Notes;
