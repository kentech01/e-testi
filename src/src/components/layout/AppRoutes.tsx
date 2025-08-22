import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { initializeAuth } from '../../store/authSlice';
import { setLoading, setDarkMode } from '../../store/uiSlice';
import { LandingPage } from '../../pages/LandingPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { TestsPage } from '../../pages/TestsPage';
import { SubjectSelectionPage } from '../../pages/SubjectSelectionPage';
import { ExamPage } from '../../pages/ExamPage';
import { TestResultsPage } from '../../pages/TestResultsPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { TipsPage } from '../../pages/TipsPage';
import { AppLayout } from './AppLayout';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function AppRoutes() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { currentView, isLoading } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize dark mode from localStorage
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        dispatch(setDarkMode(savedDarkMode));

        // Initialize auth
        await dispatch(initializeAuth());
      } catch (error) {
        console.error('App initialization failed:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeApp();
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  const renderCurrentPage = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tests':
        return <TestsPage />;
      case 'subject-selection':
        return <SubjectSelectionPage />;
      case 'exam':
        return <ExamPage />;
      case 'test-results':
        return <TestResultsPage />;
      case 'tips':
        return <TipsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const isExamMode = ['exam', 'subject-selection'].includes(currentView);

  return (
    <AppLayout showNavigation={!isExamMode}>
      {renderCurrentPage()}
    </AppLayout>
  );
}