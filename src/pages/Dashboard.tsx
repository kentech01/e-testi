import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  GraduationCap,
  BookOpen,
  Target,
  Star,
  Users,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { DashboardStats } from '../components/dashboard';
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

const performanceData = [
  { test: 'Test 1', matematik: 85, gjuhaShqipe: 90, anglisht: 78 },
  { test: 'Test 2', matematik: 78, gjuhaShqipe: 85, anglisht: 82 },
  { test: 'Test 3', matematik: 92, gjuhaShqipe: 88, anglisht: 76 },
  { test: 'Test 4', matematik: 75, gjuhaShqipe: 92, anglisht: 85 },
  { test: 'Test 5', matematik: 88, gjuhaShqipe: 87, anglisht: 89 },
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

const achievements = [
  {
    title: 'Fillues i mire',
    description: 'Përfundoi testin e parë',
    icon: '🎯',
    unlocked: true,
  },
  {
    title: 'Seri fitore',
    description: '5 teste radhaz mbi 80%',
    icon: '🔥',
    unlocked: true,
  },
  {
    title: 'Matematikan',
    description: 'Rezultat perfekt në matematik',
    icon: '🧮',
    unlocked: false,
  },
  {
    title: 'Poliglot',
    description: 'Rezultat i shkëlqyer në gjuhë',
    icon: '📚',
    unlocked: false,
  },
];

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

export function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return <Navigate to="/" replace />;
  }

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

  const overallProgress = Math.round(
    subjectData.reduce((acc, subject) => acc + subject.progress, 0) /
      subjectData.length
  );
  const totalTestsCompleted = subjectData.reduce(
    (acc, subject) => acc + subject.testsCompleted,
    0
  );
  const totalMinutesThisWeek = weeklyActivity.reduce(
    (acc, day) => acc + day.minutes,
    0
  );
  const averageScore = Math.round(
    subjectData.reduce((acc, subject) => acc + subject.lastScore, 0) /
      subjectData.length
  );

  const pieData = subjectData.map((subject, index) => ({
    name: subject.name,
    value: subject.testsCompleted,
    color: COLORS[index],
  }));

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

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
            <div className="text-right">
              <div className="text-3xl font-bold">{overallProgress}%</div>
              <div className="text-blue-100 text-sm">
                Progres i përgjithshëm
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-100">
                Objektivi juaj për këtë muaj
              </span>
              <span className="text-sm">{overallProgress}/85%</span>
            </div>
            <Progress value={overallProgress} className="h-3 bg-white/20" />
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
        <Card className="lg:col-span-2">
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

        {/* Test Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Shpërndarja e testeve</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {pieData.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full`}
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span>{entry.name}</span>
                  </div>
                  <span>{entry.value} teste</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Grafiku i performancës</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test" />
                <YAxis domain={[60, 100]} />
                <Line
                  type="monotone"
                  dataKey="matematik"
                  stroke={COLORS[0]}
                  strokeWidth={3}
                  name="Matematika"
                />
                <Line
                  type="monotone"
                  dataKey="gjuhaShqipe"
                  stroke={COLORS[1]}
                  strokeWidth={3}
                  name="Gjuha Shqipe"
                />
                <Line
                  type="monotone"
                  dataKey="anglisht"
                  stroke={COLORS[2]}
                  strokeWidth={3}
                  name="Anglisht"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Arritjet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    achievement.unlocked
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : 'bg-muted/30 border-muted'
                  }`}
                >
                  <div
                    className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="default" className="bg-green-500">
                      ✓
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
