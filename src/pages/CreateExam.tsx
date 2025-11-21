import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { examCacheAtom } from '../store/atoms/createExamAtom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
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
import type { Exam } from '../services/exams';
import type { Question as ServiceQuestion } from '../services/questions';
import useSectors from '../hooks/useSectors';
import {
  getGradeRangeFromSector,
  getSubjectsForGradeRange,
  type Subject,
} from '../data/subjects';

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
  subject?: string;
}

const TOTAL_QUESTIONS = 100;

export function CreateExam() {
  const navigate = useNavigate();
  const params = useParams<{ examId?: string; questionId?: string }>();

  // Recoil cache state
  const [examCache, setExamCache] = useRecoilState(examCacheAtom);

  // Local state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [sectorId, setSectorId] = useState<string>('');
  const [passingScoreText, setPassingScoreText] = useState<string>('40');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examId, setExamId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    sectors,
    loading: loadingSectors,
    ensureSectorsLoaded,
  } = useSectors();
  const [createdQuestionIds, setCreatedQuestionIds] = useState<Set<number>>(
    new Set()
  );
  const [questionIdMap, setQuestionIdMap] = useState<Map<number, string>>(
    new Map()
  );
  const [errors, setErrors] = useState<{
    examTitle?: string;
    examDescription?: string;
    sectorId?: string;
    passingScore?: string;
    questionTitle?: string;
    questionSubject?: string;
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
      subject: undefined,
    }));
  });

  // Ensure sectors are loaded only if not cached
  useEffect(() => {
    ensureSectorsLoaded();
  }, [ensureSectorsLoaded]);

  // Track previous sector to detect changes
  const previousSectorIdRef = useRef<string>('');

  // Default sector selection after sectors are available
  useEffect(() => {
    if (sectors.length > 0 && !sectorId) {
      setSectorId(sectors[0].id);
    }
  }, [sectors, sectorId]);

  // Clear subject when sector changes (but not on initial load)
  useEffect(() => {
    if (
      sectorId &&
      previousSectorIdRef.current &&
      previousSectorIdRef.current !== sectorId
    ) {
      // Clear subject for all questions when sector changes
      setQuestions((prev) => prev.map((q) => ({ ...q, subject: undefined })));
    }
    // Update the ref after checking
    if (sectorId) {
      previousSectorIdRef.current = sectorId;
    }
  }, [sectorId]);

  // Track which examId we've initialized for to prevent effect from resetting navigation
  const initializedExamIdRef = useRef<string | null>(null);
  // Track last questionId we set index from to avoid unnecessary resets
  const lastQuestionIdRef = useRef<string | null>(null);
  // Track if we're currently processing to prevent concurrent runs
  const isProcessingRef = useRef(false);
  // Track if we're navigating programmatically to skip effect re-runs
  const isNavigatingRef = useRef(false);
  // Ref to access questions without causing re-renders
  const questionsRef = useRef(questions);
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  console.log('questions', questions);

  // Refs to access Set/Map without causing re-renders in callbacks
  const createdQuestionIdsRef = useRef(createdQuestionIds);
  useEffect(() => {
    createdQuestionIdsRef.current = createdQuestionIds;
  }, [createdQuestionIds]);

  const questionIdMapRef = useRef(questionIdMap);
  useEffect(() => {
    questionIdMapRef.current = questionIdMap;
  }, [questionIdMap]);

  // Ref to access examCache without causing re-renders in callbacks
  const examCacheRef = useRef(examCache);
  useEffect(() => {
    examCacheRef.current = examCache;
  }, [examCache]);

  // Fetch exam and question data if params are present (always fresh)
  useEffect(() => {
    // Only fetch if examId is provided and we haven't initialized for this examId
    if (!params.examId || initializedExamIdRef.current === params.examId) {
      return;
    }

    // Skip if we're navigating programmatically
    if (isNavigatingRef.current) {
      return;
    }

    // Prevent concurrent runs or re-runs
    if (isProcessingRef.current) {
      return;
    }

    console.log('examCache', examCache);

    const fetchExamData = async () => {
      // Mark as processing immediately to prevent concurrent runs
      isProcessingRef.current = true;
      initializedExamIdRef.current = params.examId!; // Set this immediately to prevent re-runs
      setIsLoading(true);

      try {
        // Reset questionId ref when switching to a different exam
        lastQuestionIdRef.current = null;

        const examIdToFetch = params.examId!;
        setExamId(examIdToFetch);

        // Check cache first, then fetch if not available
        let fetchedExam: Exam;
        let fetchedQuestions: ServiceQuestion[];

        const cachedExam = examCache.exams.get(examIdToFetch);
        const cachedQuestions = examCache.questions.get(examIdToFetch);

        if (cachedExam && cachedQuestions) {
          // Use cached data
          fetchedExam = cachedExam;
          fetchedQuestions = cachedQuestions;
        } else {
          // Fetch fresh data
          fetchedExam = await examService.getExamById(examIdToFetch);
          fetchedQuestions =
            await questionsService.getQuestionsByExam(examIdToFetch);

          // Cache the fetched data
          setExamCache((prev) => ({
            ...prev,
            exams: new Map([...prev.exams, [examIdToFetch, fetchedExam]]),
            questions: new Map([
              ...prev.questions,
              [examIdToFetch, fetchedQuestions],
            ]),
          }));
        }

        // Build maps and populate questions
        const newCreatedIds = new Set<number>();
        const newIdMap = new Map<number, string>();
        const updatedQuestions: Question[] = [];

        fetchedQuestions.forEach((dbQuestion) => {
          const localId = dbQuestion.orderNumber;
          newCreatedIds.add(localId);
          newIdMap.set(localId, dbQuestion.id);
        });

        // Create updated questions array
        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
          const localId = i + 1;
          const dbQuestion = fetchedQuestions.find(
            (q) => q.orderNumber === localId
          );
          if (dbQuestion) {
            updatedQuestions.push({
              id: localId,
              title: dbQuestion.text,
              description: dbQuestion.description || '',
              answerOptions:
                dbQuestion.options?.map((opt, idx) => ({
                  id: `${localId}-${idx + 1}`,
                  text: normalizeOptionText(opt.text, idx),
                  isCorrect: opt.isCorrect,
                })) || [],
              imageUrl: dbQuestion.imageUrl,
              imageFile: null,
              subject: dbQuestion.subject?.trim(),
            });
          } else {
            // Keep existing question structure
            updatedQuestions.push({
              id: localId,
              title: '',
              description: '',
              answerOptions: [
                { id: `${localId}-1`, text: '', isCorrect: false },
                { id: `${localId}-2`, text: '', isCorrect: false },
                { id: `${localId}-3`, text: '', isCorrect: false },
                { id: `${localId}-4`, text: '', isCorrect: false },
              ],
              imageFile: null,
              imageUrl: undefined,
              subject: undefined,
            });
          }
        }

        // Batch all state updates together - only on initial load
        setExamTitle(fetchedExam.title);
        setExamDescription(fetchedExam.description || '');
        setSectorId(fetchedExam.sectorId);
        setPassingScoreText(String(fetchedExam.passingScore));
        setQuestions(updatedQuestions);
        setCreatedQuestionIds(newCreatedIds);
        setQuestionIdMap(newIdMap);

        // On initial load, navigate to the last question (highest orderNumber) if editing
        if (fetchedQuestions.length > 0) {
          // If questionId is in URL, navigate to that question
          if (params.questionId) {
            const questionIndex = Array.from(newIdMap.entries()).findIndex(
              ([_, dbId]) => dbId === params.questionId
            );
            if (questionIndex !== -1) {
              const localId = Array.from(newIdMap.keys())[questionIndex];
              const targetIndex = localId - 1; // localId is 1-based, index is 0-based
              setCurrentQuestionIndex(targetIndex);
              lastQuestionIdRef.current = params.questionId;
            } else {
              // Question not found, navigate to last question
              const maxOrderNumber = Math.max(
                ...fetchedQuestions.map((q) => q.orderNumber)
              );
              const lastQuestion = fetchedQuestions.find(
                (q) => q.orderNumber === maxOrderNumber
              );
              const targetIndex = maxOrderNumber - 1;
              const safeIndex = Math.min(targetIndex, TOTAL_QUESTIONS - 1);
              setCurrentQuestionIndex(safeIndex);
              if (lastQuestion?.id) {
                lastQuestionIdRef.current = lastQuestion.id;
                const url = `/test-management/edit/${params.examId}/${lastQuestion.id}`;
                isNavigatingRef.current = true;
                navigate(url, { replace: true });
                setTimeout(() => {
                  isNavigatingRef.current = false;
                }, 100);
              }
            }
          } else {
            // No questionId in URL, navigate to last question
            const maxOrderNumber = Math.max(
              ...fetchedQuestions.map((q) => q.orderNumber)
            );
            const lastQuestion = fetchedQuestions.find(
              (q) => q.orderNumber === maxOrderNumber
            );
            const targetIndex = maxOrderNumber - 1;
            const safeIndex = Math.min(targetIndex, TOTAL_QUESTIONS - 1);
            setCurrentQuestionIndex(safeIndex);
            if (lastQuestion?.id) {
              lastQuestionIdRef.current = lastQuestion.id;
              const url = `/test-management/edit/${params.examId}/${lastQuestion.id}`;
              isNavigatingRef.current = true;
              navigate(url, { replace: true });
              setTimeout(() => {
                isNavigatingRef.current = false;
              }, 100);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch exam data:', error);
        setApiError('Failed to load exam data. Please refresh the page.');
      } finally {
        isProcessingRef.current = false;
        setIsLoading(false);
      }
    };

    fetchExamData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.examId]);

  const currentQuestion = questions[currentQuestionIndex];

  // Get available subjects based on selected sector
  const availableSubjects = useMemo(() => {
    if (!sectorId) return [];
    const selectedSector = sectors.find((s) => s.id === sectorId);
    if (!selectedSector) return [];
    const gradeRange = getGradeRangeFromSector(
      selectedSector.displayName || selectedSector.name
    );
    return getSubjectsForGradeRange(gradeRange);
  }, [sectorId, sectors]);

  // Map currentQuestion.subject (which may be an old label or value)
  // to the canonical subject value used by the Select options.
  const selectedSubjectValue: string | undefined = useMemo(() => {
    // If there are no subjects for the current sector, keep the Select "empty"
    // so the placeholder text is visible.
    if (!sectorId || availableSubjects.length === 0) {
      return undefined;
    }

    const subjRaw = currentQuestion?.subject;
    if (!subjRaw) return undefined;

    const subj = subjRaw.trim();
    if (!subj) return undefined;
    const normalized = subj.toLowerCase();

    // 1) Match by value (case-insensitive, trimmed)
    const byValue = availableSubjects.find(
      (s) => s.value.trim().toLowerCase() === normalized
    );
    if (byValue) return byValue.value;

    // 2) Match by label (for older data stored as label text)
    const byLabel = availableSubjects.find(
      (s) => s.label.trim().toLowerCase() === normalized
    );
    if (byLabel) return byLabel.value;

    // 3) No matching subject in the available list – treat as unset so
    // the placeholder is shown instead of a blank value.
    return undefined;
  }, [currentQuestion?.subject, availableSubjects, sectorId]);

  // Memoized local preview URL for selected (not yet uploaded) image
  const imageObjectUrl = useMemo(() => {
    return currentQuestion?.imageFile
      ? URL.createObjectURL(currentQuestion.imageFile)
      : null;
  }, [currentQuestion?.imageFile]);
  useEffect(() => {
    return () => {
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    };
  }, [imageObjectUrl]);

  const handleAddOption = () => {
    const newOption: AnswerOption = {
      id: `${currentQuestionIndex + 1}-${Date.now()}`,
      // Keep value empty so the user doesn't need to delete "Option N" before typing.
      // The visible label still comes from the input's placeholder.
      text: '',
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

  const handleQuestionSubjectChange = (subject: string) => {
    setQuestions(
      questions.map((q, index) =>
        index === currentQuestionIndex ? { ...q, subject } : q
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
        index === currentQuestionIndex
          ? {
              ...q,
              // Clear previously uploaded image when a new image is chosen
              imageUrl: file ? undefined : q.imageUrl,
              imageFile: file,
            }
          : q
      )
    );
  };

  const optionLetterForIndex = (i: number): string => {
    return String.fromCharCode('A'.charCodeAt(0) + i);
  };

  const normalizeOptionText = (
    text: string | undefined | null,
    idx: number
  ) => {
    const t = (text ?? '').trim();
    const defaultLabel = `Option ${idx + 1}`;
    return t === defaultLabel ? '' : t;
  };

  const validateExam = useCallback((): boolean => {
    const newErrors: typeof errors = {};
    if (!examTitle.trim()) newErrors.examTitle = 'Exam title is required.';
    if (!examDescription.trim())
      newErrors.examDescription = 'Exam description is required.';
    if (!sectorId) newErrors.sectorId = 'Please select a sector.';
    const parsedPassing =
      passingScoreText === '' ? NaN : Number(passingScoreText);
    if (!Number.isFinite(parsedPassing) || parsedPassing < 0)
      newErrors.passingScore = 'Passing score must be a number ≥ 0.';
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [examTitle, examDescription, sectorId, passingScoreText]);

  const validateQuestion = useCallback((q: Question): boolean => {
    const newErrors: typeof errors = {};
    if (!q.title.trim())
      newErrors.questionTitle = `Question ${q.id} title is required.`;
    if (!q.subject || !q.subject.trim())
      newErrors.questionSubject = `Question ${q.id} subject is required.`;
    if (!q.answerOptions.some((o) => o.isCorrect))
      newErrors.questionOptions = 'At least one option must be marked correct.';
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, []);

  // Check if current question has validation errors
  const hasQuestionErrors = useMemo(() => {
    const q = currentQuestion;
    if (!q) return false;
    const hasTitleError = !q.title.trim();
    const hasSubjectError = !q.subject || !q.subject.trim();
    const hasOptionsError = !q.answerOptions.some((o) => o.isCorrect);
    return hasTitleError || hasSubjectError || hasOptionsError;
  }, [currentQuestion]);

  // Check if exam has validation errors
  const hasExamErrors = useMemo(() => {
    return !examTitle.trim() || !examDescription.trim() || !sectorId;
  }, [examTitle, examDescription, sectorId]);

  // Check if there are any errors that would prevent navigation
  const hasErrors = hasExamErrors || hasQuestionErrors;

  // Check if current question has changed compared to cached version
  const hasQuestionChanged = useCallback((): boolean => {
    const q = questionsRef.current[currentQuestionIndex];
    if (!q || !examId) return true; // If no question or exam, treat as changed

    const currentCache = examCacheRef.current;
    const cachedQuestions = currentCache.questions.get(examId);
    if (!cachedQuestions) return true; // No cache, treat as changed

    const cachedQuestion = cachedQuestions.find(
      (cq) => cq.orderNumber === q.id
    );
    if (!cachedQuestion) return true; // Question not in cache, treat as changed

    // Check if question fields changed
    if (q.title !== (cachedQuestion.text || '')) return true;
    if (q.description !== (cachedQuestion.description || '')) return true;
    if (q.subject !== (cachedQuestion.subject || '')) return true;
    if (!!q.imageFile) return true; // New image file selected
    if (q.imageUrl !== cachedQuestion.imageUrl) return true;

    // Check if options changed
    const cachedOpts = cachedQuestion.options || [];
    if (q.answerOptions.length !== cachedOpts.length) return true;

    for (let i = 0; i < q.answerOptions.length; i++) {
      const local = q.answerOptions[i];
      const remote = cachedOpts[i];
      if (!remote) return true;
      if (local.text !== (remote.text || '')) return true;
      if (!!local.isCorrect !== !!remote.isCorrect) return true;
    }

    return false; // No changes detected
  }, [currentQuestionIndex, examId]);

  // Check if exam data has changed
  const hasExamChanged = useCallback((): boolean => {
    if (!examId) return true; // No exam yet, treat as changed

    const currentCache = examCacheRef.current;
    const cachedExam = currentCache.exams.get(examId);
    if (!cachedExam) return true; // No cache, treat as changed

    // Check if exam fields changed
    if (examTitle !== (cachedExam.title || '')) return true;
    if (examDescription !== (cachedExam.description || '')) return true;
    if (sectorId !== cachedExam.sectorId) return true;

    return false; // No changes detected
  }, [examId, examTitle, examDescription, sectorId]);

  const persistCurrentQuestion = useCallback(async (): Promise<{
    success: boolean;
    dbQuestionId?: string;
  }> => {
    const q = questionsRef.current[currentQuestionIndex];

    setApiError(null);
    // Validate
    const examOk = validateExam();
    const questionOk = validateQuestion(q);
    if (!examOk || !questionOk) return { success: false };

    const parsedPassing = Number(passingScoreText);

    // Check if question exists
    const currentCreatedIds = createdQuestionIdsRef.current;
    const isCreated = currentCreatedIds.has(q.id);
    const allQuestionsCreated = currentCreatedIds.size >= TOTAL_QUESTIONS;

    // If all 100 questions are created and this question is not one of them, don't allow creating it
    if (allQuestionsCreated && !isCreated) {
      setApiError(
        'All 100 questions have been created. You can only edit existing questions.'
      );
      return { success: false };
    }

    // Create exam if this is the first persist; also update title/description/sector if editing
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
      } else {
        // Always update exam fields
        const updatedExam = await examService.updateExam(ensuredExamId, {
          title: examTitle,
          description: examDescription,
          sectorId: sectorId,
        });

        // Update cache with updated exam
        if (ensuredExamId) {
          const examIdKey = ensuredExamId;
          setExamCache((prev) => ({
            ...prev,
            exams: new Map([...prev.exams, [examIdKey, updatedExam as Exam]]),
          }));
        }
      }

      // Upload image if selected, otherwise use existing imageUrl
      let imageUrl: string | undefined = q.imageUrl || undefined;
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

      const questionData = {
        text: q.title,
        imageUrl,
        examId: ensuredExamId!,
        subject: q.subject || 'general',
        orderNumber: q.id,
        points: 1,
        isActive: true,
        description: q.description,
        options,
      };

      let dbQuestionId: string;
      const isQuestionCreated = currentCreatedIds.has(q.id);

      const currentIdMap = questionIdMapRef.current;

      if (isQuestionCreated) {
        // Update existing question
        const existingDbId = currentIdMap.get(q.id);
        if (!existingDbId) {
          throw new Error('Question database ID not found for update');
        }
        const updated = await questionsService.updateQuestion(
          existingDbId,
          questionData
        );
        dbQuestionId = existingDbId;

        // Update cache with updated question
        if (ensuredExamId) {
          const examIdKey = ensuredExamId;
          setExamCache((prev) => {
            const existing = prev.questions.get(examIdKey) || [];
            const updatedQuestions = existing.map((ques) =>
              ques.id === dbQuestionId ? (updated as ServiceQuestion) : ques
            );
            return {
              ...prev,
              questions: new Map([
                ...prev.questions,
                [examIdKey, updatedQuestions],
              ]),
            };
          });
        }
      } else {
        // Create new question
        const created = await questionsService.createQuestion(questionData);
        dbQuestionId = created.id;
        setCreatedQuestionIds((prev) => new Set([...prev, q.id]));
        setQuestionIdMap((prev) => new Map([...prev, [q.id, dbQuestionId]]));

        // Update cache with new question
        if (ensuredExamId) {
          const examIdKey = ensuredExamId;
          setExamCache((prev) => {
            const existing = prev.questions.get(examIdKey) || [];
            const updated = [...existing, created as ServiceQuestion];
            return {
              ...prev,
              questions: new Map([...prev.questions, [examIdKey, updated]]),
            };
          });
        }

        // Check if we just reached 100 questions
        const updatedCreatedIds = new Set([...currentCreatedIds, q.id]);
        if (updatedCreatedIds.size >= TOTAL_QUESTIONS) {
          // Navigate back to test-management after a short delay
          setTimeout(() => {
            navigate('/test-management');
          }, 500);
          return { success: true, dbQuestionId };
        }
      }

      // Persist saved data back into local state (title, description, options, image)
      setQuestions((prev) =>
        prev.map((question, index) => {
          if (index !== currentQuestionIndex) return question;
          return {
            ...question,
            title: q.title,
            description: q.description,
            subject: q.subject,
            answerOptions: q.answerOptions.map((opt, idx) => ({
              id: opt.id,
              text: opt.text || `Option ${idx + 1}`,
              isCorrect: !!opt.isCorrect,
            })),
            imageUrl: imageUrl || question.imageUrl,
            imageFile: null,
          };
        })
      );

      return { success: true, dbQuestionId };
    } catch (e: any) {
      setApiError(
        e?.response?.data?.message || e?.message || 'Failed to save.'
      );
      return { success: false };
    }
  }, [
    currentQuestionIndex,
    examId,
    examTitle,
    examDescription,
    sectorId,
    passingScoreText,
    validateExam,
    validateQuestion,
    navigate,
  ]);

  const ensureQuestionExists = useCallback(
    async (localId: number): Promise<string | undefined> => {
      if (!examId) return undefined;

      // Check if all 100 questions are already created
      const currentCreatedIds = createdQuestionIdsRef.current;
      const allQuestionsCreated = currentCreatedIds.size >= TOTAL_QUESTIONS;

      // If all questions are created, don't allow creating more
      if (allQuestionsCreated && !currentCreatedIds.has(localId)) {
        throw new Error(
          'All 100 questions have been created. You can only edit existing questions.'
        );
      }

      const currentIdMap = questionIdMapRef.current;
      const existing = currentIdMap.get(localId);
      if (existing) return existing;

      const defaultOptions = Array.from({ length: 4 }, (_, idx) => ({
        text: `Option ${idx + 1}`,
        optionLetter: optionLetterForIndex(idx),
        isCorrect: false,
      }));

      // Get subject from current question state if available
      const currentQuestion = questionsRef.current.find(
        (q) => q.id === localId
      );
      const questionSubject = currentQuestion?.subject || 'general';

      const created = await questionsService.createQuestion({
        text: '',
        imageUrl: undefined,
        examId: examId,
        subject: questionSubject,
        orderNumber: localId,
        points: 1,
        isActive: true,
        options: defaultOptions,
      });

      const dbId = created.id;
      const newCreatedIds = new Set([...currentCreatedIds, localId]);
      setCreatedQuestionIds(newCreatedIds);
      setQuestionIdMap((prev) => new Map([...prev, [localId, dbId]]));

      // Update cache with new question
      if (examId) {
        setExamCache((prev) => {
          const existing = prev.questions.get(examId) || [];
          const updated = [...existing, created as ServiceQuestion];
          return {
            ...prev,
            questions: new Map([...prev.questions, [examId, updated]]),
          };
        });
      }

      // Check if we just reached 100 questions
      if (newCreatedIds.size >= TOTAL_QUESTIONS) {
        // Navigate back to test-management after a short delay
        setTimeout(() => {
          navigate('/test-management');
        }, 500);
      }

      return dbId;
    },
    [examId, setExamCache, navigate]
  );

  const updateUrl = useCallback(
    (targetIndex?: number, dbQuestionId?: string) => {
      if (!examId) return;

      const index =
        typeof targetIndex === 'number' ? targetIndex : currentQuestionIndex;
      // Use ref to avoid dependency on questions array
      const questionLocalId = questionsRef.current[index]?.id;
      const questionDbId =
        dbQuestionId || questionIdMap.get(questionLocalId) || '';

      // Check if URL actually needs to change
      const currentUrl = questionDbId
        ? `/test-management/edit/${examId}/${questionDbId}`
        : `/test-management/edit/${examId}`;
      const expectedUrl = window.location.pathname;

      // Only navigate if URL is different
      if (currentUrl !== expectedUrl || params.questionId !== questionDbId) {
        isNavigatingRef.current = true;
        navigate(currentUrl, { replace: true });
        // Update ref to prevent effect from resetting index on URL change
        if (questionDbId) {
          lastQuestionIdRef.current = questionDbId;
        } else {
          lastQuestionIdRef.current = null;
        }
        // Reset flag after navigation completes
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 50);
      } else {
        // Still update ref even if URL doesn't change
        if (questionDbId) {
          lastQuestionIdRef.current = questionDbId;
        } else {
          lastQuestionIdRef.current = null;
        }
      }
    },
    [examId, currentQuestionIndex, questionIdMap, navigate, params.questionId]
  );

  const handleNext = useCallback(async () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestionLocalId = nextIndex + 1; // index is 0-based, localId is 1-based

      // Check if all 100 questions are already created
      const currentCreatedIds = createdQuestionIdsRef.current;
      const allQuestionsCreated = currentCreatedIds.size >= TOTAL_QUESTIONS;

      // If all questions are created, only allow navigating to existing questions
      if (allQuestionsCreated && !currentCreatedIds.has(nextQuestionLocalId)) {
        // Find the next existing question
        const sortedCreatedIds = Array.from(currentCreatedIds).sort(
          (a, b) => a - b
        );
        const currentLocalId = currentQuestionIndex + 1;
        const nextCreatedId = sortedCreatedIds.find(
          (id) => id > currentLocalId
        );

        if (nextCreatedId) {
          const nextCreatedIndex = nextCreatedId - 1;
          setCurrentQuestionIndex(nextCreatedIndex);
          updateUrl(nextCreatedIndex);
          return;
        } else {
          // No more questions to navigate to
          return;
        }
      }

      // Check if current question or exam has changed
      const questionChanged = hasQuestionChanged();
      const examChanged = hasExamChanged();

      // If nothing changed, just navigate without saving
      if (!questionChanged && !examChanged) {
        // If next question does not exist yet, check if we can create it
        let nextDbId = questionIdMapRef.current.get(nextQuestionLocalId);
        if (!nextDbId) {
          // Check if all 100 questions are already created
          if (currentCreatedIds.size >= TOTAL_QUESTIONS) {
            // All questions created, can't create more
            setApiError(
              'All 100 questions have been created. You can only navigate to existing questions.'
            );
            return;
          }

          setIsSubmitting(true);
          try {
            nextDbId = await ensureQuestionExists(nextQuestionLocalId);
          } catch (error) {
            console.error('Error creating placeholder question:', error);
            setApiError(
              error instanceof Error
                ? error.message
                : 'An error occurred. Please try again.'
            );
            return;
          } finally {
            setIsSubmitting(false);
          }
        }

        // If next question already exists, load its data from cache
        const isNextQuestionCreated =
          currentCreatedIds.has(nextQuestionLocalId);
        if (isNextQuestionCreated && examId) {
          const currentCache = examCacheRef.current;
          const cachedQuestions = currentCache.questions.get(examId);
          if (cachedQuestions) {
            const cachedQuestion = cachedQuestions.find(
              (q) => q.orderNumber === nextQuestionLocalId
            );
            if (cachedQuestion) {
              // Update local state with cached question data
              setQuestions((prev) =>
                prev.map((question, index) => {
                  if (index === nextIndex) {
                    return {
                      ...question,
                      title: cachedQuestion.text || '',
                      description: cachedQuestion.description || '',
                      subject: cachedQuestion.subject?.trim(),
                      answerOptions:
                        cachedQuestion.options?.map((opt, idx) => ({
                          id: `${nextQuestionLocalId}-${idx + 1}`,
                          text: normalizeOptionText(opt.text, idx),
                          isCorrect: opt.isCorrect || false,
                        })) || question.answerOptions,
                      imageUrl: cachedQuestion.imageUrl,
                      imageFile: null,
                    };
                  }
                  return question;
                })
              );
            }
          }
        }

        setCurrentQuestionIndex(nextIndex);
        updateUrl(nextIndex, nextDbId);
        return;
      }

      // If there are changes, save first
      setIsSubmitting(true);
      try {
        const result = await persistCurrentQuestion();
        if (result.success) {
          setErrors({});
          // If next question does not exist yet, check if we can create it
          let nextDbId = questionIdMapRef.current.get(nextQuestionLocalId);
          if (!nextDbId) {
            // Check if all 100 questions are already created
            const currentCreatedIds = createdQuestionIdsRef.current;
            if (currentCreatedIds.size >= TOTAL_QUESTIONS) {
              // All questions created, can't create more - navigate to test-management
              navigate('/test-management');
              return;
            }

            nextDbId = await ensureQuestionExists(nextQuestionLocalId);
          }

          // If next question already exists, load its data from cache
          const isNextQuestionCreated =
            currentCreatedIds.has(nextQuestionLocalId);
          if (isNextQuestionCreated && examId) {
            const currentCache = examCacheRef.current;
            const cachedQuestions = currentCache.questions.get(examId);
            if (cachedQuestions) {
              const cachedQuestion = cachedQuestions.find(
                (q) => q.orderNumber === nextQuestionLocalId
              );
              if (cachedQuestion) {
                // Update local state with cached question data
                setQuestions((prev) =>
                  prev.map((question, index) => {
                    if (index === nextIndex) {
                      return {
                        ...question,
                        title: cachedQuestion.text || '',
                        description: cachedQuestion.description || '',
                        subject: cachedQuestion.subject?.trim(),
                        answerOptions:
                          cachedQuestion.options?.map((opt, idx) => ({
                            id: `${nextQuestionLocalId}-${idx + 1}`,
                            text: normalizeOptionText(opt.text, idx),
                            isCorrect: opt.isCorrect || false,
                          })) || question.answerOptions,
                        imageUrl: cachedQuestion.imageUrl,
                        imageFile: null,
                      };
                    }
                    return question;
                  })
                );
              }
            }
          }

          setCurrentQuestionIndex(nextIndex);
          updateUrl(nextIndex, nextDbId);
        } else {
          // Validation failed - errors should be displayed
        }
      } catch (error) {
        console.error('Error in handleNext:', error);
        setApiError('An error occurred while saving. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [
    currentQuestionIndex,
    persistCurrentQuestion,
    updateUrl,
    ensureQuestionExists,
    examId,
    hasQuestionChanged,
    hasExamChanged,
  ]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      const prevQuestionLocalId = prevIndex + 1; // index is 0-based, localId is 1-based

      // Check if all 100 questions are already created
      const currentCreatedIds = createdQuestionIdsRef.current;
      const allQuestionsCreated = currentCreatedIds.size >= TOTAL_QUESTIONS;

      // If all questions are created, only allow navigating to existing questions
      if (allQuestionsCreated && !currentCreatedIds.has(prevQuestionLocalId)) {
        // Find the previous existing question (largest ID that's less than current)
        const sortedCreatedIds = Array.from(currentCreatedIds).sort(
          (a, b) => b - a
        ); // descending
        const currentLocalId = currentQuestionIndex + 1;
        const prevCreatedId = sortedCreatedIds.find(
          (id) => id < currentLocalId
        );

        if (prevCreatedId) {
          const prevCreatedIndex = prevCreatedId - 1;
          setCurrentQuestionIndex(prevCreatedIndex);
          updateUrl(prevCreatedIndex);
          return;
        } else {
          // No previous questions to navigate to
          return;
        }
      }

      // If previous question already exists, load its data from cache
      const isPrevQuestionCreated = currentCreatedIds.has(prevQuestionLocalId);
      if (isPrevQuestionCreated && examId) {
        const currentCache = examCacheRef.current;
        const cachedQuestions = currentCache.questions.get(examId);
        if (cachedQuestions) {
          const cachedQuestion = cachedQuestions.find(
            (q) => q.orderNumber === prevQuestionLocalId
          );
          if (cachedQuestion) {
            // Update local state with cached question data
            setQuestions((prev) =>
              prev.map((question, index) => {
                if (index === prevIndex) {
                  return {
                    ...question,
                    title: cachedQuestion.text || '',
                    description: cachedQuestion.description || '',
                    subject: cachedQuestion.subject?.trim(),
                    answerOptions:
                      cachedQuestion.options?.map((opt, idx) => ({
                        id: `${prevQuestionLocalId}-${idx + 1}`,
                        text: normalizeOptionText(opt.text, idx),
                        isCorrect: opt.isCorrect || false,
                      })) || question.answerOptions,
                    imageUrl: cachedQuestion.imageUrl,
                    imageFile: null,
                  };
                }
                return question;
              })
            );
          }
        }
      }

      setCurrentQuestionIndex(prevIndex);
      updateUrl(prevIndex);
    }
  }, [currentQuestionIndex, updateUrl, examId]);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const result = await persistCurrentQuestion();
      if (result.success) {
        navigate('/test-management');
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      setApiError('An error occurred while saving. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  // Show loading state while fetching exam data
  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading exam data...</p>
          </div>
        </div>
      </div>
    );
  }

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
              Exam Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter exam title..."
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full"
              disabled={false}
            />
            {errors.examTitle && (
              <p className="mt-1 text-sm text-red-600">{errors.examTitle}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Enter exam description..."
              value={examDescription}
              onChange={(e) => setExamDescription(e.target.value)}
              className="w-full"
              disabled={false}
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
                Sector <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border rounded-md h-10 px-3"
                value={sectorId}
                onChange={(e) => setSectorId(e.target.value)}
                disabled={loadingSectors}
              >
                <option value="">Select a sector...</option>
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
                Passing Score
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
        <CardContent className="p-6 relative">
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          )}
          {apiError && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {apiError}
            </div>
          )}
          {/* Question Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Title <span className="text-red-500">*</span>
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

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedSubjectValue}
                onValueChange={handleQuestionSubjectChange}
                disabled={
                  isSubmitting || !sectorId || availableSubjects.length === 0
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a subject..." />
                </SelectTrigger>
                {availableSubjects.length > 0 && (
                  <SelectContent>
                    {availableSubjects.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Select>
              {errors.questionSubject && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.questionSubject}
                </p>
              )}
              {!sectorId && (
                <p className="mt-1 text-sm text-amber-600">
                  Please select a sector in the exam information section above
                  to see available subjects.
                </p>
              )}
            </div>

            {/* Question Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Image (Optional)
              </label>
              <p className="mb-2 text-xs text-gray-500">
                Recommended: clear images up to{' '}
                <span className="font-semibold">2&nbsp;MB</span> in size and no
                larger than about{' '}
                <span className="font-semibold">600×600&nbsp;px</span> to keep
                loading fast and previews readable on all devices.
              </p>
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
              {(currentQuestion.imageUrl || imageObjectUrl) && (
                <div className="mt-3 w-full">
                  <div className="relative mx-auto max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl border rounded overflow-hidden">
                    <img
                      src={
                        currentQuestion.imageUrl || (imageObjectUrl as string)
                      }
                      alt="Question"
                      className="w-full h-auto max-h-[600px] object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Answer Options <span className="text-red-500">*</span>
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
                    <span className="font-medium text-gray-700 w-6">
                      {optionLetterForIndex(idx)}.
                    </span>
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
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting || hasErrors}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting || hasErrors}
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
