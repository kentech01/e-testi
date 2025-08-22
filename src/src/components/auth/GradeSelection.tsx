import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { GraduationCap } from 'lucide-react';

interface GradeSelectionProps {
  selectedGrade: string;
  onSelectGrade: (grade: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function GradeSelection({ 
  selectedGrade, 
  onSelectGrade, 
  onNext, 
  onBack, 
  isLoading 
}: GradeSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3>Zgjidhni klasën tuaj</h3>
        <p className="text-sm text-muted-foreground">
          Kjo do të na ndihmojë të personalizojmë përmbajtjen për ju
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedGrade === '9' ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}
          onClick={() => onSelectGrade('9')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <h4>Klasa 9</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Përgatitje për vitin e ardhshëm
            </p>
            <Badge variant="secondary" className="mt-2">
              Bazë
            </Badge>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedGrade === '12' ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}
          onClick={() => onSelectGrade('12')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <h4>Klasa 12</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Përgatitje për maturë
            </p>
            <Badge variant="secondary" className="mt-2">
              Avancuar
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex-1"
          disabled={isLoading}
        >
          Mbrapa
        </Button>
        <Button 
          onClick={onNext} 
          className="flex-1" 
          disabled={!selectedGrade || isLoading}
        >
          Vazhdo
        </Button>
      </div>
    </div>
  );
}