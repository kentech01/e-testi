// Re-export all exam-related types and classes from the service
export type {
  Exam,
  Question,
  QuestionOption,
  CreateExamRequest,
  QuestionOptionRequest,
  QuestionRequest,
  CreateCompleteExamRequest,
  CreateCompleteExamResponse,
} from '../services/exams';

// Re-export Sector for backward compatibility
export type { Sector } from '../services/sectors';

export { ExamService } from '../services/exams';
