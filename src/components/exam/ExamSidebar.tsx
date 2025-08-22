import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { ImageIcon, BarChart3, BookOpen } from 'lucide-react';

interface ExamSidebarProps {
  currentPage: number;
  totalPages: number;
  questions: any[];
  answers: (number | null)[];
  flaggedQuestions: Set<number>;
  onPageChange: (page: number) => void;
  onQuestionClick: (questionIndex: number) => void;
  answeredCount: number;
}

export function ExamSidebar({
  currentPage,
  totalPages,
  questions,
  answers,
  flaggedQuestions,
  onPageChange,
  onQuestionClick,
  answeredCount
}: ExamSidebarProps) {
  const getQuestionStatus = (globalIndex: number) => {
    if (answers[globalIndex] !== null) return 'answered';
    if (flaggedQuestions.has(globalIndex)) return 'flagged';
    return 'unanswered';
  };

  const hasSpecialFeatures = (question: any) => {
    return question.hasInteractiveGraph || question.imageUrl || question.readingPassage;
  };

  return (
    <div className="w-80 space-y-4">
      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Navigimi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex-1"
            >
              Para
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="flex-1"
            >
              Pas
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Faqja {currentPage + 1} nga {totalPages}
          </div>
        </CardContent>
      </Card>

      {/* Question Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Përgjigjja e pyetjeve</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, i) => {
                const status = getQuestionStatus(i);
                const hasGraph = question.hasInteractiveGraph;
                const hasImage = question.imageUrl;
                const hasPassage = question.readingPassage;
                
                return (
                  <button
                    key={i}
                    onClick={() => onQuestionClick(i)}
                    className={`
                      w-10 h-10 rounded-lg border-2 text-sm font-medium transition-colors relative
                      ${status === 'answered'
                        ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                        : status === 'flagged'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                          : 'bg-muted hover:bg-muted/80 border-muted text-muted-foreground'
                      }
                    `}
                  >
                    {i + 1}
                    {hasGraph && (
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-2 h-2 text-white" />
                      </div>
                    )}
                    {hasImage && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-2 h-2 text-white" />
                      </div>
                    )}
                    {hasPassage && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                        <BookOpen className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
          
          <div className="space-y-2 text-xs mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Aktuale</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded dark:bg-green-900/30 dark:border-green-800"></div>
              <span>E përgjigjur</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded dark:bg-yellow-900/30 dark:border-yellow-800"></div>
              <span>E shënuar</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-muted border border-muted rounded"></div>
              <span>Pa përgjigje</span>
            </div>
          </div>

          <div className="pt-4 border-t text-sm space-y-2">
            <div className="flex justify-between">
              <span>E përgjigjur:</span>
              <span className="font-medium">{answeredCount}/100</span>
            </div>
            <div className="flex justify-between">
              <span>E shënuar:</span>
              <span className="font-medium">{flaggedQuestions.size}</span>
            </div>
            <div className="flex justify-between">
              <span>Pa përgjigje:</span>
              <span className="font-medium">{100 - answeredCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 