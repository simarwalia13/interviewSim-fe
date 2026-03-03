export interface StudyNote {
  id: number;
  title: string;
  content: string;
  keyPoints: string[];
}

export interface FlashCard {
  id: number;
  front: string;
  back: string;
}

export interface PreviousPaper {
  id: number;
  year: string;
  title: string;
  questions: number;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface SyllabusTopic {
  id: number;
  unit: string;
  topics: string[];
  weightage: string;
}

export const generateStudyNotes = (examName: string): StudyNote[] => [
  {
    id: 1,
    title: 'Fundamentals & Core Concepts',
    content: `Understanding the foundational principles of ${examName} is critical. This section covers the building blocks that form the basis of all advanced topics.`,
    keyPoints: [
      'Define core terminology and definitions',
      'Understand the historical evolution of the subject',
      'Identify the key frameworks and models',
      'Relate concepts to real-world applications',
    ],
  },
  {
    id: 2,
    title: 'Important Theories & Models',
    content:
      'Theories provide the backbone of any subject. Learn the major theories, their proponents, and how they apply to problem-solving in examinations.',
    keyPoints: [
      'Classical vs. modern approaches',
      'Key theorists and their contributions',
      'Comparative analysis of models',
      'Application in exam scenarios',
    ],
  },
  {
    id: 3,
    title: 'Problem-Solving Techniques',
    content:
      'Mastering problem-solving is essential for scoring well. This section focuses on systematic approaches to tackling different question types.',
    keyPoints: [
      'Step-by-step analytical approach',
      'Elimination techniques for MCQs',
      'Time-saving shortcuts and tricks',
      'Common mistakes to avoid',
    ],
  },
  {
    id: 4,
    title: 'Data Interpretation & Analysis',
    content:
      'Many exams include data-heavy questions. Learn how to quickly interpret charts, graphs, and tables to extract meaningful insights.',
    keyPoints: [
      'Reading bar charts and pie diagrams',
      'Calculating percentages and ratios',
      'Identifying trends and patterns',
      'Drawing conclusions from data sets',
    ],
  },
  {
    id: 5,
    title: 'Revision Strategy & Exam Tips',
    content:
      'A solid revision plan can make the difference between passing and excelling. Follow a structured approach in the final weeks before the exam.',
    keyPoints: [
      'Create a revision timetable',
      'Focus on high-weightage topics',
      'Practice with timed mock tests',
      'Stay calm and manage exam anxiety',
    ],
  },
];

export const generateFlashCards = (examName: string): FlashCard[] => [
  {
    id: 1,
    front: `What is the most important skill for ${examName}?`,
    back: 'Critical thinking and analytical reasoning are the most valued skills.',
  },
  {
    id: 2,
    front: 'What is spaced repetition?',
    back: 'A learning technique where review intervals increase over time to improve long-term memory retention.',
  },
  {
    id: 3,
    front: 'What is the Pomodoro technique?',
    back: 'A time management method using 25-minute focused work intervals followed by 5-minute breaks.',
  },
  {
    id: 4,
    front: 'Define active recall',
    back: 'A study method where you actively stimulate memory during learning by testing yourself on the material.',
  },
  {
    id: 5,
    front: 'What is the Feynman technique?',
    back: 'Explain a concept in simple terms as if teaching someone else to identify gaps in understanding.',
  },
  {
    id: 6,
    front: 'What does SWOT analysis stand for?',
    back: 'Strengths, Weaknesses, Opportunities, and Threats — a strategic planning framework.',
  },
  {
    id: 7,
    front: 'What is the 80/20 rule (Pareto Principle)?',
    back: '80% of results come from 20% of efforts. Focus on high-impact topics for maximum score improvement.',
  },
  {
    id: 8,
    front: 'What is mind mapping?',
    back: 'A visual technique for organizing information around a central concept using branches and keywords.',
  },
  {
    id: 9,
    front: 'What is chunking in memory?',
    back: 'Grouping individual pieces of information into larger, meaningful units to improve recall.',
  },
  {
    id: 10,
    front: 'Best approach for negative marking?',
    back: "Only attempt questions you're reasonably confident about. Skip if unsure to avoid penalty.",
  },
];

export const generatePreviousPapers = (examName: string): PreviousPaper[] => [
  {
    id: 1,
    year: '2024',
    title: `${examName} — Paper I`,
    questions: 100,
    duration: '2 hours',
    difficulty: 'Medium',
  },
  {
    id: 2,
    year: '2024',
    title: `${examName} — Paper II`,
    questions: 80,
    duration: '2 hours',
    difficulty: 'Hard',
  },
  {
    id: 3,
    year: '2023',
    title: `${examName} — Paper I`,
    questions: 100,
    duration: '2 hours',
    difficulty: 'Easy',
  },
  {
    id: 4,
    year: '2023',
    title: `${examName} — Paper II`,
    questions: 80,
    duration: '2 hours',
    difficulty: 'Medium',
  },
  {
    id: 5,
    year: '2022',
    title: `${examName} — Paper I`,
    questions: 100,
    duration: '2 hours',
    difficulty: 'Medium',
  },
  {
    id: 6,
    year: '2022',
    title: `${examName} — Paper II`,
    questions: 80,
    duration: '2 hours',
    difficulty: 'Hard',
  },
];

export const generateSyllabus = (examName: string): SyllabusTopic[] => [
  {
    id: 1,
    unit: 'Unit 1 — Fundamentals',
    topics: [
      'Basic concepts & terminology',
      'Historical background',
      'Core principles',
      'Introduction to frameworks',
    ],
    weightage: '20%',
  },
  {
    id: 2,
    unit: 'Unit 2 — Quantitative Aptitude',
    topics: [
      'Number systems',
      'Percentages & ratios',
      'Algebra & geometry',
      'Data interpretation',
    ],
    weightage: '25%',
  },
  {
    id: 3,
    unit: 'Unit 3 — Logical Reasoning',
    topics: [
      'Syllogisms',
      'Coding-decoding',
      'Blood relations',
      'Seating arrangements',
    ],
    weightage: '20%',
  },
  {
    id: 4,
    unit: 'Unit 4 — Domain Knowledge',
    topics: [
      `${examName}-specific concepts`,
      'Current affairs & updates',
      'Case studies',
      'Applied problems',
    ],
    weightage: '25%',
  },
  {
    id: 5,
    unit: 'Unit 5 — General Awareness',
    topics: [
      'Indian polity & governance',
      'Economy basics',
      'Science & technology',
      'Current events',
    ],
    weightage: '10%',
  },
];
