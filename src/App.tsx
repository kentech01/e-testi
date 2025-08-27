import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useCallback,
  useMemo,
} from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Toaster } from './ui/sonner';
import { toast } from 'sonner';
import {
  GraduationCap,
  BookOpen,
  Target,
  Users,
  ChevronRight,
  Star,
} from 'lucide-react';
import { Skeleton } from './ui/skeleton';

// Lazy load pages for better performance
const AuthModal = lazy(() =>
  import('./components/forms').then((module) => ({ default: module.AuthModal }))
);
const Navigation = lazy(() =>
  import('./components/layout').then((module) => ({
    default: module.Navigation,
  }))
);
const Dashboard = lazy(() =>
  import('./pages').then((module) => ({ default: module.Dashboard }))
);
const TestList = lazy(() =>
  import('./pages').then((module) => ({ default: module.TestList }))
);
const SubjectSelection = lazy(() =>
  import('./pages').then((module) => ({ default: module.SubjectSelection }))
);
const ExamInterface = lazy(() =>
  import('./pages').then((module) => ({ default: module.ExamInterface }))
);
const TestTaking = lazy(() =>
  import('./pages').then((module) => ({ default: module.TestTaking }))
);
const TestResults = lazy(() =>
  import('./pages').then((module) => ({ default: module.TestResults }))
);
const Settings = lazy(() =>
  import('./pages').then((module) => ({ default: module.Settings }))
);
const Tips = lazy(() =>
  import('./pages').then((module) => ({ default: module.Tips }))
);

interface User {
  name: string;
  email: string;
  grade: string;
  school?: string;
}

type ViewType =
  | 'dashboard'
  | 'tests'
  | 'subject-selection'
  | 'exam-interface'
  | 'taking-test'
  | 'test-results'
  | 'tips'
  | 'settings';

// Memoized constants to prevent re-creation
const features = [
  {
    icon: Target,
    title: 'Teste autentike',
    description: 'Teste të ngjashme me format e maturës zyrtare',
    badge: '100+ teste',
  },
  {
    icon: BookOpen,
    title: 'Materiale cilësore',
    description: 'Përmbajtje e përpunuar nga mësimdhënës të përvojshëm',
    badge: 'E përditësuar',
  },
  {
    icon: Users,
    title: 'Komunitet studentësh',
    description: 'Mëso dhe garo me studentë të tjerë nga e gjithë Kosova',
    badge: '10K+ studentë',
  },
];

const subjects = [
  { name: 'Matematika', count: 45, color: 'bg-blue-500' },
  { name: 'Gjuha Shqipe', count: 38, color: 'bg-green-500' },
  { name: 'Anglisht', count: 32, color: 'bg-purple-500' },
];

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="space-y-4 w-full max-w-md p-4">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mx-auto" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  </div>
);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [currentTestId, setCurrentTestId] = useState<number | null>(null);
  const [currentSubject, setCurrentSubject] = useState<
    'matematik' | 'gjuhaShqipe' | 'anglisht' | null
  >(null);
  const [testAnswers, setTestAnswers] = useState<(number | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app state
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const savedUser = localStorage.getItem('maturaUser');
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        setDarkMode(savedDarkMode);
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleLogin = useCallback((email: string, password: string) => {
    const mockUser = {
      name: 'Ardi Hoxha',
      email: email,
      grade: '12',
      school: 'Liceu i Përgjithshëm "Sami Frashëri" - Prishtinë',
    };

    setUser(mockUser);
    localStorage.setItem('maturaUser', JSON.stringify(mockUser));
    setShowAuth(false);
    toast.success('Mirë se erdhe përsëri!');
  }, []);

  const handleSignup = useCallback(
    (
      email: string,
      password: string,
      name: string,
      grade: string,
      school: string
    ) => {
      const newUser = {
        name: name,
        email: email,
        grade: grade,
        school: school,
      };

      setUser(newUser);
      localStorage.setItem('maturaUser', JSON.stringify(newUser));
      setShowAuth(false);
      toast.success(
        'Mirë se erdhe në E-testi! Llogaria juaj u krijua me sukses.'
      );
    },
    []
  );

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('maturaUser');
    setCurrentView('dashboard');
    setCurrentTestId(null);
    setCurrentSubject(null);
    setTestAnswers([]);
    toast.info('U dolët nga llogaria');
  }, []);

  const handleToggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const handleStartNewExam = useCallback(() => {
    setCurrentView('subject-selection');
  }, []);

  const handleSubjectSelect = useCallback(
    (subject: 'matematik' | 'gjuhaShqipe' | 'anglisht') => {
      setCurrentSubject(subject);
      setCurrentView('exam-interface');
      toast.info(
        `Filloi testi i ${subject === 'matematik' ? 'Matematikës' : subject === 'gjuhaShqipe' ? 'Gjuhës Shqipe' : 'Gjuhës Angleze'}`
      );
    },
    []
  );

  const handleStartTest = useCallback((testId: number) => {
    setCurrentTestId(testId);
    setCurrentView('taking-test');
    toast.info(`Filloi Test ${testId}`);
  }, []);

  const handleCompleteExam = useCallback((answers: (number | null)[]) => {
    const convertedAnswers = answers.map((answer) =>
      answer === null ? -1 : answer
    );
    setTestAnswers(convertedAnswers);
    setCurrentView('test-results');
    toast.success('Testi u përfundua me sukses!');
  }, []);

  const handleCompleteTest = useCallback((answers: number[]) => {
    setTestAnswers(answers);
    setCurrentView('test-results');
    toast.success('Testi u përfundua me sukses!');
  }, []);

  const handleViewResults = useCallback((testId: number) => {
    setCurrentTestId(testId);
    const mockAnswers = Array.from({ length: 100 }, () =>
      Math.floor(Math.random() * 4)
    );
    setTestAnswers(mockAnswers);
    setCurrentView('test-results');
  }, []);

  const handleUpdateProfile = useCallback(
    (name: string, email: string) => {
      if (user) {
        const updatedUser = { ...user, name, email };
        setUser(updatedUser);
        localStorage.setItem('maturaUser', JSON.stringify(updatedUser));
        toast.success('Profili u përditësua me sukses!');
      }
    },
    [user]
  );

  const handleBackToTests = useCallback(() => {
    setCurrentView('tests');
    setCurrentTestId(null);
    setCurrentSubject(null);
    setTestAnswers([]);
  }, []);

  const handleBackToSubjectSelection = useCallback(() => {
    setCurrentView('subject-selection');
    setCurrentSubject(null);
  }, []);

  // Memoized computed values
  const isExamMode = useMemo(
    () => ['exam-interface', 'subject-selection'].includes(currentView),
    [currentView]
  );

  const shouldShowNavigation = useMemo(() => !isExamMode, [isExamMode]);

  // Show loading screen during initialization
  if (isLoading) {
    return <LoadingFallback />;
  }

  // Show landing page if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <header className="p-4 flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl">E-testi</h1>
              <p className="text-xs text-muted-foreground">
                Përgatitja për maturë
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleDarkMode}
            className="w-10 h-10 p-0"
          >
            {darkMode ? '☀️' : '🌙'}
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
              Mëso, praktiko dhe përgatitu për testet e maturës me platformën më
              moderne dhe të plotë në Kosovë. Më shumë se 10,000 studentë tashmë
              kanë zgjedhur E-test.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setShowAuth(true)}
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

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {subjects.map((subject, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 ${subject.color} rounded-xl mx-auto mb-4 flex items-center justify-center`}
                  >
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{subject.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-1">
                    {subject.count}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    teste të disponueshme
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-left hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {feature.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 mt-16">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Gati për të filluar?</h3>
              <p className="text-blue-100 mb-6 max-w-md mx-auto">
                Bashkohu me mijëra studentë të tjerë që po përgatiten për maturë
                me E-testi
              </p>
              <Button
                onClick={() => setShowAuth(true)}
                size="lg"
                variant="secondary"
                className="h-12 px-8 bg-white text-blue-600 hover:bg-blue-50"
              >
                Krijo llogari falas
              </Button>
            </CardContent>
          </Card>
        </main>

        <Suspense fallback={<LoadingFallback />}>
          <AuthModal
            isOpen={showAuth}
            onClose={() => setShowAuth(false)}
            onLogin={handleLogin}
            onSignup={handleSignup}
          />
        </Suspense>

        <Toaster />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Header - Hidden on desktop */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-background border-b border-border z-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold">E-testi </h1>
          </div>
          <Button size="sm" variant="outline" onClick={handleToggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </Button>
        </div>
      </div>

      {/* Sidebar Navigation - Hidden on mobile when in exam mode */}
      {shouldShowNavigation && (
        <div className="hidden lg:flex">
          <Suspense fallback={<Skeleton className="w-64 h-full" />}>
            <Navigation
              currentView={currentView}
              onViewChange={setCurrentView as (view: string) => void}
              user={user}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              onLogout={handleLogout}
            />
          </Suspense>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${isExamMode ? 'lg:ml-0' : ''}`}>
        <div className="lg:hidden h-16" /> {/* Spacer for mobile header */}
        <Suspense fallback={<LoadingFallback />}>
          {currentView === 'dashboard' && <Dashboard user={user} />}

          {currentView === 'tests' && (
            <TestList
              onStartTest={handleStartTest}
              onViewResults={handleViewResults}
              onStartNewExam={handleStartNewExam}
            />
          )}

          {currentView === 'subject-selection' && (
            <SubjectSelection
              onSelectSubject={handleSubjectSelect}
              onBack={handleBackToTests}
            />
          )}

          {currentView === 'exam-interface' && currentSubject && (
            <ExamInterface
              subject={currentSubject}
              onComplete={handleCompleteExam}
              onExit={handleBackToSubjectSelection}
            />
          )}

          {currentView === 'taking-test' && currentTestId && (
            <TestTaking
              testId={currentTestId}
              onComplete={handleCompleteTest}
              onExit={handleBackToTests}
            />
          )}

          {currentView === 'test-results' &&
            (currentTestId || currentSubject) && (
              <TestResults
                testId={currentTestId || 1}
                answers={testAnswers}
                onBack={handleBackToTests}
              />
            )}

          {currentView === 'tips' && <Tips />}

          {currentView === 'settings' && (
            <Settings
              user={user}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
            />
          )}
        </Suspense>
      </div>

      {/* Mobile Bottom Navigation - Hidden when in exam mode */}
      {shouldShowNavigation && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2">
          <div className="grid grid-cols-5 gap-1">
            {[
              { id: 'dashboard', label: 'Kreu', icon: '🏠' },
              { id: 'tests', label: 'Testet', icon: '📝' },
              { id: 'test-results', label: 'Rezultatet', icon: '📊' },
              { id: 'tips', label: 'Këshilla', icon: '💡' },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
            ].map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? 'default' : 'ghost'}
                size="sm"
                className="flex flex-col h-auto py-2 px-1"
                onClick={() => setCurrentView(item.id as ViewType)}
              >
                <span className="text-lg mb-1">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}
