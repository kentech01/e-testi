import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AspectRatio } from './ui/aspect-ratio';
import { ScrollArea } from './ui/scroll-area';
import { InteractiveGraph } from './InteractiveGraph';
import { Clock, ArrowLeft, ArrowRight, BookOpen, Calculator, Globe, Flag, CheckCircle2, AlertTriangle, Image as ImageIcon, BarChart3 } from 'lucide-react';

// Import Figma assets
import mathQuestionsImage from 'figma:asset/ab2130238c669774c9a7337397996b6a3345926a.png';
import housePlanImage from 'figma:asset/41570a0bbce5ad5706abf665a800b572a24ee738.png';

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

interface ExamInterfaceProps {
  subject: 'matematik' | 'gjuhaShqipe' | 'anglisht';
  onComplete: (answers: (number | null)[]) => void;
  onExit: () => void;
}

// Enhanced mock questions with performance optimizations
const createBaseQuestions = (subject: string): Question[] => {
  const questions: { [key: string]: Question[] } = {
    matematik: [
      {
        id: 101,
        question: "Për transportimin e një sasie të thëngjellit nevojiten 24 kamionë me fuqi transportuese 14 tonëshe. Sa kamionë me fuqi bartëse 12 tonëshe do të ishin të nevojshëm për transportimin e sasisë së njëjtë të thëngjellit?",
        options: ["22", "24", "28", "30"],
        correctAnswer: 2,
        subject: "matematik"
      },
      {
        id: 102,
        question: "Sa është vlera e shprehjes (-a²)⁴ · (-a⁻)² : a ?",
        options: ["-a²", "a¹¹", "a⁶", "-a¹¹"],
        correctAnswer: 1,
        subject: "matematik"
      },
      {
        id: 103,
        question: "Cili funksion i përgjigjet grafikut të dhënë?",
        options: ["y = x² + 4x", "y = x² - 4x", "y = -x² - 4x", "y = -x² + 4x"],
        correctAnswer: 3,
        subject: "matematik",
        hasInteractiveGraph: true,
        graphConfig: {
          functionType: 'quadratic',
          coefficients: { a: -1, b: 4, c: 0 },
          domain: { x: [-2, 6], y: [-2, 6] }
        }
      },
      {
        id: 104,
        question: "Cila është vlera e funksionit f(x) = 2x + 3 në pikën x = 4?",
        options: ["8", "11", "14", "16"],
        correctAnswer: 1,
        subject: "matematik",
        hasInteractiveGraph: true,
        graphConfig: {
          functionType: 'linear',
          coefficients: { a: 2, b: 3 },
          domain: { x: [-2, 6], y: [-1, 15] }
        }
      },
      {
        id: 105,
        question: "Një kopsht ka formën e drejtëkëndshit me siprinë 300 m². Cili ekuacion kuadratik i përgjigjet që zgjidhjet e tij mundësojnë që kopshti të rrethohet me një tel të gjatë 70 m?",
        options: ["x² - 35x + 300 = 0", "x² + 70x + 300 = 0", "x² - 70x + 300 = 0", "x² + 35x + 300 = 0"],
        correctAnswer: 0,
        subject: "matematik"
      }
    ],
    gjuhaShqipe: [
      {
        id: 30,
        question: "Nga personazhet dhe elementet e tjera mund të kuptohet se ky fragment është nxjerrë nga legjenda shqiptare e njohur si legjenda e:",
        options: ["ringjalljes", "rinjohjjes", "murosjes", "vëllavrasjes"],
        correctAnswer: 2,
        subject: "gjuhaShqipe",
        readingPassage: `Kam parë shtëpinë të nxirë e të shembur, ku unë kam lindur, ku u kam lindur edhe ti, o Gjergj! Edhe kam marrë dhé prej atje, edhe ja kam sjellë me vete, se do të të hedhë në varr bashkë me ty, që të mos harrojmë tokën tonë edhe as në vdekje. Edhe ia foli: "Çkemi bërë ne, o Gjergj, që Zoti na dha një fat të tillë? Çkemi bërë që na lanë pa shtëpi, pa vend e pa vatër?"

Ajo vazhdoi: "Edhe ju çfarë keni bërë, o burra, që kështu po vriteni njëri-tjetrin? Pse po shkatërroni atë që Zoti ka ndërtuar?" Kështu, ajo qante e vajtonte, derisa Gjergji i vdiq në krahë.

E mbrapme e vuri dorën te zemra dhe e ndjeu se nuk rrahte më. Atëherë filloi të ulurinte dhe të bërtitë si ujkja, sa që tokë e qiell u rrënkuan. Edhe ajo e kapi për flokë dhe filloi t'ia shkëpuste nga koka. Pastaj e kapi për fyti dhe e puthi në buzë për herë të fundit.

"O Gjergj, o zemra ime," - tha ajo, - "pse më le vetëm në këtë botë të keqe? Si do të jetoj unë pa ty? Si do të fle në atë shtrat të ftohtë, ku ti nuk do të jesh më?" Edhe ajo u hodh përmbi të dhe e përqafoi fort, sikur donte ta ngrohte me trupin e saj.

Kur e panë burrat që ajo kishte vdekur edhe ajo, filluan të qanin e të vajtojnë. "Shihni," - thanë ata, - "çfarë bëri dashuria! Ajo nuk diti të jetojë pa të." Edhe ata i varrosën bashkë në një varr, që të mos ndaheshin as në vdekje.`,
        passageId: "legjenda1",
        passageTitle: "Fragment nga legjenda shqiptare e murosjes",
        questionNumber: 1,
        totalPassageQuestions: 5
      },
      {
        id: 31,
        question: "Nga ky tekst, ku flet personazhi kryesor, mund të vërehet se ai është i:",
        options: ["druajtur", "inatosur", "shqetësuar", "hidhëruar"],
        correctAnswer: 3,
        subject: "gjuhaShqipe",
        readingPassage: `Kam parë shtëpinë të nxirë e të shembur, ku unë kam lindur, ku u kam lindur edhe ti, o Gjergj! Edhe kam marrë dhé prej atje, edhe ja kam sjellë me vete, se do të të hedhë në varr bashkë me ty, që të mos harrojmë tokën tonë edhe as në vdekje. Edhe ia foli: "Çkemi bërë ne, o Gjergj, që Zoti na dha një fat të tillë? Çkemi bërë që na lanë pa shtëpi, pa vend e pa vatër?"

Ajo vazhdoi: "Edhe ju çfarë keni bërë, o burra, që kështu po vriteni njëri-tjetrin? Pse po shkatërroni atë që Zoti ka ndërtuar?" Kështu, ajo qante e vajtonte, derisa Gjergji i vdiq në krahë.

E mbrapme e vuri dorën te zemra dhe e ndjeu se nuk rrahte më. Atëherë filloi të ulurinte dhe të bërtitë si ujkja, sa që tokë e qiell u rrënkuan. Edhe ajo e kapi për flokë dhe filloi t'ia shkëpuste nga koka. Pastaj e kapi për fyti dhe e puthi në buzë për herë të fundit.

"O Gjergj, o zemra ime," - tha ajo, - "pse më le vetëm në këtë botë të keqe? Si do të jetoj unë pa ty? Si do të fle në atë shtrat të ftohtë, ku ti nuk do të jesh më?" Edhe ajo u hodh përmbi të dhe e përqafoi fort, sikur donte ta ngrohte me trupin e saj.

Kur e panë burrat që ajo kishte vdekur edhe ajo, filluan të qanin e të vajtojnë. "Shihni," - thanë ata, - "çfarë bëri dashuria! Ajo nuk diti të jetojë pa të." Edhe ata i varrosën bashkë në një varr, që të mos ndaheshin as në vdekje.`,
        passageId: "legjenda1",
        passageTitle: "Fragment nga legjenda shqiptare e murosjes",
        questionNumber: 2,
        totalPassageQuestions: 5
      },
      {
        id: 32,
        question: "Në fjalinë \"Kam parë shtëpinë të nxirë e të shembur...\", kryefjala mund të kuptohet nga fjala:",
        options: ["kam", "parë", "shtëpinë", "të nxirë"],
        correctAnswer: 0,
        subject: "gjuhaShqipe",
        readingPassage: `Kam parë shtëpinë të nxirë e të shembur, ku unë kam lindur, ku u kam lindur edhe ti, o Gjergj! Edhe kam marrë dhé prej atje, edhe ja kam sjellë me vete, se do të të hedhë në varr bashkë me ty, që të mos harrojmë tokën tonë edhe as në vdekje. Edhe ia foli: "Çkemi bërë ne, o Gjergj, që Zoti na dha një fat të tillë? Çkemi bërë që na lanë pa shtëpi, pa vend e pa vatër?"

Ajo vazhdoi: "Edhe ju çfarë keni bërë, o burra, që kështu po vriteni njëri-tjetrin? Pse po shkatërroni atë që Zoti ka ndërtuar?" Kështu, ajo qante e vajtonte, derisa Gjergji i vdiq në krahë.

E mbrapme e vuri dorën te zemra dhe e ndjeu se nuk rrahte më. Atëherë filloi të ulurinte dhe të bërtitë si ujkja, sa që tokë e qiell u rrënkuan. Edhe ajo e kapi për flokë dhe filloi t'ia shkëpuste nga koka. Pastaj e kapi për fyti dhe e puthi në buzë për herë të fundit.

"O Gjergj, o zemra ime," - tha ajo, - "pse më le vetëm në këtë botë të keqe? Si do të jetoj unë pa ty? Si do të fle në atë shtrat të ftohtë, ku ti nuk do të jesh më?" Edhe ajo u hodh përmbi të dhe e përqafoi fort, sikur donte ta ngrohte me trupin e saj.

Kur e panë burrat që ajo kishte vdekur edhe ajo, filluan të qanin e të vajtojnë. "Shihni," - thanë ata, - "çfarë bëri dashuria! Ajo nuk diti të jetojë pa të." Edhe ata i varrosën bashkë në një varr, që të mos ndaheshin as në vdekje.`,
        passageId: "legjenda1",
        passageTitle: "Fragment nga legjenda shqiptare e murosjes",
        questionNumber: 3,
        totalPassageQuestions: 5
      },
      {
        id: 33,
        question: "Në këtë fragment hasen disa elemente dialektore të:",
        options: ["arbërishtes", "arvanitishtes", "toskërishtes", "gegërishtes"],
        correctAnswer: 3,
        subject: "gjuhaShqipe",
        readingPassage: `Kam parë shtëpinë të nxirë e të shembur, ku unë kam lindur, ku u kam lindur edhe ti, o Gjergj! Edhe kam marrë dhé prej atje, edhe ja kam sjellë me vete, se do të të hedhë në varr bashkë me ty, që të mos harrojmë tokën tonë edhe as në vdekje. Edhe ia foli: "Çkemi bërë ne, o Gjergj, që Zoti na dha një fat të tillë? Çkemi bërë që na lanë pa shtëpi, pa vend e pa vatër?"

Ajo vazhdoi: "Edhe ju çfarë keni bërë, o burra, që kështu po vriteni njëri-tjetrin? Pse po shkatërroni atë që Zoti ka ndërtuar?" Kështu, ajo qante e vajtonte, derisa Gjergji i vdiq në krahë.

E mbrapme e vuri dorën te zemra dhe e ndjeu se nuk rrahte më. Atëherë filloi të ulurinte dhe të bërtitë si ujkja, sa që tokë e qiell u rrënkuan. Edhe ajo e kapi për flokë dhe filloi t'ia shkëpuste nga koka. Pastaj e kapi për fyti dhe e puthi në buzë për herë të fundit.

"O Gjergj, o zemra ime," - tha ajo, - "pse më le vetëm në këtë botë të keqe? Si do të jetoj unë pa ty? Si do të fle në atë shtrat të ftohtë, ku ti nuk do të jesh më?" Edhe ajo u hodh përmbi të dhe e përqafoi fort, sikur donte ta ngrohte me trupin e saj.

Kur e panë burrat që ajo kishte vdekur edhe ajo, filluan të qanin e të vajtojnë. "Shihni," - thanë ata, - "çfarë bëri dashuria! Ajo nuk diti të jetojë pa të." Edhe ata i varrosën bashkë në një varr, që të mos ndaheshin as në vdekje.`,
        passageId: "legjenda1",
        passageTitle: "Fragment nga legjenda shqiptare e murosjes",
        questionNumber: 4,
        totalPassageQuestions: 5
      },
      {
        id: 34,
        question: "Tema kryesore e këtij fragmenti është:",
        options: ["lufta dhe paqja", "dashuria dhe sakrifica", "varfëria dhe pasuria", "malli dhe kthimi"],
        correctAnswer: 1,
        subject: "gjuhaShqipe",
        readingPassage: `Kam parë shtëpinë të nxirë e të shembur, ku unë kam lindur, ku u kam lindur edhe ti, o Gjergj! Edhe kam marrë dhé prej atje, edhe ja kam sjellë me vete, se do të të hedhë në varr bashkë me ty, që të mos harrojmë tokën tonë edhe as në vdekje. Edhe ia foli: "Çkemi bërë ne, o Gjergj, që Zoti na dha një fat të tillë? Çkemi bërë që na lanë pa shtëpi, pa vend e pa vatër?"

Ajo vazhdoi: "Edhe ju çfarë keni bërë, o burra, që kështu po vriteni njëri-tjetrin? Pse po shkatërroni atë që Zoti ka ndërtuar?" Kështu, ajo qante e vajtonte, derisa Gjergji i vdiq në krahë.

E mbrapme e vuri dorën te zemra dhe e ndjeu se nuk rrahte më. Atëherë filloi të ulurinte dhe të bërtitë si ujkja, sa që tokë e qiell u rrënkuan. Edhe ajo e kapi për flokë dhe filloi t'ia shkëpuste nga koka. Pastaj e kapi për fyti dhe e puthi në buzë për herë të fundit.

"O Gjergj, o zemra ime," - tha ajo, - "pse më le vetëm në këtë botë të keqe? Si do të jetoj unë pa ty? Si do të fle në atë shtrat të ftohtë, ku ti nuk do të jesh më?" Edhe ajo u hodh përmbi të dhe e përqafoi fort, sikur donte ta ngrohte me trupin e saj.

Kur e panë burrat që ajo kishte vdekur edhe ajo, filluan të qanin e të vajtojnë. "Shihni," - thanë ata, - "çfarë bëri dashuria! Ajo nuk diti të jetojë pa të." Edhe ata i varrosën bashkë në një varr, që të mos ndaheshin as në vdekje.`,
        passageId: "legjenda1",
        passageTitle: "Fragment nga legjenda shqiptare e murosjes",
        questionNumber: 5,
        totalPassageQuestions: 5
      }
    ],
    anglisht: [
      {
        id: 80,
        question: "According to the house plan shown, which room has the largest area?",
        options: ["Living room", "Parents' bedroom", "Kitchen", "David's bedroom"],
        correctAnswer: 0,
        subject: "anglisht",
        readingPassage: `David lives in a spacious house with his parents. Below is the house plan. Apart from the kitchen, the dining room and the living room, there are two bedrooms. One is his parents' and the other is David's bedroom. His parents' bedroom is 3.60 X 3.30, whereas David's bedroom is 2.70 X 3.00 metres.`,
        imageUrl: housePlanImage,
        imageCaption: "David's house floor plan showing room dimensions",
        passageId: "house_plan1",
        passageTitle: "David's House Plan",
        questionNumber: 1,
        totalPassageQuestions: 3
      },
      {
        id: 81,
        question: "How much larger is the parents' bedroom compared to David's bedroom?",
        options: ["2.78m²", "3.78m²", "4.78m²", "5.78m²"],
        correctAnswer: 0,
        subject: "anglisht",
        readingPassage: `David lives in a spacious house with his parents. Below is the house plan. Apart from the kitchen, the dining room and the living room, there are two bedrooms. One is his parents' and the other is David's bedroom. His parents' bedroom is 3.60 X 3.30, whereas David's bedroom is 2.70 X 3.00 metres.`,
        imageUrl: housePlanImage,
        imageCaption: "David's house floor plan showing room dimensions",
        passageId: "house_plan1",
        passageTitle: "David's House Plan",
        questionNumber: 2,
        totalPassageQuestions: 3
      },
      {
        id: 82,
        question: "Based on the floor plan, what can you conclude about the house layout?",
        options: [
          "The bedrooms are located on the upper floor",
          "The kitchen and dining room are connected",
          "There is only one bathroom in the house",
          "The living room has direct access to the garden"
        ],
        correctAnswer: 1,
        subject: "anglisht",
        readingPassage: `David lives in a spacious house with his parents. Below is the house plan. Apart from the kitchen, the dining room and the living room, there are two bedrooms. One is his parents' and the other is David's bedroom. His parents' bedroom is 3.60 X 3.30, whereas David's bedroom is 2.70 X 3.00 metres.`,
        imageUrl: housePlanImage,
        imageCaption: "David's house floor plan showing room dimensions",
        passageId: "house_plan1",
        passageTitle: "David's House Plan",
        questionNumber: 3,
        totalPassageQuestions: 3
      }
    ]
  };

  return questions[subject] || [];
};

// Generate additional questions lazily
const generateAdditionalQuestions = (subject: string, startId: number, count: number): Question[] => {
  const questions: Question[] = [];
  
  for (let i = 0; i < count; i++) {
    const shouldHaveImage = Math.random() < 0.08; // 8% chance
    const shouldHaveGraph = subject === 'matematik' && Math.random() < 0.15; // 15% chance for math
    
    questions.push({
      id: startId + i,
      question: `${subject === 'matematik' ? 'Pyetja matematike' : subject === 'gjuhaShqipe' ? 'Pyetja e gjuhës shqipe' : 'English question'} ${startId + i}: Zgjidhni përgjigjen e saktë për këtë pyetje të simuluar.`,
      options: ["Opsioni A", "Opsioni B", "Opsioni C", "Opsioni D"],
      correctAnswer: Math.floor(Math.random() * 4),
      subject,
      ...(shouldHaveImage && {
        imageUrl: "https://images.unsplash.com/photo-1727522974735-44251dfe61b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljYWwlMjBkaWFncmFtJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc1NTY5OTM4N3ww&ixlib=rb-4.1.0&q=80&w=400",
        imageCaption: "Diagram ilustrues për pyetjen"
      }),
      ...(shouldHaveGraph && {
        hasInteractiveGraph: true,
        graphConfig: {
          functionType: ['quadratic', 'linear', 'exponential'][Math.floor(Math.random() * 3)] as any,
          coefficients: { 
            a: Math.floor(Math.random() * 5) + 1, 
            b: Math.floor(Math.random() * 5) - 2, 
            c: Math.floor(Math.random() * 5) - 2 
          },
          domain: { x: [-5, 5], y: [-10, 10] }
        }
      })
    });
  }
  
  return questions;
};

const subjectInfo = {
  matematik: { name: 'Matematika', icon: Calculator, color: 'text-blue-600' },
  gjuhaShqipe: { name: 'Gjuha Shqipe', icon: BookOpen, color: 'text-green-600' },
  anglisht: { name: 'Gjuha Angleze', icon: Globe, color: 'text-purple-600' }
};

// Memoized question component
const QuestionCard = memo(({ 
  question, 
  index, 
  globalIndex, 
  isFlagged, 
  isAnswered, 
  selectedAnswer, 
  onAnswerChange, 
  onToggleFlag 
}: {
  question: Question;
  index: number;
  globalIndex: number;
  isFlagged: boolean;
  isAnswered: boolean;
  selectedAnswer: number | null;
  onAnswerChange: (value: string) => void;
  onToggleFlag: () => void;
}) => (
  <Card className={`${isFlagged ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800' : ''}`}>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg">
            Pyetja {question.id}
            {question.questionNumber && question.totalPassageQuestions && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({question.questionNumber}/{question.totalPassageQuestions})
              </span>
            )}
          </CardTitle>
          {isFlagged && <Flag className="w-4 h-4 text-yellow-500" />}
          {isAnswered && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          {question.imageUrl && <ImageIcon className="w-4 h-4 text-blue-500" />}
          {question.hasInteractiveGraph && <BarChart3 className="w-4 h-4 text-purple-500" />}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFlag}
          className={isFlagged ? 'text-yellow-500' : ''}
        >
          <Flag className="w-4 h-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Interactive Graph Section */}
      {question.hasInteractiveGraph && question.graphConfig && (
        <InteractiveGraph
          functionType={question.graphConfig.functionType}
          coefficients={question.graphConfig.coefficients}
          domain={question.graphConfig.domain}
          title="Grafiku i funksionit"
        />
      )}

      {/* Image Section */}
      {question.imageUrl && (
        <div className="space-y-2">
          <AspectRatio ratio={16 / 10} className="bg-white rounded-lg overflow-hidden border">
            <ImageWithFallback
              src={question.imageUrl}
              alt={question.imageCaption || `Ilustrim për pyetjen ${question.id}`}
              className="w-full h-full object-contain"
            />
          </AspectRatio>
          {question.imageCaption && (
            <p className="text-sm text-muted-foreground text-center italic">
              {question.imageCaption}
            </p>
          )}
        </div>
      )}

      {/* Question Text */}
      <p className="text-base leading-relaxed">{question.question}</p>

      {/* Options */}
      <RadioGroup
        value={selectedAnswer?.toString() || ''}
        onValueChange={onAnswerChange}
        className="space-y-3"
      >
        {question.options.map((option, optionIndex) => (
          <div
            key={optionIndex}
            className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <RadioGroupItem
              value={optionIndex.toString()}
              id={`q${question.id}-option-${optionIndex}`}
              className="mt-0.5"
            />
            <Label
              htmlFor={`q${question.id}-option-${optionIndex}`}
              className="flex-1 cursor-pointer leading-relaxed"
            >
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + optionIndex)}.
              </span>
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </CardContent>
  </Card>
));

QuestionCard.displayName = 'QuestionCard';

export function ExamInterface({ subject, onComplete, onExit }: ExamInterfaceProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(100).fill(null));
  const [timeLeft, setTimeLeft] = useState(7200);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Memoized questions generation for better performance
  const questions = useMemo(() => {
    const baseQuestions = createBaseQuestions(subject);
    const additionalQuestionsCount = 100 - baseQuestions.length;
    const startId = Math.max(...baseQuestions.map(q => q.id)) + 1;
    const additionalQuestions = generateAdditionalQuestions(subject, startId, additionalQuestionsCount);
    
    return [...baseQuestions, ...additionalQuestions];
  }, [subject]);

  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  
  // Only load current page questions for performance
  const currentQuestions = useMemo(() => 
    questions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage),
    [questions, currentPage, questionsPerPage]
  );
  
  const SubjectIcon = subjectInfo[subject].icon;
  const answeredCount = useMemo(() => 
    answers.filter(answer => answer !== null).length,
    [answers]
  );
  const progress = (answeredCount / 100) * 100;

  // Current reading passage
  const currentPassage = useMemo(() => 
    currentQuestions.find(q => q.readingPassage)?.readingPassage,
    [currentQuestions]
  );
  const currentPassageTitle = useMemo(() => 
    currentQuestions.find(q => q.passageTitle)?.passageTitle,
    [currentQuestions]
  );
  const passageQuestions = useMemo(() => 
    currentQuestions.filter(q => q.readingPassage),
    [currentQuestions]
  );

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Memoized handlers
  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleAnswerChange = useCallback((questionIndex: number, value: string) => {
    const globalIndex = currentPage * questionsPerPage + questionIndex;
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[globalIndex] = parseInt(value);
      return newAnswers;
    });
  }, [currentPage, questionsPerPage]);

  const toggleFlag = useCallback((questionIndex: number) => {
    const globalIndex = currentPage * questionsPerPage + questionIndex;
    setFlaggedQuestions(prev => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(globalIndex)) {
        newFlagged.delete(globalIndex);
      } else {
        newFlagged.add(globalIndex);
      }
      return newFlagged;
    });
  }, [currentPage, questionsPerPage]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const handlePrevious = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handleSubmit = useCallback(() => {
    onComplete(answers);
  }, [answers, onComplete]);

  const getQuestionStatus = useCallback((globalIndex: number) => {
    if (answers[globalIndex] !== null) return 'answered';
    if (flaggedQuestions.has(globalIndex)) return 'flagged';
    return 'unanswered';
  }, [answers, flaggedQuestions]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onExit}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Dil nga testi
            </Button>
            <div className="flex items-center space-x-2">
              <SubjectIcon className={`w-5 h-5 ${subjectInfo[subject].color}`} />
              <h1>Test 15</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4" />
              <span className={timeLeft < 600 ? 'text-red-500 font-semibold' : ''}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <Badge variant="secondary">
              {answeredCount}/100 përgjigjur
            </Badge>
            <Button onClick={() => setShowSubmitDialog(true)} size="sm">
              Dërgo testin
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span>Progresi: {progress.toFixed(1)}%</span>
            <span>Faqja {currentPage + 1} nga {totalPages}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Questions Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Reading Passage Section */}
          {currentPassage && (
            <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 sticky top-28 z-10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-blue-900 dark:text-blue-100">
                  <BookOpen className="w-5 h-5" />
                  <span>{currentPassageTitle}</span>
                </CardTitle>
                {passageQuestions.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                    <span>Pyetjet {passageQuestions[0]?.questionNumber}-{passageQuestions[passageQuestions.length - 1]?.questionNumber} janë bazuar në këtë tekst</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48 w-full">
                  <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-100 whitespace-pre-line">
                    {currentPassage}
                  </p>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Questions */}
          <div className="space-y-4">
            {currentQuestions.map((question, index) => {
              const globalIndex = currentPage * questionsPerPage + index;
              return (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  globalIndex={globalIndex}
                  isFlagged={flaggedQuestions.has(globalIndex)}
                  isAnswered={answers[globalIndex] !== null}
                  selectedAnswer={answers[globalIndex]}
                  onAnswerChange={(value) => handleAnswerChange(index, value)}
                  onToggleFlag={() => toggleFlag(index)}
                />
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>E mëparshme</span>
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Faqja {currentPage + 1} nga {totalPages}
              </span>
            </div>

            <Button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="flex items-center space-x-2"
            >
              <span>E radhës</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar - Question Navigation */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-base">Navigimi i pyetjeve</CardTitle>
              <p className="text-sm text-muted-foreground">Progresi: {progress.toFixed(1)}%</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 100 }, (_, i) => {
                  const status = getQuestionStatus(i);
                  const page = Math.floor(i / questionsPerPage);
                  const question = questions[i];
                  const hasImage = question?.imageUrl;
                  const hasPassage = question?.readingPassage;
                  const hasGraph = question?.hasInteractiveGraph;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(page)}
                      className={`
                        relative w-8 h-8 text-xs rounded border transition-colors flex items-center justify-center
                        ${currentPage === page && i >= currentPage * questionsPerPage && i < (currentPage + 1) * questionsPerPage
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : status === 'answered'
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
              
              <div className="space-y-2 text-xs">
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
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
                <h3>Konfirmo dërgimin e testit</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Lënda: <span className="font-medium">{subjectInfo[subject].name}</span></p>
                  <p>Përgjigje të dhëna: <span className="font-medium">{answeredCount}/100</span></p>
                  <p>Kohë e mbetur: <span className="font-medium">{formatTime(timeLeft)}</span></p>
                  <p>Pyetje të shënuara: <span className="font-medium">{flaggedQuestions.size}</span></p>
                </div>
                <p className="text-sm text-muted-foreground">
                  A jeni të sigurt që doni të dërgoni testin? Ky veprim nuk mund të zhbëhet.
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowSubmitDialog(false)} className="flex-1">
                    Anulo
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1">
                    Dërgo testin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}