import { AxiosInstance } from 'axios';
import HttpClient from './httpClient';
import { Sector } from './sectors';

// Types based on backend entities
export interface QuestionOption {
  id: number;
  text: string;
  imageUrl?: string;
  questionId: number;
  optionLetter: string;
  isCorrect: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  id: number;
  text: string;
  imageUrl?: string;
  examId: string | number;
  subject: string;
  examPart?: string;
  parentId?: number;
  displayText?: string;
  orderNumber: number;
  points: number;
  isActive: boolean;
  options?: QuestionOption[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Exam {
  id: string | number;
  title: string;
  description?: string;
  sectorId: string;
  sector?: Sector;
  isActive: boolean;
  totalQuestions: number;
  passingScore: number;
  // Backend flags for completion and pass status
  isCompleted?: boolean;
  hasPassed?: boolean;
  questions?: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExamRequest {
  title: string;
  description?: string;
  sectorId: string;
  isActive?: boolean;
  totalQuestions: number;
  passingScore: number;
}

export interface QuestionOptionRequest {
  text: string;
  imageUrl?: string;
  optionLetter: string;
  isCorrect: boolean;
}

export interface QuestionRequest {
  text: string;
  imageUrl?: string;
  subject: string;
  examPart?: string;
  parentId?: number;
  displayText?: string;
  orderNumber: number;
  points?: number;
  isActive?: boolean;
  options?: QuestionOptionRequest[];
}

export interface CreateCompleteExamRequest {
  title: string;
  description?: string;
  sectorId: string;
  isActive?: boolean;
  totalQuestions?: number;
  passingScore?: number;
  questions: QuestionRequest[];
}

export interface CreateCompleteExamResponse {
  exam: Exam;
  questionsCreated: number;
  message: string;
}

/**
 * Exam Service Class
 * Uses a shared HttpClient instance
 */
export class ExamService {
  private api: AxiosInstance;

  constructor() {
    this.api = HttpClient.instance;
  }

  // Get all exams
  async getExams(sectorId?: number): Promise<Exam[]> {
    const response = await this.api.get<Exam[]>('exams', {
      params: sectorId ? { sectorId } : {},
    });
    return response.data;
  }

  // Get exam by ID
  async getExamById(id: string | number): Promise<Exam> {
    const response = await this.api.get<Exam>(`exams/${String(id)}`);
    return response.data;
  }

  // Get exams by sector
  async getExamsBySector(sectorId: number): Promise<Exam[]> {
    const response = await this.api.get<Exam[]>(`exams/sector/${sectorId}`);
    return response.data;
  }

  // Create basic exam
  async createExam(examData: CreateExamRequest): Promise<Exam> {
    const response = await this.api.post<Exam>('exams', examData);
    return response.data;
  }

  // Create complete exam with questions and options
  async createCompleteExam(
    examData: CreateCompleteExamRequest
  ): Promise<CreateCompleteExamResponse> {
    const response = await this.api.post<CreateCompleteExamResponse>(
      'exams/complete',
      examData
    );
    return response.data;
  }

  // Update exam
  async updateExam(
    id: string | number,
    examData: Partial<CreateExamRequest>
  ): Promise<Exam> {
    const response = await this.api.put<Exam>(`exams/${id}`, examData);
    return response.data;
  }

  // Delete exam
  async deleteExam(id: string | number): Promise<void> {
    await this.api.delete(`exams/${id}`);
  }

  // Mark exam as completed
  async completeExam(id: string | number): Promise<Exam> {
    const response = await this.api.post<Exam>(`exams/${String(id)}/complete`);
    return response.data;
  }

  // Reset exam so the user can retake it
  async resetExam(id: string | number): Promise<Exam> {
    const response = await this.api.post<{ message: string; exam: Exam }>(
      `exams/${String(id)}/reset`
    );
    // Backend wraps the updated exam in { message, exam }
    return response.data.exam;
  }
}

// Export singleton instance
export const examService = new ExamService();
export default examService;
