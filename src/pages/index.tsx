import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useCreateGuest, useGuestSession } from '@/hooks/guest';

import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { guest, clearGuest, isGuest } = useGuestSession();
  const createGuest = useCreateGuest();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEnterAsGuest = () => {
    createGuest.mutate(undefined);
  };

  const handleLeaveGuest = () => {
    clearGuest();
    window.location.replace('/');
  };

  // Same on server and initial client render to avoid hydration mismatch
  if (!mounted) {
    return (
      <>
        <Seo templateTitle='Dashboard' />
        <main className='flex min-h-screen items-center justify-center'>
          <Spinner
            className='text-primary-600 text-3xl font-bold'
            tip='Loading...'
          />
        </main>
      </>
    );
  }

  // After mount: no stored guest and not loading → show enter as guest
  if (guest === null && !createGuest.isLoading) {
    const hasStored =
      typeof localStorage !== 'undefined' &&
      localStorage.getItem('interviewSim_guest');
    if (!hasStored) {
      return (
        <>
          <Seo templateTitle='Dashboard' />
          <main className='flex min-h-screen flex-col items-center justify-center p-8'>
            <Card className='w-full max-w-md'>
              <CardHeader>
                <CardTitle className='text-xl'>
                  Interview Sim – Dashboard
                </CardTitle>
                <CardDescription className='mb-4 mt-2 block'>
                  Enter as a guest to use the dashboard. A random UUID and token
                  will be generated for your session.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Button
                  size='lg'
                  className='w-full'
                  disabled={createGuest.isLoading}
                  onClick={handleEnterAsGuest}
                >
                  {createGuest.isLoading ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Entering…
                    </>
                  ) : (
                    'Enter as guest'
                  )}
                </Button>
                <Link href='/'>
                  <Button variant='link' className='w-full'>
                    Back to home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </main>
        </>
      );
    }
  }

  // Hydrating from storage or creating guest
  if (!isGuest && !createGuest.isSuccess) {
    return (
      <>
        <Seo templateTitle='Dashboard' />
        <main className='flex min-h-screen items-center justify-center'>
          <Spinner tip='Loading...' />
        </main>
      </>
    );
  }

  // Dashboard with guest session
  return (
    <>
      <Seo templateTitle='Dashboard' />
      <main className='min-h-screen p-6 md:p-8'>
        <div className='mx-auto max-w-4xl'>
          <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
            <h1 className='text-2xl font-semibold tracking-tight'>Dashboard</h1>
            <div className='flex gap-2'>
              <Link href='/'>
                <Button variant='outline'>Home</Button>
              </Link>
              <Button variant='outline' onClick={handleLeaveGuest}>
                Leave guest session
              </Button>
            </div>
          </div>

          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Guest session</CardTitle>
              <CardDescription>
                You are using the dashboard as a guest. Use this session for API
                calls.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2 font-mono text-sm'>
              <p>
                <strong>UUID:</strong>{' '}
                <span className='text-primary-600 break-all'>
                  {guest?.uuid ?? '—'}
                </span>
              </p>
              <p>
                <strong>Token:</strong>{' '}
                <span className='text-primary-600 break-all'>
                  {guest?.token ? `${guest.token.slice(0, 20)}…` : '—'}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                Your guest token is stored in <code>localStorage</code> and sent
                as <code>Authorization</code> header on API requests. Add more
                dashboard content and API calls here.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
