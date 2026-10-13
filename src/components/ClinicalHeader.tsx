import React from 'react';
import { Activity } from 'lucide-react';
import { DiseaseKey } from '../types';
import { Badge } from './ui/badge';

interface ClinicalHeaderProps {
  activeTab: DiseaseKey | 'docs';
  onSelectTab: (tab: DiseaseKey | 'docs') => void;
  onOpenTestDataModal: () => void;
  modelsLoaded: boolean;
}

export const ClinicalHeader: React.FC<ClinicalHeaderProps> = ({
  onOpenTestDataModal,
  modelsLoaded
}) => {
  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-40 shadow-xs">
      {/* Top Institutional Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#166534] flex items-center justify-center text-white shadow-xs border border-emerald-700/40 shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#172033]">
                  HealthPredict <span className="text-[#16A34A] font-extrabold">AI</span>
                </h1>
                <Badge variant="outline" className="hidden sm:inline-flex text-xs uppercase font-mono py-0.5 px-2 text-[#166534] bg-[#DCFCE7] border-emerald-200/90 font-bold rounded-md">
                  Clinical DSS v2.4
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium hidden md:block">
                Multi-Disease Decision Support & Risk Stratification System
              </p>
            </div>
          </div>

          {/* Right Status / Action */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-[#64748B] bg-[#F7FAF9] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse shrink-0" />
              <span>RF Ensemble Pipelines Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
