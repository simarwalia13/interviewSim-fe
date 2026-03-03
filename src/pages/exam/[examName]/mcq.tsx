import { Field, Form, Formik } from 'formik';
import { useAtom } from 'jotai';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Star,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import * as Yup from 'yup';

import { generateMockQuestions } from '@/data/mockQuestions';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { feedbackSubmittedAtom } from '@/store';

const FeedbackSchema = Yup.object().shape({
  rating: Yup.number().min(1).max(5).required('Please select a rating'),
  difficulty: Yup.string().required('Please select difficulty'),
  comment: Yup.string().max(500, 'Too long'),
});

const Mcq = () => {
  const router = useRouter();
  const { examName } = router.query;
  const decoded = examName ? decodeURIComponent(examName as string) : '';

  const questions = useMemo(() => generateMockQuestions(decoded), [decoded]);
  const total = questions.length;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(total).fill(null)
  );
  const [finished, setFinished] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useAtom(
    feedbackSubmittedAtom
  );

  const q = questions[current];
  const progress = ((current + 1) / total) * 100;

  const handleConfirm = () => {
    if (selected === null) return;
    const updated = [...answers];
    updated[current] = selected;
    setAnswers(updated);
    setConfirmed(true);
  };

  const handleNext = () => {
    if (current < total - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setFinished(true);
    }
  };

  const score = answers.filter(
    (a, i) => a === questions[i].correctAnswer
  ).length;
  const attempted = answers.filter((a) => a !== null).length;
  const accuracy = attempted > 0 ? Math.round((score / attempted) * 100) : 0;

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setAnswers(Array(total).fill(null));
    setFinished(false);
    setFeedbackSubmitted(false);
  };

  if (finished) {
    const grade =
      score >= 18
        ? 'Outstanding'
        : score >= 14
        ? 'Excellent'
        : score >= 10
        ? 'Good'
        : score >= 6
        ? 'Average'
        : 'Needs Improvement';

    return (
      <div className='bg-background min-h-screen'>
        <header className='border-border bg-background/80 sticky top-0 z-10 border-b backdrop-blur-md'>
          <div className='mx-auto flex max-w-3xl items-center gap-3 px-4 py-3'>
            <button
              onClick={() =>
                router.push(`/exam/${encodeURIComponent(decoded)}`)
              }
              className='hover:bg-muted rounded-lg p-2 transition-colors'
            >
              <ArrowLeft className='text-foreground h-4 w-4' />
            </button>
            <h1 className='text-foreground text-base font-medium'>Results</h1>
          </div>
        </header>

        <main className='mx-auto max-w-3xl px-4 py-8'>
          {/* Score Card */}
          <div className='border-border bg-card mb-6 rounded-2xl border p-6 text-center md:p-8'>
            <p className='text-muted-foreground mb-2 text-xs uppercase tracking-wider'>
              {decoded}
            </p>
            <div className='text-foreground mb-1 text-5xl font-bold md:text-6xl'>
              {score}
              <span className='text-muted-foreground text-2xl'>/{total}</span>
            </div>
            <p className='text-primary mb-6 text-lg font-medium'>{grade}</p>

            {/* Stats */}
            <div className='mb-6 grid grid-cols-3 gap-4'>
              <div className='bg-muted/50 rounded-xl p-3'>
                <Target className='text-primary mx-auto mb-1 h-4 w-4' />
                <p className='text-foreground text-lg font-semibold'>
                  {accuracy}%
                </p>
                <p className='text-muted-foreground text-[10px] uppercase'>
                  Accuracy
                </p>
              </div>
              <div className='bg-muted/50 rounded-xl p-3'>
                <TrendingUp className='text-accent mx-auto mb-1 h-4 w-4' />
                <p className='text-foreground text-lg font-semibold'>
                  {attempted}
                </p>
                <p className='text-muted-foreground text-[10px] uppercase'>
                  Attempted
                </p>
              </div>
              <div className='bg-muted/50 rounded-xl p-3'>
                <CheckCircle2 className='mx-auto mb-1 h-4 w-4 text-green-600' />
                <p className='text-foreground text-lg font-semibold'>{score}</p>
                <p className='text-muted-foreground text-[10px] uppercase'>
                  Correct
                </p>
              </div>
            </div>

            <div className='flex justify-center gap-3'>
              <Button
                variant='outline'
                onClick={() =>
                  router.push(`/exam/${encodeURIComponent(decoded)}`)
                }
              >
                <ArrowLeft className='mr-1 h-4 w-4' /> Back
              </Button>
              <Button onClick={handleRestart}>
                <RotateCcw className='mr-1 h-4 w-4' /> Retry
              </Button>
            </div>
          </div>

          {/* Question Review */}
          <div className='border-border bg-card mb-6 rounded-2xl border p-5'>
            <h3 className='text-foreground mb-4 text-sm font-medium'>
              Question Review
            </h3>
            <div className='grid grid-cols-5 gap-2 sm:grid-cols-10'>
              {questions.map((question, i) => {
                const isCorrect = answers[i] === question.correctAnswer;
                const wasAnswered = answers[i] !== null;
                return (
                  <div
                    key={i}
                    className={`flex aspect-square w-full items-center justify-center rounded-lg border text-xs font-medium ${
                      wasAnswered
                        ? isCorrect
                          ? 'border-green-300 bg-green-500/10 text-green-700'
                          : 'bg-destructive/10 border-destructive/30 text-destructive'
                        : 'bg-muted/50 border-border text-muted-foreground'
                    }`}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback Form */}
          <div className='border-border bg-card rounded-2xl border p-5'>
            <h3 className='text-foreground mb-4 text-sm font-medium'>
              Share Your Feedback
            </h3>
            {feedbackSubmitted ? (
              <div className='py-4 text-center'>
                <CheckCircle2 className='text-primary mx-auto mb-2 h-8 w-8' />
                <p className='text-foreground text-sm'>
                  Thank you for your feedback!
                </p>
              </div>
            ) : (
              <Formik
                initialValues={{ rating: 0, difficulty: '', comment: '' }}
                validationSchema={FeedbackSchema}
                onSubmit={() => {
                  setFeedbackSubmitted(true);
                }}
              >
                {({ errors, touched, setFieldValue, values }) => (
                  <Form className='space-y-4'>
                    {/* Rating */}
                    <div>
                      <label className='text-foreground mb-2 block text-xs font-medium'>
                        Rate this test
                      </label>
                      <div className='flex gap-1'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type='button'
                            onClick={() => setFieldValue('rating', star)}
                            className='p-1'
                          >
                            <Star
                              className={`h-6 w-6 transition-colors ${
                                star <= values.rating
                                  ? 'text-accent fill-accent'
                                  : 'text-border'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {errors.rating && touched.rating && (
                        <p className='text-destructive mt-1 text-xs'>
                          {errors.rating}
                        </p>
                      )}
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className='text-foreground mb-2 block text-xs font-medium'>
                        Difficulty level
                      </label>
                      <div className='flex gap-2'>
                        {['Easy', 'Medium', 'Hard'].map((level) => (
                          <button
                            key={level}
                            type='button'
                            onClick={() => setFieldValue('difficulty', level)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                              values.difficulty === level
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-muted-foreground hover:border-primary/30'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                      {errors.difficulty && touched.difficulty && (
                        <p className='text-destructive mt-1 text-xs'>
                          {errors.difficulty}
                        </p>
                      )}
                    </div>

                    {/* Comment */}
                    <div>
                      <label className='text-foreground mb-2 block text-xs font-medium'>
                        Comments (optional)
                      </label>
                      <Field
                        as='textarea'
                        name='comment'
                        placeholder='Share your thoughts...'
                        className='border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary/30 min-h-[80px] w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2'
                      />
                      {errors.comment && touched.comment && (
                        <p className='text-destructive mt-1 text-xs'>
                          {errors.comment}
                        </p>
                      )}
                    </div>

                    <Button type='submit' size='sm'>
                      Submit Feedback
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='bg-background min-h-screen'>
      {/* Header */}
      <header className='border-border bg-background/80 sticky top-0 z-10 border-b backdrop-blur-md'>
        <div className='mx-auto flex max-w-3xl items-center justify-between px-4 py-3'>
          <button
            onClick={() => router.push(`/exam/${encodeURIComponent(decoded)}`)}
            className='hover:bg-muted rounded-lg p-2 transition-colors'
          >
            <ArrowLeft className='text-foreground h-4 w-4' />
          </button>
          <span className='text-muted-foreground text-sm'>
            {current + 1} / {total}
          </span>
        </div>
        <div className='mx-auto max-w-3xl px-4 pb-3'>
          <Progress value={progress} className='h-1.5' />
        </div>
      </header>

      {/* Question */}
      <main className='mx-auto max-w-3xl px-4 py-8 md:py-12'>
        <p className='text-muted-foreground mb-2 text-xs uppercase tracking-wider'>
          Question {current + 1}
        </p>
        <h2 className='text-foreground mb-8 text-lg leading-relaxed md:text-xl'>
          {q.question}
        </h2>

        {/* Options */}
        <div className='mb-8 space-y-3'>
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === q.correctAnswer;
            let stateClass = 'border-border hover:border-primary/40';

            if (confirmed) {
              if (isCorrect) stateClass = 'border-primary/60 bg-primary/5';
              else if (isSelected && !isCorrect)
                stateClass = 'border-destructive/60 bg-destructive/5';
              else stateClass = 'border-border opacity-50';
            } else if (isSelected) {
              stateClass = 'border-primary/60 bg-primary/5';
            }

            return (
              <button
                key={i}
                disabled={confirmed}
                onClick={() => setSelected(i)}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3.5 text-left text-sm transition-all duration-200 ${stateClass} ${
                  confirmed ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <span className='border-border text-muted-foreground flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-xs font-medium'>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className='text-foreground/90 flex-1'>{opt}</span>
                {confirmed && isCorrect && (
                  <CheckCircle2 className='text-primary h-4 w-4 flex-shrink-0' />
                )}
                {confirmed && isSelected && !isCorrect && (
                  <XCircle className='text-destructive h-4 w-4 flex-shrink-0' />
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className='flex justify-end gap-3'>
          {!confirmed ? (
            <Button onClick={handleConfirm} disabled={selected === null}>
              Confirm
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {current < total - 1 ? (
                <>
                  Next <ArrowRight className='ml-1 h-4 w-4' />
                </>
              ) : (
                'View Results'
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Mcq;
