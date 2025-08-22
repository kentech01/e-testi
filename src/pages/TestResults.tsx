import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { CheckCircle2, XCircle, Clock, Target, TrendingUp, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface TestResultsProps {
  testId: number;
  answers: number[];
  onBack: () => void;
}

const mockCorrectAnswers = Array.from({ length: 100 }, () => Math.floor(Math.random() * 4));
const subjectBreakdown = [
  { subject: 'Matematika', questions: 40, correct: 32, percentage: 80 },
  { subject: 'Gjuha Shqipe', questions: 35, correct: 28, percentage: 80 },
  { subject: 'Anglisht', questions: 25, correct: 18, percentage: 72 },
];

const difficultyAnalysis = [
  { level: 'E lehtë', total: 30, correct: 28, percentage: 93 },
  { level: 'Mesatare', total: 45, correct: 32, percentage: 71 },
  { level: 'E vështirë', total: 25, correct: 18, percentage: 72 },
];

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

export function TestResults({ testId, answers, onBack }: TestResultsProps) {
  const correctAnswers = answers.filter((answer, index) => answer === mockCorrectAnswers[index]).length;
  const incorrectAnswers = answers.filter((answer, index) => answer !== mockCorrectAnswers[index] && answer !== -1).length;
  const unanswered = answers.filter(answer => answer === -1).length;
  
  const percentage = Math.round((correctAnswers / 100) * 100);
  const timeSpent = "1:23:45";

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kthehu
            </Button>
            <h1>Rezultatet e Test {testId}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Overall Score */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold ${color}`}>
                {percentage}%
              </div>
              <div className={`text-2xl font-semibold ${color}`}>
                Nota: {grade}
              </div>
              <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Koha: {timeSpent}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{correctAnswers}/100 të sakta</span>
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
              {subjectBreakdown.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>{subject.subject}</span>
                    <Badge variant={subject.percentage >= 75 ? 'default' : 'secondary'}>
                      {subject.percentage}%
                    </Badge>
                  </div>
                  <Progress value={subject.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {subject.correct}/{subject.questions} të sakta
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Analysis */}
        <Card>
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
        </Card>

        {/* Recommendations */}
        <Card>
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
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            Kthehu te testet
          </Button>
          <Button>
            Bëj testin përsëri
          </Button>
          <Button variant="secondary">
            Studjo gabimet
          </Button>
        </div>
      </div>
    </div>
  );
}