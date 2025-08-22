import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Moon, Sun, User, Bell, Shield, Trash2, Download, School, GraduationCap, Mail } from 'lucide-react';

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2>Cilësimet e llogarisë</h2>
          <p className="text-muted-foreground">Menaxhoni profilin dhe preferencat tuaja</p>
        </div>
      </div>

      {/* Profile Settings */}
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
                  onChange={(e) => setName(e.target.value)}
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Shkruani email-in tuaj"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grade">Klasa që ndiqni</Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
              <Select value={user.grade} disabled>
                <SelectTrigger className="pl-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9">Klasa 9 (Testi përgatitor)</SelectItem>
                  <SelectItem value="12">Klasa 12 (Matura)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Për të ndryshuar klasën, kontaktoni administratorin
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="school">Shkolla juaj</Label>
            <div className="relative">
              <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
              <Select value={school} onValueChange={setSchool}>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Zgjidhni shkollën tuaj" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {kosovoSchools.map((schoolOption) => (
                    <SelectItem key={schoolOption} value={schoolOption}>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{schoolOption}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Shkolla përdoret për statistika dhe grupime lokale
            </p>
          </div>

          <Button onClick={handleSaveProfile} className="w-full md:w-auto">
            Ruaj ndryshimet
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span>Pamja dhe gjuha</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Modaliteti i errët</Label>
              <p className="text-sm text-muted-foreground">
                Aktivizo temën e errët për një përvojë më të rehatshme në sy
              </p>
            </div>
            <Switch 
              checked={darkMode} 
              onCheckedChange={onToggleDarkMode}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="language">Gjuha e ndërfaqes</Label>
            <Select defaultValue="sq">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sq">🇦🇱 Shqip</SelectItem>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="sr">🇷🇸 Српски</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Zona kohore</Label>
            <Select defaultValue="cet">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cet">CET (Evropa Qendrore)</SelectItem>
                <SelectItem value="eet">EET (Evropa Lindore)</SelectItem>
                <SelectItem value="wet">WET (Evropa Perëndimore)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
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
              onCheckedChange={setNotifications}
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
              onCheckedChange={setEmailNotifications}
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
              onCheckedChange={setSound}
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
              onCheckedChange={setAutoSave}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Siguria dhe privatësia</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium">Shkarko të dhënat</div>
                  <div className="text-xs text-muted-foreground">Eksporto të gjitha të dhënat tuaja</div>
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium">Ndrysho fjalëkalimin</div>
                  <div className="text-xs text-muted-foreground">Përditëso fjalëkalimin tuaj</div>
                </div>
              </div>
            </Button>
          </div>
          
          <Button variant="outline" className="w-full justify-start h-auto p-4">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <div className="font-medium">Historia e veprimtarive</div>
                <div className="text-xs text-muted-foreground">Shiko hyrjet dhe veprimet e kohëve të fundit</div>
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Statusi i llogarisë</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Badge className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-green-800 dark:text-green-200">Llogari aktive</div>
                <div className="text-sm text-green-600 dark:text-green-300">Ju keni qasje të plotë në të gjitha funkcionalitetet</div>
              </div>
            </div>
            <Badge className="bg-green-500 text-white">
              Premium
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            <span>Zona e rrezikshme</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <h4 className="font-medium text-destructive mb-2">Fshi llogarinë</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Ky veprim nuk mund të zhbëhet. Të gjitha të dhënat tuaja, përfshirë rezultatet e testeve dhe progresin, do të fshihen përfundimisht.
            </p>
            <Button variant="destructive" size="sm">
              Fshi llogarinë
            </Button>
          </div>
          
          <Separator />
          
          <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-muted-foreground hover:text-foreground">
            Dil nga llogaria
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}