import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  ClipboardList,
} from 'lucide-react';
import { useIsAdmin } from '../../utils/admin';
import useSectors from '@/hooks/useSectors';

interface NavigationProps {
  user: {
    name: string;
    grade: string;
  };
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  { id: 'tests', label: 'Testet', icon: FileText, path: '/tests' },
  // { id: 'results', label: 'Rezultatet', icon: BarChart3, path: '/results' },
  {
    id: 'test-management',
    label: 'Menaxhimi i Testeve',
    icon: ClipboardList,
    path: '/test-management',
  },
  { id: 'tips', label: 'Këshilla', icon: Lightbulb, path: '/tips' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export function Navigation({
  user,
  darkMode,
  onToggleDarkMode,
  onLogout,
}: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = useIsAdmin();
  const {sectors, ensureSectorsLoaded} = useSectors();

  // Filter menu items based on admin status
  useEffect(()=>{
    ensureSectorsLoaded();
  }, [])
  
  const visibleMenuItems = menuItems.filter((item) => {
    if (item.id === 'test-management') {
      return isAdmin;
    }
    return true;
  });
  

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3 justify-start">
          <div>
            <img src="./etesti-logo.svg" className='w-[105px] mb-2' alt="" />
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
                {sectors.find(item=>item.id == user.grade)?.displayName}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path === '/test-management' &&
              location.pathname.startsWith('/test-management'));

          return (
            <Button
              key={item.id}
              variant={isActive ? 'default' : 'ghost'}
              className={`w-full justify-start h-10 ${
                isActive
                  ? 'bg-primary !text-[#fff]'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  
              }${(darkMode && isActive) && '!text-black'}`}
              onClick={() => navigate(item.path)}
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
