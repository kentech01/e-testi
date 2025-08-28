import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ExamHeader,
  QuestionCard,
  ExamSidebar,
  SubmitDialog,
} from '../components/exam';
import { subjectInfo } from '../data/subjectInfo';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  imageUrl?: string;
  imageCaption?: string;
  readingPassage?: string;
  passageId?: string;
  passageTitle?: string;
  questionNumber?: number;
  totalPassageQuestions?: number;
  hasInteractiveGraph?: boolean;
  graphConfig?: {
    functionType: 'quadratic' | 'linear' | 'exponential' | 'trigonometric';
    coefficients?: { a?: number; b?: number; c?: number; d?: number };
    domain?: { x: [number, number]; y: [number, number] };
  };
}

export interface ExamInterfaceProps {
  subject: 'matematik' | 'gjuhaShqipe' | 'anglisht';
  onComplete: (answers: (number | null)[]) => void;
  onExit: () => void;
}

const createBaseQuestions = (subject: string): Question[] => {
  const questions: { [key: string]: Question[] } = {
    matematik: [
      {
        id: 101,
        question:
          'Për transportimin e një sasie të thëngjellit nevojiten 24 kamionë me fuqi transportuese 14 tonëshe. Sa kamionë me fuqi bartëse 12 tonëshe do të ishin të nevojshëm për transportimin e sasisë së njëjtë të thëngjellit?',
        options: ['22', '24', '28', '30'],
        correctAnswer: 2,
        subject: 'matematik',
      },
      {
        id: 102,
        question: 'Sa është vlera e shprehjes (-a²)⁴ · (-a⁻)² : a ?',
        options: ['-a²', 'a¹¹', 'a⁶', '-a¹¹'],
        correctAnswer: 1,
        subject: 'matematik',
      },
      {
        id: 103,
        question: 'Cili funksion i përgjigjet grafikut të dhënë?',
        options: ['y = x² + 4x', 'y = x² - 4x', 'y = -x² - 4x', 'y = -x² + 4x'],
        correctAnswer: 3,
        subject: 'matematik',
        hasInteractiveGraph: true,
        graphConfig: {
          functionType: 'quadratic',
          coefficients: { a: -1, b: 4, c: 0 },
          domain: { x: [-2, 6], y: [-2, 6] },
        },
      },
    ],
    gjuhaShqipe: [
      {
        id: 30,
        question:
          'Nga personazhet dhe elementet e tjera mund të kuptohet se ky fragment është nxjerrë nga legjenda shqiptare e njohur si legjenda e:',
        options: [
          'Rozafatit',
          'Gjergj Elez Alisë',
          'Muji dhe Halilit',
          'Konstandinit dhe Dorës',
        ],
        correctAnswer: 0,
        subject: 'gjuhaShqipe',
        readingPassage:
          'Në një kohë të largët, në një kënd të bukur të Shqipërisë, jetonte një vajzë e bukur dhe e mirë...',
        passageTitle: 'Legjenda e Rozafatit',
      },
    ],
    anglisht: [
      {
        id: 50,
        question: 'What is the main idea of the passage?',
        options: [
          'The importance of education',
          'Environmental protection',
          'Technological advancement',
          'Cultural diversity',
        ],
        correctAnswer: 1,
        subject: 'anglisht',
        readingPassage:
          'Environmental protection has become one of the most critical issues facing our planet today...',
        passageTitle: 'Environmental Challenges',
      },
    ],
  };

  return questions[subject] || [];
};

const generateAdditionalQuestions = (
  subject: string,
  startId: number,
  count: number
): Question[] => {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    questions.push({
      id: startId + i,
      question: `Pyetja shtesë ${i + 1} për ${subject}`,
      options: ['Opsioni A', 'Opsioni B', 'Opsioni C', 'Opsioni D'],
      correctAnswer: Math.floor(Math.random() * 4),
      subject: subject,
    });
  }

  return questions;
};

export function ExamInterface({
  subject,
  onComplete,
  onExit,
}: ExamInterfaceProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(100).fill(null)
  );
  const [timeLeft, setTimeLeft] = useState(7200);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const questions = useMemo(() => {
    const baseQuestions = createBaseQuestions(subject);
    const additionalQuestionsCount = 100 - baseQuestions.length;
    const startId = Math.max(...baseQuestions.map((q) => q.id)) + 1;
    const additionalQuestions = generateAdditionalQuestions(
      subject,
      startId,
      additionalQuestionsCount
    );
    return [...baseQuestions, ...additionalQuestions];
  }, [subject]);

  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = useMemo(
    () =>
      questions.slice(
        currentPage * questionsPerPage,
        (currentPage + 1) * questionsPerPage
      ),
    [questions, currentPage, questionsPerPage]
  );

  const SubjectIcon = subjectInfo[subject].icon;
  const answeredCount = useMemo(
    () => answers.filter((answer) => answer !== null).length,
    [answers]
  );
  const progress = (answeredCount / 100) * 100;
  const currentPassage = useMemo(
    () => currentQuestions.find((q) => q.readingPassage)?.readingPassage,
    [currentQuestions]
  );
  const currentPassageTitle = useMemo(
    () => currentQuestions.find((q) => q.passageTitle)?.passageTitle,
    [currentQuestions]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answers, onComplete]);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleAnswerChange = useCallback(
    (questionIndex: number, value: string) => {
      const globalIndex = currentPage * questionsPerPage + questionIndex;
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[globalIndex] = parseInt(value);
        return newAnswers;
      });
    },
    [currentPage, questionsPerPage]
  );

  const toggleFlag = useCallback(
    (questionIndex: number) => {
      const globalIndex = currentPage * questionsPerPage + questionIndex;
      setFlaggedQuestions((prev) => {
        const newFlagged = new Set(prev);
        if (newFlagged.has(globalIndex)) {
          newFlagged.delete(globalIndex);
        } else {
          newFlagged.add(globalIndex);
        }
        return newFlagged;
      });
    },
    [currentPage, questionsPerPage]
  );

  const handleQuestionClick = useCallback(
    (questionIndex: number) => {
      setCurrentPage(Math.floor(questionIndex / questionsPerPage));
    },
    [questionsPerPage]
  );

  return (
    <div className="min-h-screen bg-background">
      <ExamHeader
        subject={subjectInfo[subject].name}
        subjectIcon={SubjectIcon}
        timeLeft={timeLeft}
        progress={progress}
        answeredCount={answeredCount}
        onExit={onExit}
        formatTime={formatTime}
      />

      <div className="flex gap-6 p-6">
        <div className="flex-1 space-y-6">
          {currentQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              questionIndex={index}
              answer={answers[currentPage * questionsPerPage + index]}
              isFlagged={flaggedQuestions.has(
                currentPage * questionsPerPage + index
              )}
              onAnswerChange={(value) => handleAnswerChange(index, value)}
              onToggleFlag={() => toggleFlag(index)}
              showPassage={!!currentPassage}
              passageContent={currentPassage}
              passageTitle={currentPassageTitle}
            />
          ))}

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
            >
              Para
            </button>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
            >
              Pas
            </button>
          </div>
        </div>

        <ExamSidebar
          currentPage={currentPage}
          totalPages={totalPages}
          questions={questions}
          answers={answers}
          flaggedQuestions={flaggedQuestions}
          onPageChange={setCurrentPage}
          onQuestionClick={handleQuestionClick}
          answeredCount={answeredCount}
        />
      </div>

      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setShowSubmitDialog(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Perfundo testin
        </button>
      </div>

      <SubmitDialog
        isOpen={showSubmitDialog}
        subject={subjectInfo[subject].name}
        answeredCount={answeredCount}
        timeLeft={timeLeft}
        flaggedCount={flaggedQuestions.size}
        onConfirm={() => onComplete(answers)}
        onCancel={() => setShowSubmitDialog(false)}
        formatTime={formatTime}
      />
    </div>
  );
}
