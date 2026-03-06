export type QuestionType =
  | 'multiple_choice'
  | 'text'
  | 'rating'
  | 'checkbox'
  | 'dropdown'
  | 'linear_scale'
  | 'date'
  | 'email'
  | 'phone'
  | 'number'
  | 'yes_no';

export type FormCategory =
  | 'survey'
  | 'quiz'
  | 'poll'
  | 'registration'
  | 'feedback'
  | 'custom';

export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean; // for quiz scoring
}

export interface ConditionalRule {
  questionId: string;
  value: string;
  action: 'show' | 'skip';
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: Option[];
  maxRating?: number;
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  points?: number; // quiz points
  conditionalRule?: ConditionalRule;
}

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  headerImage?: string;
  logoUrl?: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  category: FormCategory;
  questions: Question[];
  status: 'draft' | 'active' | 'closed';
  createdAt: string;
  responses: SurveyResponse[];
  timerEnabled?: boolean;
  timerMinutes?: number;
  theme?: FormTheme;
  showProgressBar?: boolean;
  shuffleQuestions?: boolean;
  allowMultipleResponses?: boolean;
  successMessage?: string;
}

export interface Answer {
  questionId: string;
  value: string | string[] | number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Answer[];
  submittedAt: string;
  score?: number;
  totalPoints?: number;
  timeTaken?: number; // seconds
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: FormCategory;
  icon: string;
  questions: Question[];
  timerEnabled?: boolean;
  timerMinutes?: number;
}
