import { useAtomValue } from 'jotai';
import { BarChart3, FilePlus, FileText, Users } from 'lucide-react';
import Link from 'next/link';
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

export default function Dashboard() {
  const surveys = useAtomValue(surveysAtom);

  const totalSurveys = surveys.length;
  const totalResponses = surveys.reduce(
    (sum, s) => sum + s.responses.length,
    0
  );
  const activeSurveys = surveys.filter((s) => s.status === 'active').length;

  const statusData = [
    {
      name: 'Draft',
      value: surveys.filter((s) => s.status === 'draft').length,
    },
    { name: 'Active', value: activeSurveys },
    {
      name: 'Closed',
      value: surveys.filter((s) => s.status === 'closed').length,
    },
  ].filter((d) => d.value > 0);

  const responseData = surveys.slice(0, 6).map((s) => ({
    name: s.title.length > 12 ? s.title.slice(0, 12) + '…' : s.title,
    responses: s.responses.length,
  }));

  return (
    <AppLayout>
      <div className='animate-fade-in space-y-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='font-heading text-3xl font-bold tracking-tight'>
              Dashboard
            </h1>
            <p className='text-muted-foreground mt-1'>
              Overview of your surveys and responses
            </p>
          </div>
          <Link href='/form/builder' passHref>
            <Button>
              <FilePlus className='mr-2 h-4 w-4' />
              New Survey
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className='grid gap-4 sm:grid-cols-3'>
          {[
            { label: 'Total Surveys', value: totalSurveys, icon: FileText },
            { label: 'Total Responses', value: totalResponses, icon: Users },
            { label: 'Active Surveys', value: activeSurveys, icon: BarChart3 },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-muted-foreground text-sm font-medium'>
                  {stat.label}
                </CardTitle>
                <stat.icon className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='font-heading text-3xl font-bold'>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        {surveys.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>
                  Responses per Survey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='h-64'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={responseData}>
                      <XAxis
                        dataKey='name'
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar
                        dataKey='responses'
                        fill='hsl(170, 55%, 38%)'
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Survey Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex h-64 items-center justify-center'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx='50%'
                        cy='50%'
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey='value'
                      >
                        {statusData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className='mt-2 flex justify-center gap-4'>
                  {statusData.map((d, i) => (
                    <div
                      key={d.name}
                      className='text-muted-foreground flex items-center gap-1.5 text-xs'
                    >
                      <div
                        className='h-2.5 w-2.5 rounded-full'
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      {d.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-16'>
              <FileText className='text-muted-foreground/40 mb-4 h-12 w-12' />
              <h3 className='font-heading mb-1 text-lg font-semibold'>
                No surveys yet
              </h3>
              <p className='text-muted-foreground mb-4 text-sm'>
                Create your first survey to get started
              </p>
              <Link href='/form/builder' passHref>
                <Button>
                  <FilePlus className='mr-2 h-4 w-4' />
                  Create Survey
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
