import React from 'react';

export const Input = ({ label, name, value, onChange, placeholder, type = "text", required = false, className = "" }) => (
  <div className={`mb-4 w-full ${className}`}>
    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5 truncate">{String(label)}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 placeholder-slate-400 shadow-sm text-sm"
    />
  </div>
);

