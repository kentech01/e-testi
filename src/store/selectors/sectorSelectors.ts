/**
 * Sector Selectors
 *
 * Usage Example:
 *
 * import { useRecoilValue, useRecoilState } from 'recoil';
 * import {
 *   sectorsSelector,
 *   currentSectorSelector,
 *   activeSectorsSelector
 * } from '@/store/selectors/sectorSelectors';
 *
 * function MyComponent() {
 *   const sectors = useRecoilValue(sectorsSelector);
 *   const currentSector = useRecoilValue(currentSectorSelector);
 *   const activeSectors = useRecoilValue(activeSectorsSelector);
 *
 *   // Use dynamic selectors
 *   const sector = useRecoilValue(sectorByIdSelector(sectorId));
 * }
 */

import { selector } from 'recoil';
import { sectorAtom } from '../atoms/sectorAtom';
import { Sector } from '../../services/sectors';

export const sectorsSelector = selector({
  key: 'sectorsSelector',
  get: ({ get }) => {
    const sectorState = get(sectorAtom);
    return sectorState.sectors;
  },
});

export const currentSectorSelector = selector({
  key: 'currentSectorSelector',
  get: ({ get }) => {
    const sectorState = get(sectorAtom);
    return sectorState.currentSector;
  },
});

export const sectorLoadingSelector = selector({
  key: 'sectorLoadingSelector',
  get: ({ get }) => {
    const sectorState = get(sectorAtom);
    return sectorState.loading;
  },
});

export const sectorErrorSelector = selector({
  key: 'sectorErrorSelector',
  get: ({ get }) => {
    const sectorState = get(sectorAtom);
    return sectorState.error;
  },
});

export const sectorStateSelector = selector({
  key: 'sectorStateSelector',
  get: ({ get }) => {
    const sectorState = get(sectorAtom);
    return sectorState;
  },
});

export const activeSectorsSelector = selector({
  key: 'activeSectorsSelector',
  get: ({ get }) => {
    const sectors = get(sectorsSelector);
    return sectors.filter((sector: Sector) => sector.isActive);
  },
});

export const sectorByIdSelector = (id: string) =>
  selector({
    key: `sectorByIdSelector_${id}`,
    get: ({ get }) => {
      const sectors = get(sectorsSelector);
      return sectors.find((sector: Sector) => sector.id === id) || null;
    },
  });
