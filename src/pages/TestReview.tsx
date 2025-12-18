import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { examService, Exam } from '../services/exams';
import { questionsService, Question } from '../services/questions';
import {
  userAnswerService,
  UserAnswer,
  ExamResults,
} from '../services/userAnswers';
import { toast } from 'sonner';

export function TestReview() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const complexAnswer = useRef<boolean>(false);
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) {
      toast.error('ID e testit nuk është valide');
      navigate('/tests');
      return;
    }

    fetchData();
  }, [examId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch exam
      const examData = await examService.getExamById(examId!);
      setExam(examData);

      // Fetch questions
      const questionsData = await questionsService.getQuestionsByExam(examId!);
      const sortedQuestions = questionsData.sort(
        (a, b) => a.orderNumber - b.orderNumber
      );
      setQuestions(sortedQuestions);

      // Fetch exam results
      const results = await userAnswerService.getExamResults(examId!);
      setExamResults(results);
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      toast.error(
        'Nuk u arrit të ngarkohej rishikimi i testit. Provoni përsëri.'
      );
      navigate('/tests');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetailedResults = () => {
    navigate(`/results/${examId}`);
  };

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

  if (!exam || !examResults || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">Failed to load test review.</p>
              <Button onClick={() => navigate('/tests')} variant="outline">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Create a map of questionId to user answers for quick lookup
  const answerMap = new Map<string, UserAnswer[]>();
  examResults.answers.forEach((answer) => {
    const existing = answerMap.get(answer.questionId) || [];
    existing.push(answer);
    answerMap.set(answer.questionId, existing);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tests')}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kthehu
            </Button>
            <h1 className="text-2xl font-bold">
              Rezultatet e testit: {exam.title}
            </h1>
          </div>
          <Button onClick={handleViewDetailedResults} size="sm">
            Shiko rezultatet e detajuara
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Summary Card */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold">
                {examResults.correctAnswers}/{examResults.totalQuestions} të
                sakta
              </div>
              <div className="text-2xl font-semibold">
                {examResults.accuracy.toFixed(1)}% saktësi
              </div>
              {/* Pass/Fail Indicator */}
              <div className="flex justify-center">
                {examResults.accuracy > 40 ? (
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-lg font-semibold text-green-700 dark:text-green-300">
                      Kaluar
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="text-lg font-semibold text-red-700 dark:text-red-300">
                      Dështuar
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>{examResults.correctAnswers} të sakta</span>
                </div>
                <div className="flex items-center space-x-1">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span>{examResults.incorrectAnswers} të gabuara</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Pikët totale: {examResults.totalPoints}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Review */}
        <div className="space-y-6">
          {questions.map((question, index) => {
            const userAnswersForQuestion = answerMap.get(question.id) || [];
            const userSelectedOptionIds = new Set(
              userAnswersForQuestion.map((a) => a.selectedOptionId)
            );
            const parsedQuestionText = (() => {
              if (
                question.text?.includes('[')
              ) {
                try {
                  return JSON.parse(question.text);
                } catch {
                  return question.text;
                }
              }
            
              return question.text;
            })();

            return (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle>
                    Pyetja {index + 1} nga {questions.length}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-lg"><h1 className="text-lg mb-8">
                  {Array.isArray(parsedQuestionText) ? (
                    parsedQuestionText.map((val, index) =>
                      index % 2 == 0 ? (
                        <h1 className='inline-block'>{val}</h1>
                      ) : (
                        <math-field
                          read-only
                          value={val}
                          style={{ fontSize: '22px', padding: '8px', display: "inline-block", background: "transparent", color: "var(--foreground)" }}
                        ></math-field>
                      )
                    )
                  ) : (
                    <h1>{parsedQuestionText}</h1>
                  )}
                </h1> </div>
                  {question.imageUrl && (
                    <div className="w-full">
                      <div className="relative mx-auto max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl border rounded-lg overflow-hidden ">
                        <img
                          src={question.imageUrl}
                          alt="Question"
                          className="w-full h-auto max-h-[600px] object-contain"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {question.options
                      ?.slice()
                      .sort((a, b) =>
                        a.optionLetter.localeCompare(b.optionLetter)
                      )
                      .map((option) => {
                        complexAnswer.current = false
                        const isCorrect = option.isCorrect;
                        const isSelected = userSelectedOptionIds.has(option.id);
                        const isIncorrectAndSelected = !isCorrect && isSelected;
                        if (option.text.includes('~')) {
                          complexAnswer.current = true;
                          console.log(option.text, "textiii");
                          
                        }

                        let borderColor = 'border-gray-300';
                        let bgColor = 'bg-transparent';
                        let icon = null;

                        if (isCorrect) {
                          borderColor = 'border-green-500';
                          bgColor = 'bg-green-50 dark:bg-green-900/20';
                          icon = (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          );
                        } else if (isIncorrectAndSelected) {
                          borderColor = 'border-red-500';
                          bgColor = 'bg-red-50 dark:bg-red-900/20';
                          icon = <XCircle className="w-5 h-5 text-red-600" />;
                        }

                        return (
                          <div
                            key={option.id}
                            className={`flex items-center space-x-3 p-3 border-2 rounded-lg ${borderColor} ${bgColor}`}
                          >
                            {icon && (
                              <div className="flex-shrink-0">{icon}</div>
                            )}
                            <div className="flex-1">
                              <Label className="cursor-default">
                                {option.optionLetter}.{' '}
                                {complexAnswer.current ? (
                                  <math-field
                                    read-only
                                    value={option.text.replace(/^~\s*/, '')}
                                    style={{
                                      fontSize: '22px',
                                      padding: '8px',
                                      display: 'inline-block',
                                      background: 'transparent', color: "var(--foreground)"
                                    }}
                                  ></math-field>
                                ) : (
                                  option.text
                                )}
                              </Label>
                              {isSelected && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  (Zgjedhja juaj)
                                </span>
                              )}
                              {isCorrect && (
                                <span className="ml-2 text-xs font-semibold text-green-600">
                                  (Përgjigjja e saktë)
                                </span>
                              )}
                            </div>
                            {option.imageUrl && (
                              <img
                                src={option.imageUrl}
                                alt={option.optionLetter}
                                className="w-20 h-20 object-cover rounded"
                              />
                            )}
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Finish Button */}
        <div className="flex justify-center pt-4">
          <Button onClick={handleViewDetailedResults} size="lg">
            Shiko rezultatet e detajuara
          </Button>
        </div>
      </div>
    </div>
  );
}
