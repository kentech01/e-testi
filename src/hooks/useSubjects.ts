import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import subjectService, { Subject } from '../services/subjects';
import { subjectAtom } from '../store/atoms/subjectAtom';

export function useSubjects(sectorId: string | null) {
  const [subjectState, setSubjectState] = useRecoilState(subjectAtom);
  
  const ensureSubjectsLoaded = useCallback(async () => {
    if (!sectorId) return;

    // Check if already cached
    const cached = subjectState.subjectsBySector.get(sectorId);
    if (cached && cached.length > 0) {
      // Update current subjects if not already set
      if (subjectState.currentSectorId !== sectorId || subjectState.currentSubjects.length === 0) {
        setSubjectState((prev) => ({
          ...prev,
          currentSubjects: cached,
          currentSectorId: sectorId,
        }));
      }
      return;
    }

    // Only fetch when not loading
    if (subjectState.loading) return;

    try {
      setSubjectState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        currentSectorId: sectorId,
      }));

      const fetched: Subject[] = await subjectService.getSubjectsBySector(
        sectorId
      );

      // API already returns label, value, and id
      // Ensure id is present (it should be from the API)
      const transformedSubjects: Subject[] = fetched.map((subject) => ({
        ...subject,
        id: subject.id, // id should always be present from the API
        name: subject.name || subject.label,
      }));

      // Update cache
      setSubjectState((prev) => {
        const newMap = new Map(prev.subjectsBySector);
        newMap.set(sectorId, transformedSubjects);
        return {
          ...prev,
          subjectsBySector: newMap,
          currentSubjects: transformedSubjects,
          loading: false,
        };
      });
    } catch (e: any) {
      setSubjectState((prev) => ({
        ...prev,
        error: e?.message || 'Failed to load subjects',
        loading: false,
      }));
    }
  }, [
    sectorId,
    subjectState.loading,
    subjectState.subjectsBySector,
    setSubjectState,
  ]);

  // Auto-load when sectorId changes
  useEffect(() => {
    if (sectorId) {
      ensureSubjectsLoaded();
    }
  }, [sectorId, ensureSubjectsLoaded]);

  // Return subjects based on current sector
  const subjects = useMemo(() => {
    if (!sectorId) return [];
    // If current sector matches, return current subjects
    if (subjectState.currentSectorId === sectorId) {
      return subjectState.currentSubjects;
    }
    // Otherwise, try to get from cache
    const cached = subjectState.subjectsBySector.get(sectorId);
    return cached || [];
  }, [sectorId, subjectState.currentSectorId, subjectState.currentSubjects, subjectState.subjectsBySector]);

  return {
    subjects,
    loading: subjectState.loading,
    error: subjectState.error,
    ensureSubjectsLoaded,
  } as const;
}

export default useSubjects;

