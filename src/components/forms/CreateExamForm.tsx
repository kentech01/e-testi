import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import { ArrowLeft, Plus, X, Upload, Save } from 'lucide-react';

interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface CreateExamFormProps {
  onBack: () => void;
  onSave: (examData: any) => void;
}

export function CreateExamForm({ onBack, onSave }: CreateExamFormProps) {
  const [questionTitle, setQuestionTitle] = useState('');
  const [description, setDescription] = useState('');
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([
    { id: '1', text: 'Option 1', isCorrect: false },
    { id: '2', text: 'Option 2', isCorrect: false },
    { id: '3', text: 'Option 3', isCorrect: false },
    { id: '4', text: 'Option 4', isCorrect: false },
  ]);

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

  const handleSave = () => {
    const hasCorrectAnswer = answerOptions.some((option) => option.isCorrect);
    if (!hasCorrectAnswer) {
      alert('At least one answer must be marked as correct.');
      return;
    }

    onSave({
      title: questionTitle,
      description,
      answerOptions,
    });
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

      <Card>
        <CardContent className="p-6">
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
              />
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
                {answerOptions.map((option) => (
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
                      disabled={answerOptions.length <= 1}
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

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <Button onClick={handleSave} style={{ minWidth: '160px' }}>
              <Plus className="w-4 h-4" />
              Create New Exam
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
