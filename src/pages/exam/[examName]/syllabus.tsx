import { ArrowLeft, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/router';

import { generateSyllabus } from '@/data/studyData';

import { Progress } from '@/components/ui/progress';

const Syllabus = () => {
  const router = useRouter();
  const { examName } = router.query;
  const decoded = examName ? decodeURIComponent(examName as string) : '';
  const syllabus = generateSyllabus(decoded);

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
              <GraduationCap className='h-4 w-4' /> Syllabus & Exam Pattern
            </h1>
            <p className='text-muted-foreground text-xs'>{decoded}</p>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-3xl px-4 py-8'>
        {/* Exam Pattern Overview */}
        <div className='border-border bg-card mb-6 rounded-xl border p-5'>
          <h2 className='text-foreground mb-3 text-sm font-medium'>
            Exam Pattern Overview
          </h2>
          <div className='grid grid-cols-2 gap-4 text-center sm:grid-cols-4'>
            {[
              { label: 'Total Questions', value: '100' },
              { label: 'Duration', value: '2 Hours' },
              { label: 'Marking', value: '+2 / -0.5' },
              { label: 'Max Marks', value: '200' },
            ].map((item) => (
              <div key={item.label} className='bg-muted/50 rounded-lg p-3'>
                <p className='text-foreground text-lg font-semibold'>
                  {item.value}
                </p>
                <p className='text-muted-foreground mt-1 text-[10px] uppercase tracking-wider'>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Syllabus Units */}
        <div className='space-y-4'>
          {syllabus.map((unit) => (
            <div
              key={unit.id}
              className='border-border bg-card rounded-xl border p-5'
            >
              <div className='mb-3 flex items-center justify-between'>
                <h3 className='text-foreground text-sm font-medium'>
                  {unit.unit}
                </h3>
                <span className='text-primary bg-primary/10 rounded-full px-2 py-0.5 text-xs font-medium'>
                  {unit.weightage}
                </span>
              </div>
              <Progress
                value={parseInt(unit.weightage)}
                className='mb-3 h-1.5'
              />
              <ul className='space-y-1.5'>
                {unit.topics.map((topic, i) => (
                  <li
                    key={i}
                    className='text-foreground/80 flex items-center gap-2 text-sm'
                  >
                    <span className='bg-accent h-1.5 w-1.5 flex-shrink-0 rounded-full' />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Syllabus;
