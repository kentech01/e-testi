import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { AspectRatio } from '../../ui/aspect-ratio';
import { InteractiveGraph } from '../common/InteractiveGraph';
import { Flag, CheckCircle2, AlertTriangle, Image as ImageIcon, BarChart3 } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  imageUrl?: string;
  imageCaption?: string;
  readingPassage?: string;
  passageId?: string;
  passageTitle?: string;
  questionNumber?: number;
  totalPassageQuestions?: number;
  hasInteractiveGraph?: boolean;
  graphConfig?: {
    functionType: 'quadratic' | 'linear' | 'exponential' | 'trigonometric';
    coefficients?: { a?: number; b?: number; c?: number; d?: number; };
    domain?: { x: [number, number]; y: [number, number]; };
  };
}

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  answer: number | null;
  isFlagged: boolean;
  onAnswerChange: (value: string) => void;
  onToggleFlag: () => void;
  showPassage?: boolean;
  passageContent?: string;
  passageTitle?: string;
}

export const QuestionCard = React.memo(({ 
  question, 
  questionIndex, 
  answer, 
  isFlagged, 
  onAnswerChange, 
  onToggleFlag,
  showPassage,
  passageContent,
  passageTitle
}: QuestionCardProps) => {
  const hasImage = question.imageUrl;
  const hasGraph = question.hasInteractiveGraph;
  const hasPassage = question.readingPassage;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {/* Question Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">Pyetja {questionIndex + 1}</Badge>
            {hasImage && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <ImageIcon className="w-3 h-3" />
                <span>Imazh</span>
              </Badge>
            )}
            {hasGraph && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <BarChart3 className="w-3 h-3" />
                <span>Grafik</span>
              </Badge>
            )}
            {hasPassage && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>Tekst</span>
              </Badge>
            )}
          </div>
          
          <button
            onClick={onToggleFlag}
            className={`p-2 rounded-full transition-colors ${
              isFlagged 
                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            title={isFlagged ? 'Hiq shënimin' : 'Shëno pyetjen'}
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>

        {/* Reading Passage */}
        {showPassage && passageContent && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
            <h3 className="font-semibold mb-2">{passageTitle}</h3>
            <p className="text-sm leading-relaxed">{passageContent}</p>
          </div>
        )}

        {/* Question Text */}
        <div className="mb-6">
          <p className="text-lg leading-relaxed">{question.question}</p>
        </div>

        {/* Image */}
        {hasImage && question.imageUrl && (
          <div className="mb-6">
            <AspectRatio ratio={16 / 9} className="mb-2">
              <ImageWithFallback
                src={question.imageUrl}
                alt={question.imageCaption || 'Question image'}
                className="w-full h-full object-cover rounded-lg"
              />
            </AspectRatio>
            {question.imageCaption && (
              <p className="text-sm text-muted-foreground text-center">{question.imageCaption}</p>
            )}
          </div>
        )}

        {/* Interactive Graph */}
        {hasGraph && question.graphConfig && (
          <div className="mb-6">
            <InteractiveGraph
              functionType={question.graphConfig.functionType}
              coefficients={question.graphConfig.coefficients}
              domain={question.graphConfig.domain}
              title="Grafiku i funksionit"
            />
          </div>
        )}

        {/* Answer Options */}
        <RadioGroup value={answer?.toString() || ''} onValueChange={onAnswerChange}>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <RadioGroupItem value={index.toString()} id={`q${question.id}-${index}`} />
                <Label 
                  htmlFor={`q${question.id}-${index}`} 
                  className="flex-1 cursor-pointer text-base leading-relaxed"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        {/* Answer Status */}
        {answer !== null && (
          <div className="mt-4 flex items-center space-x-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-600">Përgjigja u zgjodh</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

QuestionCard.displayName = 'QuestionCard'; 