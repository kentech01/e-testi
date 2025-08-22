import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { toggleDarkMode, setAuthModalOpen } from '../store/uiSlice';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AuthModal } from '../components/auth/AuthModal';
import { FeatureCard } from '../components/common/FeatureCard';
import { SubjectCard } from '../components/common/SubjectCard';
import { GraduationCap, ChevronRight, Star } from 'lucide-react';
import { SUBJECTS } from '../constants/subjects';

const features = [
  {
    icon: 'Target',
    title: 'Teste autentike',
    description: 'Teste të ngjashme me format e maturës zyrtare',
    badge: '100+ teste'
  },
  {
    icon: 'BookOpen',
    title: 'Materiale cilësore',
    description: 'Përmbajtje e përpunuar nga mësimdhënës të përvojshëm',
    badge: 'E përditësuar'
  },
  {
    icon: 'Users',
    title: 'Komunitet studentësh',
    description: 'Mëso dhe garo me studentë të tjerë nga e gjithë Kosova',
    badge: '10K+ studentë'
  }
];

export function LandingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { isDarkMode, isAuthModalOpen } = useSelector((state: RootState) => state.ui);

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const handleOpenAuth = () => {
    dispatch(setAuthModalOpen(true));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="p-4 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl">E-test</h1>
            <p className="text-xs text-muted-foreground">Përgatitja për maturë</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleDarkMode}
          className="w-10 h-10 p-0"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </Button>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-12 text-center space-y-12">
        <div className="space-y-6">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-1">
            <Star className="w-3 h-3 mr-1" />
            Platforma #1 për maturë në Kosovë
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Përgatitu për maturë me sukses
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Mëso, praktiko dhe përgatitu për testet e maturës me platformën më moderne dhe të plotë në Kosovë. 
            Më shumë se 10,000 studentë tashmë kanë zgjedhur E-test.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleOpenAuth} 
              size="lg" 
              className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg"
            >
              Fillo falas tani
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
              Shiko demonstrimin
            </Button>
          </div>
        </div>

        {/* Subject Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {SUBJECTS.map((subject, index) => (
            <SubjectCard key={index} subject={subject} />
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 mt-16">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Gati për të filluar?</h3>
            <p className="text-blue-100 mb-6 max-w-md mx-auto">
              Bashkohu me mijëra studentë të tjerë që po përgatiten për maturë me E-test
            </p>
            <Button 
              onClick={handleOpenAuth}
              size="lg"
              variant="secondary"
              className="h-12 px-8 bg-white text-blue-600 hover:bg-blue-50"
            >
              Krijo llogari falas
            </Button>
          </CardContent>
        </Card>
      </main>

      <AuthModal />
    </div>
  );
}