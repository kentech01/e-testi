import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { examService, Exam } from '../services/exams';
import { questionsService, Question } from '../services/questions';
import { userAnswerService, UserAnswer, ExamResults } from '../services/userAnswers';
import { toast } from 'sonner';

export function TestReview() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) {
      toast.error('Invalid exam ID');
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
      toast.error('Failed to load test review. Please try again.');
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
              <p className="text-red-600 mb-4">
                Failed to load test review.
              </p>
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

            return (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle>
                    Pyetja {index + 1} nga {questions.length}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-lg">{question.text}</div>
                  {question.imageUrl && (
                    <img
                      src={question.imageUrl}
                      alt="Question"
                      className="max-w-full rounded-lg"
                    />
                  )}

                  <div className="space-y-3">
                    {question.options?.map((option) => {
                      const isCorrect = option.isCorrect;
                      const isSelected = userSelectedOptionIds.has(option.id);
                      const isIncorrectAndSelected = !isCorrect && isSelected;

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
                              {option.optionLetter}. {option.text}
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

