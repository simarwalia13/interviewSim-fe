export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
}

// Generic sample questions — in a real app these would come from an API per exam
export const generateMockQuestions = (examName: string): Question[] => [
  {
    id: 1,
    question: `Which of the following is most relevant to ${examName}?`,
    options: [
      'Option A - Fundamental concept',
      'Option B - Advanced theory',
      'Option C - Practical application',
      'Option D - Historical context',
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: 'What is the primary purpose of a systematic study approach?',
    options: [
      'Memorization only',
      'Understanding core concepts',
      'Passing without effort',
      'Skipping fundamentals',
    ],
    correctAnswer: 1,
  },
  {
    id: 3,
    question:
      'Which study technique is considered most effective for long-term retention?',
    options: [
      'Cramming',
      'Spaced repetition',
      'Reading once',
      'Highlighting only',
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: 'What does critical thinking primarily involve?',
    options: [
      'Accepting information at face value',
      'Analyzing and evaluating arguments',
      'Memorizing facts',
      'Following instructions blindly',
    ],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: 'Which of these is a key component of effective time management?',
    options: [
      'Multitasking always',
      'Prioritization',
      'Working without breaks',
      'Avoiding planning',
    ],
    correctAnswer: 1,
  },
  {
    id: 6,
    question: 'What is the best way to approach multiple-choice questions?',
    options: [
      'Always pick C',
      'Eliminate wrong answers first',
      'Choose the longest answer',
      'Skip all difficult ones',
    ],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: 'Which factor most influences exam performance?',
    options: [
      'Luck',
      'Consistent preparation',
      'Last-minute study',
      'Exam hall temperature',
    ],
    correctAnswer: 1,
  },
  {
    id: 8,
    question: 'What is the recommended revision strategy before exams?',
    options: [
      'Learn new topics',
      'Revise what you know',
      "Don't revise at all",
      'Only read summaries',
    ],
    correctAnswer: 1,
  },
  {
    id: 9,
    question: "How should you handle a question you're unsure about?",
    options: [
      'Leave it blank always',
      'Mark it and return later',
      'Spend 10 minutes on it',
      'Panic immediately',
    ],
    correctAnswer: 1,
  },
  {
    id: 10,
    question: 'What role does practice testing play in preparation?',
    options: [
      'No significant role',
      'Identifies weak areas',
      'Wastes time',
      'Only useful for toppers',
    ],
    correctAnswer: 1,
  },
  {
    id: 11,
    question: 'Which note-taking method aids comprehension best?',
    options: [
      'Copying textbook verbatim',
      'Creating mind maps',
      'Not taking notes',
      'Typing everything',
    ],
    correctAnswer: 1,
  },
  {
    id: 12,
    question: 'What is the ideal study session duration?',
    options: [
      '5 hours non-stop',
      '25-50 minutes with breaks',
      'All night before exam',
      '10 minutes total',
    ],
    correctAnswer: 1,
  },
  {
    id: 13,
    question: 'Which resource type is generally most reliable for exam prep?',
    options: [
      'Random blogs',
      'Official syllabus & past papers',
      'Social media tips',
      'Unverified PDFs',
    ],
    correctAnswer: 1,
  },
  {
    id: 14,
    question: 'What should you do on the day before an exam?',
    options: [
      'Start a new topic',
      'Light revision and rest',
      'Pull an all-nighter',
      'Ignore all preparation',
    ],
    correctAnswer: 1,
  },
  {
    id: 15,
    question: 'How does group study benefit preparation?',
    options: [
      "It doesn't",
      'Enables discussion and doubt clearing',
      'Creates more confusion',
      'Only for weak students',
    ],
    correctAnswer: 1,
  },
  {
    id: 16,
    question: 'What is the significance of mock tests?',
    options: [
      'Waste of time',
      'Simulates real exam conditions',
      'Only for advanced students',
      'Replaces actual study',
    ],
    correctAnswer: 1,
  },
  {
    id: 17,
    question: 'Which habit improves focus during study?',
    options: [
      'Studying with TV on',
      'Removing distractions',
      'Checking phone frequently',
      'Eating while studying',
    ],
    correctAnswer: 1,
  },
  {
    id: 18,
    question: 'What is active recall?',
    options: [
      'Reading passively',
      'Testing yourself on material',
      'Listening to lectures',
      'Watching videos only',
    ],
    correctAnswer: 1,
  },
  {
    id: 19,
    question: 'Why is sleep important during exam preparation?',
    options: [
      "It's not important",
      'Consolidates memory and restores energy',
      'Wastes study time',
      'Only needed after exams',
    ],
    correctAnswer: 1,
  },
  {
    id: 20,
    question: 'What should be your first step when starting exam preparation?',
    options: [
      'Buy all books available',
      'Understand the syllabus and exam pattern',
      'Start solving questions randomly',
      'Ask friends what to do',
    ],
    correctAnswer: 1,
  },
];
