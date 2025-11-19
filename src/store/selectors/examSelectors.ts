/**
 * Exam Selectors
 *
 * Usage Example:
 *
 * import { useRecoilValue, useRecoilState } from 'recoil';
 * import {
 *   examsSelector,
 *   currentExamSelector,
 *   answeredCountSelector
 * } from '@/store/selectors/examSelectors';
 *
 * function MyComponent() {
 *   const exams = useRecoilValue(examsSelector);
 *   const currentExam = useRecoilValue(currentExamSelector);
 *   const answeredCount = useRecoilValue(answeredCountSelector);
 *
 *   // Use dynamic selectors
 *   const isAnswered = useRecoilValue(isQuestionAnsweredSelector(questionId));
 * }
 */

import { selector } from 'recoil';
import {
  examAtom,
  questionAnswersAtom,
  currentQuestionIndexAtom,
} from '../atoms/examAtom';
import { Exam } from '../../services/exams';

export const examsSelector = selector({
  key: 'examsSelector',
  get: ({ get }) => {
    const examState = get(examAtom);
    return examState.exams;
  },
});

export const currentExamSelector = selector({
  key: 'currentExamSelector',
  get: ({ get }) => {
    const examState = get(examAtom);
    return examState.currentExam;
  },
});

export const examLoadingSelector = selector({
  key: 'examLoadingSelector',
  get: ({ get }) => {
    const examState = get(examAtom);
    return examState.loading;
  },
});

export const examErrorSelector = selector({
  key: 'examErrorSelector',
  get: ({ get }) => {
    const examState = get(examAtom);
    return examState.error;
  },
});

export const examStateSelector = selector({
  key: 'examStateSelector',
  get: ({ get }) => {
    const examState = get(examAtom);
    return examState;
  },
});

export const answersSelector = selector({
  key: 'answersSelector',
  get: ({ get }) => {
    const answersState = get(questionAnswersAtom);
    return answersState.answers;
  },
});

export const flaggedQuestionsSelector = selector({
  key: 'flaggedQuestionsSelector',
  get: ({ get }) => {
    const answersState = get(questionAnswersAtom);
    return answersState.flaggedQuestions;
  },
});

export const answeredCountSelector = selector({
  key: 'answeredCountSelector',
  get: ({ get }) => {
    const answersState = get(questionAnswersAtom);
    return answersState.answers.size;
  },
});

export const totalQuestionsSelector = selector({
  key: 'totalQuestionsSelector',
  get: ({ get }) => {
    const currentExam = get(currentExamSelector);
    return currentExam?.questions?.length || 0;
  },
});

export const completionProgressSelector = selector({
  key: 'completionProgressSelector',
  get: ({ get }) => {
    const answeredCount = get(answeredCountSelector);
    const totalQuestions = get(totalQuestionsSelector);
    if (totalQuestions === 0) return 0;
    return (answeredCount / totalQuestions) * 100;
  },
});

export const activeExamsSelector = selector({
  key: 'activeExamsSelector',
  get: ({ get }) => {
    const exams = get(examsSelector);
    return exams.filter((exam: Exam) => exam.isActive);
  },
});

export const examByIdSelector = (id: string | number) =>
  selector({
    key: `examByIdSelector_${id}`,
    get: ({ get }) => {
      const examState = get(examAtom);
      // First check cache
      const cached = examState.examsCache.get(id);
      if (cached) return cached;
      // Fallback to exams list
      return examState.exams.find((exam: Exam) => exam.id === id) || null;
    },
  });

export const examCacheSelector = selector({
  key: 'examCacheSelector',
  get: ({ get }) => {
    const examState = get(examAtom);
    return examState.examsCache;
  },
});

export const examsBySectorSelector = (sectorId: string) =>
  selector({
    key: `examsBySectorSelector_${sectorId}`,
    get: ({ get }) => {
      const exams = get(examsSelector);
      return exams.filter((exam: Exam) => exam.sectorId === sectorId);
    },
  });

export const currentQuestionSelector = selector({
  key: 'currentQuestionSelector',
  get: ({ get }) => {
    const currentExam = get(currentExamSelector);
    const currentIndex = get(currentQuestionIndexAtom);
    if (!currentExam?.questions) return null;
    return currentExam.questions[currentIndex] || null;
  },
});

export const isQuestionAnsweredSelector = (questionId: number) =>
  selector({
    key: `isQuestionAnsweredSelector_${questionId}`,
    get: ({ get }) => {
      const answers = get(answersSelector);
      return answers.has(questionId);
    },
  });

export const isQuestionFlaggedSelector = (questionId: number) =>
  selector({
    key: `isQuestionFlaggedSelector_${questionId}`,
    get: ({ get }) => {
      const flaggedQuestions = get(flaggedQuestionsSelector);
      return flaggedQuestions.has(questionId);
    },
  });
