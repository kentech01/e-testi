import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { GraduationCap, BookOpen, Users, Plus } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { examService } from '../services/exams';
import { userAnswerService } from '../services/userAnswers';
import { toast } from 'sonner';

export interface DashboardProps {
  user: {
    name: string;
    email: string;
    grade: string;
    school?: string;
  } | null;
}

const subjectData = [
  {
    name: 'Matematika',
    progress: 72,
    testsCompleted: 8,
    totalTests: 12,
    lastScore: 85,
  },
  {
    name: 'Gjuha Shqipe',
    progress: 81,
    testsCompleted: 9,
    totalTests: 11,
    lastScore: 92,
  },
  {
    name: 'Anglisht',
    progress: 64,
    testsCompleted: 7,
    totalTests: 10,
    lastScore: 78,
  },
];

const weeklyActivity = [
  { day: 'Hën', minutes: 45 },
  { day: 'Mar', minutes: 62 },
  { day: 'Mër', minutes: 38 },
  { day: 'Enj', minutes: 51 },
  { day: 'Pre', minutes: 73 },
  { day: 'Sht', minutes: 29 },
  { day: 'Die', minutes: 18 },
];

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

export function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [testsTotal, setTestsTotal] = useState(0);
  const [testsPassed, setTestsPassed] = useState(0);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Load basic test stats (how many tests taken / passed)
  useEffect(() => {
    const loadTestStats = async () => {
      try {
        setIsStatsLoading(true);
        const answers = await userAnswerService.getUserAnswers();

        if (!answers || answers.length === 0) {
          setTestsTotal(0);
          setTestsPassed(0);
          return;
        }

        // Group answers by exam and compute accuracy for each exam
        const examsMap = new Map<string, { total: number; correct: number }>();

        answers.forEach((answer) => {
          const current = examsMap.get(answer.examId) || {
            total: 0,
            correct: 0,
          };
          current.total += 1;
          if (answer.isCorrect) {
            current.correct += 1;
          }
          examsMap.set(answer.examId, current);
        });

        const totalExams = examsMap.size;
        let passedExams = 0;
        const PASS_THRESHOLD = 0.5; // 50% accuracy to consider an exam as passed

        examsMap.forEach(({ total, correct }) => {
          const accuracy = total > 0 ? correct / total : 0;
          if (accuracy >= PASS_THRESHOLD) {
            passedExams += 1;
          }
        });

        setTestsTotal(totalExams);
        setTestsPassed(passedExams);
      } catch (error) {
        console.error('Failed to load test stats:', error);
      } finally {
        setIsStatsLoading(false);
      }
    };

    loadTestStats();
  }, []);

  const handleStartRandomTest = async () => {
    try {
      setIsLoading(true);

      // Fetch all exams
      const exams = await examService.getExams();

      // Filter for active exams
      const activeExams = exams.filter((exam) => exam.isActive);

      if (activeExams.length === 0) {
        toast.error('Nuk ka teste të disponueshme për momentin.');
        return;
      }

      // Fetch user answers to determine completed exams
      let completedExamIds = new Set<string>();
      try {
        const userAnswers = await userAnswerService.getUserAnswers();
        // Get unique exam IDs from user answers
        completedExamIds = new Set(
          userAnswers.map((answer) => String(answer.examId))
        );
      } catch (err: any) {
        // If no answers exist yet or rate limited, that's okay
        if (err?.response?.status !== 429) {
          console.log('No user answers found or error fetching answers');
        }
      }

      // Filter for non-completed exams
      const availableExams = activeExams.filter(
        (exam) => !completedExamIds.has(String(exam.id))
      );

      // If all exams are completed, allow starting any active exam
      const examsToChooseFrom =
        availableExams.length > 0 ? availableExams : activeExams;

      if (examsToChooseFrom.length === 0) {
        toast.error('Nuk ka teste të disponueshme për momentin.');
        return;
      }

      // Select a random test
      const randomIndex = Math.floor(Math.random() * examsToChooseFrom.length);
      const randomTest = examsToChooseFrom[randomIndex];

      // Navigate to the test
      navigate(`/tests/${randomTest.id}`);
      toast.info(`Filloi test: ${randomTest.title}`);
    } catch (error) {
      console.error('Failed to start random test:', error);
      toast.error('Dështoi të fillonte testi. Ju lutem provoni përsëri.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalMinutesThisWeek = weeklyActivity.reduce(
    (acc, day) => acc + day.minutes,
    0
  );

  const passedTestsData = [
    { name: 'Të kaluara', value: testsPassed },
    { name: 'Të pakaluara', value: Math.max(testsTotal - testsPassed, 0) },
  ];

  const passRate =
    testsTotal > 0 ? Math.round((testsPassed / testsTotal) * 100) : 0;

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* <Avatar className="w-16 h-16 border-2 border-white/20">
                <AvatarFallback className="bg-white/10 text-white text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar> */}
              <div>
                <h2 className="text-2xl font-bold">
                  Mirë se erdhe, {user.name.split(' ')[0]}!
                </h2>
                <div className="flex items-center space-x-4 text-blue-100 mt-1">
                  <div className="flex items-center space-x-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>Klasa {user.grade}</span>
                  </div>
                  {user.school && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm truncate max-w-[200px]">
                        {user.school.split(' - ')[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-end justify-end">
          <Button
            onClick={handleStartRandomTest}
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-blue-50"
            disabled={isLoading}
          >
            <Plus className="w-5 h-5 mr-2" />
            {isLoading ? 'Duke ngarkuar...' : 'Fillo test'}
          </Button>
        </CardFooter>
      </Card>

      {/* Quick Stats */}
      {/* <DashboardStats
        overallProgress={overallProgress}
        totalTestsCompleted={totalTestsCompleted}
        totalMinutesThisWeek={totalMinutesThisWeek}
        averageScore={averageScore}
      /> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Performance */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Performanca sipas lëndëve</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {subjectData.map((subject, index) => (
              <div key={subject.name} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full`}
                      style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <span className="font-medium">{subject.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {subject.lastScore}%
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {subject.progress}%
                    </span>
                  </div>
                </div>
                <Progress value={subject.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {subject.testsCompleted} nga {subject.totalTests} teste
                  </span>
                  <span>Rezultati i fundit: {subject.lastScore}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Aktiviteti javor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Bar
                    dataKey="minutes"
                    fill={COLORS[0]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold">
                {totalMinutesThisWeek} min
              </div>
              <div className="text-sm text-muted-foreground">
                Total kjo javë
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passed tests chart */}
        <Card>
          <CardHeader>
            <CardTitle>Teste të kaluara</CardTitle>
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
                Duke ngarkuar statistikat...
              </div>
            ) : testsTotal === 0 ? (
              <div className="h-48 flex items-center justify-center text-sm text-muted-foreground text-center">
                Nuk ka të dhëna ende. Fillo një test për të parë progresin tënd.
              </div>
            ) : (
              <>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={passedTestsData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={4}
                      >
                        {passedTestsData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 0
                                ? '#10B981' // green for passed
                                : '#EF4444' // red for not passed
                            }
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center space-y-1">
                  <div className="text-lg font-semibold">
                    {testsPassed}/{testsTotal} teste të kaluara
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Norma e kalimit: {passRate}%
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
