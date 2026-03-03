import { ArrowLeft, BarChart3, Clock, FileText } from 'lucide-react';
import { useRouter } from 'next/router';

import { generatePreviousPapers } from '@/data/studyData';

const difficultyColor = {
  Easy: 'bg-green-500/10 text-green-700 border-green-200',
  Medium: 'bg-accent/10 text-accent border-accent/20',
  Hard: 'bg-destructive/10 text-destructive border-destructive/20',
};

const PreviousPapers = () => {
  const router = useRouter();
  const { examName } = router.query;
  const decoded = examName ? decodeURIComponent(examName as string) : '';
  const papers = generatePreviousPapers(decoded);

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
              <FileText className='h-4 w-4' /> Previous Papers
            </h1>
            <p className='text-muted-foreground text-xs'>{decoded}</p>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-3xl px-4 py-8'>
        <div className='space-y-3'>
          {papers.map((paper) => (
            <div
              key={paper.id}
              className='border-border bg-card hover:border-primary/30 rounded-xl border p-5 transition-colors'
            >
              <div className='mb-3 flex items-start justify-between'>
                <div>
                  <h3 className='text-foreground text-sm font-medium'>
                    {paper.title}
                  </h3>
                  <p className='text-muted-foreground mt-0.5 text-xs'>
                    {paper.year}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                    difficultyColor[paper.difficulty]
                  }`}
                >
                  {paper.difficulty}
                </span>
              </div>
              <div className='text-muted-foreground flex items-center gap-4 text-xs'>
                <span className='flex items-center gap-1'>
                  <BarChart3 className='h-3 w-3' /> {paper.questions} Questions
                </span>
                <span className='flex items-center gap-1'>
                  <Clock className='h-3 w-3' /> {paper.duration}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className='text-muted-foreground mt-8 text-center text-xs'>
          Full paper downloads will be available soon.
        </p>
      </main>
    </div>
  );
};

export default PreviousPapers;
