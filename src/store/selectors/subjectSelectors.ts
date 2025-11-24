/**
 * Subject Selectors
 *
 * Usage Example:
 *
 * import { useRecoilValue, useRecoilState } from 'recoil';
 * import {
 *   currentSubjectsSelector,
 *   subjectsBySectorSelector,
 *   subjectLoadingSelector
 * } from '@/store/selectors/subjectSelectors';
 *
 * function MyComponent() {
 *   const subjects = useRecoilValue(currentSubjectsSelector);
 *   const loading = useRecoilValue(subjectLoadingSelector);
 *
 *   // Use dynamic selectors
 *   const sectorSubjects = useRecoilValue(subjectsBySectorSelector(sectorId));
 * }
 */

import { selector } from 'recoil';
import { subjectAtom } from '../atoms/subjectAtom';
import { Subject } from '../../services/subjects';

export const currentSubjectsSelector = selector({
  key: 'currentSubjectsSelector',
  get: ({ get }) => {
    const subjectState = get(subjectAtom);
    return subjectState.currentSubjects;
  },
});

export const currentSectorIdSelector = selector({
  key: 'currentSectorIdSelector',
  get: ({ get }) => {
    const subjectState = get(subjectAtom);
    return subjectState.currentSectorId;
  },
});

export const subjectLoadingSelector = selector({
  key: 'subjectLoadingSelector',
  get: ({ get }) => {
    const subjectState = get(subjectAtom);
    return subjectState.loading;
  },
});

export const subjectErrorSelector = selector({
  key: 'subjectErrorSelector',
  get: ({ get }) => {
    const subjectState = get(subjectAtom);
    return subjectState.error;
  },
});

export const subjectStateSelector = selector({
  key: 'subjectStateSelector',
  get: ({ get }) => {
    const subjectState = get(subjectAtom);
    return subjectState;
  },
});

/**
 * Get subjects for a specific sector (from cache)
 * @param sectorId - The sector ID
 * @returns Selector that returns subjects for the given sector
 */
export const subjectsBySectorSelector = (sectorId: string) =>
  selector({
    key: `subjectsBySectorSelector_${sectorId}`,
    get: ({ get }) => {
      const subjectState = get(subjectAtom);
      return subjectState.subjectsBySector.get(sectorId) || [];
    },
  });

/**
 * Get all subjects from all sectors (flattened)
 */
export const allSubjectsSelector = selector({
  key: 'allSubjectsSelector',
  get: ({ get }) => {
    const subjectState = get(subjectAtom);
    const allSubjects: Subject[] = [];
    subjectState.subjectsBySector.forEach((subjects) => {
      allSubjects.push(...subjects);
    });
    return allSubjects;
  },
});

