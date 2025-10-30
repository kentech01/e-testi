import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../config/api';
import type {
  Question as ExamQuestion,
  QuestionOption as ExamQuestionOption,
} from './exams';

export interface QuestionOption
  extends Omit<
    ExamQuestionOption,
    'id' | 'questionId' | 'createdAt' | 'updatedAt'
  > {
  id: string;
  questionId: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question
  extends Omit<
    ExamQuestion,
    | 'id'
    | 'examId'
    | 'orderNumber'
    | 'points'
    | 'options'
    | 'createdAt'
    | 'updatedAt'
  > {
  id: string;
  examId: string;
  orderNumber: number;
  points: number;
  options?: QuestionOption[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuestionRequest {
  text: string;
  imageUrl?: string;
  examId: string;
  subject: string;
  examPart?: string;
  parentId?: string;
  displayText?: string;
  orderNumber: number;
  points?: number;
  isActive?: boolean;
  options?: Array<{
    text: string;
    imageUrl?: string;
    optionLetter: string; // 'A' | 'B' | 'C' | 'D' ...
    isCorrect: boolean;
  }>;
}

export interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {}

class QuestionsService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async getQuestionsByExam(examId: string): Promise<Question[]> {
    const res = await this.api.get<Question[]>(`questions/exam/${examId}`);
    return res.data;
  }

  async getQuestionsBySubject(
    examId: string,
    subject: string
  ): Promise<Question[]> {
    const res = await this.api.get<Question[]>(
      `questions/exam/${examId}/subject/${subject}`
    );
    return res.data;
  }

  async getQuestionsByExamPart(
    examId: string,
    examPart: string
  ): Promise<Question[]> {
    const res = await this.api.get<Question[]>(
      `questions/exam/${examId}/part/${examPart}`
    );
    return res.data;
  }

  async getQuestionById(id: string): Promise<Question> {
    const res = await this.api.get<Question>(`questions/${id}`);
    return res.data;
  }

  async createQuestion(payload: CreateQuestionRequest): Promise<Question> {
    const res = await this.api.post<Question>('questions', payload);
    return res.data;
  }

  async updateQuestion(
    id: string,
    payload: UpdateQuestionRequest
  ): Promise<Question> {
    const res = await this.api.put<Question>(`questions/${id}`, payload);
    return res.data;
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.api.delete(`questions/${id}`);
  }
}

export const questionsService = new QuestionsService();
export default questionsService;
