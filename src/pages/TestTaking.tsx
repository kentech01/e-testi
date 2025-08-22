import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Clock, ArrowLeft, ArrowRight, Flag } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
}

interface TestTakingProps {
  testId: number;
  onComplete: (answers: number[]) => void;
  onExit: () => void;
}

// Mock questions for the test
const mockQuestions: Question[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  question: `Pyetja ${i + 1}: Cila nga alternativat e mëposhtme është e saktë?`,
  options: [
    `Alternativa A për pyetjen ${i + 1}`,
    `Alternativa B për pyetjen ${i + 1}`,
    `Alternativa C për pyetjen ${i + 1}`,
    `Alternativa D për pyetjen ${i + 1}`,
  ],
  correctAnswer: Math.floor(Math.random() * 4),
  subject: 'Matematika'
}));

export function TestTaking({ testId, onComplete, onExit }: TestTakingProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(100).fill(-1));
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < 99) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(currentQuestion)) {
      newFlagged.delete(currentQuestion);
    } else {
      newFlagged.add(currentQuestion);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  const answeredCount = answers.filter(answer => answer !== -1).length;
  const progress = (answeredCount / 100) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onExit}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Dil nga testi
            </Button>
            <h1>Test {testId}</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4" />
              <span className={timeLeft < 600 ? 'text-red-500' : ''}>{formatTime(timeLeft)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {answeredCount}/100 përgjigjur
            </div>
            <Button onClick={() => setShowSubmitConfirm(true)} size="sm">
              Dërgo testin
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Area */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pyetja {currentQuestion + 1} nga 100</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleFlag}
                  className={flaggedQuestions.has(currentQuestion) ? 'text-yellow-500' : ''}
                >
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
              <Progress value={((currentQuestion + 1) / 100) * 100} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg">
                {mockQuestions[currentQuestion].question}
              </div>

              <RadioGroup 
                value={answers[currentQuestion].toString()} 
                onValueChange={handleAnswerChange}
                className="space-y-4"
              >
                {mockQuestions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {String.fromCharCode(65 + index)}. {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  E mëparshme
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={currentQuestion === 99}
                >
                  E radhës
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Navigimi i pyetjeve</CardTitle>
              <div className="text-sm text-muted-foreground">
                Progresi: {progress.toFixed(1)}%
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 100 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestion(i)}
                    className={`
                      w-8 h-8 text-xs rounded border transition-colors
                      ${currentQuestion === i 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : answers[i] !== -1 
                          ? 'bg-green-100 text-green-800 border-green-300' 
                          : flaggedQuestions.has(i)
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                            : 'bg-muted hover:bg-muted/80 border-muted'
                      }
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span>Aktuale</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span>E përgjigjur</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span>E shënuar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-muted border border-muted rounded"></div>
                  <span>Pa përgjigje</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3>Konfirmo dërgimin</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Përgjigje të dhëna: {answeredCount}/100</p>
                  <p>Kohë e mbetur: {formatTime(timeLeft)}</p>
                  <p>Pyetje të shënuara: {flaggedQuestions.size}</p>
                </div>
                <p className="text-sm">A jeni të sigurt që doni të dërgoni testin? Ky veprim nuk mund të zhbëhet.</p>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowSubmitConfirm(false)} className="flex-1">
                    Anulo
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1">
                    Dërgo testin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}