import { useEffect, useState } from 'react';
import { businessDate } from '../constants/exchangeRates';
export function useBusinessDate() {
  const [day, setDay] = useState(() => businessDate());
  useEffect(() => {
    const refresh = () => setDay(businessDate());
    const interval = setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    return () => { clearInterval(interval); window.removeEventListener('focus', refresh); };
  }, []);
  return day;
}
