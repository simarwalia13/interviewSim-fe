import { useAtomValue } from 'jotai';
import { ArrowLeft, HelpCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { surveysAtom } from '@/store';

const COLORS = [
  'hsl(170, 55%, 38%)',
  'hsl(35, 85%, 55%)',
  'hsl(260, 50%, 55%)',
  'hsl(340, 65%, 55%)',
  'hsl(200, 70%, 50%)',
];

export default function SurveyAnalytics() {
  const router = useRouter();
  const { id } = router.query;
  const surveys = useAtomValue(surveysAtom);
  const survey = surveys.find((s) => s.id === id);

  if (!survey) {
    return (
      <p className='text-muted-foreground py-20 text-center'>
        Survey not found
      </p>
    );
  }

  const { responses, questions } = survey;

  const getQuestionData = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return [];

    if (question.type === 'multiple_choice' || question.type === 'checkbox') {
      const counts: Record<string, number> = {};
      question.options?.forEach((o) => (counts[o.text] = 0));
      responses.forEach((r) => {
        const ans = r.answers.find((a) => a.questionId === questionId);
        if (!ans) return;
        if (Array.isArray(ans.value)) {
          ans.value.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
        } else {
          counts[ans.value as string] = (counts[ans.value as string] || 0) + 1;
        }
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    if (question.type === 'rating') {
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      responses.forEach((r) => {
        const ans = r.answers.find((a) => a.questionId === questionId);
        if (ans && typeof ans.value === 'number') {
          counts[ans.value] = (counts[ans.value] || 0) + 1;
        }
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    return [];
  };

  const getTextResponses = (questionId: string) => {
    return responses
      .map((r) => r.answers.find((a) => a.questionId === questionId)?.value)
      .filter((v): v is string => typeof v === 'string' && v.length > 0);
  };

  const getRatingAvg = (questionId: string) => {
    const values = responses
      .map((r) => r.answers.find((a) => a.questionId === questionId)?.value)
      .filter((v): v is number => typeof v === 'number');
    if (values.length === 0) return 0;
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <AppLayout>
      <div className='animate-fade-in space-y-6'>
        <div className='flex items-center gap-3'>
          <Link href='/form/surveys'>
            <Button variant='ghost' size='icon'>
              <ArrowLeft className='h-4 w-4' />
            </Button>
          </Link>
          <div>
            <h1 className='font-heading text-3xl font-bold tracking-tight'>
              {survey.title}
            </h1>
            <p className='text-muted-foreground mt-1 flex items-center gap-4'>
              <span className='flex items-center gap-1'>
                <Users className='h-3.5 w-3.5' /> {responses.length} responses
              </span>
              <span className='flex items-center gap-1'>
                <HelpCircle className='h-3.5 w-3.5' /> {questions.length}{' '}
                questions
              </span>
            </p>
          </div>
        </div>

        {responses.length === 0 ? (
          <Card>
            <CardContent className='py-16 text-center'>
              <p className='text-muted-foreground mb-4'>No responses yet</p>
              <Link href={`/form/survey/${id}/respond`}>
                <Button variant='outline'>Submit a test response</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-6'>
            {questions.map((q) => (
              <Card key={q.id}>
                <CardHeader>
                  <CardTitle className='text-base'>{q.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {(q.type === 'multiple_choice' || q.type === 'checkbox') && (
                    <div className='h-56'>
                      <ResponsiveContainer width='100%' height='100%'>
                        <BarChart
                          data={getQuestionData(q.id)}
                          layout='vertical'
                        >
                          <XAxis
                            type='number'
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                          />
                          <YAxis
                            type='category'
                            dataKey='name'
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                            width={100}
                          />
                          <Tooltip />
                          <Bar
                            dataKey='value'
                            fill='hsl(170, 55%, 38%)'
                            radius={[0, 6, 6, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {q.type === 'rating' && (
                    <div>
                      <p className='font-heading mb-4 text-2xl font-bold'>
                        Average: {getRatingAvg(q.id)} / 5
                      </p>
                      <div className='h-48'>
                        <ResponsiveContainer width='100%' height='100%'>
                          <PieChart>
                            <Pie
                              data={getQuestionData(q.id)}
                              cx='50%'
                              cy='50%'
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={3}
                              dataKey='value'
                              label={({ name, value }) =>
                                value > 0 ? `★${name}: ${value}` : ''
                              }
                            >
                              {getQuestionData(q.id).map((_, i) => (
                                <Cell
                                  key={i}
                                  fill={COLORS[i % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {q.type === 'text' && (
                    <div className='max-h-60 space-y-2 overflow-auto'>
                      {getTextResponses(q.id).map((text, i) => (
                        <div
                          key={i}
                          className='bg-muted rounded-lg px-3 py-2 text-sm'
                        >
                          {text}
                        </div>
                      ))}
                      {getTextResponses(q.id).length === 0 && (
                        <p className='text-muted-foreground text-sm'>
                          No text responses
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
