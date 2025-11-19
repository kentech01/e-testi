/**
 * User Answer Atoms
 *
 * Usage Example:
 *
 * import { useRecoilState, useSetRecoilState } from 'recoil';
 * import { userAnswersAtom, examResultsAtom } from '@/store/atoms/userAnswerAtom';
 *
 * function MyComponent() {
 *   const [userAnswersState, setUserAnswersState] = useRecoilState(userAnswersAtom);
 *   const setResults = useSetRecoilState(examResultsAtom);
 *
 *   // Update answers
 *   setUserAnswersState({ ...userAnswersState, answers: newAnswers });
 * }
 */

import { atom } from 'recoil';
import { UserAnswer, ExamResults } from '../../services/userAnswers';

export interface UserAnswersState {
  answers: UserAnswer[]; // All answers (flat list)
  answersByExam: Map<string | number, UserAnswer[]>; // Cache answers by examId
  loading: boolean;
  error: string | null;
}

export const userAnswersAtom = atom<UserAnswersState>({
  key: 'userAnswersState',
  default: {
    answers: [],
    answersByExam: new Map(),
    loading: false,
    error: null,
  },
});

export interface ExamResultsState {
  results: Map<string, ExamResults>; // Map of examId to ExamResults
  loading: boolean;
  error: string | null;
}

export const examResultsAtom = atom<ExamResultsState>({
  key: 'examResultsState',
  default: {
    results: new Map(),
    loading: false,
    error: null,
  },
});

