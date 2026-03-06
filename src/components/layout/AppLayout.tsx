import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  LayoutDashboard,
  List,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import UserProfile from '@/components/user/UserProfile';

const navItems = [
  { to: '/form/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/form/surveys', icon: List, label: 'Surveys' },
  { to: '/form/builder', icon: FilePlus, label: 'Create' },
  { to: '/form/template', icon: Sparkles, label: 'Templates' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = router.pathname;

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className='flex min-h-screen'>
      {/* Sidebar */}
      <aside
        className={cn(
          'border-border bg-card relative hidden flex-col border-r transition-all duration-300 md:flex',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className='bg-accent hover:bg-accent/80 absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border shadow-md transition-colors'
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className='text-accent-foreground h-3 w-3' />
          ) : (
            <ChevronLeft className='text-accent-foreground h-3 w-3' />
          )}
        </button>

        {/* Logo */}
        <Link
          href='/form/dashboard'
          className={cn(
            'mb-10 flex items-center gap-2 px-3 pt-6',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <div className='bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg'>
            <BarChart3 className='text-primary-foreground h-4 w-4' />
          </div>
          {!isCollapsed && (
            <span className='font-heading text-foreground text-xl font-bold tracking-tight'>
              FormCraft
            </span>
          )}
        </Link>

        {/* Navigation */}
        <nav className='flex flex-1 flex-col gap-1 px-3'>
          {navItems.map((item) => {
            const active =
              pathname === item.to ||
              (item.to !== '/' && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  isCollapsed ? 'justify-center' : ''
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className='h-4 w-4 shrink-0' />
                {!isCollapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section at Bottom */}
        <div
          className={cn(
            'border-border mt-auto border-t p-3',
            isCollapsed ? 'px-2' : ''
          )}
        >
          <UserProfile />
        </div>
      </aside>

      {/* Mobile nav */}
      <div className='border-border bg-card fixed bottom-0 left-0 right-0 z-50 flex border-t md:hidden'>
        {navItems?.map((item) => {
          const active =
            pathname === item.to ||
            (item.to !== '/' && pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className='h-5 w-5' />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Main content */}
      <main className='flex-1 overflow-auto pb-20 md:pb-0'>
        <div className='mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8'>
          {children}
        </div>
      </main>
    </div>
  );
}
