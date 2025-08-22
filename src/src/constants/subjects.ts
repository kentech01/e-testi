import { Calculator, BookOpen, Globe } from 'lucide-react';
import { Subject } from '../types/exam';

export const SUBJECTS = [
  { 
    id: 'matematik' as Subject, 
    name: 'Matematika', 
    nameEn: 'Mathematics',
    count: 45, 
    color: 'bg-blue-500',
    icon: Calculator,
    iconColor: 'text-blue-600'
  },
  { 
    id: 'gjuhaShqipe' as Subject, 
    name: 'Gjuha Shqipe', 
    nameEn: 'Albanian Language',
    count: 38, 
    color: 'bg-green-500',
    icon: BookOpen,
    iconColor: 'text-green-600'
  },
  { 
    id: 'anglisht' as Subject, 
    name: 'Gjuha Angleze', 
    nameEn: 'English Language',
    count: 32, 
    color: 'bg-purple-500',
    icon: Globe,
    iconColor: 'text-purple-600'
  },
];

export const SUBJECT_INFO = SUBJECTS.reduce((acc, subject) => {
  acc[subject.id] = subject;
  return acc;
}, {} as Record<Subject, typeof SUBJECTS[0]>);