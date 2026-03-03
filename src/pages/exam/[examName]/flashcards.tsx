import { ArrowLeft, ArrowRight, Brain, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { generateFlashCards } from '@/data/studyData';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const FlashCards = () => {
  const router = useRouter();
  const { examName } = router.query;
  const decoded = examName ? decodeURIComponent(examName as string) : '';
  const cards = generateFlashCards(decoded);

  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[current];
  const progress = ((current + 1) / cards.length) * 100;

  const handleNext = () => {
    if (current < cards.length - 1) {
      setCurrent(current + 1);
      setFlipped(false);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setFlipped(false);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setFlipped(false);
  };

  return (
    <div className='bg-background min-h-screen'>
      <header className='border-border bg-background/80 sticky top-0 z-10 border-b backdrop-blur-md'>
        <div className='mx-auto flex max-w-3xl items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() =>
                router.push(`/exam/${encodeURIComponent(decoded)}`)
              }
              className='hover:bg-muted rounded-lg p-2 transition-colors'
            >
              <ArrowLeft className='text-foreground h-4 w-4' />
            </button>
            <div>
              <h1 className='text-foreground flex items-center gap-2 text-base font-medium'>
                <Brain className='h-4 w-4' /> Flash Cards
              </h1>
              <p className='text-muted-foreground text-xs'>{decoded}</p>
            </div>
          </div>
          <span className='text-muted-foreground text-sm'>
            {current + 1}/{cards.length}
          </span>
        </div>
        <div className='mx-auto max-w-3xl px-4 pb-3'>
          <Progress value={progress} className='h-1.5' />
        </div>
      </header>

      <main className='mx-auto flex max-w-3xl flex-col items-center px-4 py-8 md:py-16'>
        {/* Card */}
        <button
          onClick={() => setFlipped(!flipped)}
          className='border-border bg-card hover:border-primary/30 flex min-h-[220px] w-full max-w-lg cursor-pointer flex-col items-center justify-center rounded-2xl border p-8 text-center transition-all duration-300 hover:shadow-md md:min-h-[280px]'
        >
          <p className='text-muted-foreground mb-4 text-[10px] uppercase tracking-widest'>
            {flipped ? 'Answer' : 'Question'} — Tap to flip
          </p>
          <p
            className={`text-base leading-relaxed md:text-lg ${
              flipped ? 'text-primary font-medium' : 'text-foreground'
            }`}
          >
            {flipped ? card.back : card.front}
          </p>
        </button>

        {/* Controls */}
        <div className='mt-8 flex items-center gap-3'>
          <Button
            variant='outline'
            size='sm'
            onClick={handlePrev}
            disabled={current === 0}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <Button variant='outline' size='sm' onClick={handleRestart}>
            <RotateCcw className='h-4 w-4' />
          </Button>
          <Button
            size='sm'
            onClick={handleNext}
            disabled={current === cards.length - 1}
          >
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default FlashCards;
