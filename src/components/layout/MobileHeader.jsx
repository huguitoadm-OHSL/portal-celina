import React from 'react';
import { Building2, Menu } from 'lucide-react';

export const MobileHeader = ({ onMenuClick }) => {
  return (
    <header className="md:hidden bg-[var(--bg-card-inner)] border-b border-[var(--border-glow)] text-[var(--text-primary)] px-4 py-3 flex items-center justify-between shrink-0 z-30 shadow-lg">
      <div className="flex items-center gap-2 font-black text-sm tracking-tight text-[var(--text-primary)]">
        <div className="w-7 h-7 rounded-lg bg-[var(--bg-card-inner)] border border-cyan-500/40 flex items-center justify-center text-cyan-400">
          <Building2 className="w-4 h-4" />
        </div>
        <span>Portal Asesores</span>
      </div>
      <button
        aria-label="Abrir menú" onClick={onMenuClick}
        className="p-1.5 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-glow)] text-cyan-400 hover:text-[var(--text-primary)] transition-colors"
        aria-label="Abrir Menú"
      >
        <Menu className="w-5 h-5" />
      </button>
    </header>
  );
};
