import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { BookOpen, Users, Target } from 'lucide-react';

export function StudyResources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resurse të dobishme</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-auto p-4 justify-start">
            <BookOpen className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Libra mësimi</div>
              <div className="text-xs text-muted-foreground">Lista e librave të rekomanduara</div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto p-4 justify-start">
            <Users className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Grupe studimi</div>
              <div className="text-xs text-muted-foreground">Gjej partnerë për studim</div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto p-4 justify-start">
            <Target className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Teste shtesë</div>
              <div className="text-xs text-muted-foreground">Materiale praktike</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 