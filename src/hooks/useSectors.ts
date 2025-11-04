import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import sectorService, { Sector } from '../services/sectors';
import { sectorAtom } from '../store/atoms/sectorAtom';
import { sectorsSelector } from '../store/selectors/sectorSelectors';

export function useSectors() {
  const [sectorState, setSectorState] = useRecoilState(sectorAtom);
  const sectors = useRecoilValue(sectorsSelector);

  const ensureSectorsLoaded = useCallback(async () => {
    // Only fetch when cache is empty
    if (sectors.length > 0 || sectorState.loading) return;
    try {
      setSectorState((prev) => ({ ...prev, loading: true, error: null }));
      const fetched: Sector[] = await sectorService.getSectors();
      setSectorState((prev) => ({ ...prev, sectors: fetched }));
    } catch (e: any) {
      setSectorState((prev) => ({
        ...prev,
        error: e?.message || 'Failed to load sectors',
      }));
    } finally {
      setSectorState((prev) => ({ ...prev, loading: false }));
    }
  }, [sectors.length, sectorState.loading, setSectorState]);

  // Consumers can opt-in to auto load by mounting effect; default noop here
  useEffect(() => {
    // no auto-call; expose ensureSectorsLoaded to be called explicitly
  }, []);

  return {
    sectors,
    loading: sectorState.loading,
    error: sectorState.error,
    ensureSectorsLoaded,
  } as const;
}

export default useSectors;
