import React from 'react';
import { Activity, Sparkles, Database } from 'lucide-react';
import { DiseaseKey } from '../types';
import { Badge } from './ui/badge';
import { ECGVisualizerModal } from './ECGVisualizerModal';
import { CTScanAnalyzerModal } from './CTScanAnalyzerModal';

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
    <header className="bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs border border-emerald-700/40 shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900">
                  BioMed <span className="text-emerald-600 font-extrabold">AI Next-Gen</span>
                </h1>
                <Badge variant="outline" className="hidden sm:inline-flex text-[10px] uppercase font-mono py-0.5 px-2 text-emerald-800 bg-emerald-50 border-emerald-300 font-bold rounded-md">
                  Gemini + ML Ensemble
                </Badge>
              </div>
              <p className="text-xs text-gray-500 font-medium hidden md:block">
                Multi-Disease Risk Engine &bull; PDF Lab OCR &bull; ECG & CT Scan Accelerators
              </p>
            </div>
          </div>

          {/* Right Action Modals (ECG & CT Scan Readers) */}
          <div className="flex items-center space-x-2.5">
            <ECGVisualizerModal />
            <CTScanAnalyzerModal />
            <button
              onClick={onOpenTestDataModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition"
              title="Inspect 25% holdout test cohorts"
            >
              <Database className="w-3.5 h-3.5 text-gray-500" />
              <span>Test Cohorts</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
