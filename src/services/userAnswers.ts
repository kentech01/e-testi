import { AxiosInstance } from 'axios';
import HttpClient from './httpClient';

// Types based on backend UserAnswer entity
export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  questionId: string;
  optionLetter: string;
  isCorrect: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserAnswer {
  id: string;
  userId: string;
  examId: string;
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpentSeconds: number;
  createdAt: string;
  updatedAt: string;
  // Relations (optional, populated when fetched with relations)
  question?: {
    id: string;
    text: string;
    imageUrl?: string;
    subject: string;
    points: number;
  };
  selectedOption?: QuestionOption;
  exam?: {
    id: string;
    title: string;
  };
}

export interface SubmitAnswerRequest {
  examId: string;
  questionId: string;
  selectedOptionId: string;
  points?: number;
  timeSpentSeconds: number;
}

export interface UpdateAnswerRequest {
  selectedOptionId: string;
  points?: number;
  timeSpentSeconds?: number;
}

export interface ExamResults {
  examId: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  totalPoints: number;
  totalTimeSpent: number;
  answers: UserAnswer[];
}

/**
 * User Answer Service Class
 * Uses a shared HttpClient instance
 */
export class UserAnswerService {
  private api: AxiosInstance;

  constructor() {
    this.api = HttpClient.instance;
  }

  /**
   * Submit a new answer for a question
   * POST /user-answers/submit
   */
  async submitAnswer(data: SubmitAnswerRequest): Promise<UserAnswer> {
    const response = await this.api.post<UserAnswer>(
      'user-answers/submit',
      data
    );
    return response.data;
  }

  /**
   * Get user answers
   * GET /user-answers?examId=xxx (optional)
   */
  async getUserAnswers(examId?: string): Promise<UserAnswer[]> {
    const response = await this.api.get<UserAnswer[]>('user-answers', {
      params: examId ? { examId } : {},
    });
    return response.data;
  }

  /**
   * Get exam results with statistics
   * GET /user-answers/results/:examId
   */
  async getExamResults(examId: string): Promise<ExamResults> {
    const response = await this.api.get<ExamResults>(
      `user-answers/results/${examId}`
    );
    return response.data;
  }

  /**
   * Update an existing answer
   * PUT /user-answers/:id
   */
  async updateAnswer(
    id: string,
    data: UpdateAnswerRequest
  ): Promise<UserAnswer> {
    const response = await this.api.put<UserAnswer>(
      `user-answers/${id}`,
      data
    );
    return response.data;
  }
}

// Export singleton instance
export const userAnswerService = new UserAnswerService();
export default userAnswerService;

