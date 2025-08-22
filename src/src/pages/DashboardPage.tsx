import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setCurrentView } from '../store/uiSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { BookOpen, TrendingUp, Clock, Target, Users, Trophy, BarChart3 } from 'lucide-react';
import { SUBJECTS } from '../constants/subjects';

export function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleStartNewExam = () => {
    dispatch(setCurrentView('subject-selection'));
  };

  const handleViewTests = () => {
    dispatch(setCurrentView('tests'));
  };

  const handleViewResults = () => {
    dispatch(setCurrentView('test-results'));
  };

  // Mock data for dashboard
  const recentTests = [
    { id: 1, subject: 'matematik', score: 85, date: '2024-01-15', duration: '1:45:30' },
    { id: 2, subject: 'gjuhaShqipe', score: 78, date: '2024-01-12', duration: '1:52:15' },
    { id: 3, subject: 'anglisht', score: 92, date: '2024-01-10', duration: '1:38:45' },
  ];

  const stats = {
    totalTests: 12,
    averageScore: 85,
    totalHours: 24,
    bestStreak: 5
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Mirë se erdhe, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Ja ku qëndroni në përgatitjen tuaj për maturë
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleStartNewExam}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Fillo test të ri</h3>
            <p className="text-sm text-muted-foreground">Zgjidhni lëndën dhe filloni testimin</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewTests}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Shiko testet</h3>
            <p className="text-sm text-muted-foreground">Shikoni të gjitha testet e disponueshme</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewResults}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-2">Rezultatet</h3>
            <p className="text-sm text-muted-foreground">Analizoni performancën tuaj</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalTests}</p>
                <p className="text-xs text-muted-foreground">Teste të përfunduara</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
                <p className="text-xs text-muted-foreground">Mesatarja</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalHours}h</p>
                <p className="text-xs text-muted-foreground">Kohë gjithsej</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.bestStreak}</p>
                <p className="text-xs text-muted-foreground">Seria më e mirë</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Testet e fundit</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTests.map((test) => {
              const subject = SUBJECTS.find(s => s.id === test.subject);
              return (
                <div key={test.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${subject?.color} rounded-lg flex items-center justify-center`}>
                      {subject && <subject.icon className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <p className="font-medium">{subject?.name}</p>
                      <p className="text-sm text-muted-foreground">{test.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={test.score >= 80 ? 'default' : test.score >= 60 ? 'secondary' : 'destructive'}>
                      {test.score}%
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{test.duration}</p>
                  </div>
                </div>
              );
            })}
            <Button variant="outline" className="w-full" onClick={handleViewResults}>
              Shiko të gjitha rezultatet
            </Button>
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Progresi sipas lëndëve</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {SUBJECTS.map((subject, index) => {
              const progress = [75, 65, 85][index]; // Mock progress data
              return (
                <div key={subject.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <subject.icon className={`w-4 h-4 ${subject.iconColor}`} />
                      <span className="text-sm font-medium">{subject.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
            
            <div className="pt-4 border-t">
              <Button className="w-full" onClick={handleStartNewExam}>
                <Target className="w-4 h-4 mr-2" />
                Fillo një test të ri
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}