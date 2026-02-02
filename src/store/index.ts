import { atom } from 'jotai';

import type { CreateGuestResponse } from '@/Interface';

const GUEST_STORAGE_KEY = 'interviewSim_guest';

export const loginFlag = atom(false);
export const useremail = atom<any>('');
export const userme = atom<any>({});

// Guest session (uuid + token from create guest API)
export const guestSessionAtom = atom<CreateGuestResponse | null>(null);

// Helper: persist guest to localStorage so it survives refresh and is used by API headers
export function setGuestSession(session: CreateGuestResponse | null) {
  if (typeof window === 'undefined') return;
  if (session) {
    window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(session));
    window.localStorage.setItem('authorization', `Bearer ${session.token}`);
  } else {
    window.localStorage.removeItem(GUEST_STORAGE_KEY);
    window.localStorage.removeItem('authorization');
  }
}

export function getGuestSessionFromStorage(): CreateGuestResponse | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(GUEST_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CreateGuestResponse) : null;
  } catch {
    return null;
  }
}
