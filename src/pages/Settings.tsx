import React from 'react';
import { 
  SettingsHeader, 
  ProfileSettings, 
  NotificationSettings, 
  PrivacySecurity, 
  AccountStatus, 
  DangerZone 
} from '../components/settings';

interface SettingsProps {
  user: {
    name: string;
    email: string;
    grade: string;
    school?: string;
  };
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateProfile: (name: string, email: string) => void;
  onLogout: () => void;
}

export function Settings({ user, darkMode, onToggleDarkMode, onUpdateProfile, onLogout }: SettingsProps) {
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);
  const [school, setSchool] = React.useState(user.school || '');
  const [notifications, setNotifications] = React.useState(true);
  const [autoSave, setAutoSave] = React.useState(true);
  const [sound, setSound] = React.useState(false);
  const [emailNotifications, setEmailNotifications] = React.useState(true);

  const handleSaveProfile = () => {
    onUpdateProfile(name, email);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <SettingsHeader userName={user.name} />
      
      <ProfileSettings
        name={name}
        email={email}
        school={school}
        grade={user.grade}
        onNameChange={setName}
        onEmailChange={setEmail}
        onSchoolChange={setSchool}
        onGradeChange={() => {}} // TODO: Implement grade change
        onSave={handleSaveProfile}
      />

      <NotificationSettings
        notifications={notifications}
        emailNotifications={emailNotifications}
        sound={sound}
        autoSave={autoSave}
        onNotificationsChange={setNotifications}
        onEmailNotificationsChange={setEmailNotifications}
        onSoundChange={setSound}
        onAutoSaveChange={setAutoSave}
      />

      <PrivacySecurity />
      <AccountStatus />
      <DangerZone onLogout={onLogout} />
    </div>
  );
}