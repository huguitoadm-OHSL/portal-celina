import { useEffect, useState } from 'react';
const KEY = 'celina.theme';
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { const stored = localStorage.getItem(KEY); return ['light', 'dark', 'system'].includes(stored) ? stored : 'system'; } catch { return 'system'; }
  });
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => { document.documentElement.dataset.theme = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme; };
    apply();
    try { localStorage.setItem(KEY, theme); } catch { /* El tema sigue funcionando sin almacenamiento. */ }
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);
  return [theme, setTheme];
}
