/**
 * Create Exam Atoms
 *
 * Atoms for managing exam creation flow state
 */

import { atom } from 'recoil';
import { Exam } from '../../services/exams';
import { Question as ServiceQuestion } from '../../services/questions';

export interface CreateExamFormData {
  examId: string | null;
  examTitle: string;
  examDescription: string;
  sectorId: string;
  passingScore: number;
}

export interface LocalQuestion {
  id: number; // 1-100 local ID
  title: string;
  description: string;
  answerOptions: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  imageFile?: File | null;
  imageUrl?: string;
}

export interface CreateExamState {
  formData: CreateExamFormData;
  localQuestions: LocalQuestion[];
  createdQuestionIds: Set<number>; // Local IDs that are created in DB
  questionIdMap: Map<number, string>; // Map local ID to DB ID
  currentQuestionIndex: number;
  loading: boolean;
  error: string | null;
}

export const createExamAtom = atom<CreateExamState>({
  key: 'createExamState',
  default: {
    formData: {
      examId: null,
      examTitle: '',
      examDescription: '',
      sectorId: '',
      passingScore: 40,
    },
    localQuestions: Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      title: '',
      description: '',
      answerOptions: [
        { id: `${index + 1}-1`, text: '', isCorrect: false },
        { id: `${index + 1}-2`, text: '', isCorrect: false },
        { id: `${index + 1}-3`, text: '', isCorrect: false },
        { id: `${index + 1}-4`, text: '', isCorrect: false },
      ],
      imageFile: null,
      imageUrl: undefined,
    })),
    createdQuestionIds: new Set<number>(),
    questionIdMap: new Map<number, string>(),
    currentQuestionIndex: 0,
    loading: false,
    error: null,
  },
});

export interface ExamCacheState {
  exams: Map<string, Exam>; // Map of examId to Exam
  questions: Map<string, ServiceQuestion[]>; // Map of examId to Questions
  sectors: Map<string, any>; // Cache for sectors if needed
}

export const examCacheAtom = atom<ExamCacheState>({
  key: 'examCacheState',
  default: {
    exams: new Map(),
    questions: new Map(),
    sectors: new Map(),
  },
});
