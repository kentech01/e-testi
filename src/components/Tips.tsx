import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Lightbulb, Clock, BookOpen, Brain, Target, Users, ChevronRight, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const studyTips = [
  {
    id: 1,
    category: 'study',
    icon: BookOpen,
    title: 'Planifikimi i studimit',
    excerpt: 'Si të organizoni kohën tuaj për studim efikas',
    content: `
      Një plan studimi të strukturuar është çelësi i suksesit në maturë. Ja disa hapa:
      
      • Krijoni një orar javor që përfshin të gjitha lëndët
      • Ndani sesionet e studimit në blloqe 45-50 minutëshe
      • Bëni pushime 10-15 minutëshe midis sesioneve
      • Përsëritni materialet e mësuara çdo javë
      • Planifikoni kohë për teste praktike
    `,
    difficulty: 'E lehtë',
    timeToRead: '3 min'
  },
  {
    id: 2,
    category: 'exam',
    icon: Target,
    title: 'Strategjitë e testimit',
    excerpt: 'Teknika për të përballuar testet me sukses',
    content: `
      Strategjitë e duhura mund të përmirësojnë rezultatet tuaja:
      
      • Lexoni të gjitha pyetjet para se të filloni
      • Filloni me pyetjet që i dini më mirë
      • Menaxhoni kohën - 1.2 minuta për pyetje
      • Mos e humbisni kohën në pyetjet e vështira
      • Kontrolloni përgjigjjet në fund
      • Mos ndryshoni përgjigjjen nëse nuk jeni të sigurt
    `,
    difficulty: 'Mesatare',
    timeToRead: '4 min'
  },
  {
    id: 3,
    category: 'mental',
    icon: Brain,
    title: 'Menaxhimi i stresit',
    excerpt: 'Si të qëndroni të qetë gjatë periudhës së maturës',
    content: `
      Stresi mund të ndikojë negativisht në performancë:
      
      • Praktikoni teknika frymëmarrjeje të thella
      • Bëni ushtrime fizike të rregullta
      • Sigurohuni që të fjeni 7-8 orë çdo natë
      • Hani ushqim të shëndetshëm
      • Flisni me miqtë dhe familjen për mbështetje
      • Shmangni kafenë e tepërt para testeve
    `,
    difficulty: 'E lehtë',
    timeToRead: '5 min'
  },
  {
    id: 4,
    category: 'study',
    icon: Clock,
    title: 'Teknikat e memorizimit',
    excerpt: 'Metoda efektive për të mbajtur mend informacionin',
    content: `
      Përmirësoni aftësinë tuaj të memorizimit:
      
      • Përdorni teknikën e përsëritjes me interval
      • Krijoni shkurtime dhe akronime
      • Vizualizoni informacionin
      • Lidhni informacione të reja me ato që dini
      • Mësoni në grupe të vogla informacioni
      • Përdorni karta studimi (flashcards)
    `,
    difficulty: 'Mesatare',
    timeToRead: '4 min'
  },
  {
    id: 5,
    category: 'exam',
    icon: Users,
    title: 'Ditën e testimit',
    excerpt: 'Çfarë të bëni ditën e maturës për sukses maksimal',
    content: `
      Përgatituni mirë për ditën e rëndësishme:
      
      • Zgjohuni në kohë të rregullt
      • Hani një mëngjes të shëndetshëm
      • Mbërrini në qendër 30 minuta para fillimit
      • Sillni të gjitha materialet e nevojshme
      • Lexoni udhëzimet me kujdes
      • Qëndroni të qetë dhe të fokusuar
      • Besoni në përgatitjen tuaj
    `,
    difficulty: 'E lehtë',
    timeToRead: '3 min'
  },
  {
    id: 6,
    category: 'mental',
    icon: Lightbulb,
    title: 'Motivimi dhe qëndrueshmëria',
    excerpt: 'Si të mbeteni të motivuar gjatë procesit të përgatitjes',
    content: `
      Ruani motivimin e lartë gjatë gjithë procesit:
      
      • Vendosni objektiva afatshkurtra dhe afatgjata
      • Shpërbleni veten për arritjet
      • Kujtoni pse është e rëndësishme të jeni të suksesshëm
      • Rrethohuni me njerëz pozitivë
      • Përqendrohuni në progresin, jo në perfeksionin
      • Pranoni që do të ketë ditë të vështira
    `,
    difficulty: 'E lehtë',
    timeToRead: '4 min'
  }
];

const subjectTips = {
  matematik: [
    'Praktikoni llogaritjet pa kalulator çdo ditë',
    'Mësoni formulat themelore përmendsh',
    'Zgjidhni probleme të ndryshme për çdo temë',
    'Kontrolloni gjithmonë rezultatin tuaj',
    'Visualizoni problemet gjeometrike'
  ],
  gjuhaShqipe: [
    'Lexoni tekste të ndryshme çdo ditë',
    'Praktikoni shkrimimin e ese-ve',
    'Mësoni rregullat e pikëzimit',
    'Shtoni vocabularin tuaj',
    'Analizoni tekste letrare klasike'
  ],
  anglisht: [
    'Dëgjoni audio në anglisht çdo ditë',
    'Praktikoni të folurat me miq',
    'Lexoni artikuj në lajme anglishe',
    'Mësoni fjalë të reja çdo javë',
    'Praktikoni gramatikën me ushtrime'
  ]
};

export function Tips() {
  const [selectedTip, setSelectedTip] = useState<typeof studyTips[0] | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'study': return BookOpen;
      case 'exam': return Target;
      case 'mental': return Brain;
      default: return Lightbulb;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'E lehtë': return 'bg-green-100 text-green-800';
      case 'Mesatare': return 'bg-yellow-100 text-yellow-800';
      case 'E vështirë': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2>Këshilla për sukses</h2>
        <p className="text-muted-foreground">Udhëzime dhe strategji për përgatitjen e maturës</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Këshilla të përgjithshme</TabsTrigger>
          <TabsTrigger value="subjects">Sipas lëndëve</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {!selectedTip ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studyTips.map((tip) => {
                const Icon = tip.icon;
                return (
                  <Card 
                    key={tip.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedTip(tip)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Icon className="w-6 h-6 text-primary" />
                        <Badge variant="outline" className={getDifficultyColor(tip.difficulty)}>
                          {tip.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h3 className="font-medium">{tip.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{tip.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{tip.timeToRead}</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setSelectedTip(null)} size="sm">
                    ← Kthehu
                  </Button>
                  <Badge variant="outline" className={getDifficultyColor(selectedTip.difficulty)}>
                    {selectedTip.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <selectedTip.icon className="w-8 h-8 text-primary" />
                  <div>
                    <h2>{selectedTip.title}</h2>
                    <p className="text-sm text-muted-foreground">{selectedTip.timeToRead} lexim</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {selectedTip.content.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">
                      {line.trim()}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(subjectTips).map(([subject, tips]) => (
              <Card key={subject}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>
                      {subject === 'matematik' && 'Matematika'}
                      {subject === 'gjuhaShqipe' && 'Gjuha Shqipe'}
                      {subject === 'anglisht' && 'Anglisht'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Subject Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Resurse të dobishme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <BookOpen className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Libra mësimi</div>
                    <div className="text-xs text-muted-foreground">Lista e librave të rekomanduara</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <Users className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Grupe studimi</div>
                    <div className="text-xs text-muted-foreground">Gjej partnerë për studim</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <Target className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Teste shtesë</div>
                    <div className="text-xs text-muted-foreground">Materiale praktike</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}