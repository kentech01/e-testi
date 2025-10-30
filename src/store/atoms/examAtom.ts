/**
 * Exam Atoms
 *
 * Usage Example:
 *
 * import { useRecoilState, useSetRecoilState } from 'recoil';
 * import { examAtom, questionAnswersAtom } from '@/store/atoms/examAtom';
 *
 * function MyComponent() {
 *   const [examState, setExamState] = useRecoilState(examAtom);
 *   const setAnswers = useSetRecoilState(questionAnswersAtom);
 *
 *   // Update exams
 *   setExamState({ ...examState, exams: newExams });
 * }
 */

import { atom } from 'recoil';
import { Exam, Question } from '../../services/exams';

export interface ExamState {
  exams: Exam[];
  currentExam: Exam | null;
  loading: boolean;
  error: string | null;
}

export const examAtom = atom<ExamState>({
  key: 'examState',
  default: {
    exams: [],
    currentExam: null,
    loading: false,
    error: null,
  },
});

export interface QuestionAnswersState {
  answers: Map<number, number>; // Map of questionId to selected optionId
  flaggedQuestions: Set<number>; // Set of flagged questionIds
}

export const questionAnswersAtom = atom<QuestionAnswersState>({
  key: 'questionAnswersState',
  default: {
    answers: new Map(),
    flaggedQuestions: new Set(),
  },
});

export const currentQuestionIndexAtom = atom<number>({
  key: 'currentQuestionIndex',
  default: 0,
});
