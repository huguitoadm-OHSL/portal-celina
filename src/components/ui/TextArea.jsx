import React from 'react';

export const TextArea = ({ label, name, value, onChange, placeholder, rows = 4 }) => (
  <div className="form-field mb-3.5 w-full">
    {label && (
      <label className="block text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 ml-0.5 truncate">
        {String(label)}
      </label>
    )}
    <textarea
      aria-label={label || placeholder || name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3.5 py-2.5 bg-[var(--bg-card-inner)] border border-[var(--border-highlight)] rounded-xl text-xs font-semibold text-[var(--text-primary)] placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all shadow-inner resize-none leading-relaxed"
    />
  </div>
);
