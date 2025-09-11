import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface Exam {
  id: number;
  title: string;
  subject: string;
  grade: string;
  status: 'Published' | 'Draft' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

const mockExams: Exam[] = [
  {
    id: 1,
    title: 'Midterm Mathematics Exam',
    subject: 'Mathematics',
    grade: 'Grade 10',
    status: 'Published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
  },
  {
    id: 2,
    title: 'English Literature Quiz',
    subject: 'English',
    grade: 'Grade 9',
    status: 'Draft',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
  },
  {
    id: 3,
    title: 'Physics Final Assessment',
    subject: 'Physics',
    grade: 'Grade 12',
    status: 'Published',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-22',
  },
  {
    id: 4,
    title: 'History Chapter Test',
    subject: 'History',
    grade: 'Grade 11',
    status: 'Archived',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15',
  },
  {
    id: 5,
    title: 'Chemistry Lab Practical',
    subject: 'Chemistry',
    grade: 'Grade 11',
    status: 'Published',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-25',
  },
  {
    id: 6,
    title: 'Biology Unit Test',
    subject: 'Biology',
    grade: 'Grade 10',
    status: 'Draft',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
];

export function TestManagement() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>(mockExams);

  const getStatusBadgeVariant = (status: Exam['status']) => {
    switch (status) {
      case 'Published':
        return 'default';
      case 'Draft':
        return 'secondary';
      case 'Archived':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleCreateExam = () => {
    console.log('Create exam button clicked!'); // Debug log
    navigate('/test-management/create');
  };

  const handleViewExam = (examId: number) => {
    console.log('View exam:', examId);
  };

  const handleEditExam = (examId: number) => {
    console.log('Edit exam:', examId);
  };

  const handleDeleteExam = (examId: number) => {
    setExams(exams.filter((exam) => exam.id !== examId));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
          <p className="text-gray-600 mt-1">
            Manage and organize all your exams in one place.
          </p>
        </div>
        <Button
          onClick={handleCreateExam}
          className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md flex items-center gap-2 font-medium"
          style={{ minWidth: '160px' }}
        >
          <Plus className="w-4 h-4" />
          Create New Exam
        </Button>
      </div>

      {/* Exams Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Subject</TableHead>
                <TableHead className="font-semibold">Grade</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell className="text-gray-600">
                    {exam.subject}
                  </TableCell>
                  <TableCell className="text-gray-600">{exam.grade}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(exam.status)}>
                      {exam.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewExam(exam.id)}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditExam(exam.id)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExam(exam.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
