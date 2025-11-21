import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import {
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Play,
  Plus,
  BookOpen,
  Calculator,
  Globe,
} from 'lucide-react';
import { examService, Exam } from '../services/exams';
import { userAnswerService } from '../services/userAnswers';
import { toast } from 'sonner';

interface Test {
  id: string | number;
  title: string;
  completed: boolean;
  hasPassed?: boolean;
  score?: number;
  timeSpent?: string;
  subject?: string;
  exam: Exam;
}

interface TestListProps {
  onStartTest: (testId: string | number) => void;
  onViewResults: (testId: string | number) => void;
  onStartNewExam: () => void;
}

const subjectInfo = {
  matematik: { name: 'Matematika', icon: Calculator, color: 'text-blue-600' },
  gjuhaShqipe: {
    name: 'Gjuha Shqipe',
    icon: BookOpen,
    color: 'text-green-600',
  },
  anglisht: { name: 'Gjuha Angleze', icon: Globe, color: 'text-purple-600' },
};

export function TestList({
  onStartTest,
  onViewResults,
  onStartNewExam,
}: TestListProps) {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | number | null>(null);

  // Fetch exams and user answers on mount
  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all exams
      const exams = await examService.getExams();

      // Get all exams (both active and inactive)
      const allExams = exams;

      // Fetch user answers to get list of completed exams
      let userAnswers: any[] = [];
      try {
        userAnswers = await userAnswerService.getUserAnswers();
      } catch (err: any) {
        // If no answers exist yet or rate limited, that's okay
        if (err?.response?.status === 429) {
          console.log('Rate limited, skipping user answers fetch');
        } else {
          console.log('No user answers found');
        }
      }

      // Get unique exam IDs from user answers
      const completedExamIds = new Set(
        userAnswers.map((answer) => answer.examId)
      );

      // Create a map of exam results by examId (only fetch for completed exams)
      // Limit to first 5 to avoid rate limiting
      const examResultsMap = new Map<string, any>();
      const examsToCheck = allExams
        .filter((exam) => completedExamIds.has(String(exam.id)))
        .slice(0, 5); // Limit to 5 exams to avoid rate limiting

      // Fetch results sequentially with a small delay to avoid rate limiting
      for (const exam of examsToCheck) {
        try {
          const results = await userAnswerService.getExamResults(
            String(exam.id)
          );
          examResultsMap.set(String(exam.id), results);
          // Small delay between requests to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (err: any) {
          // Exam results not available or rate limited
          if (err?.response?.status === 429) {
            console.log('Rate limited, stopping results fetch');
            break; // Stop if rate limited
          } else {
            console.log(`Results not available for exam ${exam.id}`);
          }
        }
      }

      // Map exams to Test format
      const mappedTests: Test[] = allExams.map((exam) => {
        const results = examResultsMap.get(String(exam.id));
        // Prefer backend flags if available, otherwise fall back to isActive / results
        const isCompleted =
          typeof exam.isCompleted === 'boolean'
            ? exam.isCompleted
            : !!results || !exam.isActive;
        const hasPassed =
          typeof exam.hasPassed === 'boolean'
            ? exam.hasPassed
            : results?.hasPassed;
        const score = results ? Math.round(results.accuracy) : undefined;
        const timeSpentSeconds = results?.totalTimeSpent || 0;
        const timeSpent =
          timeSpentSeconds > 0
            ? `${Math.floor(timeSpentSeconds / 60)} min`
            : undefined;

        return {
          id: exam.id,
          title: exam.title,
          completed: isCompleted,
          hasPassed,
          score,
          timeSpent,
          subject: exam.sector?.name || undefined,
          exam,
        };
      });

      setTests(mappedTests);
    } catch (err: any) {
      console.error('Failed to fetch tests:', err);
      setError('Failed to load tests. Please try again.');
      toast.error('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const onStartTestClick = (testId: string | number) => {
    // Pass the testId as-is (could be string UUID or number)
    onStartTest(testId);
  };

  const onViewResultsClick = (testId: string | number) => {
    // Pass the testId as-is (could be string UUID or number)
    onViewResults(testId);
  };

  const onStartNewExamClick = () => {
    // Get all active (non-completed) tests
    const activeTests = tests.filter(
      (test) => !test.completed && test.exam.isActive
    );

    if (activeTests.length === 0) {
      toast.error('Nuk ka teste të disponueshme për momentin.');
      return;
    }

    // Select a random test
    const randomIndex = Math.floor(Math.random() * activeTests.length);
    const randomTest = activeTests[randomIndex];

    // Start the random test
    onStartTest(randomTest.id);
  };

  const handleResetAndStartSelectedTest = async (test: Test) => {
    if (!test || resettingId === test.id) return;
    try {
      setResettingId(test.id);
      await examService.resetExam(test.id);
      toast.success('Testi u rivendos. Mund ta bëni përsëri.');
      setSelectedTest(null);
      onStartTestClick(test.id);
    } catch (err) {
      console.error('Failed to reset exam:', err);
      toast.error('Dështoi rivendosja e testit. Ju lutem provoni përsëri.');
    } finally {
      setResettingId(null);
    }
  };

  const getSubjectIcon = (
    subject: 'matematik' | 'gjuhaShqipe' | 'anglisht'
  ) => {
    const Icon = subjectInfo[subject].icon;
    return <Icon className={`w-4 h-4 ${subjectInfo[subject].color}`} />;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        {/* <h2>Testet</h2> */}
        {/* <p className="text-muted-foreground">
          Zgjidhni një test për të filluar ose për të parë rezultatet
        </p> */}
      </div>

      {/* Start New Exam Section */}
      <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Fillo test të ri</h3>
              {/* <p className="text-blue-100 mb-4">
                Zgjidhni lëndën dhe filloni një test të përshtatur për nivelin
                tuaj
              </p> */}
              <div className="flex items-center space-x-4 text-sm text-blue-100">
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>100 pyetje</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>120 minuta</span>
                </div>
              </div>
            </div>
            <Button
              onClick={onStartNewExamClick}
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Fillo test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subject Stats - Only show if we have tests */}
      {tests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(subjectInfo).map(([subject, info]) => {
            const subjectTests = tests.filter(
              (test) => test.subject === subject
            );
            const completedTests = subjectTests.filter(
              (test) => test.completed
            );
            const averageScore =
              completedTests.length > 0
                ? Math.round(
                    completedTests.reduce(
                      (sum, test) => sum + (test.score || 0),
                      0
                    ) / completedTests.length
                  )
                : 0;

            const Icon = info.icon;

            if (subjectTests.length === 0) return null;

            return (
              <Card key={subject}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${info.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{info.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {completedTests.length}/{subjectTests.length} të
                        përfunduara
                      </p>
                    </div>
                  </div>
                  {completedTests.length > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">
                        {averageScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Mesatarja
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Udhëzime për testin
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>
                  • Çdo test përmban 100 pyetje me zgjedhje të shumëfishta
                </li>
                <li>• Koha e disponueshme është 120 minuta</li>
                <li>• Mund të navigoni lirshëm midis faqeve</li>
                <li>• Përgjigjet ruhen automatikisht</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Format i testit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Lloji i pyetjeve:</span>
              <span className="font-medium">Zgjedhje të shumëfishta</span>
            </div>
            <div className="flex justify-between">
              <span>Numri i opsioneve:</span>
              <span className="font-medium">4 (A, B, C, D)</span>
            </div>

            <div className="flex justify-between">
              <span>Ruajtja automatike:</span>
              <span className="font-medium text-green-600">✓ Aktive</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sistemi i pikëzimit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Përgjigje e saktë:</span>
              <span className="font-medium text-green-600">+1 pikë</span>
            </div>
            <div className="flex justify-between">
              <span>Përgjigje e gabuar:</span>
              <span className="font-medium text-red-600">0 pikë</span>
            </div>
            <div className="flex justify-between">
              <span>Pa përgjigje:</span>
              <span className="font-medium text-yellow-600">0 pikë</span>
            </div>
            <div className="flex justify-between">
              <span>Maksimumi:</span>
              <span className="font-medium">100 pikë</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests Grid */}
      <div>
        <h3 className="font-semibold mb-4">Të gjitha testet</h3>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex flex-col items-center space-y-3">
                  <Skeleton className="w-8 h-8 rounded" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchTests} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : tests.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No tests available at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tests.map((test) => {
              const isPassed = test.completed && test.hasPassed === true;
              const isFailed = test.completed && test.hasPassed === false;

              return (
                <Card
                  key={test.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    test.completed
                      ? isPassed
                        ? 'bg-emerald-950 text-emerald-50'
                        : isFailed
                          ? 'bg-red-950 text-red-50'
                          : 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'
                  } ${
                    selectedTest?.id === test.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedTest(test)}
                >
                  <CardContent className="p-4 flex flex-col items-center space-y-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-slate-800 text-white">
                      {test.completed ? (
                        isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{test.title}</p>
                      {test.completed && (
                        <>
                          {test.score !== undefined && (
                            <p className="text-xs text-muted-foreground">
                              {test.score}%
                            </p>
                          )}
                          <p
                            className={`text-[11px] mt-1 ${
                              isPassed
                                ? 'text-emerald-300'
                                : isFailed
                                  ? 'text-red-300'
                                  : ''
                            }`}
                          >
                            {test.hasPassed === true
                              ? 'Kaluar'
                              : test.hasPassed === false
                                ? 'Nuk e kaluat'
                                : 'Përfunduar'}
                          </p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Test Details Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-slate-900 text-white mx-auto">
                  <FileText className="w-8 h-8" />
                </div>

                <div>
                  <h3>{selectedTest.title}</h3>
                  {selectedTest.exam.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedTest.exam.description}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedTest.completed
                      ? `Test i përfunduar me rezultat ${selectedTest.score}%${
                          selectedTest.hasPassed === true
                            ? ' • Kaluar'
                            : selectedTest.hasPassed === false
                              ? ' • Nuk e kaluat'
                              : ''
                        }`
                      : `Test që përmban ${selectedTest.exam.totalQuestions} pyetje për përgatitjen e maturës`}
                  </p>
                  {selectedTest.exam.totalQuestions && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedTest.exam.totalQuestions} pyetje • Pikë minimale:{' '}
                      {selectedTest.exam.passingScore}%
                    </p>
                  )}
                </div>

                {selectedTest.completed && (
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedTest.timeSpent}</span>
                    </div>
                    <Badge variant="secondary">{selectedTest.score}%</Badge>
                  </div>
                )}

                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTest(null)}
                      className="flex-1"
                    >
                      Mbyll
                    </Button>
                    {selectedTest.completed ? (
                      <Button
                        onClick={() => {
                          onViewResultsClick(selectedTest.id);
                          setSelectedTest(null);
                        }}
                        className="flex-1"
                      >
                        Shiko rezultatet
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          onStartTestClick(selectedTest.id);
                          setSelectedTest(null);
                        }}
                        className="flex-1 bg-green-500 hover:bg-green-600"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Let's go!
                      </Button>
                    )}
                  </div>
                  {selectedTest.completed && (
                    <Button
                      onClick={() =>
                        handleResetAndStartSelectedTest(selectedTest)
                      }
                      className="w-full bg-green-500 hover:bg-green-600"
                      disabled={resettingId === selectedTest.id}
                    >
                      {resettingId === selectedTest.id
                        ? 'Duke rivendosur...'
                        : 'Bëj testin përsëri'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
