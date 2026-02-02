import { useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useMutation } from 'react-query';

import {
  getGuestSessionFromStorage,
  guestSessionAtom,
  setGuestSession,
} from '@/store';

import { createGuest } from '@/services/guest';

export function useCreateGuest() {
  const setGuestSessionAtom = useSetAtom(guestSessionAtom);

  return useMutation(() => createGuest(), {
    onSuccess: (data) => {
      setGuestSession(data);
      setGuestSessionAtom(data);
    },
  });
}

/** Read guest session from store; hydrates from localStorage on mount. Use for dashboard. */
export function useGuestSession() {
  const [session, setSession] = useAtom(guestSessionAtom);

  useEffect(() => {
    if (session === null && typeof window !== 'undefined') {
      const stored = getGuestSessionFromStorage();
      if (stored) setSession(stored);
    }
  }, [session, setSession]);

  const clearGuest = () => {
    setGuestSession(null);
    setSession(null);
  };

  return { guest: session, clearGuest, isGuest: !!session };
}
