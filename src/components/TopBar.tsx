import React from 'react';
import { Menu, Activity, ShieldCheck, UserCheck, FileSpreadsheet } from 'lucide-react';
import { DiseaseKey } from '../types';
import { DISEASE_CONFIGS } from '../data/diseaseFields';

interface TopBarProps {
  activeTab: DiseaseKey | 'docs';
  onToggleSidebar: () => void;
  onOpenTestDataModal?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activeTab, onToggleSidebar, onOpenTestDataModal }) => {
  const currentConfig = DISEASE_CONFIGS.find((c) => c.id === activeTab);
  const title =
    activeTab === 'docs'
      ? 'System Architecture & Documentation'
      : `${currentConfig?.title || 'Disease'} Risk Prediction`;

  return (
    <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white shrink-0 sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
            {title}
          </h2>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-100 uppercase tracking-wide">
            Model v2.4
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {onOpenTestDataModal && (
          <button
            onClick={onOpenTestDataModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all shadow-2xs cursor-pointer"
            title="View exact parameters and download 25% test data CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">25% Test Data</span>
            <span className="sm:hidden">25% Data</span>
          </button>
        )}

        <div className="text-right hidden md:block">
          <p className="text-xs text-slate-500 font-medium">Operator</p>
          <p className="text-sm font-semibold text-slate-800">Dr. Khan Adnan</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 shadow-2xs">
          KA
        </div>
      </div>
    </header>
  );
};
