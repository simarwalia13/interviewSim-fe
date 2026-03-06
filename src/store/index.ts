import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type { Survey } from './types';

export const loginFlag = atom(false);
export const signupEmailAtom = atom<string>('');
export const userme = atom<any>({});

// Feedback submitted state
export const feedbackSubmittedAtom = atom(false);

// form
export const surveysAtom = atomWithStorage<Survey[]>('formcraft-surveys', []);

export const activeSurveyIdAtom = atom<string | null>(null);

export const activeSurveyAtom = atom((get) => {
  const surveys = get(surveysAtom);
  const id = get(activeSurveyIdAtom);
  return surveys.find((s) => s.id === id) ?? null;
});
