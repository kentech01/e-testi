import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Star } from 'lucide-react';

interface SubjectTipsProps {
  subjectTips: {
    [key: string]: string[];
  };
}

export function SubjectTips({ subjectTips }: SubjectTipsProps) {
  const getSubjectName = (subject: string) => {
    switch (subject) {
      case 'matematik':
        return 'Matematika';
      case 'gjuhaShqipe':
        return 'Gjuha Shqipe';
      case 'anglisht':
        return 'Gjuha Angleze';
      case 'fizike':
        return 'Fizikë';
      case 'kimi':
        return 'Kimi';
      case 'biologji':
        return 'Biologji';
      case 'histori':
        return 'Histori';
      case 'gjeografi':
        return 'Gjeografi';
      case 'informatike':
        return 'Informatikë';
      case 'ekonomi':
        return 'Ekonomi';
      case 'lendeProfesionale':
        return 'Lëndë profesionale';
      default:
        return subject;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(subjectTips).map(([subject, tips]) => (
        <Card key={subject}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>{getSubjectName(subject)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
