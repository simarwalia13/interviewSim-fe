export interface ExamCategory {
  title: string;
  description: string;
  items: string[];
}

export const governmentExams: ExamCategory = {
  title: 'Government Exams',
  description: 'Central & State level examinations',
  items: [
    'UPSC Civil Services (IAS/IPS/IFS)',
    'SSC CGL',
    'SSC CHSL',
    'SSC MTS',
    'IBPS PO',
    'IBPS Clerk',
    'SBI PO',
    'SBI Clerk',
    'RBI Grade B',
    'RRB NTPC',
    'RRB Group D',
    'NABARD Grade A',
    'LIC AAO',
    'SEBI Grade A',
    'NDA & CDS',
    'CAPF (AC)',
    'Indian Forest Service',
    'State PSC Exams',
  ],
};

export const competitiveExams: ExamCategory = {
  title: 'Competitive Exams',
  description: 'National level competitive tests',
  items: [
    'GATE',
    'UGC NET / JRF',
    'CAT',
    'MAT',
    'XAT',
    'CLAT',
    'CTET',
    'TET (State)',
    'CSIR NET',
    'ICAR NET',
    'JEST',
    'SET / SLET',
  ],
};

export const collegeEntrance: ExamCategory = {
  title: 'College Entrance',
  description: 'Undergraduate & postgraduate admissions',
  items: [
    'JEE Main',
    'JEE Advanced',
    'NEET UG',
    'NEET PG',
    'CUET UG',
    'CUET PG',
    'BITSAT',
    'VITEEE',
    'WBJEE',
    'MHT CET',
    'AP EAMCET',
    'KCET',
    'COMEDK',
    'NATA',
    'NID DAT',
    'UCEED',
  ],
};

export const jobFields: ExamCategory = {
  title: 'Job Interview Prep',
  description: 'Domain-wise interview preparation',
  items: [
    'Software Engineering',
    'Data Science & ML',
    'Civil Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Banking & Finance',
    'Teaching & Education',
    'Medical & Healthcare',
    'Law & Legal',
    'Journalism & Media',
    'Defence & Military',
    'Public Administration',
    'Accounting & Audit',
    'Marketing & Sales',
    'Human Resources',
    'Supply Chain & Logistics',
  ],
};

// export const GeneralQuizz = {};

export const allCategories = [
  governmentExams,
  competitiveExams,
  collegeEntrance,
  jobFields,
  // GeneralQuizz,
];
