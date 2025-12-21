import React from 'react';
import {
  SettingsHeader,
  ProfileSettings,
  NotificationSettings,
  PrivacySecurity,
  AccountStatus,
  DangerZone,
} from '../components/settings';

interface SettingsProps {
  user: {
    name: string;
    email: string;
    grade: string;
    school?: number | null;
    municipality?: number | null
  };
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateProfile: (grade: string, school: number, municipality: number) => void;
  onLogout: () => void;
}

export function Settings({
  user,
  darkMode,
  onToggleDarkMode,
  onUpdateProfile,
  onLogout,
}: SettingsProps) {
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);
  const [school, setSchool] = React.useState(user.school || 0);
  const [grade, setGrade] = React.useState(user.grade || '');
  const [municipality, setMunicipality] = React.useState(user.municipality || 0);
  const [notifications, setNotifications] = React.useState(true);
  const [autoSave, setAutoSave] = React.useState(true);
  const [sound, setSound] = React.useState(false);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  console.log(user);
  

  const handleSaveProfile = () => {
    onUpdateProfile(grade, school, municipality);
    console.log(grade, school, municipality);
    
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <SettingsHeader userName={user.name} />

      <ProfileSettings
        name={name}
        email={email}
        school={school}
        grade={grade}
        municipality={municipality}
        onMunicipalityChange={setMunicipality}
        onSchoolChange={setSchool}
        onGradeChange={setGrade} // TODO: Implement grade change
        onSave={handleSaveProfile}
      />

      {/* <NotificationSettings
        notifications={notifications}
        emailNotifications={emailNotifications}
        sound={sound}
        autoSave={autoSave}
        onNotificationsChange={setNotifications}
        onEmailNotificationsChange={setEmailNotifications}
        onSoundChange={setSound}
        onAutoSaveChange={setAutoSave}
      /> */}

      {/* <PrivacySecurity /> */}
      <AccountStatus />
      <DangerZone onLogout={onLogout} />
    </div>
  );
}
