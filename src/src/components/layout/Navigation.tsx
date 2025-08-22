import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setCurrentView, toggleDarkMode } from '../../store/uiSlice';
import { logoutUser } from '../../store/authSlice';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { 
  GraduationCap, 
  Home, 
  BookOpen, 
  BarChart3, 
  Lightbulb, 
  Settings, 
  LogOut,
  Sun,
  Moon
} from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', label: 'Kreu', icon: Home },
  { id: 'tests', label: 'Testet', icon: BookOpen },
  { id: 'test-results', label: 'Rezultatet', icon: BarChart3 },
  { id: 'tips', label: 'Këshilla', icon: Lightbulb },
  { id: 'settings', label: 'Cilësimet', icon: Settings },
];

export function Navigation() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentView, isDarkMode } = useSelector((state: RootState) => state.ui);

  const handleViewChange = (view: string) => {
    dispatch(setCurrentView(view as any));
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl">E-test</h1>
            <p className="text-xs text-muted-foreground">Përgatitja për maturë</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user && getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground">Klasa {user?.grade}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleViewChange(item.id)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleToggleDarkMode}
        >
          {isDarkMode ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />}
          {isDarkMode ? 'Drita' : 'Errësia'}
        </Button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Dil nga llogaria
        </Button>
      </div>
    </div>
  );
}