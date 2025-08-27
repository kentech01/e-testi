import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { AlertTriangle } from 'lucide-react';

interface SubmitDialogProps {
  isOpen: boolean;
  subject: string;
  answeredCount: number;
  timeLeft: number;
  flaggedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  formatTime: (seconds: number) => string;
}

export function SubmitDialog({
  isOpen,
  subject,
  answeredCount,
  timeLeft,
  flaggedCount,
  onConfirm,
  onCancel,
  formatTime,
}: SubmitDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h3>Konfirmo dërgimin e testit</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Lënda: <span className="font-medium">{subject}</span>
              </p>
              <p>
                Përgjigje të dhëna:{' '}
                <span className="font-medium">{answeredCount}/100</span>
              </p>
              <p>
                Kohë e mbetur:{' '}
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </p>
              <p>
                Pyetje të shënuara:{' '}
                <span className="font-medium">{flaggedCount}</span>
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              A jeni të sigurt që doni të dërgoni testin? Ky veprim nuk mund të
              zhbëhet.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Anulo
              </Button>
              <Button onClick={onConfirm} className="flex-1">
                Perfundo testin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
