import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { toggleDarkMode } from '../../store/uiSlice';
import { Button } from '../ui/button';
import { GraduationCap, Sun, Moon } from 'lucide-react';

export function MobileHeader() {
  const dispatch = useDispatch<AppDispatch>();
  const { isDarkMode } = useSelector((state: RootState) => state.ui);

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-background border-b border-border z-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-bold">E-test</h1>
        </div>
        <Button size="sm" variant="outline" onClick={handleToggleDarkMode}>
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}