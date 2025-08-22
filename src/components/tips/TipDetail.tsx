import React from 'react';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

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

interface TipDetailProps {
  tip: Tip;
  onBack: () => void;
}

export function TipDetail({ tip, onBack }: TipDetailProps) {
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} size="sm">
            ← Kthehu
          </Button>
          <Badge variant="outline" className={getDifficultyColor(tip.difficulty)}>
            {tip.difficulty}
          </Badge>
        </div>
        <div className="flex items-center space-x-3">
          <TipIcon className="w-8 h-8 text-primary" />
          <div>
            <h2>{tip.title}</h2>
            <p className="text-sm text-muted-foreground">{tip.timeToRead} lexim</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          {tip.content.split('\n').map((line, index) => (
            <p key={index} className="mb-2">
              {line.trim()}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 