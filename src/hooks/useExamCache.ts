import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import examService from '../services/exams';
import questionsService from '../services/questions';
import { examCacheAtom } from '../store/atoms/createExamAtom';

export function useExamCache() {
  const [cache, setCache] = useRecoilState(examCacheAtom);

  const ensureExamLoaded = useCallback(
    async (examId: string) => {
      if (cache.exams.has(examId)) {
        return cache.exams.get(examId)!;
      }
      const fetched = await examService.getExamById(examId);
      setCache((prev) => ({
        ...prev,
        exams: new Map([...prev.exams, [examId, fetched]]),
      }));
      return fetched;
    },
    [cache.exams, setCache]
  );

  const ensureQuestionsLoaded = useCallback(
    async (examId: string) => {
      if (cache.questions.has(examId)) {
        return cache.questions.get(examId)!;
      }
      const fetched = await questionsService.getQuestionsByExam(examId);
      setCache((prev) => ({
        ...prev,
        questions: new Map([...prev.questions, [examId, fetched]]),
      }));
      return fetched;
    },
    [cache.questions, setCache]
  );

  return { ensureExamLoaded, ensureQuestionsLoaded } as const;
}

export default useExamCache;
