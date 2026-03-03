import {
  ArrowLeft,
  BookOpen,
  Brain,
  ClipboardList,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { useRouter } from 'next/router';

const options = [
  {
    label: 'MCQ Test',
    description: 'Practice with 20 multiple-choice questions',
    icon: ClipboardList,
    route: 'mcq',
  },
  {
    label: 'Study Notes',
    description: 'Quick revision notes & key concepts',
    icon: BookOpen,
    route: 'notes',
  },
  {
    label: 'Previous Papers',
    description: 'Solve past year question papers',
    icon: FileText,
    route: 'papers',
  },
  {
    label: 'Flash Cards',
    description: 'Memorize important facts & formulas',
    icon: Brain,
    route: 'flashcards',
  },
  {
    label: 'Syllabus',
    description: 'Complete syllabus & exam pattern',
    icon: GraduationCap,
    route: 'syllabus',
  },
];

const ExamDetail = () => {
  const router = useRouter();
  const { examName } = router.query;
  const decoded = examName ? decodeURIComponent(examName as string) : '';

  return (
    <div className='bg-background min-h-screen'>
      <header className='border-border bg-background/80 sticky top-0 z-10 border-b backdrop-blur-md'>
        <div className='mx-auto flex max-w-4xl items-center gap-3 px-4 py-4'>
          <button
            onClick={() => router.push('/')}
            className='hover:bg-muted rounded-lg p-2 transition-colors'
          >
            <ArrowLeft className='text-foreground h-4 w-4' />
          </button>
          <div>
            <h1 className='text-foreground text-lg tracking-tight md:text-xl'>
              {decoded}
            </h1>
            <p className='text-muted-foreground text-xs'>
              Choose your preparation mode
            </p>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-4xl px-4 py-8 md:py-12'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {options?.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.route}
                onClick={() =>
                  router.push(
                    `/exam/${encodeURIComponent(decoded)}/${opt.route}`
                  )
                }
                className='border-border bg-card hover:border-primary/40 group cursor-pointer rounded-xl border p-5 text-left transition-all duration-200 hover:shadow-sm'
              >
                <div className='mb-2 flex items-center gap-3'>
                  <div className='bg-muted group-hover:bg-primary/10 rounded-lg p-2 transition-colors'>
                    <Icon className='text-foreground/70 group-hover:text-primary h-5 w-5 transition-colors' />
                  </div>
                  <h3 className='text-foreground text-sm font-medium'>
                    {opt.label}
                  </h3>
                </div>
                <p className='text-muted-foreground text-xs'>
                  {opt.description}
                </p>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ExamDetail;
