import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Bell } from 'lucide-react';

interface NotificationSettingsProps {
  notifications: boolean;
  emailNotifications: boolean;
  sound: boolean;
  autoSave: boolean;
  onNotificationsChange: (value: boolean) => void;
  onEmailNotificationsChange: (value: boolean) => void;
  onSoundChange: (value: boolean) => void;
  onAutoSaveChange: (value: boolean) => void;
}

export function NotificationSettings({
  notifications,
  emailNotifications,
  sound,
  autoSave,
  onNotificationsChange,
  onEmailNotificationsChange,
  onSoundChange,
  onAutoSaveChange
}: NotificationSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Njoftimet</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Njoftime në aplikacion</Label>
            <p className="text-sm text-muted-foreground">
              Merrni njoftime për teste të reja, përditësime dhe arritje
            </p>
          </div>
          <Switch 
            checked={notifications} 
            onCheckedChange={onNotificationsChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Njoftime me email</Label>
            <p className="text-sm text-muted-foreground">
              Merrni email për njoftime të rëndësishme dhe përmbledhje javore
            </p>
          </div>
          <Switch 
            checked={emailNotifications} 
            onCheckedChange={onEmailNotificationsChange}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Efektet zanore</Label>
            <p className="text-sm text-muted-foreground">
              Luani zëra për veprime dhe njoftime në aplikacion
            </p>
          </div>
          <Switch 
            checked={sound} 
            onCheckedChange={onSoundChange}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Ruajtja automatike</Label>
            <p className="text-sm text-muted-foreground">
              Ruaj automatikisht përgjigjet gjatë testeve për siguri ekstra
            </p>
          </div>
          <Switch 
            checked={autoSave} 
            onCheckedChange={onAutoSaveChange}
          />
        </div>
      </CardContent>
    </Card>
  );
} 