import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import { Clock, ArrowLeft } from 'lucide-react';

interface ExamHeaderProps {
  subject: string;
  subjectIcon: React.ComponentType<{ className?: string }>;
  timeLeft: number;
  progress: number;
  answeredCount: number;
  onExit: () => void;
  formatTime: (seconds: number) => string;
}

export function ExamHeader({ 
  subject, 
  subjectIcon: SubjectIcon, 
  timeLeft, 
  progress, 
  answeredCount, 
  onExit, 
  formatTime 
}: ExamHeaderProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <SubjectIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Testi i {subject}</h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Kohë e mbetur: {formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Progresi</div>
              <div className="text-2xl font-bold">{answeredCount}/100</div>
            </div>
            <div className="w-32">
              <Progress value={progress} className="h-2" />
            </div>
            <Button variant="outline" onClick={onExit} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Dil</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 