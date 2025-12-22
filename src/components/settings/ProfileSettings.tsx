import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Button } from '../../ui/button';
import { User, Mail, School, GraduationCap } from 'lucide-react';
import useSectors from '@/hooks/useSectors';

interface ProfileSettingsProps {
  name: string;
  email: string;
  school: number | null;
  grade: string;
  municipality: number | null;
  onMunicipalityChange: (municipality: number) => void;
  onSchoolChange: (school: number) => void;
  onGradeChange: (grade: string) => void;
  onSave: () => void;
}
interface School {
  nameAlbanian: string;
  nameEnglish: string;
  nameSerbian: string;
  idTeacherLicenseMunicipality: number;
  id: number;
}
export interface Municipality {
  id: number;
  nameAlbanian: string;
  nameEnglish: string;
  nameSerbian: string;
}
export function ProfileSettings({
  name,
  email,
  school,
  grade,
  municipality,
  onMunicipalityChange,
  onSchoolChange,
  onGradeChange,
  onSave,
}: ProfileSettingsProps) {
  const [kosovoSchools, setKosovoSchools] = useState<School[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<School[]>([]);
  const [kosovoCities, setKosovoCities] = useState<Municipality[]>([]);
  const {sectors, ensureSectorsLoaded} = useSectors();
  useEffect(() => {
    ensureSectorsLoaded();
    fetch('/schools.json')
      .then((res) => res.json())
      .then((data) => {
        setSelectedSchools(data.teacherLicenseInstitution)
        setKosovoSchools(data.teacherLicenseInstitution);
      })
      .catch((err) => console.log(err));
    fetch('/cities.json')
      .then((res) => res.json())
      .then((data) => {
        setKosovoCities(data.teacherLicenseMunicipality);
      })
      .catch((err) => console.log(err));
  }, []);
  const onMunicipalityChangeInside= (value: number)=>{
    onMunicipalityChange(value);
    const filtered=kosovoSchools.filter((item:School) => item.idTeacherLicenseMunicipality == value);
    setSelectedSchools(filtered);
    if(filtered.length > 0){
      
      onSchoolChange(filtered[0]!.id)
    }
  }
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
                placeholder="Shkruani emrin tuaj"
                className="pl-10"
                disabled
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
                placeholder="shkruani@email.com"
                className="pl-10"
                disabled
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
                  {sectors?.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="school">Komuna</Label>
            <div className="relative">
              <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Select value={municipality} onValueChange={onMunicipalityChangeInside}>
                <SelectTrigger className="pl-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {kosovoCities.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nameAlbanian}
                    </SelectItem>
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
                  {selectedSchools.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nameAlbanian}
                    </SelectItem>
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
