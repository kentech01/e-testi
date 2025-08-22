import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Button } from '../../ui/button';
import { User, Mail, School, GraduationCap } from 'lucide-react';

interface ProfileSettingsProps {
  name: string;
  email: string;
  school: string;
  grade: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onSchoolChange: (school: string) => void;
  onGradeChange: (grade: string) => void;
  onSave: () => void;
}

const kosovoSchools = [
  'Liceu i Përgjithshëm "Sami Frashëri" - Prishtinë',
  'Liceu i Përgjithshëm "Hasan Prishtina" - Prishtinë',
  'Liceu Ekonomik - Prishtinë',
  'Liceu i Shkencave të Natyrës - Prishtinë',
  'Liceu i Përgjithshëm - Prizren',
  'Liceu i Përgjithshëm "Gjon Buzuku" - Prizren',
  'Liceu i Përgjithshëm - Pejë',
  'Liceu i Përgjithshëm - Gjakovë',
  'Liceu i Përgjithshëm - Ferizaj',
  'Liceu i Përgjithshëm - Gjilan',
  'Liceu i Përgjithshëm - Mitrovicë',
  'Liceu i Përgjithshëm - Vushtrri',
  'Liceu Teknik - Prishtinë',
  'Liceu Mjekësor - Prishtinë',
  'Tjetër...'
];

const grades = ['Klasa 9', 'Klasa 10', 'Klasa 11', 'Klasa 12'];

export function ProfileSettings({
  name,
  email,
  school,
  grade,
  onNameChange,
  onEmailChange,
  onSchoolChange,
  onGradeChange,
  onSave
}: ProfileSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Profili personal</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Emri i plotë</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Shkruani emrin tuaj"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email adresa</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="shkruani@email.com"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="grade">Klasa</Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Select value={grade} onValueChange={onGradeChange}>
                <SelectTrigger className="pl-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="school">Shkolla</Label>
            <div className="relative">
              <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Select value={school} onValueChange={onSchoolChange}>
                <SelectTrigger className="pl-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {kosovoSchools.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave}>Ruaj ndryshimet</Button>
        </div>
      </CardContent>
    </Card>
  );
} 