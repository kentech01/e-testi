import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { isDarkMode } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  return <>{children}</>;
}