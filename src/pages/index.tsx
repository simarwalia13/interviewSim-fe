import { useAtom } from 'jotai';
import {
  BarChart3,
  BookOpen,
  FilePlus,
  Search,
  Target,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useMe } from '@/hooks/auth/user/userQuery';

import { allCategories } from '@/data/examData';

import CategorySection from '@/components/CategorySection';
import { Button } from '@/components/ui/button';
import UserProfile from '@/components/user/UserProfile';

import { userme } from '@/store';

const DashboardPage = () => {
  const [search, setSearch] = useState('');
  const { data: currentUser, isLoading } = useMe();

  const [user, setUser] = useAtom(userme);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser, setUser]);

  const name = user?.data?.[0].name;
  const email = user?.data?.[0].email;

  const filtered = allCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  const isLoggedIn = user !== null && Object.keys(user).length > 0;

  return (
    <div className='bg-background min-h-screen'>
      {/* Header */}
      <header className='border-border bg-background/95 sticky top-0 z-10 border-b backdrop-blur-md'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-3'>
            <div className='bg-accent/10 flex h-9 w-9 items-center justify-center rounded-lg'>
              <Target className='text-accent h-5 w-5' />
            </div>
            <div>
              <h1 className='text-foreground text-xl tracking-tight md:text-2xl'>
                PrepHub<span className='text-accent'>.</span>
              </h1>
              <p className='text-muted-foreground hidden text-xs sm:block'>
                Your exam & interview preparation companion
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {/* Sign Up Button - New Design */}
            {isLoggedIn ? (
              <UserProfile name={name} email={email} isLoading={isLoading} />
            ) : (
              <Link href='/auth/login'>
                <Button className='from-accent/90 to-accent hover:from-accent hover:to-accent/90 shadow-accent/25 hover:shadow-accent/30 relative rounded-full bg-gradient-to-r px-5 py-2 text-black shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95'>
                  <span className='relative z-10 flex items-center gap-2'>
                    Login
                    <svg
                      className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 7l5 5m0 0l-5 5m5-5H6'
                      />
                    </svg>
                  </span>
                  <span className='absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100' />
                </Button>
              </Link>
            )}

            {/* FormCraft Button */}
            <Link href='/form/dashboard'>
              <Button
                variant='outline'
                className='group relative ml-2 overflow-hidden rounded-full border-blue-200 bg-blue-50 px-5 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900 dark:hover:text-blue-200'
              >
                <span className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-blue-200/20 to-transparent transition-transform duration-700 group-hover:translate-x-full dark:via-blue-800/20' />
                <FilePlus className='mr-2 h-4 w-4' />
                <span className='text-black'>FormCraft</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-6xl px-4 py-8 md:py-12'>
        {/* Hero Section - Darker Background */}
        <div className='from-primary/10 via-accent/10 to-secondary/10 border-border/50 relative mb-16 overflow-hidden rounded-2xl border bg-gradient-to-br p-8 md:p-12'>
          {/* Decorative elements - darker */}
          <div className='bg-accent/20 absolute right-0 top-0 -mr-10 -mt-10 h-40 w-40 rounded-full blur-3xl' />
          <div className='bg-primary/20 absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full blur-3xl' />

          <div className='relative'>
            <div className='text-accent mb-4 flex items-center gap-2'>
              <Zap className='h-5 w-5' />
              <span className='text-sm font-medium uppercase tracking-wider'>
                Smart Learning Platform
              </span>
            </div>

            <h2 className='text-foreground max-w-2xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl'>
              Find your exam<span className='text-accent'>.</span>
              <br />
              Start preparing<span className='text-accent'>.</span>
            </h2>

            <p className='text-muted-foreground mt-4 max-w-xl text-sm leading-relaxed md:text-base'>
              Browse government, competitive & entrance exams along with job
              interview topics — all in one place. Track your progress with{' '}
              <span className=' font-medium'>FormCraft</span> surveys &
              analytics.
            </p>

            {/* Stats / Quick info */}
            <div className='mt-8 flex flex-wrap gap-6'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/30 rounded-lg p-2'>
                  <BookOpen className='text-primary h-5 w-5' />
                </div>
                <div>
                  <div className='text-foreground text-xl font-bold'>50+</div>
                  <div className='text-muted-foreground text-xs'>
                    Exam Categories
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='bg-accent/20 rounded-lg p-2'>
                  <Target className='text-accent h-5 w-5' />
                </div>
                <div>
                  <div className='text-foreground text-xl font-bold'>200+</div>
                  <div className='text-muted-foreground text-xs'>
                    Topics Covered
                  </div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className='relative mt-8 max-w-md'>
              <Search className='text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2' />
              <input
                type='text'
                placeholder='Search exams or fields...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='border-border bg-card/80 text-foreground placeholder:text-muted-foreground focus:ring-accent/40 focus:border-accent/60 w-full rounded-lg border py-3 pl-10 pr-4 text-sm transition-all focus:outline-none focus:ring-2'
              />
            </div>
          </div>
        </div>

        {/* FormCraft Promo Section - Darker */}
        <div className='border-accent/30 from-accent/40 via-background to-primary/10 mb-12 rounded-xl border bg-gradient-to-r p-6 backdrop-blur-sm'>
          <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-start gap-4'>
              <div className='bg-accent flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border shadow-lg'>
                <BarChart3 className='h-6 w-6 text-black' />
              </div>
              <div>
                <h3 className='text-foreground flex items-center gap-2 text-base font-semibold'>
                  Create Your Own Surveys with FormCraft
                  <span className='bg-accent/30 text-accent-foreground rounded-full px-2 py-0.5 text-xs font-medium'>
                    NEW
                  </span>
                </h3>
                <p className='text-muted-foreground mt-1 text-sm'>
                  Build custom surveys, collect responses, and analyze data.
                  Perfect for feedback, quizzes, and research.
                </p>
              </div>
            </div>
            <Link href='/form/dashboard'>
              <Button
                variant='outline'
                className='border-accent/60 hover:bg-accent/20 hover:text-accent-foreground group gap-2 border text-black'
              >
                <FilePlus className='h-4 w-4 transition-transform group-hover:rotate-12' />
                Launch FormCraft
                <BarChart3 className='h-3.5 w-3.5 opacity-70' />
              </Button>
            </Link>
          </div>
        </div>

        {/* Categories */}
        {filtered.length > 0 ? (
          <div className='space-y-10'>
            {filtered.map((cat, idx) => (
              <div
                key={cat.title}
                className='animate-fade-in'
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CategorySection category={cat} />
              </div>
            ))}
          </div>
        ) : (
          <div className='border-border bg-card/50 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center'>
            <Search className='text-muted-foreground h-12 w-12 opacity-30' />
            <p className='text-muted-foreground mt-4 text-lg'>
              No results found for "{search}"
            </p>
            <Button
              variant='link'
              onClick={() => setSearch('')}
              className='text-accent/90 mt-2'
            >
              Clear search
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className='border-border bg-card/30 mt-16 border-t'>
        <div className='mx-auto max-w-6xl px-4 py-8'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
            <div className='col-span-1 md:col-span-2'>
              <div className='flex items-center gap-2'>
                <Target className='text-accent h-5 w-5' />
                <span className='text-foreground font-semibold'>PrepHub</span>
              </div>
              <p className='text-muted-foreground mt-2 max-w-xs text-sm'>
                Your comprehensive platform for exam preparation and survey
                creation.
              </p>
            </div>
            <div>
              <h4 className='text-foreground mb-3 text-sm font-semibold'>
                Resources
              </h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link
                    href='#'
                    className='text-muted-foreground hover:text-accent/80 transition-colors'
                  >
                    Exams
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='text-muted-foreground hover:text-accent/80 transition-colors'
                  >
                    Study Notes
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='text-muted-foreground hover:text-accent/80 transition-colors'
                  >
                    Flash Cards
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='text-foreground mb-3 text-sm font-semibold'>
                FormCraft
              </h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link
                    href='/form/dashboard'
                    className='text-muted-foreground hover:text-accent/80 transition-colors'
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href='/form/surveys'
                    className='text-muted-foreground hover:text-accent/80 transition-colors'
                  >
                    My Surveys
                  </Link>
                </li>
                <li>
                  <Link
                    href='/form/builder'
                    className='text-muted-foreground hover:text-accent/80 transition-colors'
                  >
                    Create Survey
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-border mt-8 border-t pt-6 text-center'>
            <p className='text-muted-foreground text-xs'>
              PrepHub — Exam & Interview Preparation Hub. Built with FormCraft.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
