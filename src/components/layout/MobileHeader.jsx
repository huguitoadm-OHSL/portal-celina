import React from 'react';
import { Building2, Menu } from 'lucide-react';

export const MobileHeader = ({ onMenuClick }) => {
  return (
    <div className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between shrink-0 z-30 shadow-md">
      <div className="flex items-center font-bold text-lg">
        <Building2 className="w-6 h-6 mr-2 text-indigo-400" /> Portal Asesores
      </div>
      <button 
        onClick={onMenuClick} 
        className="p-1 rounded-md hover:bg-white/10 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
};

