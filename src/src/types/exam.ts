export type Subject = 'matematik' | 'gjuhaShqipe' | 'anglisht';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: Subject;
  imageUrl?: string;
  imageCaption?: string;
  readingPassage?: string;
  passageId?: string;
  passageTitle?: string;
  questionNumber?: number;
  totalPassageQuestions?: number;
  hasInteractiveGraph?: boolean;
  graphConfig?: GraphConfig;
  difficulty?: 'easy' | 'medium' | 'hard';
  topics?: string[];
}

export interface GraphConfig {
  functionType: 'quadratic' | 'linear' | 'exponential' | 'trigonometric';
  coefficients?: { a?: number; b?: number; c?: number; d?: number; };
  domain?: { x: [number, number]; y: [number, number]; };
  title?: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: Subject;
  questionCount: number;
  duration: number; // in seconds
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  updatedAt: string;
}

export interface ExamSession {
  id: string;
  examId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  timeRemaining: number;
  currentPage: number;
  answers: (number | null)[];
  flaggedQuestions: number[];
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface TestResult {
  id: string;
  examId: string;
  sessionId: string;
  userId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
  answers: (number | null)[];
  questionResults: QuestionResult[];
  percentile?: number;
  subject: Subject;
}

export interface QuestionResult {
  questionId: number;
  selectedAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
  timeSpent?: number;
}

export interface ExamStats {
  totalExams: number;
  completedExams: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  subjectStats: Record<Subject, SubjectStats>;
}

export interface SubjectStats {
  subject: Subject;
  examsCompleted: number;
  averageScore: number;
  bestScore: number;
  weakTopics: string[];
  strongTopics: string[];
}