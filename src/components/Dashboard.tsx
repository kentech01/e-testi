import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { GraduationCap, BookOpen, Target, TrendingUp, Clock, Star, Award, Users } from 'lucide-react';

interface DashboardProps {
  user: {
    name: string;
    grade: string;
    email: string;
    school?: string;
  };
}

const subjectData = [
  { name: 'Matematika', progress: 72, testsCompleted: 8, totalTests: 12, lastScore: 85 },
  { name: 'Gjuha Shqipe', progress: 81, testsCompleted: 9, totalTests: 11, lastScore: 92 },
  { name: 'Anglisht', progress: 64, testsCompleted: 7, totalTests: 10, lastScore: 78 },
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
  { title: 'Fillues i mire', description: 'Përfundoi testin e parë', icon: '🎯', unlocked: true },
  { title: 'Seri fitore', description: '5 teste radhaz mbi 80%', icon: '🔥', unlocked: true },
  { title: 'Matematikan', description: 'Rezultat perfekt në matematik', icon: '🧮', unlocked: false },
  { title: 'Poliglot', description: 'Rezultat i shkëlqyer në gjuhë', icon: '📚', unlocked: false },
];

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

export function Dashboard({ user }: DashboardProps) {
  const overallProgress = Math.round(subjectData.reduce((acc, subject) => acc + subject.progress, 0) / subjectData.length);
  const totalTestsCompleted = subjectData.reduce((acc, subject) => acc + subject.testsCompleted, 0);
  const totalMinutesThisWeek = weeklyActivity.reduce((acc, day) => acc + day.minutes, 0);
  const averageScore = Math.round(subjectData.reduce((acc, subject) => acc + subject.lastScore, 0) / subjectData.length);

  const pieData = subjectData.map((subject, index) => ({
    name: subject.name,
    value: subject.testsCompleted,
    color: COLORS[index]
  }));

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-2 border-white/20">
                <AvatarFallback className="bg-white/10 text-white text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">Mirë se erdhe, {user.name.split(' ')[0]}!</h2>
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
              <div className="text-blue-100 text-sm">Progres i përgjithshëm</div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-100">Objektivi juaj për këtë muaj</span>
              <span className="text-sm">{overallProgress}/85%</span>
            </div>
            <Progress value={overallProgress} className="h-3 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{totalTestsCompleted}</div>
            <div className="text-sm text-muted-foreground">Teste të përfunduara</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{averageScore}%</div>
            <div className="text-sm text-muted-foreground">Mesatarja</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{Math.round(totalMinutesThisWeek / 60)}h</div>
            <div className="text-sm text-muted-foreground">Kjo javë</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">2</div>
            <div className="text-sm text-muted-foreground">Arritje të reja</div>
          </CardContent>
        </Card>
      </div>

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
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="font-medium">{subject.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {subject.lastScore}%
                    </Badge>
                    <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                  </div>
                </div>
                <Progress value={subject.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{subject.testsCompleted} nga {subject.totalTests} teste</span>
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
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }}></div>
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
                  <Bar dataKey="minutes" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold">{totalMinutesThisWeek} min</div>
              <div className="text-sm text-muted-foreground">Total kjo javë</div>
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
                  <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
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