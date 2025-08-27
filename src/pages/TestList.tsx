import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  CheckCircle2,
  FileText,
  Clock,
  Play,
  Plus,
  BookOpen,
  Calculator,
  Globe,
} from 'lucide-react';

interface Test {
  id: number;
  title: string;
  completed: boolean;
  score?: number;
  timeSpent?: string;
  subject: 'matematik' | 'gjuhaShqipe' | 'anglisht';
}

interface TestListProps {
  onStartTest: (testId: number) => void;
  onViewResults: (testId: number) => void;
  onStartNewExam: () => void;
}

const mockTests: Test[] = [
  {
    id: 1,
    title: 'Test 1',
    completed: true,
    score: 85,
    timeSpent: '45 min',
    subject: 'matematik',
  },
  {
    id: 2,
    title: 'Test 2',
    completed: true,
    score: 78,
    timeSpent: '52 min',
    subject: 'matematik',
  },
  {
    id: 3,
    title: 'Test 3',
    completed: true,
    score: 92,
    timeSpent: '38 min',
    subject: 'gjuhaShqipe',
  },
  {
    id: 4,
    title: 'Test 4',
    completed: true,
    score: 75,
    timeSpent: '48 min',
    subject: 'anglisht',
  },
  { id: 5, title: 'Test 5', completed: false, subject: 'matematik' },
  {
    id: 6,
    title: 'Test 6',
    completed: true,
    score: 88,
    timeSpent: '42 min',
    subject: 'gjuhaShqipe',
  },
  {
    id: 7,
    title: 'Test 7',
    completed: true,
    score: 91,
    timeSpent: '40 min',
    subject: 'anglisht',
  },
  {
    id: 8,
    title: 'Test 8',
    completed: true,
    score: 82,
    timeSpent: '46 min',
    subject: 'matematik',
  },
  {
    id: 9,
    title: 'Test 9',
    completed: true,
    score: 79,
    timeSpent: '50 min',
    subject: 'gjuhaShqipe',
  },
  {
    id: 10,
    title: 'Test 10',
    completed: true,
    score: 86,
    timeSpent: '44 min',
    subject: 'anglisht',
  },
  { id: 11, title: 'Test 11', completed: false, subject: 'matematik' },
  { id: 12, title: 'Test 12', completed: false, subject: 'gjuhaShqipe' },
  { id: 13, title: 'Test 13', completed: false, subject: 'anglisht' },
  { id: 14, title: 'Test 14', completed: false, subject: 'matematik' },
  { id: 15, title: 'Test 15', completed: false, subject: 'gjuhaShqipe' },
  { id: 16, title: 'Test 16', completed: false, subject: 'anglisht' },
];

const subjectInfo = {
  matematik: { name: 'Matematika', icon: Calculator, color: 'text-blue-600' },
  gjuhaShqipe: {
    name: 'Gjuha Shqipe',
    icon: BookOpen,
    color: 'text-green-600',
  },
  anglisht: { name: 'Gjuha Angleze', icon: Globe, color: 'text-purple-600' },
};

export function TestList({
  onStartTest,
  onViewResults,
  onStartNewExam,
}: TestListProps) {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const getSubjectIcon = (
    subject: 'matematik' | 'gjuhaShqipe' | 'anglisht'
  ) => {
    const Icon = subjectInfo[subject].icon;
    return <Icon className={`w-4 h-4 ${subjectInfo[subject].color}`} />;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2>Testet</h2>
        <p className="text-muted-foreground">
          Zgjidhni një test për të filluar ose për të parë rezultatet
        </p>
      </div>

      {/* Start New Exam Section */}
      <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Fillo test të ri</h3>
              <p className="text-blue-100 mb-4">
                Zgjidhni lëndën dhe filloni një test të përshtatur për nivelin
                tuaj
              </p>
              <div className="flex items-center space-x-4 text-sm text-blue-100">
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>100 pyetje</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>120 minuta</span>
                </div>
              </div>
            </div>
            {/* <Button
              onClick={onStartNewExam}
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Fillo test
            </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* Subject Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(subjectInfo).map(([subject, info]) => {
          const subjectTests = mockTests.filter(
            (test) => test.subject === subject
          );
          const completedTests = subjectTests.filter((test) => test.completed);
          const averageScore =
            completedTests.length > 0
              ? Math.round(
                  completedTests.reduce(
                    (sum, test) => sum + (test.score || 0),
                    0
                  ) / completedTests.length
                )
              : 0;

          const Icon = info.icon;

          return (
            <Card key={subject}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${info.color}`} />
                  </div>
                  <div>
                    <h4 className="font-medium">{info.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {completedTests.length}/{subjectTests.length} të
                      përfunduara
                    </p>
                  </div>
                </div>
                {completedTests.length > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">
                      {averageScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Mesatarja
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tests Grid */}
      <div>
        <h3 className="font-semibold mb-4">Të gjitha testet</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mockTests.map((test) => (
            <Card
              key={test.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                test.completed
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'
              } ${selectedTest?.id === test.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedTest(test)}
            >
              <CardContent className="p-4 flex flex-col items-center space-y-3">
                <div className="flex items-center justify-center w-8 h-8 rounded bg-slate-700 text-white">
                  {test.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{test.title}</p>
                  {test.completed && test.score && (
                    <p className="text-xs text-muted-foreground">
                      {test.score}%
                    </p>
                  )}
                </div>
                {/* <div className="flex items-center justify-center">
                  {getSubjectIcon(test.subject)}
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Test Details Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-slate-900 text-white mx-auto">
                  <FileText className="w-8 h-8" />
                </div>

                <div>
                  <h3>{selectedTest.title}</h3>
                  {/* <div className="flex items-center justify-center space-x-2 mt-2">
                    {getSubjectIcon(selectedTest.subject)}
                    <span className="text-sm text-muted-foreground">
                      {subjectInfo[selectedTest.subject].name}
                    </span>
                  </div> */}
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedTest.completed
                      ? `Test i përfunduar me rezultat ${selectedTest.score}%`
                      : 'Test që përmban 100 pyetje për përgatitjen e maturës'}
                  </p>
                </div>

                {selectedTest.completed && (
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedTest.timeSpent}</span>
                    </div>
                    <Badge variant="secondary">{selectedTest.score}%</Badge>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTest(null)}
                    className="flex-1"
                  >
                    Mbyll
                  </Button>
                  {selectedTest.completed ? (
                    <Button
                      onClick={() => {
                        onViewResults(selectedTest.id);
                        setSelectedTest(null);
                      }}
                      className="flex-1"
                    >
                      Shiko rezultatet
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        onStartTest(selectedTest.id);
                        setSelectedTest(null);
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Let's go!
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
