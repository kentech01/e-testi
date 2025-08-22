import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { examService } from '../services/examService';
import { Exam, Question, ExamSession, Subject, TestResult } from '../types/exam';

interface ExamState {
  currentExam: Exam | null;
  currentSession: ExamSession | null;
  questions: Question[];
  answers: (number | null)[];
  flaggedQuestions: Set<number>;
  currentPage: number;
  timeLeft: number;
  isLoading: boolean;
  error: string | null;
  results: TestResult | null;
}

const initialState: ExamState = {
  currentExam: null,
  currentSession: null,
  questions: [],
  answers: [],
  flaggedQuestions: new Set(),
  currentPage: 0,
  timeLeft: 7200, // 2 hours
  isLoading: false,
  error: null,
  results: null,
};

// Async thunks
export const startExam = createAsyncThunk(
  'exam/start',
  async ({ subject, testId }: { subject: Subject; testId?: number }, { rejectWithValue }) => {
    try {
      const exam = await examService.startExam(subject, testId);
      return exam;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitExam = createAsyncThunk(
  'exam/submit',
  async (
    { examId, answers }: { examId: string; answers: (number | null)[] },
    { rejectWithValue }
  ) => {
    try {
      const result = await examService.submitExam(examId, answers);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveProgress = createAsyncThunk(
  'exam/saveProgress',
  async (
    { sessionId, answers, currentPage }: { sessionId: string; answers: (number | null)[]; currentPage: number },
    { rejectWithValue }
  ) => {
    try {
      await examService.saveProgress(sessionId, answers, currentPage);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setAnswer: (state, action: PayloadAction<{ questionIndex: number; answer: number }>) => {
      const { questionIndex, answer } = action.payload;
      state.answers[questionIndex] = answer;
    },
    toggleFlag: (state, action: PayloadAction<number>) => {
      const questionIndex = action.payload;
      if (state.flaggedQuestions.has(questionIndex)) {
        state.flaggedQuestions.delete(questionIndex);
      } else {
        state.flaggedQuestions.add(questionIndex);
      }
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    decrementTime: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
    },
    resetExam: (state) => {
      state.currentExam = null;
      state.currentSession = null;
      state.questions = [];
      state.answers = [];
      state.flaggedQuestions = new Set();
      state.currentPage = 0;
      state.timeLeft = 7200;
      state.results = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start exam cases
      .addCase(startExam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startExam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentExam = action.payload.exam;
        state.currentSession = action.payload.session;
        state.questions = action.payload.questions;
        state.answers = new Array(action.payload.questions.length).fill(null);
        state.flaggedQuestions = new Set();
        state.currentPage = 0;
        state.timeLeft = action.payload.exam.duration || 7200;
      })
      .addCase(startExam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Submit exam cases
      .addCase(submitExam.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitExam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload;
      })
      .addCase(submitExam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setAnswer,
  toggleFlag,
  setCurrentPage,
  decrementTime,
  resetExam,
  clearError,
} = examSlice.actions;

export default examSlice.reducer;