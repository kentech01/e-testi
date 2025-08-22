import React from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2 } from 'lucide-react';
import { KOSOVO_SCHOOLS } from '../../constants/schools';

interface SchoolSelectionProps {
  selectedSchool: string;
  onSelectSchool: (school: string) => void;
  onComplete: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function SchoolSelection({ 
  selectedSchool, 
  onSelectSchool, 
  onComplete, 
  onBack, 
  isLoading 
}: SchoolSelectionProps) {
  const canComplete = selectedSchool.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3>Zgjidhni shkollën tuaj</h3>
        <p className="text-sm text-muted-foreground">
          Kjo do të na ndihmojë të krijojmë një eksperiencë të personalizuar
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="school">Shkolla</Label>
        <Select 
          value={selectedSchool} 
          onValueChange={onSelectSchool}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Zgjidhni shkollën tuaj" />
          </SelectTrigger>
          <SelectContent>
            {KOSOVO_SCHOOLS.map(school => (
              <SelectItem key={school} value={school}>
                {school}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          onClick={onComplete} 
          className="flex-1" 
          disabled={!canComplete || isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Krijo llogari
        </Button>
      </div>
    </div>
  );
}