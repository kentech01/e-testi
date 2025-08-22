import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Navigation } from './Navigation';
import { MobileHeader } from './MobileHeader';
import { MobileNavigation } from './MobileNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export function AppLayout({ children, showNavigation = true }: AppLayoutProps) {
  const { currentView } = useSelector((state: RootState) => state.ui);

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Navigation */}
      {showNavigation && (
        <div className="hidden lg:flex">
          <Navigation />
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${showNavigation ? '' : 'lg:ml-0'}`}>
        <div className="lg:hidden h-16" /> {/* Spacer for mobile header */}
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      {showNavigation && <MobileNavigation />}
    </div>
  );
}