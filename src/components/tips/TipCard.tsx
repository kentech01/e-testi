import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Clock, ChevronRight } from 'lucide-react';

interface Tip {
  id: number;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  excerpt: string;
  content: string;
  difficulty: string;
  timeToRead: string;
}

interface TipCardProps {
  tip: Tip;
  onClick: () => void;
}

export function TipCard({ tip, onClick }: TipCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'E lehtë':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'Mesatare':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'E vështirë':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const TipIcon = tip.icon;

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow" 
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <TipIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{tip.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{tip.excerpt}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getDifficultyColor(tip.difficulty)}>
              {tip.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
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
} 