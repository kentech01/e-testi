import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import examService from '../../services/exams';
import questionsService from '../../services/questions';
import sectorService from '../../services/sectors';
import { storageService } from '../../lib/firebase';
import { Sector } from '../../services/sectors';

interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface CreateExamFormProps {
  onBack: () => void;
  onSave?: (examData: any) => void;
}

export function CreateExamForm({ onBack, onSave }: CreateExamFormProps) {
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [sectorId, setSectorId] = useState<string>('');
  const [passingScoreText, setPassingScoreText] = useState<string>('40');
  const [examId, setExamId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [errors, setErrors] = useState<{
    examTitle?: string;
    examDescription?: string;
    sectorId?: string;
    passingScore?: string;
    questionTitle?: string;
    questionOptions?: string;
  }>({});

  const [questionTitle, setQuestionTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([
    { id: '1', text: '', isCorrect: false },
    { id: '2', text: '', isCorrect: false },
    { id: '3', text: '', isCorrect: false },
    { id: '4', text: '', isCorrect: false },
  ]);

  // Fetch sectors on mount
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        setLoadingSectors(true);
        const fetchedSectors = await sectorService.getSectors();
        setSectors(fetchedSectors);
        if (fetchedSectors.length > 0 && !sectorId) {
          setSectorId(fetchedSectors[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch sectors:', error);
        setApiError('Failed to load sectors. Please refresh the page.');
      } finally {
        setLoadingSectors(false);
      }
    };

    fetchSectors();
  }, []);

  const handleAddOption = () => {
    const newOption: AnswerOption = {
      id: Date.now().toString(),
      text: `Option ${answerOptions.length + 1}`,
      isCorrect: false,
    };
    setAnswerOptions([...answerOptions, newOption]);
  };

  const handleRemoveOption = (optionId: string) => {
    if (answerOptions.length > 1) {
      setAnswerOptions(
        answerOptions.filter((option) => option.id !== optionId)
      );
    }
  };

  const handleOptionTextChange = (optionId: string, text: string) => {
    setAnswerOptions(
      answerOptions.map((option) =>
        option.id === optionId ? { ...option, text } : option
      )
    );
  };

  const handleOptionCorrectChange = (optionId: string, isCorrect: boolean) => {
    setAnswerOptions(
      answerOptions.map((option) =>
        option.id === optionId ? { ...option, isCorrect } : option
      )
    );
  };

  const optionLetterForIndex = (i: number): string =>
    String.fromCharCode('A'.charCodeAt(0) + i);

  const handleChooseImage = () => fileInputRef.current?.click();
  const handleImageSelected: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setImageFile(e.target.files?.[0] || null);
  };

  const validate = () => {
    const v: typeof errors = {};
    if (!examTitle.trim()) v.examTitle = 'Exam title is required.';
    if (!examDescription.trim())
      v.examDescription = 'Exam description is required.';
    if (!sectorId) v.sectorId = 'Please select a sector.';
    const parsedPassing =
      passingScoreText === '' ? NaN : Number(passingScoreText);
    if (!Number.isFinite(parsedPassing) || parsedPassing < 0)
      v.passingScore = 'Passing score must be a number ≥ 0.';
    if (!questionTitle.trim()) v.questionTitle = 'Question title is required.';
    if (!answerOptions.some((o) => o.isCorrect))
      v.questionOptions = 'At least one option must be marked correct.';
    setErrors(v);
    return Object.keys(v).length === 0;
  };

  const handleSave = async () => {
    setApiError(null);
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      // Ensure exam exists
      let ensuredExamId = examId;
      if (!ensuredExamId) {
        const created = await examService.createExam({
          title: examTitle,
          description: examDescription,
          sectorId,
          isActive: true,
          totalQuestions: 1,
          passingScore: Number(passingScoreText),
        } as any);
        ensuredExamId = String((created as any).id);
        setExamId(ensuredExamId);
      }

      // Upload image if any
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        const safeName = imageFile.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const path = `exams/${ensuredExamId}/questions/1/${Date.now()}_${safeName}`;
        imageUrl = await storageService.uploadFileWithProgress(imageFile, path);
      }

      // Create question
      await questionsService.createQuestion({
        text: questionTitle,
        imageUrl,
        examId: ensuredExamId!,
        subject: 'general',
        orderNumber: 1,
        points: 1,
        isActive: true,
        options: answerOptions.map((opt, idx) => ({
          text: opt.text || `Option ${idx + 1}`,
          optionLetter: optionLetterForIndex(idx),
          isCorrect: !!opt.isCorrect,
        })),
      });

      if (onSave) {
        onSave({ examId: ensuredExamId });
      }
      // success UI is optional; keeping quiet to avoid alerts
    } catch (err: any) {
      setApiError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to create exam/question.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exams
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Exam</h1>
          <p className="text-gray-600 mt-1">
            Create a new exam question with multiple choice answers.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informatat e Testit</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titulli i Testit
            </label>
            <Input
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="Enter exam title..."
              disabled={!!examId}
            />
            {errors.examTitle && (
              <p className="mt-1 text-sm text-red-600">{errors.examTitle}</p>
            )}
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Përshkrimi i Testit
            </label>
            <Textarea
              value={examDescription}
              onChange={(e) => setExamDescription(e.target.value)}
              placeholder="Enter exam description..."
              disabled={!!examId}
            />
            {errors.examDescription && (
              <p className="mt-1 text-sm text-red-600">
                {errors.examDescription}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Klasa
            </label>
            <select
              className="w-full border rounded-md h-10 px-3"
              value={sectorId}
              onChange={(e) => setSectorId(e.target.value)}
              disabled={!!examId || loadingSectors}
            >
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.displayName}
                </option>
              ))}
            </select>
            {errors.sectorId && (
              <p className="mt-1 text-sm text-red-600">{errors.sectorId}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pikët Kaluese
            </label>
            <Input
              type="text"
              inputMode="numeric"
              value={passingScoreText}
              placeholder="40"
              onChange={(e) => setPassingScoreText(e.target.value)}
              disabled={true}
            />
            {errors.passingScore && (
              <p className="mt-1 text-sm text-red-600">{errors.passingScore}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Totali i Pyetjeve
            </label>
            <Input type="number" value={1} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
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
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                {imageFile ? 'Change Image' : 'Choose Image'}
              </Button>
              {imageFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {imageFile.name}
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
                {answerOptions.map((option, idx) => (
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
                      disabled={answerOptions.length <= 1 || isSubmitting}
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

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <Button
              onClick={handleSave}
              style={{ minWidth: '160px' }}
              disabled={isSubmitting}
            >
              <Plus className="w-4 h-4" />
              Create New Exam
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
