import React, { useState } from 'react';
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
}

const TOTAL_QUESTIONS = 100;

export function CreateExam() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>(() => {
    // Initialize with 100 empty questions
    return Array.from({ length: TOTAL_QUESTIONS }, (_, index) => ({
      id: index + 1,
      title: '',
      description: '',
      answerOptions: [
        { id: `${index + 1}-1`, text: 'Option 1', isCorrect: false },
        { id: `${index + 1}-2`, text: 'Option 2', isCorrect: false },
        { id: `${index + 1}-3`, text: 'Option 3', isCorrect: false },
        { id: `${index + 1}-4`, text: 'Option 4', isCorrect: false },
      ],
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

  const handleNext = () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSave = () => {
    // Validate that all questions have at least one correct answer
    const invalidQuestions = questions.filter(
      (q) => !q.answerOptions.some((option) => option.isCorrect)
    );

    if (invalidQuestions.length > 0) {
      alert(
        `Please ensure all questions have at least one correct answer. Invalid questions: ${invalidQuestions.map((q) => q.id).join(', ')}`
      );
      return;
    }

    // Here you would typically save to your backend/database
    console.log('Saving exam with 100 questions:', {
      title: examTitle,
      description: examDescription,
      questions,
    });

    // Navigate back to test management
    navigate('/test-management');
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
            />
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
            />
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
              />
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
              />
            </div>

            {/* Question Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Image (Optional)
              </label>
              <Button variant="outline" className="w-full h-20 border-dashed">
                <Upload className="w-5 h-5 mr-2" />
                Choose Image
              </Button>
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
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {currentQuestion.answerOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <Checkbox
                      checked={option.isCorrect}
                      onCheckedChange={(checked) =>
                        handleOptionCorrectChange(option.id, checked as boolean)
                      }
                    />
                    <Input
                      value={option.text}
                      onChange={(e) =>
                        handleOptionTextChange(option.id, e.target.value)
                      }
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(option.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={currentQuestion.answerOptions.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

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
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-2">
              {currentQuestionIndex < TOTAL_QUESTIONS - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
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
