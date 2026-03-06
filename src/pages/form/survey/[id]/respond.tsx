import { useAtom } from 'jotai';
import { AlertTriangle, Timer } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { surveysAtom } from '@/store';
import type { Answer } from '@/store/types';
import { generateId } from '@/store/utils';

export default function SurveyRespond() {
  const router = useRouter();
  const { id } = router.query;
  const [surveys, setSurveys] = useAtom(surveysAtom);

  const survey = surveys.find((s) => s.id === id);

  const [answers, setAnswers] = useState<
    Record<string, string | string[] | number>
  >({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startTime] = useState(Date.now());

  // Timer
  useEffect(() => {
    if (!survey?.timerEnabled || !survey.timerMinutes) return;
    setTimeLeft(survey.timerMinutes * 60);
  }, [survey?.timerEnabled, survey?.timerMinutes]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          toast.error('Time is up! Auto-submitting...');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0) submitResponse();
  }, [timeLeft]);

  if (!survey) {
    return (
      <AppLayout>
        <div className='flex min-h-[400px] items-center justify-center'>
          <p className='text-muted-foreground'>Form not found</p>
        </div>
      </AppLayout>
    );
  }

  const setAnswer = (questionId: string, value: string | string[] | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const toggleCheckbox = (questionId: string, optionText: string) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];
      const next = current.includes(optionText)
        ? current.filter((v) => v !== optionText)
        : [...current, optionText];
      return { ...prev, [questionId]: next };
    });
  };

  const progress =
    survey.questions.length > 0
      ? Math.round(
          (Object.keys(answers).filter((k) => {
            const val = answers[k];
            if (Array.isArray(val)) return val.length > 0;
            return val !== '' && val !== undefined;
          }).length /
            survey.questions.length) *
            100
        )
      : 0;

  const submitResponse = () => {
    for (const q of survey.questions) {
      if (q.required && !answers[q.id]) {
        toast.error(`Please answer: "${q.title}"`);
        return;
      }
    }

    // Calculate score for quizzes
    let score: number | undefined;
    let totalPoints: number | undefined;
    if (survey.category === 'quiz') {
      totalPoints = survey.questions.reduce(
        (sum, q) => sum + (q.points || 0),
        0
      );
      score = 0;
      for (const q of survey.questions) {
        const ans = answers[q.id];
        const correctOptions =
          q.options?.filter((o) => o.isCorrect).map((o) => o.text) || [];
        if (typeof ans === 'string' && correctOptions.includes(ans)) {
          score += q.points || 0;
        }
      }
    }

    const responseAnswers: Answer[] = survey.questions.map((q) => ({
      questionId: q.id,
      value: answers[q.id] ?? '',
    }));

    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    setSurveys((prev) =>
      prev.map((s) =>
        s.id === survey.id
          ? {
              ...s,
              responses: [
                ...s.responses,
                {
                  id: generateId(),
                  surveyId: s.id,
                  answers: responseAnswers,
                  submittedAt: new Date().toISOString(),
                  score,
                  totalPoints,
                  timeTaken,
                },
              ],
            }
          : s
      )
    );

    if (survey.category === 'quiz' && score !== undefined && totalPoints) {
      toast.success(
        `Score: ${score}/${totalPoints} (${Math.round(
          (score / totalPoints) * 100
        )}%)`
      );
    } else {
      toast.success(survey.successMessage || 'Response submitted!');
    }
    router.push('/form/surveys');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AppLayout>
      <div className='animate-fade-in mx-auto max-w-2xl space-y-6'>
        {/* Timer bar */}
        {survey.timerEnabled && timeLeft !== null && (
          <div
            className={`sticky top-0 z-10 flex items-center justify-between rounded-lg p-3 ${
              timeLeft < 60
                ? 'bg-destructive/10 border-destructive/30'
                : 'bg-card'
            } border`}
          >
            <div className='flex items-center gap-2'>
              {timeLeft < 60 ? (
                <AlertTriangle className='text-destructive h-4 w-4' />
              ) : (
                <Timer className='text-muted-foreground h-4 w-4' />
              )}
              <span
                className={`font-heading text-lg font-bold ${
                  timeLeft < 60 ? 'text-destructive' : ''
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
            <span className='text-muted-foreground text-xs'>
              Time remaining
            </span>
          </div>
        )}

        <div>
          <h1 className='font-heading text-3xl font-bold tracking-tight'>
            {survey.title}
          </h1>
          {survey.description && (
            <p className='text-muted-foreground mt-1'>{survey.description}</p>
          )}
        </div>

        {/* Progress bar */}
        {survey.showProgressBar !== false && (
          <div className='space-y-1'>
            <Progress value={progress} className='h-2' />
            <p className='text-muted-foreground text-right text-xs'>
              {progress}% complete
            </p>
          </div>
        )}

        {survey.questions.map((q, idx) => (
          <Card key={q.id}>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>
                {idx + 1}. {q.title}
                {q.required && <span className='text-destructive ml-1'>*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {q.type === 'text' && (
                <Textarea
                  placeholder='Your answer...'
                  value={(answers[q.id] as string) || ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                />
              )}

              {(q.type === 'multiple_choice' || q.type === 'yes_no') && (
                <RadioGroup
                  value={(answers[q.id] as string) || ''}
                  onValueChange={(val) => setAnswer(q.id, val)}
                >
                  {q.options?.map((opt) => (
                    <div key={opt.id} className='flex items-center gap-2'>
                      <RadioGroupItem value={opt.text} id={opt.id} />
                      <Label htmlFor={opt.id}>{opt.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {q.type === 'checkbox' && (
                <div className='space-y-2'>
                  {q.options?.map((opt) => (
                    <div key={opt.id} className='flex items-center gap-2'>
                      <Checkbox
                        id={opt.id}
                        checked={((answers[q.id] as string[]) || []).includes(
                          opt.text
                        )}
                        onCheckedChange={() => toggleCheckbox(q.id, opt.text)}
                      />
                      <Label htmlFor={opt.id}>{opt.text}</Label>
                    </div>
                  ))}
                </div>
              )}

              {q.type === 'dropdown' && (
                <Select
                  value={(answers[q.id] as string) || ''}
                  onValueChange={(val) => setAnswer(q.id, val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select an option' />
                  </SelectTrigger>
                  <SelectContent>
                    {q.options?.map((opt) => (
                      <SelectItem key={opt.id} value={opt.text}>
                        {opt.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {q.type === 'rating' && (
                <div className='flex gap-2'>
                  {Array.from(
                    { length: q.maxRating || 5 },
                    (_, i) => i + 1
                  ).map((n) => (
                    <Button
                      key={n}
                      variant={
                        (answers[q.id] as number) === n ? 'default' : 'outline'
                      }
                      size='sm'
                      onClick={() => setAnswer(q.id, n)}
                      className='h-10 w-10'
                    >
                      {n}
                    </Button>
                  ))}
                </div>
              )}

              {q.type === 'linear_scale' && (
                <div className='space-y-2'>
                  <div className='text-muted-foreground flex items-center justify-between text-xs'>
                    <span>{q.scaleMinLabel || q.scaleMin}</span>
                    <span>{q.scaleMaxLabel || q.scaleMax}</span>
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    {Array.from(
                      { length: (q.scaleMax || 10) - (q.scaleMin || 1) + 1 },
                      (_, i) => (q.scaleMin || 1) + i
                    ).map((n) => (
                      <Button
                        key={n}
                        variant={
                          (answers[q.id] as number) === n
                            ? 'default'
                            : 'outline'
                        }
                        size='sm'
                        onClick={() => setAnswer(q.id, n)}
                        className='h-9 w-9 text-xs'
                      >
                        {n}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {q.type === 'email' && (
                <Input
                  type='email'
                  placeholder='email@example.com'
                  value={(answers[q.id] as string) || ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                />
              )}

              {q.type === 'phone' && (
                <Input
                  type='tel'
                  placeholder='+1 (555) 000-0000'
                  value={(answers[q.id] as string) || ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                />
              )}

              {q.type === 'number' && (
                <Input
                  type='number'
                  placeholder='Enter a number'
                  value={(answers[q.id] as string) || ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                />
              )}

              {q.type === 'date' && (
                <Input
                  type='date'
                  value={(answers[q.id] as string) || ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                />
              )}
            </CardContent>
          </Card>
        ))}

        <Button onClick={submitResponse} className='w-full'>
          Submit Response
        </Button>
      </div>
    </AppLayout>
  );
}
