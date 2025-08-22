import React from 'react';
import { Avatar, AvatarFallback } from '../../ui/avatar';

interface SettingsHeaderProps {
  userName: string;
}

export function SettingsHeader({ userName }: SettingsHeaderProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex items-center space-x-4 mb-8">
      <Avatar className="w-16 h-16">
        <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2>Cilësimet e llogarisë</h2>
        <p className="text-muted-foreground">Menaxhoni profilin dhe preferencat tuaja</p>
      </div>
    </div>
  );
} 