import { useContext } from 'react';
import { CommercialContext } from '../state/CommercialContext';
export function useCommercial() {
  const value = useContext(CommercialContext);
  if (!value) throw new Error('Se requiere CommercialProvider.');
  return value;
}
