import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setCurrentView } from '../../store/uiSlice';
import { Button } from '../ui/button';

const navigationItems = [
  { id: 'dashboard', label: 'Kreu', icon: '🏠' },
  { id: 'tests', label: 'Testet', icon: '📝' },
  { id: 'test-results', label: 'Rezultatet', icon: '📊' },
  { id: 'tips', label: 'Këshilla', icon: '💡' },
  { id: 'settings', label: 'Cilësimet', icon: '⚙️' }
];

export function MobileNavigation() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentView } = useSelector((state: RootState) => state.ui);

  const handleViewChange = (view: string) => {
    dispatch(setCurrentView(view as any));
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2">
      <div className="grid grid-cols-5 gap-1">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? 'default' : 'ghost'}
            size="sm"
            className="flex flex-col h-auto py-2 px-1"
            onClick={() => handleViewChange(item.id)}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}