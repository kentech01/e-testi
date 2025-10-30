// Re-export all exam-related types and classes from the service
export type {
  Exam,
  Question,
  QuestionOption,
  Sector,
  CreateExamRequest,
  QuestionOptionRequest,
  QuestionRequest,
  CreateCompleteExamRequest,
  CreateCompleteExamResponse,
} from '../services/exams';

export { ExamService } from '../services/exams';
