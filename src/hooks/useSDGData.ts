
import { useSDGImpact } from './useSDGImpact';

export function useSDGData() {
  const { sdgData } = useSDGImpact();
  return sdgData;
}
