import React, { Suspense, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'sonner';
import { useIsAdmin } from '../utils/admin';

// Lazy load components
const Navigation = React.lazy(() =>
  import('../components/layout').then((module) => ({
    default: module.Navigation,
  }))
);
const MobileNavigation = React.lazy(() =>
  import('../components/layout').then((module) => ({
    default: module.MobileNavigation,
  }))
);

// Lazy load pages and their types
const   Dashboard = React.lazy(() =>
  import('../pages').then((module) => ({ default: module.Dashboard }))
);
const TestList = React.lazy(() =>
  import('../pages').then((module) => ({ default: module.TestList }))
);
const TestManagement = React.lazy(() =>
  import('../pages').then((module) => ({ default: module.TestManagement }))
);
const CreateExam = React.lazy(() =>
  import('../pages').then((module) => ({ default: module.CreateExam }))
);
const SubjectSelection = React.lazy(() =>
  import('../pages').then((module) => ({ default: module.SubjectSelection }))
);
const ExamInterface = React.lazy(() =>
  import('../pages').then((module) => ({ default: module.ExamInterface }))
);
const TestTaking = React.lazy(() =>
  import('../pages').then((module) => ({ default: module.TestTaking }))
);
const TestResults = React.lazy(() =>
  import('../pages').then((module) => ({ default: module.TestResults }))
);
const TestReview = React.lazy(() =>
  import('../pages').then((module) => ({ default: module.TestReview }))
);
const Settings = React.lazy(() =>
  import('../pages').then((module) => ({ default: module.Settings }))
);
const Tips = React.lazy(() =>
  import('../pages').then((module) => ({ default: module.Tips }))
);

// Import types
import type { TestTakingProps } from '../pages/TestTaking';
import type { ExamInterfaceProps } from '../pages/ExamInterface';
import type { TestResultsProps } from '../pages/TestResults';
import examService from '@/services/exams';

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

interface AppRouterProps {
  user: {
    name: string;
    email: string;
    grade: string;
    school: number | null;
    municipality: number | null;
  } | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onUpdateProfile: (grade: string, school: number, municipality: number) => void;
}

// Wrapper components for dynamic route parameters
const TestTakingWrapper = ({
  onComplete,
  onExit,
}: Omit<TestTakingProps, 'examId' | 'questionId'>) => {
  const { examId, questionId } = useParams();
  const navigate = useNavigate();

  // Validate examId - can be string UUID or number
  if (!examId || examId === 'NaN') {
    toast.error('ID e testit nuk është valide');
    navigate('/tests');
    return null;
  }

  // Try to parse as number, but keep as string if it's a UUID
  const parsedExamId = !isNaN(Number(examId)) ? Number(examId) : examId;

  return (
    <TestTaking
      examId={parsedExamId}
      questionId={questionId}
      onComplete={onComplete}
      onExit={onExit}
    />
  );
};

const ExamInterfaceWrapper = ({
  onComplete,
  onExit,
}: Omit<ExamInterfaceProps, 'subject'>) => {
  const { subject } = useParams();
  return (
    <ExamInterface
      subject={subject as 'matematik' | 'gjuhaShqipe' | 'anglisht'}
      onComplete={onComplete}
      onExit={onExit}
    />
  );
};

const TestResultsWrapper = ({
  answers,
  onBack,
}: Omit<TestResultsProps, 'testId'>) => {
  const { examId } = useParams<{ examId?: string }>();
  return (
    <TestResults
      testId={examId ? (Number(examId) || examId) : 1}
      answers={answers}
      onBack={onBack}
    />
  );
};

const CreateExamWrapper = () => {
  return <CreateExam />;
};

const AppRouter: React.FC<AppRouterProps> = ({
  user,
  darkMode,
  onToggleDarkMode,
  onLogout,
  onUpdateProfile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentTestId, setCurrentTestId] = useState<number | null>(null);
  const [currentSubject, setCurrentSubject] = useState<
    'matematik' | 'gjuhaShqipe' | 'anglisht' | null
  >(null);
  const [testAnswers, setTestAnswers] = useState<number[]>([]);

  // Handlers
  const handleStartTest = async(testId: string | number) => {
    // Validate testId
    if (
      !testId ||
      testId === 'NaN' ||
      (typeof testId === 'number' && isNaN(testId))
    ) {
      toast.error('ID e testit nuk është valide');
      return;
    }
    const examData = await examService.getExamById(testId);
    
    setCurrentTestId(typeof testId === 'number' ? testId : null);
    navigate(`/tests/${testId}`);
    toast.info(`Filloi: ${examData.title}`);
  };

  const handleStartNewExam = () => {
    navigate('/subject-selection');
  };

  const handleSubjectSelect = (
    subject: 'matematik' | 'gjuhaShqipe' | 'anglisht'
  ) => {
    setCurrentSubject(subject);
    navigate(`/exam/${subject}`);
    toast.info(
      `Filloi testi i ${subject === 'matematik' ? 'Matematikës' : subject === 'gjuhaShqipe' ? 'Gjuhës Shqipe' : 'Gjuhës Angleze'}`
    );
  };

  const handleCompleteExam = (answers: (number | null)[]) => {
    const convertedAnswers = answers.map((answer) =>
      answer === null ? -1 : answer
    );
    setTestAnswers(convertedAnswers);
    navigate('/results');
    toast.success('Testi u përfundua me sukses!');
  };

  const handleCompleteTest = (answers: number[]) => {
    setTestAnswers(answers);
    if (currentTestId !== null) {
      navigate(`/results/${currentTestId}`);
    } else {
      // If testId is a string UUID, get it from the current location
      const testIdFromPath = location.pathname
        .split('/tests/')[1]
        ?.split('/')[0];
      if (testIdFromPath) {
        navigate(`/results/${testIdFromPath}`);
      } else {
        navigate('/results');
      }
    }
    toast.success('Testi u përfundua me sukses!');
  };

  const handleViewResults = (testId: string | number) => {
    // Validate testId
    if (
      !testId ||
      testId === 'NaN' ||
      (typeof testId === 'number' && isNaN(testId))
    ) {
      toast.error('ID e testit nuk është valide');
      return;
    }
    setCurrentTestId(typeof testId === 'number' ? testId : null);
    const mockAnswers = Array.from({ length: 100 }, () =>
      Math.floor(Math.random() * 4)
    );
    setTestAnswers(mockAnswers);
    navigate(`/results/${testId}`);
  };

  const handleBackToTests = () => {
    setCurrentTestId(null);
    setCurrentSubject(null);
    setTestAnswers([]);
    navigate('/tests');
  };

  const handleBackToSubjectSelection = () => {
    setCurrentSubject(null);
    navigate('/subject-selection');
  };

  const isExamMode = ['/exam', '/subject-selection'].some((path) =>
    location.pathname.startsWith(path)
  );

  // Protected route wrapper
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  // Admin route wrapper - requires admin privileges
  const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const isAdmin = useIsAdmin();
    if (!user) {
      return <Navigate to="/" replace />;
    }
    if (!isAdmin) {
      toast.error('Nuk keni të drejta për të hyrë në këtë faqe');
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar Navigation */}
      <div className="hidden lg:flex">
        <Suspense fallback={<Skeleton className="w-64 h-full" />}>
          {user && (
            <Navigation
              user={user}
              darkMode={darkMode}
              onToggleDarkMode={onToggleDarkMode}
              onLogout={onLogout}
            />
          )}
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-20 lg:pb-0">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard user={user!} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tests"
              element={
                <ProtectedRoute>
                  <TestList
                    user={user!}
                    onStartTest={handleStartTest}
                    onViewResults={handleViewResults}
                    onStartNewExam={handleStartNewExam}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tests/:examId/:questionId?"
              element={
                <ProtectedRoute>
                  <TestTakingWrapper
                    onComplete={handleCompleteTest}
                    onExit={handleBackToTests}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tests/:examId/review"
              element={
                <ProtectedRoute>
                  <TestReview />
                </ProtectedRoute>
              }
            />

            <Route
              path="/subject-selection"
              element={
                <ProtectedRoute>
                  <SubjectSelection
                    onSelectSubject={handleSubjectSelect}
                    onBack={handleBackToTests}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/exam/:subject"
              element={
                <ProtectedRoute>
                  <ExamInterfaceWrapper
                    onComplete={handleCompleteExam}
                    onExit={handleBackToSubjectSelection}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/results/:examId?"
              element={
                <ProtectedRoute>
                  <TestResultsWrapper
                    answers={testAnswers}
                    onBack={handleBackToTests}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tips"
              element={
                <ProtectedRoute>
                  <Tips />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings
                    user={user!}
                    darkMode={darkMode}
                    onToggleDarkMode={onToggleDarkMode}
                    onUpdateProfile={onUpdateProfile}
                    onLogout={onLogout}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/test-management"
              element={
                <AdminRoute>
                  <TestManagement />
                </AdminRoute>
              }
            />

            <Route
              path="/test-management/create"
              element={
                <AdminRoute>
                  <CreateExam />
                </AdminRoute>
              }
            />

            <Route
              path="/test-management/edit/testi/:examId/pyetja/:questionId?"
              element={
                <AdminRoute>
                  <CreateExamWrapper />
                </AdminRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </div>

      {/* Mobile Navigation */}
      <Suspense fallback={null}>
        <MobileNavigation isExamMode={isExamMode} />
      </Suspense>
    </div>
  );
};

export default AppRouter;
