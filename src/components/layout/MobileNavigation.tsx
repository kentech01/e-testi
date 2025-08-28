import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../ui/button';

interface MobileNavigationProps {
  isExamMode?: boolean;
}

export function MobileNavigation({
  isExamMode = false,
}: MobileNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  if (isExamMode) {
    return null;
  }

  const items = [
    { id: 'dashboard', path: '/dashboard', label: 'Kreu', icon: '🏠' },
    { id: 'tests', path: '/tests', label: 'Testet', icon: '📝' },
    { id: 'results', path: '/results', label: 'Rezultatet', icon: '📊' },
    { id: 'tips', path: '/tips', label: 'Këshilla', icon: '💡' },
    { id: 'settings', path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => (
          <Button
            key={item.id}
            variant={location.pathname === item.path ? 'default' : 'ghost'}
            size="sm"
            className="flex flex-col h-auto py-2 px-1"
            onClick={() => navigate(item.path)}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
