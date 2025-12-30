import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import examService from '../services/exams';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Exam } from '../services/exams';

export function TestManagement() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<number | null | string>(null);

  // Fetch exams on mount
  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const fetchedExams = await examService.getExams();
      setExams(fetchedExams);
      
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      toast.error('Dështoi ngarkimi i testeve');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = () => {
    navigate('/test-management/create');
  };

  const handleViewExam = (examId: number) => {
    console.log('View exam:', examId);
    // TODO: Implement view functionality
  };

  const handleEditExam = async (examId: string | number) => {    
    const fetchedExam = await examService.getExamById(examId);
    const firstQuestion = fetchedExam.questions!.find(obj => obj.orderNumber === 1);
    
  navigate(`/test-management/edit/testi/${examId}/pyetja/${firstQuestion!.id}`);
    
  };

  const handleDeleteClick = (examId: number | string) => {
    setExamToDelete(examId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (examToDelete === null) return;

    try {
      await examService.deleteExam(examToDelete);
      setExams(exams.filter((exam) => exam.id !== examToDelete));
      toast.success('Testi u fshi me sukses');
    } catch (error) {
      console.error('Failed to delete exam:', error);
      toast.error('Dështoi fshirja e testit');
    } finally {
      setDeleteDialogOpen(false);
      setExamToDelete(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Testet</h1>
          <p className="mt-1">
            Menaxho dhe organizo të gjitha testet ne një vend.
          </p>
        </div>
        <Button
          onClick={handleCreateExam}
          
          style={{ minWidth: '160px' }}
        >
          <Plus className="w-4 h-4" />
          Krijo një test të ri
        </Button>
      </div>

      {/* Exams Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-gray-500">Duke u ngarkuar provimet...</div>
            </div>
          ) : exams.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <p className="text-gray-500 mb-4">Nuk u gjet asnjë test</p>
              <Button onClick={handleCreateExam}>
                <Plus className="w-4 h-4 mr-2" />
                Krijo testin tuaj të parë
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Titulli</TableHead>
                  <TableHead className="font-semibold">Klasa</TableHead>
                  <TableHead className="font-semibold">Statusi</TableHead>
                  <TableHead className="font-semibold">Pyetjet</TableHead>
                  <TableHead className="font-semibold text-right">
                    Veprime
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell className="text-gray-600">
                      {exam.sector?.displayName || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={exam.isActive ? 'default' : 'secondary'}>
                        {exam.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {exam.totalQuestions}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
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
                          onClick={() => handleDeleteClick(exam.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              exam and all of its questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
