/**
 * Subject Atoms
 *
 * Usage Example:
 *
 * import { useRecoilState, useSetRecoilState } from 'recoil';
 * import { subjectAtom } from '@/store/atoms/subjectAtom';
 *
 * function MyComponent() {
 *   const [subjectState, setSubjectState] = useRecoilState(subjectAtom);
 *
 *   // Update subjects
 *   setSubjectState({ ...subjectState, subjects: newSubjects });
 * }
 */

import { atom } from 'recoil';
import { Subject } from '../../services/subjects';

export interface SubjectState {
  // Cache subjects by sector ID
  subjectsBySector: Map<string, Subject[]>;
  // Current subjects being displayed (for a specific sector)
  currentSubjects: Subject[];
  // Current sector ID
  currentSectorId: string | null;
  loading: boolean;
  error: string | null;
}

export const subjectAtom = atom<SubjectState>({
  key: 'subjectState',
  default: {
    subjectsBySector: new Map(),
    currentSubjects: [],
    currentSectorId: null,
    loading: false,
    error: null,
  },
});

