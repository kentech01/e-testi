import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { userAnswerService, ExamResults } from '../services/userAnswers';
import { examService, Exam } from '../services/exams';
import { getSubjectLabel } from '../data/subjects';
import { toast } from 'sonner';

export interface TestResultsProps {
  testId?: number | string;
  answers?: number[];
  onBack?: () => void;
}

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

export function TestResults({ testId, answers, onBack }: TestResultsProps) {
  const { examId } = useParams<{ examId?: string }>();
  const navigate = useNavigate();
  const actualExamId = examId || (testId ? String(testId) : null);
  
  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actualExamId) {
      toast.error('Invalid exam ID');
      if (onBack) {
        onBack();
      } else {
        navigate('/tests');
      }
      return;
    }

    fetchData();
  }, [actualExamId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch exam results
      const results = await userAnswerService.getExamResults(actualExamId!);
      setExamResults(results);

      // Fetch exam details
      try {
        const examData = await examService.getExamById(actualExamId!);
        setExam(examData);
      } catch (error) {
        console.error('Failed to fetch exam details:', error);
      }
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load test results. Please try again.');
      if (onBack) {
        onBack();
      } else {
        navigate('/tests');
      }
    } finally {
      setLoading(false);
    }
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

  if (!examResults) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">Failed to load test results.</p>
              <Button
                onClick={() => (onBack ? onBack() : navigate('/tests'))}
                variant="outline"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const correctAnswers = examResults.correctAnswers;
  const incorrectAnswers = examResults.incorrectAnswers;
  const unanswered = examResults.totalQuestions - correctAnswers - incorrectAnswers;
  const percentage = examResults.accuracy;
  
  // Format time spent
  const totalSeconds = examResults.totalTimeSpent;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const timeSpent = hours > 0 
    ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    : `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Calculate subject breakdown from real data
  const subjectMap = new Map<string, { correct: number; total: number }>();
  
  examResults.answers.forEach((answer) => {
    if (answer.question?.subject) {
      const subject = answer.question.subject;
      const current = subjectMap.get(subject) || { correct: 0, total: 0 };
      current.total += 1;
      if (answer.isCorrect) {
        current.correct += 1;
      }
      subjectMap.set(subject, current);
    }
  });

  const subjectBreakdown = Array.from(subjectMap.entries()).map(([subjectValue, stats]) => {
    const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    return {
      subject: getSubjectLabel(subjectValue),
      questions: stats.total,
      correct: stats.correct,
      percentage,
    };
  }).sort((a, b) => b.percentage - a.percentage);

  const pieData = [
    { name: 'E saktë', value: correctAnswers, color: '#10B981' },
    { name: 'E gabuar', value: incorrectAnswers, color: '#EF4444' },
    { name: 'Pa përgjigje', value: unanswered, color: '#F59E0B' },
  ];

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 70) return { grade: 'C', color: 'text-yellow-600' };
    if (percentage >= 60) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const { grade, color } = getGrade(percentage);
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/tests');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kthehu
            </Button>
            <h1>
              Rezultatet e Test {exam?.title || actualExamId}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Overall Score */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold ${color}`}>
                {percentage.toFixed(1)}%
              </div>
              {/* Pass/Fail Indicator */}
              <div className="flex justify-center">
                {percentage > 40 ? (
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
                  <Clock className="w-4 h-4" />
                  <span>Koha: {timeSpent}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>
                    {correctAnswers}/{examResults.totalQuestions} të sakta
                  </span>
                </div>
              </div>
              <div className="max-w-md mx-auto">
                <Progress value={percentage} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Answer Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Përmbledhja e përgjigjeve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Përgjigjje të sakta</span>
                  </div>
                  <span>{correctAnswers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Përgjigjje të gabuara</span>
                  </div>
                  <span>{incorrectAnswers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                    <span className="text-sm">Pa përgjigje</span>
                  </div>
                  <span>{unanswered}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performanca sipas lëndëve</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjectBreakdown.length > 0 ? (
                subjectBreakdown.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{subject.subject}</span>
                      <Badge
                        variant={
                          subject.percentage >= 75 ? 'default' : 'secondary'
                        }
                      >
                        {subject.percentage}%
                      </Badge>
                    </div>
                    <Progress value={subject.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {subject.correct}/{subject.questions} të sakta
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nuk ka të dhëna për performancën sipas lëndëve
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Analysis */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Analiza e vështirësisë</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={difficultyAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Bar dataKey="percentage" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}

        {/* Recommendations */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Rekomandimet për përmirësim</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {percentage < 75 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800">Fusha për përmirësim</h4>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    <li>• Fokusohuni në pyetjet e vështira - vetëm {difficultyAnalysis[2].percentage}% e sakta</li>
                    <li>• Praktikoni më shumë në Anglisht - performanca më e dobët</li>
                    <li>• Menaxhoni kohën më mirë - {unanswered} pyetje të paprëgjigura</li>
                  </ul>
                </div>
              )}
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800">Pikat e forta</h4>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  <li>• Performance e mirë në pyetjet e lehta - {difficultyAnalysis[0].percentage}% e sakta</li>
                  <li>• Matematika dhe Gjuha Shqipe janë pikat tuaja të forta</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            Kthehu te testet
          </Button>
          {actualExamId && (
            <>
              <Button onClick={() => navigate(`/tests/${actualExamId}`)}>
                Bëj testin përsëri
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(`/tests/${actualExamId}/review`)}
              >
                Studjo gabimet
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
