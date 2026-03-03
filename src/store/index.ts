import { atom } from 'jotai';

export const loginFlag = atom(false);
export const useremail = atom<any>('');
export const userme = atom<any>({});

// Feedback submitted state
export const feedbackSubmittedAtom = atom(false);
