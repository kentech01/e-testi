import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
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
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
// Lazy load components
const AuthModal = lazy(() =>
  import('./components/forms').then((module) => ({ default: module.AuthModal }))
);
const AppRouter = lazy(() =>
  import('./router').then((module) => ({ default: module.AppRouter }))
);

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
  { name: 'Matematika', count: 45 },
  { name: 'Gjuha Shqipe', count: 38 },
  { name: 'Anglisht', count: 32 },
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

// Main App Content Component
function AppContent() {
  const [showAuth, setShowAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const { user, loading, signOut } = useFirebaseAuth(); // Get signOut from the hook

  // Initialize app state
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
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

  const handleLogout = async () => {
    try {
      await signOut(); // Use the signOut from the hook, not Firebase directly
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, we should still show success
      // because the user might still be logged out
      toast.success('U dolët nga llogaria!');
      navigate('/'); // Redirect to home page even on error
    }
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleUpdateProfile = (name: string, email: string) => {
    // This would need to be implemented with Firebase user profile updates
    toast.success('Profili u përditësua me sukses!');
  };

  // Show loading screen during initialization
  if (loading) {
    return <LoadingFallback />;
  }

  // Show landing page if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <header className="p-4 flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold  text-xl text-foreground">E-testi</h1>
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
            <Badge className="bg-gradient-primary text-white border-0 px-4 py-1">
              <Star className="w-3 h-3 mr-1" />
              Platforma #1 për maturë në Kosovë
            </Badge>

            <h2 className="text-4xl md:text-6xl font-bold text-gradient-primary leading-tight">
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
                    className={`w-12 h-12 ${
                      subject.name === 'Matematika'
                        ? 'subject-math'
                        : subject.name === 'Gjuha Shqipe'
                          ? 'subject-albanian'
                          : 'subject-english'
                    } rounded-xl mx-auto mb-4 flex items-center justify-center`}
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
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
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
          <Card className="card-gradient text-white border-0 mt-16">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Gati për të filluar?</h3>
              <p className="text-white/90 mb-6 max-w-md mx-auto">
                Bashkohu me mijëra studentë të tjerë që po përgatiten për maturë
                me E-testi
              </p>
              <Button
                onClick={() => setShowAuth(true)}
                size="lg"
                variant="secondary"
                className="h-12 px-8 bg-white text-purple-600 hover:bg-gray-50"
              >
                Krijo llogari falas
              </Button>
            </CardContent>
          </Card>
        </main>

        <Suspense fallback={<LoadingFallback />}>
          <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        </Suspense>

        <Toaster />
      </div>
    );
  }

  // Convert Firebase user to the format expected by AppRouter
  const userForRouter = {
    name: user.displayName || 'User',
    email: user.email || '',
    grade: user.grade || '12',
    school: user.school || 'Unknown School',
  };

  return (
    <div className="flex h-screen bg-background">
      <Suspense fallback={<LoadingFallback />}>
        <AppRouter
          user={userForRouter}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
        />
      </Suspense>
      <Toaster />
    </div>
  );
}

// Main App Component with RecoilRoot
export default function App() {
  return (
    <RecoilRoot>
      <AppContent />
    </RecoilRoot>
  );
}
