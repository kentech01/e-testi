import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import parse from "html-react-parser";
import { useRecoilState, useRecoilValue } from 'recoil';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import { Clock, ArrowLeft, ArrowRight, Flag } from 'lucide-react';
import { examService, Exam } from '../services/exams';
import { questionsService, Question } from '../services/questions';
import { userAnswerService, UserAnswer } from '../services/userAnswers';
import { toast } from 'sonner';
import { examAtom } from '../store/atoms/examAtom';
import { questionsAtom } from '../store/atoms/questionAtom';
import { userAnswersAtom } from '../store/atoms/userAnswerAtom';
import { examByIdSelector } from '../store/selectors/examSelectors';
import { questionsByExamSelector } from '../store/selectors/questionSelectors';
import { userAnswersByExamSelector } from '../store/selectors/userAnswerSelectors';

export interface TestTakingProps {
  examId: string | number;
  questionId?: string;
  onComplete?: (answers: number[]) => void;
  onExit: () => void;
}

export function TestTaking({
  examId,
  questionId: initialQuestionId,
  onComplete,
  onExit,
}: TestTakingProps) {
  const navigate = useNavigate();

  // Recoil state
  const [, setExamState] = useRecoilState(examAtom);
  const [, setQuestionsState] = useRecoilState(questionsAtom);
  const [, setUserAnswersState] = useRecoilState(userAnswersAtom);

  // Get cached data from selectors (memoized to prevent duplicate key errors)
  const examSelector = useMemo(() => examByIdSelector(examId), [examId]);
  const questionsSelector = useMemo(
    () => questionsByExamSelector(examId),
    [examId]
  );
  const answersSelector = useMemo(
    () => userAnswersByExamSelector(examId),
    [examId]
  );

  const cachedExam = useRecoilValue(examSelector);
  const cachedQuestions = useRecoilValue(questionsSelector);
  const cachedUserAnswers = useRecoilValue(answersSelector);

  // Local state
  const [exam, setExam] = useState<Exam | null>(cachedExam || null);
  const [questions, setQuestions] = useState<Question[]>(cachedQuestions || []);
  const [loading, setLoading] = useState(
    !cachedExam || !cachedQuestions.length
  );
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null
  );
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(
    cachedUserAnswers || []
  ); // Store submitted answers
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set()
  ); // Multiple selected options for current question
  const [timeLeft, setTimeLeft] = useState(9000); // 2 hours 30 minutes in seconds - will be initialized from localStorage
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false); // Track answer submission
  const [autoSubmitActive, setAutoSubmitActive] = useState(false); // Auto-submit countdown after time ends
  const [autoSubmitCountdown, setAutoSubmitCountdown] = useState(10); // 10 second countdown
  const questionTimeSpent = useRef<Map<string, number>>(new Map()); // Track time spent per question
  const questionStartTime = useRef<number>(Date.now());
  const timerInitialized = useRef<boolean>(false);
  const autoSubmitStarted = useRef<boolean>(false);

  // Get current question object
  const currentQuestion = questions.find((q) => q.id === currentQuestionId);

  // Fetch exam, questions, and existing answers
  useEffect(() => {
    fetchExamData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  // Navigate to question when questionId changes or questions load
  useEffect(() => {
    if (questions.length === 0 || loading) return;

    if (initialQuestionId) {
      // Navigate to specified question if it exists
      const question = questions.find((q) => q.id === initialQuestionId);
      if (question) {
        setCurrentQuestionId(question.id);
        loadQuestionAnswers(question.id);
      } else {
        // Question not found, go to first unanswered
        navigateToFirstUnanswered();
      }
    } else {
      // No questionId specified, go to first unanswered
      navigateToFirstUnanswered();
    }
  }, [questions, initialQuestionId, loading]);

  // Track time spent on current question
  useEffect(() => {
    if (!currentQuestionId) return;

    questionStartTime.current = Date.now();
    return () => {
      const timeSpent = Math.floor(
        (Date.now() - questionStartTime.current) / 1000
      );
      const current = questionTimeSpent.current.get(currentQuestionId) || 0;
      questionTimeSpent.current.set(currentQuestionId, current + timeSpent);
    };
  }, [currentQuestionId]);

  // Initialize timer from localStorage or create new
  useEffect(() => {
    if (!exam || loading || timerInitialized.current) return;

    // Check if timer exists in localStorage for this exam
    const savedTime = localStorage.getItem(`exam_timer_${examId}`);
    if (savedTime) {
      // Restore timer from localStorage
      const parsed = JSON.parse(savedTime);
      const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
      const remaining = Math.max(0, parsed.initialTime - elapsed);
      setTimeLeft(remaining);
    } else {
      // First time starting this exam, save initial state
      localStorage.setItem(
        `exam_timer_${examId}`,
        JSON.stringify({
          startTime: Date.now(),
          initialTime: 9000, // 2 hours 30 minutes
        })
      );
      setTimeLeft(9000);
    }
    timerInitialized.current = true;
  }, [exam, loading, examId]);

  // Timer for exam - runs continuously, doesn't reset
  useEffect(() => {
    if (!exam || loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev <= 1 ? 0 : prev - 1;

        // Update localStorage
        const savedTime = localStorage.getItem(`exam_timer_${examId}`);
        if (savedTime) {
          const parsed = JSON.parse(savedTime);
          const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
          const remaining = Math.max(0, parsed.initialTime - elapsed);

          // Sync with calculated remaining time
          if (Math.abs(remaining - newTime) > 1) {
            return remaining;
          }
        }

        if (newTime === 0 && !autoSubmitStarted.current) {
          // Time is up: start auto-submit countdown (10 seconds)
          autoSubmitStarted.current = true;
          setAutoSubmitCountdown(10);
          setAutoSubmitActive(true);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, loading, examId]);
   

  // Auto-submit countdown effect: when time is up, give user 10 seconds before final submit
  useEffect(() => {
    if (!autoSubmitActive) return;

    const interval = setInterval(() => {
      setAutoSubmitCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setAutoSubmitActive(false);
          // Trigger final submit once countdown finishes
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoSubmitActive]);

  const fetchExamData = async () => {
    try {
      // Validate examId
      if (
        !examId ||
        examId === 'NaN' ||
        (typeof examId === 'number' && isNaN(examId))
      ) {
        throw new Error('Invalid exam ID');
      }

      const examIdStr = String(examId);
      let examData = cachedExam;
      let questionsData = cachedQuestions;
      let answersData = cachedUserAnswers;

      // Fetch exam if not cached
      if (!examData) {
        setLoading(true);
        examData = await examService.getExamById(examIdStr);
        setExam(examData);
        // Update cache
        if (examData) {
          setExamState((prev) => {
            const newCache = new Map(prev.examsCache);
            newCache.set(examId, examData as Exam);
            return { ...prev, examsCache: newCache };
          });
        }
      } else {
        setExam(examData);
      }

      // Fetch questions if not cached
      if (!questionsData || questionsData.length === 0) {
        if (!examData) setLoading(true);
        questionsData = await questionsService.getQuestionsByExam(examIdStr);
        // Sort questions by orderNumber
        const sortedQuestions = questionsData.sort(
          (a, b) => a.orderNumber - b.orderNumber
        );
        setQuestions(sortedQuestions);
        // Update cache
        setQuestionsState((prev) => {
          const newCache = new Map(prev.questionsByExam);
          newCache.set(examId, sortedQuestions);
          return { ...prev, questionsByExam: newCache };
        });
      } else {
        setQuestions(questionsData);
      }

      // Fetch existing user answers if not cached
      if (!answersData || answersData.length === 0) {
        try {
          answersData = await userAnswerService.getUserAnswers(examIdStr);
          setUserAnswers(answersData);
          // Update cache
          setUserAnswersState((prev) => {
            const newCache = new Map(prev.answersByExam);
            newCache.set(examId, answersData);
            const allAnswers = [...prev.answers];
            // Merge new answers, avoiding duplicates
            answersData.forEach((answer) => {
              if (!allAnswers.find((a) => a.id === answer.id)) {
                allAnswers.push(answer);
              }
            });
            return {
              ...prev,
              answersByExam: newCache,
              answers: allAnswers,
            };
          });
        } catch (error) {
          // No answers yet, that's okay
          console.log('No existing answers found');
        }
      } else {
        setUserAnswers(answersData);
      }
    } catch (error: any) {
      console.error('Failed to fetch exam data:', error);
      toast.error('Dështoi ngarkimi i testeve. Ju lutem provoni përsëri');
      onExit();
    } finally {
      setLoading(false);
    }
  };

  const navigateToFirstUnanswered = () => {
    // Find first question without an answer
    const answeredQuestionIds = new Set(
      userAnswers.map((answer) => answer.questionId)
    );
    const firstUnanswered = questions.find(
      (q) => !answeredQuestionIds.has(q.id)
    );

    if (firstUnanswered) {
      navigateToQuestion(firstUnanswered.id);
    } else if (questions.length > 0) {
      // All questions answered, go to first question
      navigateToQuestion(questions[0].id);
    }
  };

  const navigateToQuestion = (questionId: string) => {
    setCurrentQuestionId(questionId);
    navigate(`/tests/${examId}/${questionId}`);
    loadQuestionAnswers(questionId);

    // Check if this is the last question and show popup
    const questionIndex = questions.findIndex((q) => q.id === questionId);
    if (questionIndex === questions.length - 1) {
      setShowSubmitConfirm(true);
    }
  };

  const loadQuestionAnswers = (questionId: string) => {
    // Load existing answers for this question
    const existingAnswers = userAnswers.filter(
      (answer) => answer.questionId === questionId
    );
    const selectedOptionIds = new Set(
      existingAnswers.map((answer) => answer.selectedOptionId)
    );
    
    setSelectedOptions(selectedOptionIds);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionToggle = (optionId: string) => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
    setSelectedOptions(newSelected);
  };

  const submitCurrentAnswer = async (): Promise<boolean> => {
    if (!currentQuestionId || !currentQuestion) return false;

    // If no selection, return true (allow navigation without submission)
    if (selectedOptions.size === 0) {
      return true;
    }

    if (submittingAnswer) return false; // Already submitting

    // Check if the current selection matches existing answers
    const existingAnswersForQuestion = userAnswers.filter(
      (a) => a.questionId === currentQuestionId
    );
    const existingOptionIds = new Set(
      existingAnswersForQuestion.map((a) => a.selectedOptionId)
    );

    // Compare selected options with existing answers
    const hasSameOptions =
      selectedOptions.size === existingOptionIds.size &&
      Array.from(selectedOptions).every((optionId) =>
        existingOptionIds.has(optionId)
      ) &&
      Array.from(existingOptionIds).every((optionId) =>
        selectedOptions.has(optionId)
      );

    // If answers are the same, skip submission and just return success
    if (hasSameOptions && existingAnswersForQuestion.length > 0) {
      return true; // Skip API call, answers are already saved
    }

    setSubmittingAnswer(true);

    try {
      const timeSpent =
        questionTimeSpent.current.get(currentQuestionId) ||
        Math.floor((Date.now() - questionStartTime.current) / 1000);

      // Submit each selected option as a separate answer
      const submitPromises = Array.from(selectedOptions).map(
        async (optionId) => {
          try {
            
            const answer = await userAnswerService.submitAnswer({
              examId: String(examId),
              questionId: currentQuestionId,
              selectedOptionId: optionId,
              points: currentQuestion.points || 1,
              timeSpentSeconds: timeSpent,
            });
            
            return answer;
          } catch (error: any) {
            console.error(`Error submitting option ${optionId}:`, error);
            // If answer already exists, try to update it
            if (error?.response?.status === 400) {
              
              // Answer already exists, find it and update
              const existingAnswer = userAnswers.find(
                (a) =>
                  a.questionId === currentQuestionId &&
                  a.selectedOptionId === optionId
              );
              if (existingAnswer) {
                return await userAnswerService.updateAnswer(existingAnswer.id, {
                  selectedOptionId: optionId,
                  points: currentQuestion.points || 1,
                  timeSpentSeconds: timeSpent,
                });
              } else {
                console.warn(
                  `No existing answer found for option ${optionId}, but backend returned 400`
                );
                // Backend might have a different answer for this question
                // Check if there's any answer for this question
                const anyAnswerForQuestion = userAnswers.find(
                  (a) => a.questionId === currentQuestionId
                );
                if (anyAnswerForQuestion) {
                  console.warn(
                    `Found different answer for this question:`,
                    anyAnswerForQuestion
                  );
                  // Backend might only allow one answer per question
                  // In this case, we should update the existing one or create a new one
                  // For now, let's try to update it with the new option
                  return await userAnswerService.updateAnswer(
                    anyAnswerForQuestion.id,
                    {
                      selectedOptionId: optionId,
                      points: currentQuestion.points || 1,
                      timeSpentSeconds: timeSpent,
                    }
                  );
                }
              }
            }
            throw error;
          }
        }
      );

      const submittedAnswers = await Promise.all(submitPromises);
      

      // Update local userAnswers state
      setUserAnswers((prev) => {
        const newAnswers = [...prev];
        submittedAnswers.forEach((answer) => {
          const index = newAnswers.findIndex((a) => a.id === answer.id);
          if (index >= 0) {
            newAnswers[index] = answer;
          } else {
            newAnswers.push(answer);
          }
        });
        return newAnswers;
      });

      // Update Recoil cache
      setUserAnswersState((prev) => {
        const newAnswers = [...prev.answers];
        const examAnswers = [...(prev.answersByExam.get(examId) || [])];

        submittedAnswers.forEach((answer) => {
          // Update in all answers
          const allIndex = newAnswers.findIndex((a) => a.id === answer.id);
          if (allIndex >= 0) {
            newAnswers[allIndex] = answer;
          } else {
            newAnswers.push(answer);
          }

          // Update in exam-specific answers
          const examIndex = examAnswers.findIndex((a) => a.id === answer.id);
          if (examIndex >= 0) {
            examAnswers[examIndex] = answer;
          } else {
            examAnswers.push(answer);
          }
        });

        const newCache = new Map(prev.answersByExam);
        newCache.set(examId, examAnswers);

        return {
          ...prev,
          answers: newAnswers,
          answersByExam: newCache,
        };
      });

      toast.success('Përgjigja u ruajt!');
      return true; // Success
    } catch (error: any) {
      console.error('Failed to submit answer:', error);

      // Better error messages based on error type
      if (error?.response?.status === 404) {
        if (error?.response?.data?.error?.includes('User not found')) {
          toast.error(
            'Përdoruesi nuk u gjet. Ju lutem dilni dhe hyni përsëri.'
          );
        } else if (
          error?.response?.data?.error?.includes('Selected option not found')
        ) {
          toast.error(
            'Opsioni i zgjedhur nuk u gjet. Ju lutem provoni përsëri.'
          );
        } else {
          toast.error('Burimi nuk u gjet. Ju lutem provoni përsëri.');
        }
      } else if (error?.response?.status === 401) {
        toast.error(
          'Nuk jeni të autentifikuar. Ju lutem dilni dhe hyni përsëri.'
        );
      } else if (error?.response?.status === 500) {
        toast.error('Gabim në server. Ju lutem provoni përsëri më vonë.');
      } else {
        toast.error('Dështoi ruajtja e përgjigjes. Ju lutem provoni përsëri.');
      }

      return false; // Failure
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleNext = async () => {
    if (!currentQuestionId || submittingAnswer) return;

    // Submit current answer before moving
    const success = await submitCurrentAnswer();

    // Only navigate if submission succeeded (or no answer to submit)
    if (!success) {
      return; // Don't navigate if submission failed
    }

    // Find current question index
    const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);

    if (currentIndex < questions.length - 1) {
      // Go to next question
      const nextQuestion = questions[currentIndex + 1];
      navigateToQuestion(nextQuestion.id);
    } else {
      // Last question, show submit confirmation
      setShowSubmitConfirm(true);
    }
  };

  const handlePrevious = async () => {
    if (!currentQuestionId || submittingAnswer) return;

    // Find current question index
    const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);

    if (currentIndex > 0) {
      // Submit current answer before moving (don't block on failure for previous)
      await submitCurrentAnswer();

      // Go to previous question
      const prevQuestion = questions[currentIndex - 1];
      navigateToQuestion(prevQuestion.id);
    }
  };

  const toggleFlag = () => {
    if (!currentQuestionId) return;

    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(currentQuestionId)) {
      newFlagged.delete(currentQuestionId);
    } else {
      newFlagged.add(currentQuestionId);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleFinalSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      // Submit current answer if any
      await submitCurrentAnswer();

      // Clear timer from localStorage
      localStorage.removeItem(`exam_timer_${examId}`);

      // Mark exam as completed in the backend (best-effort)
      try {
        await examService.completeExam(examId);
      } catch (err) {
        console.error('Failed to mark exam as completed:', err);
        // Don't block user if this fails
      }

      // Navigate to review page
      navigate(`/tests/${examId}/review`);
      toast.success('Testi u përfundua me sukses!');
    } catch (error: any) {
      console.error('Failed to submit test:', error);
      toast.error('Failed to submit test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = userAnswers.length;
  const progress =
    questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const currentQuestionIndex =
    questions.findIndex((q) => q.id === currentQuestionId) + 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">
                Failed to load exam or no questions found.
              </p>
              <Button onClick={onExit} variant="outline">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">Question not found.</p>
              <Button onClick={onExit} variant="outline">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Clear timer when exiting
                localStorage.removeItem(`exam_timer_${examId}`);
                onExit();
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Dil nga testi
            </Button>
            <h1>{exam.title}</h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4" />
              <span className={timeLeft <= 1800 ? 'text-red-500' : ''}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {answeredCount}/{questions.length} përgjigjur
            </div>
            <Button
              onClick={() => setShowSubmitConfirm(true)}
              size="sm"
              disabled={submitting}
            >
              {submitting ? 'Duke dërguar...' : 'Perfundo testin'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Area */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Pyetja {currentQuestionIndex} nga {questions.length}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFlag}
                  className={
                    currentQuestionId && flaggedQuestions.has(currentQuestionId)
                      ? 'text-yellow-500'
                      : ''
                  }
                >
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
              <Progress
                value={(currentQuestionIndex / questions.length) * 100}
                className="h-2"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-lg mb-8">{currentQuestion.text}</div>
                {currentQuestion?.description && (
                  <div className='[&>ul]:list-disc [&>ol]:list-decimal'>
                    {parse(currentQuestion.description)}
                  </div>
                )}
              </div>
              {currentQuestion.imageUrl && (
                <div className="w-full">
                  <div className="relative mx-auto max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl border rounded-lg overflow-hidden ">
                    <img
                      src={currentQuestion.imageUrl}
                      alt="Question"
                      className="w-full h-auto max-h-[600px] object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {currentQuestion.options
                  ?.slice()
                  .sort((a, b) => a.optionLetter.localeCompare(b.optionLetter))
                  .map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-3 px-3 border rounded-lg hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`option-${option.id}`}
                        checked={selectedOptions.has(option.id)}
                        onCheckedChange={() => handleOptionToggle(option.id)}
                      />
                      <Label
                        htmlFor={`option-${option.id}`}
                        className="flex-1 cursor-pointer py-3"
                      >
                        {option.optionLetter}. {option.text}
                      </Label>
                      {option.imageUrl && (
                        <img
                          src={option.imageUrl}
                          alt={option.optionLetter}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                    </div>
                  ))}
              </div>

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 1 || submittingAnswer}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />E mëparshme
                </Button>
                <Button onClick={handleNext} disabled={submittingAnswer}>
                  {submittingAnswer ? (
                    <>Duke ruajtur...</>
                  ) : (
                    <>
                      E radhës
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Navigimi i pyetjeve</CardTitle>
              <div className="text-sm text-muted-foreground">
                Progresi: {progress.toFixed(1)}%
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto">
                {questions.map((question, index) => {
                  const isAnswered = userAnswers.some(
                    (a) => a.questionId === question.id
                  );
                  const isCurrent = currentQuestionId === question.id;

                  return (
                    <button
                      key={question.id}
                      onClick={() => navigateToQuestion(question.id)}
                      className={`
                        w-8 h-8 text-xs rounded border transition-colors
                        ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground border-primary'
                            : isAnswered
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-muted hover:bg-muted/80 border-muted'
                        }
                      `}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span>Aktuale</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded dark:bg-yellow-900 dark:border-yellow-700"></div>
                  <span>E përgjigjur</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-muted border border-muted rounded"></div>
                  <span>Pa përgjigje</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3>Konfirmo dërgimin</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Përgjigje të dhëna: {answeredCount}/{questions.length}
                  </p>
                  <p>Kohë e mbetur: {formatTime(timeLeft)}</p>
                  <p>Pyetje të shënuara: {flaggedQuestions.size}</p>
                </div>
                <p className="text-sm">
                  A jeni të sigurt që doni të dërgoni testin? Ky veprim nuk mund
                  të zhbëhet.
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmitConfirm(false)}
                    className="flex-1"
                  >
                    Anulo
                  </Button>
                  <Button
                    onClick={handleFinalSubmit}
                    className="flex-1"
                    disabled={submitting}
                  >
                    {submitting ? 'Duke dërguar...' : 'Perfundo testin'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Auto-submit countdown modal when time is up */}
      {autoSubmitActive && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3>Koha e testit ka përfunduar</h3>
                <p className="text-sm text-muted-foreground">
                  Ky test do të përfundohet automatikisht pas{' '}
                  <span className="font-semibold">
                    {autoSubmitCountdown} sekondash
                  </span>
                  .
                </p>
                <p className="text-xs text-muted-foreground">
                  Ju lutem mos mbyllni këtë dritare derisa dërgimi të
                  përfundojë.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
