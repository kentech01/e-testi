/**
 * User Answer Selectors
 *
 * Usage Example:
 *
 * import { useRecoilValue } from 'recoil';
 * import {
 *   userAnswersSelector,
 *   examResultsSelector,
 *   answersByExamSelector
 * } from '@/store/selectors/userAnswerSelectors';
 *
 * function MyComponent() {
 *   const answers = useRecoilValue(userAnswersSelector);
 *   const results = useRecoilValue(examResultsSelector('exam-id'));
 *   const examAnswers = useRecoilValue(answersByExamSelector('exam-id'));
 * }
 */

import { selector } from 'recoil';
import {
  userAnswersAtom,
  examResultsAtom,
} from '../atoms/userAnswerAtom';
import { UserAnswer, ExamResults } from '../../services/userAnswers';

export const userAnswersSelector = selector<UserAnswer[]>({
  key: 'userAnswersSelector',
  get: ({ get }) => {
    const state = get(userAnswersAtom);
    return state.answers;
  },
});

export const userAnswersByExamSelector = (examId: string | number) =>
  selector<UserAnswer[]>({
    key: `userAnswersByExamSelector_${examId}`,
    get: ({ get }) => {
      const state = get(userAnswersAtom);
      const cached = state.answersByExam.get(examId);
      return cached || [];
    },
  });

export const userAnswersByExamCacheSelector = selector({
  key: 'userAnswersByExamCacheSelector',
  get: ({ get }) => {
    const state = get(userAnswersAtom);
    return state.answersByExam;
  },
});

export const userAnswersLoadingSelector = selector<boolean>({
  key: 'userAnswersLoadingSelector',
  get: ({ get }) => {
    const state = get(userAnswersAtom);
    return state.loading;
  },
});

export const userAnswersErrorSelector = selector<string | null>({
  key: 'userAnswersErrorSelector',
  get: ({ get }) => {
    const state = get(userAnswersAtom);
    return state.error;
  },
});

export const examResultsMapSelector = selector<Map<string, ExamResults>>({
  key: 'examResultsMapSelector',
  get: ({ get }) => {
    const state = get(examResultsAtom);
    return state.results;
  },
});

export const examResultsLoadingSelector = selector<boolean>({
  key: 'examResultsLoadingSelector',
  get: ({ get }) => {
    const state = get(examResultsAtom);
    return state.loading;
  },
});

export const examResultsErrorSelector = selector<string | null>({
  key: 'examResultsErrorSelector',
  get: ({ get }) => {
    const state = get(examResultsAtom);
    return state.error;
  },
});

/**
 * Get exam results for a specific exam
 */
export const examResultsSelector = (examId: string) =>
  selector<ExamResults | null>({
    key: `examResultsSelector_${examId}`,
    get: ({ get }) => {
      const resultsMap = get(examResultsMapSelector);
      return resultsMap.get(examId) || null;
    },
  });

/**
 * Get all answers for a specific exam
 */
export const answersByExamSelector = (examId: string) =>
  selector<UserAnswer[]>({
    key: `answersByExamSelector_${examId}`,
    get: ({ get }) => {
      const answers = get(userAnswersSelector);
      return answers.filter((answer) => answer.examId === examId);
    },
  });

/**
 * Get all answers for a specific question
 */
export const answersByQuestionSelector = (questionId: string) =>
  selector<UserAnswer[]>({
    key: `answersByQuestionSelector_${questionId}`,
    get: ({ get }) => {
      const answers = get(userAnswersSelector);
      return answers.filter((answer) => answer.questionId === questionId);
    },
  });

/**
 * Get answer for a specific question (most recent)
 */
export const answerByQuestionSelector = (questionId: string) =>
  selector<UserAnswer | null>({
    key: `answerByQuestionSelector_${questionId}`,
    get: ({ get }) => {
      const answers = get(userAnswersSelector);
      const questionAnswers = answers.filter(
        (answer) => answer.questionId === questionId
      );
      // Return most recent answer
      return questionAnswers.length > 0
        ? questionAnswers.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0]
        : null;
    },
  });

/**
 * Get total correct answers count
 */
export const totalCorrectAnswersSelector = selector<number>({
  key: 'totalCorrectAnswersSelector',
  get: ({ get }) => {
    const answers = get(userAnswersSelector);
    return answers.filter((answer) => answer.isCorrect).length;
  },
});

/**
 * Get total points earned
 */
export const totalPointsSelector = selector<number>({
  key: 'totalPointsSelector',
  get: ({ get }) => {
    const answers = get(userAnswersSelector);
    return answers.reduce((sum, answer) => sum + answer.pointsEarned, 0);
  },
});

/**
 * Get total time spent (in seconds)
 */
export const totalTimeSpentSelector = selector<number>({
  key: 'totalTimeSpentSelector',
  get: ({ get }) => {
    const answers = get(userAnswersSelector);
    return answers.reduce(
      (sum, answer) => sum + answer.timeSpentSeconds,
      0
    );
  },
});

/**
 * Get accuracy percentage
 */
export const overallAccuracySelector = selector<number>({
  key: 'overallAccuracySelector',
  get: ({ get }) => {
    const answers = get(userAnswersSelector);
    if (answers.length === 0) return 0;
    const correctCount = answers.filter((answer) => answer.isCorrect).length;
    return (correctCount / answers.length) * 100;
  },
});

/**
 * Get answers count for a specific exam
 */
export const answersCountByExamSelector = (examId: string) =>
  selector<number>({
    key: `answersCountByExamSelector_${examId}`,
    get: ({ get }) => {
      const answers = get(answersByExamSelector(examId));
      return answers.length;
    },
  });

/**
 * Check if a question has been answered
 */
export const isQuestionAnsweredSelector = (questionId: string) =>
  selector<boolean>({
    key: `isQuestionAnsweredSelector_${questionId}`,
    get: ({ get }) => {
      const answer = get(answerByQuestionSelector(questionId));
      return answer !== null;
    },
  });

