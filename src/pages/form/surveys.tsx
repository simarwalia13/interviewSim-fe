import { useAtom } from 'jotai';
import { BarChart3, Eye, FilePlus, Pause, Play, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import AppLayout from '@/components/layout/AppLayout';
import ShareDialog from '@/components/ShareDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { surveysAtom } from '@/store';
import type { Survey } from '@/store/types';

const statusColors: Record<Survey['status'], string> = {
  draft: 'bg-secondary text-secondary-foreground',
  active: 'bg-accent text-accent-foreground',
  closed: 'bg-muted text-muted-foreground',
};

const categoryIcons: Record<string, string> = {
  survey: '📝',
  quiz: '🧠',
  poll: '📊',
  registration: '🎫',
  feedback: '💬',
  custom: '⚙️',
};

export default function SurveyList() {
  const [surveys, setSurveys] = useAtom(surveysAtom);

  const toggleStatus = (id: string) => {
    setSurveys((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'active' ? 'closed' : 'active' }
          : s
      )
    );
    toast.success('Status updated');
  };

  const deleteSurvey = (id: string) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id));
    toast.success('Deleted');
  };

  return (
    <AppLayout>
      <div className='animate-fade-in space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='font-heading text-3xl font-bold tracking-tight'>
              My Forms
            </h1>
            <p className='text-muted-foreground mt-1'>
              {surveys.length} form{surveys.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className='flex gap-2'>
            <Link href='/form/template'>
              <Button variant='outline'>Templates</Button>
            </Link>
            <Link href='/form/builder'>
              <Button>
                <FilePlus className='mr-2 h-4 w-4' />
                New Form
              </Button>
            </Link>
          </div>
        </div>

        {surveys.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center py-16'>
              <p className='text-muted-foreground mb-4'>No forms created yet</p>
              <div className='flex gap-2'>
                <Link href='/form/template'>
                  <Button variant='outline'>Browse Templates</Button>
                </Link>
                <Link href='/form/builder'>
                  <Button>Create from scratch</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-3'>
            {surveys.map((survey) => (
              <Card
                key={survey.id}
                className='transition-shadow hover:shadow-md'
              >
                <CardContent className='flex items-center justify-between py-4'>
                  <div className='min-w-0 flex-1'>
                    <div className='mb-1 flex items-center gap-2'>
                      <span>{categoryIcons[survey.category] || '📝'}</span>
                      <h3 className='font-heading truncate font-semibold'>
                        {survey.title}
                      </h3>
                      <Badge
                        variant='secondary'
                        className={statusColors[survey.status]}
                      >
                        {survey.status}
                      </Badge>
                      {survey.timerEnabled && (
                        <Badge variant='outline' className='text-xs'>
                          ⏱ {survey.timerMinutes}min
                        </Badge>
                      )}
                    </div>
                    <p className='text-muted-foreground truncate text-sm'>
                      {survey.description || 'No description'}
                    </p>
                    <p className='text-muted-foreground mt-1 text-xs'>
                      {survey.questions.length} question
                      {survey.questions.length !== 1 ? 's' : ''} ·{' '}
                      {survey.responses.length} response
                      {survey.responses.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className='ml-4 flex items-center gap-1'>
                    <ShareDialog
                      surveyId={survey.id}
                      surveyTitle={survey.title}
                    />
                    <Link href={`/form/survey/${survey.id}/respond`}>
                      <Button variant='ghost' size='icon' title='Preview'>
                        <Eye className='h-4 w-4' />
                      </Button>
                    </Link>
                    <Link href={`/form/survey/${survey.id}/analytics`}>
                      <Button variant='ghost' size='icon' title='Analytics'>
                        <BarChart3 className='h-4 w-4' />
                      </Button>
                    </Link>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => toggleStatus(survey.id)}
                      title={survey.status === 'active' ? 'Pause' : 'Activate'}
                    >
                      {survey.status === 'active' ? (
                        <Pause className='h-4 w-4' />
                      ) : (
                        <Play className='h-4 w-4' />
                      )}
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => deleteSurvey(survey.id)}
                    >
                      <Trash2 className='text-destructive h-4 w-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
