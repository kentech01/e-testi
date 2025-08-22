import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TipCard, TipDetail, SubjectTips, StudyResources } from '../components/tips';
import { Lightbulb, Clock, BookOpen, Brain, Target, Users } from 'lucide-react';

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
  }
];

const subjectTips = {
  matematik: [
    'Përdorni formulat e shpejta për llogaritje',
    'Vizualizoni problemet gjeometrike',
    'Praktikoni zgjidhjen e ekuacioneve',
    'Mësoni tabelat e shumëzimit përmendësh'
  ],
  gjuhaShqipe: [
    'Lexoni shumë tekste të ndryshme',
    'Praktikoni shkrimin e eseve',
    'Mësoni rregullat gramatikore',
    'Përmirësoni fjalorin tuaj'
  ],
  anglisht: [
    'Dëgjoni anglisht çdo ditë',
    'Lexoni artikuj në anglisht',
    'Praktikoni foljen me njerëz të tjerë',
    'Mësoni fjalët e reja çdo javë'
  ]
};

export function Tips() {
  const [selectedTip, setSelectedTip] = useState<typeof studyTips[0] | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Lightbulb className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Këshilla për studim</h1>
          <p className="text-muted-foreground mt-2">
            Teknika dhe strategji të provuara për të përmirësuar performancën tuaj
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Këshilla të përgjithshme</TabsTrigger>
          <TabsTrigger value="subjects">Këshilla për lëndët</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {!selectedTip ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyTips.map((tip) => (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  onClick={() => setSelectedTip(tip)}
                />
              ))}
            </div>
          ) : (
            <TipDetail
              tip={selectedTip}
              onBack={() => setSelectedTip(null)}
            />
          )}
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <SubjectTips subjectTips={subjectTips} />
          <StudyResources />
        </TabsContent>
      </Tabs>
    </div>
  );
}