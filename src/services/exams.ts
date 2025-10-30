import { API_BASE_URL } from '../config/api';
import axios, { AxiosInstance } from 'axios';

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
  examId: number;
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

export interface Sector {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Exam {
  id: number;
  title: string;
  description?: string;
  sectorId: number;
  sector?: Sector;
  isActive: boolean;
  totalQuestions: number;
  passingScore: number;
  questions?: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExamRequest {
  title: string;
  description?: string;
  sectorId: number;
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
  sectorId: number;
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
 * Automatically uses axios with authentication from Recoil state
 *
 * Usage:
 * import examService from '@/services/exams';
 * const exams = await examService.getExams();
 */
export class ExamService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        // Get token from localStorage (set by auth system)
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.warn('Authentication failed. Please sign in again.');
        }
        return Promise.reject(error);
      }
    );
  }

  // Get all exams
  async getExams(sectorId?: number): Promise<Exam[]> {
    const response = await this.api.get<Exam[]>('exams/', {
      params: sectorId ? { sectorId } : {},
    });
    return response.data;
  }

  // Get exam by ID
  async getExamById(id: number): Promise<Exam> {
    const response = await this.api.get<Exam>(`exams/${id}`);
    return response.data;
  }

  // Get exams by sector
  async getExamsBySector(sectorId: number): Promise<Exam[]> {
    const response = await this.api.get<Exam[]>(`exams/sector/${sectorId}`);
    return response.data;
  }

  // Create basic exam
  async createExam(examData: CreateExamRequest): Promise<Exam> {
    const response = await this.api.post<Exam>('exams/', examData);
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
    id: number,
    examData: Partial<CreateExamRequest>
  ): Promise<Exam> {
    const response = await this.api.put<Exam>(`exams/${id}`, examData);
    return response.data;
  }

  // Delete exam
  async deleteExam(id: number): Promise<void> {
    await this.api.delete(`exams/${id}`);
  }
}

/**
 * Usage Examples:
 *
 * import examService from '@/services/exams';
 *
 * // Get all exams
 * const exams = await examService.getExams();
 *
 * // Get exam by ID
 * const exam = await examService.getExamById(1);
 *
 * // Create exam with questions
 * const result = await examService.createCompleteExam({
 *   title: 'Math Exam',
 *   sectorId: 1,
 *   totalQuestions: 100,
 *   passingScore: 60,
 *   questions: [
 *     {
 *       text: 'What is 2+2?',
 *       subject: 'mathematics',
 *       orderNumber: 1,
 *       points: 1,
 *       options: [
 *         { text: '3', optionLetter: 'A', isCorrect: false },
 *         { text: '4', optionLetter: 'B', isCorrect: true },
 *       ]
 *     }
 *   ]
 * });
 */

// Export singleton instance
export const examService = new ExamService();
export default examService;
