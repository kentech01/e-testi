import React from 'react';
import { Card, CardContent } from '../ui/card';
import { BookOpen } from 'lucide-react';

interface SubjectCardProps {
  subject: {
    name: string;
    count: number;
    color: string;
  };
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className={`w-12 h-12 ${subject.color} rounded-xl mx-auto mb-4 flex items-center justify-center`}>
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-semibold text-lg mb-2">{subject.name}</h3>
        <p className="text-2xl font-bold text-primary mb-1">{subject.count}</p>
        <p className="text-sm text-muted-foreground">teste të disponueshme</p>
      </CardContent>
    </Card>
  );
}