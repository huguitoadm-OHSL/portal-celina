import { Sun, Moon, Monitor } from 'lucide-react';
export function ThemeSelector({ theme, onChange }) {
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  return <label className="theme-selector"><Icon size={17} aria-hidden="true"/><span className="sr-only">Tema de apariencia</span><select aria-label="Tema de apariencia" value={theme} onChange={e => onChange(e.target.value)}><option value="light">Claro</option><option value="dark">Oscuro</option><option value="system">Automático</option></select></label>;
}
