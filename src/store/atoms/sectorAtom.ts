/**
 * Sector Atoms
 *
 * Usage Example:
 *
 * import { useRecoilState, useSetRecoilState } from 'recoil';
 * import { sectorAtom } from '@/store/atoms/sectorAtom';
 *
 * function MyComponent() {
 *   const [sectorState, setSectorState] = useRecoilState(sectorAtom);
 *
 *   // Update sectors
 *   setSectorState({ ...sectorState, sectors: newSectors });
 * }
 */

import { atom } from 'recoil';
import { Sector } from '../../services/sectors';

export interface SectorState {
  sectors: Sector[];
  currentSector: Sector | null;
  loading: boolean;
  error: string | null;
}

export const sectorAtom = atom<SectorState>({
  key: 'sectorState',
  default: {
    sectors: [],
    currentSector: null,
    loading: false,
    error: null,
  },
});
