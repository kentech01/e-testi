import { atom } from 'recoil';
import type { Question } from '../../services/questions';

export interface QuestionsState {
  questions: Question[]; // List of questions (for create flow)
  questionsByExam: Map<string | number, Question[]>; // Cache questions by examId
  currentQuestion: Question | null;
  loading: boolean;
  error: string | null;
  // create flow helpers
  currentExamId: string | null; // set when first exam is created
  lastOrderNumber: number; // track order for next question
}

export const questionsAtom = atom<QuestionsState>({
  key: 'questionsState',
  default: {
    questions: [],
    questionsByExam: new Map(),
    currentQuestion: null,
    loading: false,
    error: null,
    currentExamId: null,
    lastOrderNumber: 0,
  },
});
