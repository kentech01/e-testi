import { apiService } from './api';
import { Exam, Question, ExamSession, Subject, TestResult } from '../types/exam';
import { generateMockQuestions } from '../utils/mockData';

class ExamService {
  async getExams(subject?: Subject): Promise<Exam[]> {
    try {
      // Mock data for now
      const mockExams: Exam[] = [
        {
          id: '1',
          title: 'Test 1',
          subject: 'matematik',
          questionCount: 100,
          duration: 7200,
          difficulty: 'medium',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // Add more mock exams...
      ];

      return subject 
        ? mockExams.filter(exam => exam.subject === subject)
        : mockExams;
    } catch (error) {
      // When API is ready: return apiService.get<Exam[]>(`/exams${subject ? `?subject=${subject}` : ''}`);
      throw error;
    }
  }

  async startExam(subject: Subject, testId?: number): Promise<{
    exam: Exam;
    session: ExamSession;
    questions: Question[];
  }> {
    try {
      // Mock exam start
      const exam: Exam = {
        id: testId?.toString() || 'new-exam',
        title: `Test ${testId || 'Interaktiv'}`,
        subject,
        questionCount: 100,
        duration: 7200,
        difficulty: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const session: ExamSession = {
        id: Math.random().toString(36).substr(2, 9),
        examId: exam.id,
        userId: 'current-user-id',
        startedAt: new Date().toISOString(),
        timeRemaining: exam.duration,
        currentPage: 0,
        answers: new Array(100).fill(null),
        flaggedQuestions: [],
        status: 'in_progress',
      };

      const questions = generateMockQuestions(subject);

      return { exam, session, questions };
    } catch (error) {
      // When API is ready: return apiService.post<ExamStartResponse>('/exams/start', { subject, testId });
      throw error;
    }
  }

  async submitExam(examId: string, answers: (number | null)[]): Promise<TestResult> {
    try {
      // Mock submission
      const correctAnswers = answers.filter((answer, index) => {
        // Mock correct answer calculation
        return answer === (index % 4);
      }).length;

      const result: TestResult = {
        id: Math.random().toString(36).substr(2, 9),
        examId,
        sessionId: 'session-id',
        userId: 'user-id',
        score: Math.round((correctAnswers / answers.length) * 100),
        correctAnswers,
        totalQuestions: answers.length,
        timeSpent: 7200,
        completedAt: new Date().toISOString(),
        answers,
        questionResults: answers.map((answer, index) => ({
          questionId: index + 1,
          selectedAnswer: answer,
          correctAnswer: index % 4,
          isCorrect: answer === (index % 4),
        })),
        subject: 'matematik',
      };

      return result;
    } catch (error) {
      // When API is ready: return apiService.post<TestResult>('/exams/submit', { examId, answers });
      throw error;
    }
  }

  async saveProgress(
    sessionId: string,
    answers: (number | null)[],
    currentPage: number
  ): Promise<void> {
    try {
      // Mock save progress
      console.log('Saving progress:', { sessionId, answers, currentPage });
    } catch (error) {
      // When API is ready: return apiService.put(`/exam-sessions/${sessionId}/progress`, { answers, currentPage });
      throw error;
    }
  }

  async getExamResults(examId: string): Promise<TestResult> {
    try {
      // Mock get results
      throw new Error('Not implemented yet');
    } catch (error) {
      // When API is ready: return apiService.get<TestResult>(`/exams/${examId}/results`);
      throw error;
    }
  }
}

export const examService = new ExamService();