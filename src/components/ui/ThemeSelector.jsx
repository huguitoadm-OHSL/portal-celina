import { SunMoon } from 'lucide-react';
export function ThemeSelector({ theme, onChange }) {
  return <label className="theme-selector"><SunMoon size={18} aria-hidden="true"/><span className="sr-only">Tema de apariencia</span><select aria-label="Tema de apariencia" value={theme} onChange={e => onChange(e.target.value)}><option value="light">Claro</option><option value="dark">Oscuro</option><option value="system">Automático</option></select></label>;
}
