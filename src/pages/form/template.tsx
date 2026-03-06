import { useAtom } from 'jotai';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'sonner';

import AppLayout from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { surveysAtom } from '@/store';
import { formTemplates } from '@/store/templates';
import type { FormCategory } from '@/store/types';
import { generateId } from '@/store/utils';

const categoryColors: Record<FormCategory | 'all', string> = {
  all: 'bg-primary text-primary-foreground',
  survey: 'bg-primary/10 text-primary',
  quiz: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  poll: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  registration:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  feedback: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  custom: 'bg-muted text-muted-foreground',
};

const categories = [
  { value: 'all', label: '🔥 All', icon: '📋' },
  { value: 'survey', label: 'Survey', icon: '📝' },
  { value: 'quiz', label: 'Quiz', icon: '🧠' },
  { value: 'poll', label: 'Poll', icon: '📊' },
  { value: 'registration', label: 'Registration', icon: '🎫' },
  { value: 'feedback', label: 'Feedback', icon: '💬' },
] as const;

export default function Templates() {
  const [, setSurveys] = useAtom(surveysAtom);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | FormCategory
  >('all');

  // Filter templates based on selected category
  const filteredTemplates =
    selectedCategory === 'all'
      ? formTemplates
      : formTemplates.filter(
          (template) => template.category === selectedCategory
        );

  const handleUseTemplate = (templateId: string) => {
    const template = formTemplates.find((t) => t.id === templateId);
    if (!template) return;

    // Deep clone questions with new IDs
    const clonedQuestions = template.questions.map((q) => ({
      ...q,
      id: generateId(),
      options: q.options?.map((o) => ({ ...o, id: generateId() })),
    }));

    const newSurvey = {
      id: generateId(),
      title: template.name,
      description: template.description,
      category: template.category,
      questions: clonedQuestions,
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      responses: [],
      timerEnabled: template.timerEnabled,
      timerMinutes: template.timerMinutes,
    };

    setSurveys((prev) => [...prev, newSurvey]);
    toast.success(`"${template.name}" created from template!`);
    router.push('/form/surveys');
  };

  return (
    <AppLayout>
      <div className='animate-fade-in space-y-6'>
        <div>
          <h1 className='font-heading flex items-center gap-2 text-3xl font-bold tracking-tight'>
            <Sparkles className='text-primary h-7 w-7' /> Templates
          </h1>
          <p className='text-muted-foreground mt-1'>
            Start with a pre-built template and customize it to your needs
          </p>
        </div>

        {/* Category Filter */}
        <div className='flex flex-wrap gap-2'>
          {categories.map((cat) => (
            <Badge
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              className={`
                cursor-pointer px-4 py-2 text-sm capitalize transition-all duration-200
                ${
                  selectedCategory === cat.value
                    ? categoryColors[cat.value]
                    : 'hover:bg-accent/50 hover:text-accent-foreground'
                }
              `}
              onClick={() => setSelectedCategory(cat.value)}
            >
              <span className='mr-1.5'>{cat.icon}</span>
              {cat.label}
            </Badge>
          ))}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className='group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
              >
                {/* Decorative gradient */}
                <div className='from-primary/5 via-accent/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity group-hover:opacity-100' />

                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <span className='text-4xl'>{template.icon}</span>
                    <Badge
                      variant='secondary'
                      className={categoryColors[template.category]}
                    >
                      {template.category}
                    </Badge>
                  </div>
                  <CardTitle className='font-heading mt-3 text-lg'>
                    {template.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className='space-y-4'>
                  <p className='text-muted-foreground line-clamp-2 text-sm leading-relaxed'>
                    {template.description}
                  </p>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className='text-muted-foreground text-xs'>
                        📝 {template.questions.length} question
                        {template.questions.length !== 1 ? 's' : ''}
                      </span>
                      {template.timerEnabled && (
                        <>
                          <span className='text-muted-foreground/30'>•</span>
                          <span className='text-muted-foreground text-xs'>
                            ⏱️ {template.timerMinutes}min
                          </span>
                        </>
                      )}
                    </div>

                    <Button
                      size='sm'
                      onClick={() => handleUseTemplate(template.id)}
                      className='group/btn relative overflow-hidden transition-all hover:pl-4'
                    >
                      <span className='relative z-10 flex items-center'>
                        Use Template
                        <ArrowRight className='ml-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5' />
                      </span>
                      <span className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Empty state
          <Card className='border-dashed'>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <div className='bg-muted mb-4 rounded-full p-4'>
                <Sparkles className='text-muted-foreground h-8 w-8' />
              </div>
              <h3 className='text-foreground text-lg font-medium'>
                No templates found
              </h3>
              <p className='text-muted-foreground mt-1 text-sm'>
                No templates available in the "{selectedCategory}" category
              </p>
              <Button
                variant='link'
                onClick={() => setSelectedCategory('all')}
                className='text-accent mt-4'
              >
                View all templates
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Template Stats */}
        <div className='border-border bg-card/50 rounded-lg border p-4 text-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>
              Showing{' '}
              <span className='text-foreground font-medium'>
                {filteredTemplates.length}
              </span>{' '}
              of{' '}
              <span className='text-foreground font-medium'>
                {formTemplates.length}
              </span>{' '}
              templates
            </span>
            <Badge variant='outline' className='bg-accent/5'>
              {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
            </Badge>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
