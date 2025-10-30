import { selector } from 'recoil';
import { questionsAtom } from '../atoms/questionAtom';
import type { Question } from '../../services/questions';

export const questionsSelector = selector<Question[]>({
  key: 'questionsSelector',
  get: ({ get }) => get(questionsAtom).questions,
});

export const questionsLoadingSelector = selector<boolean>({
  key: 'questionsLoadingSelector',
  get: ({ get }) => get(questionsAtom).loading,
});

export const questionsErrorSelector = selector<string | null>({
  key: 'questionsErrorSelector',
  get: ({ get }) => get(questionsAtom).error,
});

export const currentQuestionSelector = selector<Question | null>({
  key: 'currentQuestionSelector_questions',
  get: ({ get }) => get(questionsAtom).currentQuestion,
});

export const currentExamIdSelector = selector<string | null>({
  key: 'currentExamIdSelector',
  get: ({ get }) => get(questionsAtom).currentExamId,
});

export const lastOrderNumberSelector = selector<number>({
  key: 'lastOrderNumberSelector',
  get: ({ get }) => get(questionsAtom).lastOrderNumber,
});

export const questionByIdSelector = (id: string) =>
  selector<Question | null>({
    key: `questionByIdSelector_${id}`,
    get: ({ get }) => {
      const list = get(questionsSelector);
      return list.find((q) => q.id === id) || null;
    },
  });

export const questionsBySubjectSelector = (subject: string) =>
  selector<Question[]>({
    key: `questionsBySubjectSelector_${subject}`,
    get: ({ get }) => {
      const list = get(questionsSelector);
      return list.filter((q) => q.subject === subject);
    },
  });

export const questionsByExamPartSelector = (examPart: string) =>
  selector<Question[]>({
    key: `questionsByExamPartSelector_${examPart}`,
    get: ({ get }) => {
      const list = get(questionsSelector);
      return list.filter((q) => q.examPart === examPart);
    },
  });

export const questionsCountSelector = selector<number>({
  key: 'questionsCountSelector',
  get: ({ get }) => get(questionsSelector).length,
});
