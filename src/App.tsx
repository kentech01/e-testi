import { useState, useEffect, lazy, Suspense } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Toaster } from './ui/sonner';
import 'mathlive';
import { toast } from 'sonner';
import {
  GraduationCap,
  BookOpen,
  Target,
  Users,
  Play,
  ChevronRight,
  Star,
  Sparkles,
  SquareArrowOutUpRight,
  Check,
} from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import userService from './services/users';
import useSectors from './hooks/useSectors';
import { TestimonialCard } from './ui/TestimonialCard';
import TestimonialsSection from './ui/TestimonialsSection';
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
    title: 'Regjistrohu falas',
    description:
      'Krijo llogarinë tënde në vetëm disa sekonda. Nuk nevojitet kartë krediti.',
  },
  {
    title: 'Zgjidh lëndët',
    description:
      'Përzgjidh lëndët që do të testohesh në maturë dhe fillo praktikën e organizuar.',
  },
  {
    title: 'Praktiko dhe arrij sukses',
    description:
      'Praktiko me teste reale, gjurmo progresin dhe përgatitu me besim për maturën.',
  },
];

const subjects = [
  {
    name: 'Teste reale të maturës',
    colorTx: '#5684FF',
    color: '#E0E9FF',
    count:
      'Qasje në qindra teste të vërteta nga vitet e kaluara, të organizuara sipas lëndëve dhe temave.',
  },
  {
    name: 'Praktikë e personalizuar',
    colorTx: '#8A38F5',
    color: '#FCE0FF',
    count:
      'Ushtrime të zgjedhura sipas gabimeve të tua, që ta shpenzosh kohën vetëm aty ku ka më shumë efekt.',
  },
  {
    name: 'Progres i qartë',
    colorTx: '#00C84F',
    color: '#E0FFE5',
    count:
      'Shihe përparimin në çdo lëndë: çka po përmirëson dhe çka duhet me përsërit edhe pak.',
  },
  {
    name: 'Mbështetje nga mësimdhënës',
    colorTx: '#FF6F47',
    color: '#FFF2E0',
    count:
      'Platformë e dizajnuar për shkolla dhe mësimdhënës që duan të ndihmojnë studentët e tyre.',
  },
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
  const { user, loading, signOut } = useFirebaseAuth(); // Get signOut from the hoo
  const [menus, setMenus] = useState([
    { label: 'Testet praktike', isActive: false, redirect: '#testet-praktike' },
    { label: 'Si funksionon', isActive: false, redirect: '#si-funksionon' },
    { label: 'Lëndët', isActive: false, redirect: '#lëndët' },
    { label: 'Deshmitë', isActive: false, redirect: '#deshmitë' },
  ]);

  // Initialize app state
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);
  useEffect(() => {
    setShowAuth(false);
    if (user) {
      if (
        user!.school == null ||
        user!.municipality == null ||
        user!.grade == null
      ) {
        setShowAuth(true);
      }
    }
  }, [user]);

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

  const handleUpdateProfile = async (
    grade: string,
    school: number,
    municipality: number
  ) => {
    // This would need to be implemented with Firebase user profile updates
    await userService.updateUser({ sectorId: grade, school, municipality });
    window.location.reload();
    toast.success('Profili u përditësua me sukses!');
  };

  // Show loading screen during initialization
  if (loading) {
    return <LoadingFallback />;
  }

  // Show landing page if no user
  if (!user) {
    return (
      <div className="">
        {/* Header */}
        <header className="p-9 px-5 lg:px-36 flex justify-between items-center bg-white">
          <div className="flex items-center space-x-3">
            <img src="./etesti-logo.svg" className="hidden md:block" alt="" />
            <img
              src="./etesti-icon.svg"
              className="block md:hidden w-10"
              alt=""
            />
          </div>
          <div>
            <ul className="gap-7 hidden md:flex">
              {menus.map((menu, index) => (
                <li key={index}>
                  <a
                    href={menu.redirect}
                    className="text-[#1E3A8A] text-[16px] font-normal hover:text-[#263041] p-2"
                  >
                    {menu.label}
                  </a>
                </li>
              ))}
            </ul>
            <Button
              className="font-normal md:hidden rounded-[8px]  px-[30px] py-6 text-[15px]"
              onClick={() => setShowAuth(true)}
            >
              Fillo falas tani
            </Button>
          </div>
        </header>

        <main
          className={`relative md:py-30 py-15 px-5  md:px-36 flex items-center justify-center min-h-screen sectionWithPseudo bg-gradient-to-b from-[#f7f9ff] via-[#d3defc] to-[#5684FF]`}
        >
          <div>
            <h1 className="sm:text-6xl text-5xl font-bold text-card-foreground text-center leading-tight ">
              Platforma jote digjitale për <br />
              <span className="text-[#5684FF]">maturë</span>
            </h1>

            <p className="text-[#475569] text:[16px] sm:text-[20px] max-w-[600px] text-center mx-auto mt-5 text-lg">
              Mëso, praktiko dhe përgatitu për testet e maturës me platformën më
              moderne dhe të plotë në Kosovë.
            </p>
            <div className="md:flex-row flex-col flex gap-6 justify-center mt-9 mb-9">
              <Button
                className="md:py-[27px] font-normal md:text-[18px] rounded-[14px] md:px-[65px] px-[50px] py-[25px] text-[16px]"
                onClick={() => setShowAuth(true)}
              >
                Fillo falas tani
              </Button>
              <Button
                variant="secondary"
                className="flex md:py-[27px] font-normal md:text-[18px] rounded-[14px] md:px-[72px] px-[50px] py-[25px] text-[16px]"
              >
                <Play className="w-4 h-4" />
                Shiko demonstrimin
              </Button>
            </div>
            <div className="sectionHeroImg">
              <img
                src="./Dashboard.png"
                className=" w-full z-10 relative md:max-w-[90%] max-w-full mx-auto rounded-xl shadow"
                alt=""
              />
            </div>
          </div>
        </main>
        <main id='testet-praktike' className=" mx-auto md:py-30 py-15 px-5  md:px-36  text-center space-y-12">
          <div className="space-y-6">
            <Badge className="bg-[#F7F9FF] text-[#5684FF] border-0 rounded-4xl text-[16px] font-normal px-7 py-3">
              Veçoritë
            </Badge>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Gjithçka që të duhet për sukses në maturë
            </h2>

            <p className="text-lg md:text-2xl text-muted-foreground max-w-[80%] mx-auto leading-relaxed">
              E-testi të ndihmon të mësosh me ritmin tënd: praktikon me teste të
              vërteta, e kupton ku je dobët dhe përmirësohesh hap pas hapi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
            {subjects.map((subject, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow bg-[#F7F9FF] border-0 py-5"
              >
                <CardContent className="p-6">
                  <div
                    style={{ backgroundColor: subject.color }}
                    className={`w-16 h-16 rounded-xl mb-14 flex items-center justify-center bg-[${subject.color}]`}
                  >
                    <BookOpen
                      className="w-10 h-10"
                      style={{ color: subject.colorTx }}
                    />
                  </div>
                  <h3 className="text-start font-semibold text-xl mb-2">
                    {subject.name}
                  </h3>

                  <p className="text-start text-lg text-muted-foreground">
                    {subject.count}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <section id='si-funksionon' className="md:py-30 py-15 px-5  md:px-36  bg-[#EEF2FF]">
          <div className="space-y-6 text-center ">
            <Badge className="bg-[#F7F9FF] text-[#5684FF] border-0 rounded-4xl text-[16px] font-normal px-7 py-3">
              Si funksionon
            </Badge>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Rruga drejt suksesit në 3 hapa
            </h2>

            <p className="text-lg md:text-2xl text-muted-foreground max-w-[80%] mx-auto leading-relaxed">
              Fillo të përgatitesh për maturë në mënyrën më të thjeshtë dhe më
              efektive.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-left hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="">
                    <div className="w-18 rounded-full h-18 bg-primary text-[20px] flex items-center justify-center flex-shrink-0 mb-8 text-white">
                      0{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-[20px]">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-xl text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                      <div className=" flex gap-2 items-center mt-4">
                        <div className="w-5 h-5 rounded-full border-1 border-[#5684FF] flex items-center justify-center">
                          <Check className="w-3 h-3 !text-[#5684FF]" />
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed flex !text-[#5684FF]">
                          E thjeshtë dhe e shpejtë
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-9">
          <Button
                className="md:py-[27px] font-normal md:text-[18px] rounded-[14px] md:px-[65px] px-[50px] py-[25px] text-[16px]"
                onClick={() => setShowAuth(true)}
              >
                Fillo falas tani
              </Button>
          </div>
        </section>
        <section
          id="lëndët"
          className="md:py-30 py-15 px-5  md:px-36 lg:flex-row flex-col-reverse flex gap-20 items-center bg-white"
        >
          <div className="lg:w-1/2 space-y-8 w-full">
            <div className="flex gap-6">
              <div className="bg-[#F7F9FF] rounded-2xl md:px-8 px-3 md:py-6 py-3 text-center w-full">
                <p className="md:text-4xl text-2xl font-medium text-[#5684FF]">
                  500+
                </p>
                <p className="text-muted-foreground md:text-lg text-sm">
                  Teste
                </p>
              </div>
              <div className="bg-[#F7F9FF] rounded-2xl md:px-8 px-3  md:py-6 py-3 text-center w-full">
                <p className="md:text-4xl text-2xl font-medium text-[#8A38F5]">
                  3+
                </p>
                <p className="text-muted-foreground md:text-lg text-sm">
                  Lëndët
                </p>
              </div>
              <div className="bg-[#F7F9FF] rounded-2xl md:px-8 px-3  md:py-6 py-3 text-center w-full">
                <p className="md:text-4xl text-2xl font-medium text-[#00C84F]">
                  24/7
                </p>
                <p className="text-muted-foreground md:text-lg text-sm">
                  Qasje
                </p>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img
                src="./c405ecce008ec16c1bd407f960ab6dbeb2339dbe.jpg"
                alt="Përgatitja për maturë"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:w-1/2 space-y-10 lg:block flex flex-col items-center">
            <Badge className="bg-[#F7F9FF] text-[#5684FF] border-0 rounded-full text-[16px] font-normal px-6 py-3">
              Lëndët
            </Badge>

            <h2 className="sm:text-5xl text-4xl font-medium leading-tight">
              Përgatitu për të gjitha lëndët
            </h2>

            <p className="text-[16px] text-[#475569] font-normal  leading-10 md:max-w-[90%]">
              Platforma jonë ofron teste të plota për të gjitha lëndët e
              maturës, duke përfshirë pyetje të vërteta nga vitet e kaluara.
            </p>

            {/* Cards */}
            <div className="space-y-6 w-full">
              <Card className="border-0 bg-[#F7F9FF] rounded-2xl">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                      <GraduationCap className="w-7 h-7 text-[#5684FF]" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-lg">
                        Testi i maturës
                      </p>
                      <p className="font-semibold text-xl">Klasa 12</p>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary  flex items-center justify-center">
                    <SquareArrowOutUpRight className="w-8 h-8 text-white" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-[#F7F9FF] rounded-2xl">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                      <GraduationCap className="w-7 h-7 text-[#8A38F5]" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-lg">
                        Testi i arritshmërisë
                      </p>
                      <p className="font-semibold text-xl">Klasa 9</p>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary  flex items-center justify-center">
                    <SquareArrowOutUpRight className="w-8 h-8 text-white" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="deshmitë"
          className="md:py-30 py-15 px-5  md:px-36 bg-[#EEF2FF] text-center w-full"
        >
          <TestimonialsSection />
        </section>
        <section
          id="footer"
          className={`px-5  md:px-36 bg-[#EEF2FF] pb-10 after:bg-gradient-to-b after:from-white after:via-[#F5F8FF] after:to-[#c6d7fd] relative after:content-[''] after:absolute after:h-[80%] after:w-full after:left-0 after:bottom-0 z-0`}
        >
          <div className="w-full bg-primary rounded-3xl md:py-24 py-8 px-4  md:px-16 flex items-center justify-center z-2 relative">
            <div className="max-w-[800px] flex flex-col items-center gap-5 md:gap-10">
              <h1 className="md:text-6xl sm:text-4xl text-3xl text-white font-bold figtree text-center leading-10 md:leading-20">
                Gati të fillosh përgatitjen për maturë?
              </h1>
              <Button className="md:py-[27px] py-[25px] font-medium bg-[#FFA033] text-[16px] md:text-[20px] rounded-[14px]  px-[50px]" onClick={()=>setShowAuth(true)}>
                <div className="flex items-center gap-3 p-0">
                  <Sparkles className="!w-6 !h-6" /> Fillo tani
                </div>
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center pt-16 gap-5 z-2 relative">
            <img className="w-10" src="./etesti-icon.svg" alt="" />
            <p className="figtree text-lg text-[#0A142F] text-center">
              © 2025. Të gjitha të drejtat e rezervuara.
            </p>
          </div>
        </section>

        <Suspense fallback={<LoadingFallback />}>
          <AuthModal
            isOpen={showAuth}
            onClose={() => setShowAuth(false)}
            isLoggedIn={false}
          />
        </Suspense>

        <Toaster />
      </div>
    );
  }

  // Convert Firebase user to the format expected by AppRouter

  const userForRouter = {
    name: user.displayName || 'User',
    email: user.email || '',
    grade: user.grade || 'Klasa 12',
    school: user.school || null,
    municipality: user.municipality || null,
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
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          isLoggedIn={true}
        />
      </Suspense>
      <Toaster />
    </div>
  );
}

// Main App Component with RecoilRoot
export default function App() {
  const location = useLocation();

  useEffect(() => {
    const isOnTestPage = matchPath(
      { path: '/tests/:id/:uid', end: true },
      location.pathname
    );

    if (!isOnTestPage) {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);

        if (key && key.startsWith('exam_timer')) {
          localStorage.removeItem(key);
        }
      }
    }
  }, [location.pathname]);
  return (
    <RecoilRoot>
      <AppContent />
    </RecoilRoot>
  );
}
