import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BookOpen, Calculator, Globe, ChevronRight, Clock, FileText } from 'lucide-react';

interface SubjectSelectionProps {
  onSelectSubject: (subject: 'matematik' | 'gjuhaShqipe' | 'anglisht') => void;
  onBack: () => void;
}

const subjects = [
  {
    id: 'matematik' as const,
    name: 'Matematika',
    nameEn: 'Mathematics',
    description: 'Algebra, gjeometri, analizë dhe statistikë',
    descriptionEn: 'Algebra, geometry, analysis and statistics',
    icon: Calculator,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    questions: 100,
    duration: '120 min',
    difficulty: 'E vështirë'
  },
  {
    id: 'gjuhaShqipe' as const,
    name: 'Gjuha Shqipe',
    nameEn: 'Albanian Language',
    description: 'Gjuhësi, letërsi dhe analiza e teksteve',
    descriptionEn: 'Linguistics, literature and text analysis',
    icon: BookOpen,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    iconColor: 'text-green-600 dark:text-green-400',
    questions: 100,
    duration: '120 min',
    difficulty: 'Mesatare'
  },
  {
    id: 'anglisht' as const,
    name: 'Gjuha Angleze',
    nameEn: 'English Language',
    description: 'Gramatikë, vocabular dhe kuptim i leximit',
    descriptionEn: 'Grammar, vocabulary and reading comprehension',
    icon: Globe,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    iconColor: 'text-purple-600 dark:text-purple-400',
    questions: 100,
    duration: '120 min',
    difficulty: 'Mesatare'
  }
];

export function SubjectSelection({ onSelectSubject, onBack }: SubjectSelectionProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Kthehu
            </Button>
            <div>
              <h1>Zgjidhni lëndën</h1>
              <p className="text-sm text-muted-foreground">Përzgjidhni lëndën për të filluar testin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Instructions */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Udhëzime për testin</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Çdo test përmban 100 pyetje me zgjedhje të shumëfishta</li>
                  <li>• Koha e disponueshme është 120 minuta</li>
                  <li>• 10 pyetje shfaqen në çdo faqe</li>
                  <li>• Mund të navigoni lirshëm midis faqeve</li>
                  <li>• Përgjigjet ruhen automatikisht</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <Card 
                key={subject.id}
                className={`hover:shadow-lg transition-all cursor-pointer group ${subject.bgColor} ${subject.borderColor}`}
                onClick={() => onSelectSubject(subject.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 bg-gradient-to-br ${subject.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {subject.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <CardTitle className="mb-2">{subject.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-1">{subject.nameEn}</p>
                    <p className="text-sm">{subject.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>{subject.questions} pyetje</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{subject.duration}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full group-hover:bg-primary/90 transition-colors"
                    size="sm"
                  >
                    Fillo testin
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Format i testit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Lloji i pyetjeve:</span>
                <span className="font-medium">Zgjedhje të shumëfishta</span>
              </div>
              <div className="flex justify-between">
                <span>Numri i opsioneve:</span>
                <span className="font-medium">4 (A, B, C, D)</span>
              </div>
              <div className="flex justify-between">
                <span>Pyetje për faqe:</span>
                <span className="font-medium">10</span>
              </div>
              <div className="flex justify-between">
                <span>Ruajtja automatike:</span>
                <span className="font-medium text-green-600">✓ Aktive</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sistemi i pikëzimit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Përgjigje e saktë:</span>
                <span className="font-medium text-green-600">+1 pikë</span>
              </div>
              <div className="flex justify-between">
                <span>Përgjigje e gabuar:</span>
                <span className="font-medium text-red-600">0 pikë</span>
              </div>
              <div className="flex justify-between">
                <span>Pa përgjigje:</span>
                <span className="font-medium text-yellow-600">0 pikë</span>
              </div>
              <div className="flex justify-between">
                <span>Maksimumi:</span>
                <span className="font-medium">100 pikë</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}