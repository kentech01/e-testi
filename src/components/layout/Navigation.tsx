import React from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  Lightbulb,
  LogOut,
  User,
  Moon,
  Sun,
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  user: {
    name: string;
    grade: string;
  };
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tests', label: 'Testet', icon: FileText },
  // { id: 'results', label: 'Rezultatet', icon: BarChart3 },
  { id: 'tips', label: 'Këshilla', icon: Lightbulb },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Navigation({
  currentView,
  onViewChange,
  user,
  darkMode,
  onToggleDarkMode,
  onLogout,
}: NavigationProps) {
  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            E
          </div>
          <div>
            <h2 className="font-medium text-sidebar-foreground">E-testi</h2>
            <p className="text-xs text-sidebar-foreground/70">
              Përgatitja për maturë
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center text-sidebar-primary-foreground text-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.name}
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                Klasa {user.grade}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <Button
              key={item.id}
              variant={isActive ? 'default' : 'ghost'}
              className={`w-full justify-start h-10 ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDarkMode}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 mr-3" />
          ) : (
            <Moon className="w-4 h-4 mr-3" />
          )}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Dil
        </Button>
      </div>
    </div>
  );
}
