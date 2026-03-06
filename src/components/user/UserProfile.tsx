// components/UserProfile.tsx
// Drop-in profile button + dropdown for the PrepHub header.
// Reads user from Jotai `userAtom`. Shows initials avatar + name.
// Dropdown: Settings, Integrate Your App, Logout.

'use client';

import { useAtom } from 'jotai';
import {
  ExternalLink,
  GraduationCap,
  Link2,
  LogOut,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import LoadingSpin from 'public/svg/loadingSpin.svg';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useLogOut } from '@/hooks/auth/user/userMutation';

import { userme } from '@/store'; // Fixed import name

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  name: string;
  email: string;
  avatar?: string;
  plan?: 'Free' | 'Pro' | 'Enterprise';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name = ''): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function nameToHue(name = ''): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

// ─── Menu items ───────────────────────────────────────────────────────────────

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  description: string;
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'profile',
    label: 'My Profile',
    icon: User,
    href: '/profile',
    description: 'View & edit your profile',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    description: 'Preferences & account',
  },
  {
    id: 'integrate',
    label: 'Integrate Your App',
    icon: Link2,
    href: '/integrations',
    description: 'Connect external tools',
    badge: 'NEW',
  },
  {
    id: 'exams',
    label: 'My Exams',
    icon: GraduationCap,
    href: '/dashboard',
    description: 'Track your preparation',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function UserProfile({ ...props }) {
  const [user, setUser] = useAtom(userme);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const logoutMutation = useLogOut();
  const isLoad = logoutMutation.isLoading;

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setUser(null);
      setOpen(false);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error);
      // Force logout locally even if API fails
      setUser(null);
      setOpen(false);
      toast.error('Session ended locally');
    }
  };

  // Show loading state
  if (props.isLoading) {
    return (
      <div className='bg-accent/10 flex h-10 w-10 items-center justify-center rounded-full'>
        <LoadingSpin className='h-16 w-16 animate-spin rounded-full border-solid' />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials = getInitials(props.name);
  const hue = nameToHue(props.name);
  const plan = user?.plan ?? 'Free';

  return (
    <div ref={ref} className='relative'>
      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className='border-border bg-card hover:border-accent/40 focus-visible:ring-accent/50 group flex items-center gap-2.5 rounded-full border px-2 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2'
        aria-expanded={open}
        aria-haspopup='true'
      >
        {/* Avatar */}
        <div
          className='relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-inner'
          style={{
            background: `linear-gradient(135deg, hsl(${hue},70%,50%), hsl(${
              (hue + 40) % 360
            },65%,45%))`,
          }}
        >
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={props.name}
              width={32}
              height={32}
              className='h-full w-full rounded-full object-cover'
            />
          ) : (
            initials
          )}
          {/* Online dot */}
          <span className='border-card absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 bg-emerald-400' />
        </div>

        {/* Name — hidden on very small screens */}

        {/* <ChevronDown
          className={`text-muted-foreground h-3.5 w-3.5 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        /> */}
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div
          className='border-border bg-card animate-in absolute right-0 top-[calc(100%+8px)] z-50 w-72 overflow-hidden rounded-2xl border shadow-2xl shadow-black/10 ring-1 ring-black/5'
          style={{
            animation: 'dropIn 0.18s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          {/* User info header */}
          <div
            className='relative overflow-hidden px-4 py-4'
            style={{
              background: `linear-gradient(135deg, hsl(${hue},60%,96%), hsl(${
                (hue + 40) % 360
              },50%,97%))`,
            }}
          >
            <div className='flex items-center gap-3'>
              {/* Large avatar */}
              <div
                className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-md'
                style={{
                  background: `linear-gradient(135deg, hsl(${hue},70%,50%), hsl(${
                    (hue + 40) % 360
                  },65%,45%))`,
                }}
              >
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={props.name}
                    width={48}
                    height={48}
                    className='h-full w-full rounded-xl object-cover'
                  />
                ) : (
                  initials
                )}
              </div>

              <div className='min-w-0 flex-1'>
                <p className='text-foreground truncate font-semibold'>
                  {props.name}
                </p>
                <p className='text-muted-foreground truncate text-xs'>
                  {props.email}
                </p>
                <div className='mt-1 flex items-center gap-1'>
                  <Shield className='h-3 w-3 text-emerald-500' />
                  <span className='text-xs font-medium text-emerald-600'>
                    {plan} Plan
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className='bg-border h-px' />

          {/* Menu items */}
          <nav className='p-1.5'>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className='hover:bg-accent/10 group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors'
                >
                  <div className='bg-muted group-hover:bg-accent/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors'>
                    <Icon className='text-muted-foreground group-hover:text-accent h-4 w-4 transition-colors' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='text-foreground font-medium'>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className='bg-accent/20 text-accent rounded-full px-1.5 py-0.5 text-[10px] font-semibold'>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className='text-muted-foreground truncate text-xs'>
                      {item.description}
                    </p>
                  </div>
                  <ExternalLink className='text-muted-foreground/40 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100' />
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className='bg-border mx-3 h-px' />

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={isLoad}
            className='group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30'
          >
            {isLoad ? (
              <>
                <LoadingSpin className='h-4 w-4 animate-spin' />
              </>
            ) : (
              <>
                <LogOut className='h-4 w-4' />
                <span>Log out</span>
              </>
            )}
          </button>

          {/* Bottom padding */}
          <div className='h-1' />
        </div>
      )}

      <style jsx>{`
        @keyframes dropIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
