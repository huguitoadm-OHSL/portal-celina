import React from 'react';

export const TextArea = ({ label, name, value, onChange, placeholder, rows = 4 }) => (
  <div className="mb-3.5 w-full">
    {label && (
      <label className="block text-[11px] font-black text-slate-300 uppercase tracking-wider mb-1.5 ml-0.5 truncate">
        {String(label)}
      </label>
    )}
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3.5 py-2.5 bg-[#050b18] border border-[#1e3a5f] rounded-xl text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all shadow-inner resize-none leading-relaxed"
    />
  </div>
);
