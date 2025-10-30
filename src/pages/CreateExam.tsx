import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';
import {
  ArrowLeft,
  Plus,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  Save,
} from 'lucide-react';
import examService from '../services/exams';
import questionsService from '../services/questions';
import { storageService } from '../lib/firebase';

interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  title: string;
  description: string;
  answerOptions: AnswerOption[];
  imageFile?: File | null;
  imageUrl?: string;
}

const TOTAL_QUESTIONS = 100;

export function CreateExam() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [sectorId, setSectorId] = useState<number>(1);
  const [passingScoreText, setPassingScoreText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examId, setExamId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    examTitle?: string;
    examDescription?: string;
    sectorId?: string;
    passingScore?: string;
    questionTitle?: string;
    questionOptions?: string;
  }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [questions, setQuestions] = useState<Question[]>(() => {
    // Initialize with 100 empty questions
    return Array.from({ length: TOTAL_QUESTIONS }, (_, index) => ({
      id: index + 1,
      title: '',
      description: '',
      answerOptions: [
        { id: `${index + 1}-1`, text: '', isCorrect: false },
        { id: `${index + 1}-2`, text: '', isCorrect: false },
        { id: `${index + 1}-3`, text: '', isCorrect: false },
        { id: `${index + 1}-4`, text: '', isCorrect: false },
      ],
      imageFile: null,
      imageUrl: undefined,
    }));
  });

  const currentQuestion = questions[currentQuestionIndex];

  const handleAddOption = () => {
    const newOption: AnswerOption = {
      id: `${currentQuestionIndex + 1}-${Date.now()}`,
      text: `Option ${currentQuestion.answerOptions.length + 1}`,
      isCorrect: false,
    };

    setQuestions(
      questions.map((q, index) =>
        index === currentQuestionIndex
          ? { ...q, answerOptions: [...q.answerOptions, newOption] }
          : q
      )
    );
  };

  const handleRemoveOption = (optionId: string) => {
    if (currentQuestion.answerOptions.length > 1) {
      setQuestions(
        questions.map((q, index) =>
          index === currentQuestionIndex
            ? {
                ...q,
                answerOptions: q.answerOptions.filter(
                  (option) => option.id !== optionId
                ),
              }
            : q
        )
      );
    }
  };

  const handleOptionTextChange = (optionId: string, text: string) => {
    setQuestions(
      questions.map((q, index) =>
        index === currentQuestionIndex
          ? {
              ...q,
              answerOptions: q.answerOptions.map((option) =>
                option.id === optionId ? { ...option, text } : option
              ),
            }
          : q
      )
    );
  };

  const handleOptionCorrectChange = (optionId: string, isCorrect: boolean) => {
    setQuestions(
      questions.map((q, index) =>
        index === currentQuestionIndex
          ? {
              ...q,
              answerOptions: q.answerOptions.map((option) =>
                option.id === optionId ? { ...option, isCorrect } : option
              ),
            }
          : q
      )
    );
  };

  const handleQuestionTitleChange = (title: string) => {
    setQuestions(
      questions.map((q, index) =>
        index === currentQuestionIndex ? { ...q, title } : q
      )
    );
  };

  const handleQuestionDescriptionChange = (description: string) => {
    setQuestions(
      questions.map((q, index) =>
        index === currentQuestionIndex ? { ...q, description } : q
      )
    );
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelected: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0] || null;
    setQuestions(
      questions.map((q, index) =>
        index === currentQuestionIndex ? { ...q, imageFile: file } : q
      )
    );
  };

  const optionLetterForIndex = (i: number): string => {
    return String.fromCharCode('A'.charCodeAt(0) + i);
  };

  const validateExam = (): boolean => {
    const newErrors: typeof errors = {};
    if (!examTitle.trim()) newErrors.examTitle = 'Exam title is required.';
    if (!examDescription.trim())
      newErrors.examDescription = 'Exam description is required.';
    if (!(sectorId === 1 || sectorId === 2))
      newErrors.sectorId = 'Select KLASA_9 or KLASA_12.';
    const parsedPassing =
      passingScoreText === '' ? NaN : Number(passingScoreText);
    if (!Number.isFinite(parsedPassing) || parsedPassing < 0)
      newErrors.passingScore = 'Passing score must be a number ≥ 0.';
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateQuestion = (q: Question): boolean => {
    const newErrors: typeof errors = {};
    if (!q.title.trim())
      newErrors.questionTitle = `Question ${q.id} title is required.`;
    if (!q.answerOptions.some((o) => o.isCorrect))
      newErrors.questionOptions = 'At least one option must be marked correct.';
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const persistCurrentQuestion = async (): Promise<boolean> => {
    setApiError(null);
    // Validate
    const q = questions[currentQuestionIndex];
    const examOk = validateExam();
    const questionOk = validateQuestion(q);
    if (!examOk || !questionOk) return false;

    const parsedPassing = Number(passingScoreText);

    // Create exam if this is the first persist
    let ensuredExamId = examId;
    try {
      if (!ensuredExamId) {
        const created = await examService.createExam({
          title: examTitle,
          description: examDescription,
          sectorId: sectorId,
          isActive: true,
          totalQuestions: TOTAL_QUESTIONS,
          passingScore: parsedPassing,
        } as any);
        ensuredExamId = String((created as any).id);
        setExamId(ensuredExamId);
      }

      // Upload image if selected
      let imageUrl: string | undefined = undefined;
      if (q.imageFile) {
        const safeName = q.imageFile.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const path = `exams/${ensuredExamId}/questions/${q.id}/${Date.now()}_${safeName}`;
        imageUrl = await storageService.uploadFileWithProgress(
          q.imageFile,
          path
        );
      }

      // Build options
      const options = q.answerOptions.map((opt, idx) => ({
        text: opt.text || `Option ${idx + 1}`,
        optionLetter: optionLetterForIndex(idx),
        isCorrect: !!opt.isCorrect,
      }));

      // Create question
      await questionsService.createQuestion({
        text: q.title,
        imageUrl,
        examId: ensuredExamId!,
        subject: 'general',
        orderNumber: q.id,
        points: 1,
        isActive: true,
        options,
      });
      return true;
    } catch (e: any) {
      setApiError(
        e?.response?.data?.message || e?.message || 'Failed to save.'
      );
      return false;
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setIsSubmitting(true);
      const ok = await persistCurrentQuestion();
      setIsSubmitting(false);
      if (ok) {
        setErrors({});
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const ok = await persistCurrentQuestion();
    setIsSubmitting(false);
    if (ok) {
      navigate('/test-management');
    }
  };

  const handleBack = () => {
    navigate('/test-management');
  };

  const progress = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;
  const completedQuestions = questions.filter(
    (q) =>
      q.title.trim() !== '' &&
      q.answerOptions.some((option) => option.isCorrect)
  ).length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exams
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Create New Exam</h1>
          <p className="text-gray-600 mt-1">
            Create an exam with 100 questions. Complete all questions to save
            the exam.
          </p>
        </div>
      </div>

      {/* Exam Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Exam Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Title
            </label>
            <Input
              placeholder="Enter exam title..."
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full"
              disabled={!!examId}
            />
            {errors.examTitle && (
              <p className="mt-1 text-sm text-red-600">{errors.examTitle}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Description
            </label>
            <Textarea
              placeholder="Enter exam description..."
              value={examDescription}
              onChange={(e) => setExamDescription(e.target.value)}
              className="w-full"
              disabled={!!examId}
            />
            {errors.examDescription && (
              <p className="mt-1 text-sm text-red-600">
                {errors.examDescription}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sector
              </label>
              <select
                className="w-full border rounded-md h-10 px-3"
                value={sectorId}
                onChange={(e) => setSectorId(Number(e.target.value))}
                disabled={!!examId}
              >
                <option value={1}>KLASA_9</option>
                <option value={2}>KLASA_12</option>
              </select>
              {errors.sectorId && (
                <p className="mt-1 text-sm text-red-600">{errors.sectorId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passing Score
              </label>
              <Input
                type="text"
                inputMode="numeric"
                value={passingScoreText}
                placeholder="e.g. 60"
                onChange={(e) => setPassingScoreText(e.target.value)}
                disabled={!!examId}
              />
              {errors.passingScore && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.passingScore}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Questions
              </label>
              <Input type="number" value={TOTAL_QUESTIONS} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Progress</h3>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {TOTAL_QUESTIONS} •{' '}
                {completedQuestions} completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      {/* Question Form */}
      <Card>
        <CardHeader>
          <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {apiError && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {apiError}
            </div>
          )}
          {/* Question Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Title
              </label>
              <Input
                placeholder="Enter your question here..."
                value={currentQuestion.title}
                onChange={(e) => handleQuestionTitleChange(e.target.value)}
                className="w-full"
                disabled={isSubmitting}
              />
              {errors.questionTitle && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.questionTitle}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <Textarea
                placeholder="Add additional context or instructions for this question..."
                value={currentQuestion.description}
                onChange={(e) =>
                  handleQuestionDescriptionChange(e.target.value)
                }
                className="w-full min-h-[100px]"
                disabled={isSubmitting}
              />
            </div>

            {/* Question Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Image (Optional)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelected}
              />
              <Button
                variant="outline"
                className="w-full h-20 border-dashed"
                onClick={handleChooseImage}
                disabled={isSubmitting}
              >
                <Upload className="w-5 h-5 mr-2" />
                {currentQuestion.imageFile ? 'Change Image' : 'Choose Image'}
              </Button>
              {currentQuestion.imageFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {currentQuestion.imageFile.name}
                </p>
              )}
            </div>

            {/* Answer Options */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Answer Options
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  className="text-gray-600"
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {currentQuestion.answerOptions.map((option, idx) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <Checkbox
                      checked={option.isCorrect}
                      onCheckedChange={(checked: boolean | 'indeterminate') =>
                        handleOptionCorrectChange(option.id, checked as boolean)
                      }
                    />
                    <Input
                      value={option.text}
                      placeholder={`Option ${idx + 1}`}
                      onChange={(e) =>
                        handleOptionTextChange(option.id, e.target.value)
                      }
                      className="flex-1"
                      disabled={isSubmitting}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(option.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={
                        currentQuestion.answerOptions.length <= 1 ||
                        isSubmitting
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {errors.questionOptions && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.questionOptions}
                </p>
              )}

              <p className="text-sm text-gray-500 mt-3">
                Check the correct answer(s) for this question. At least one
                answer must be marked as correct.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || isSubmitting}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-2">
              {currentQuestionIndex < TOTAL_QUESTIONS - 1 ? (
                <Button onClick={handleNext} disabled={isSubmitting}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Exam
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
