import React from 'react';
import { 
  HeartPulse, 
  Droplet, 
  ShieldAlert, 
  Layers, 
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { DiseaseKey, ModelMetric } from '../types';
import { Badge } from './ui/badge';

interface DiseaseSelectorProps {
  activeTab: DiseaseKey | 'docs';
  onSelectTab: (tab: DiseaseKey | 'docs') => void;
  metrics: Record<string, ModelMetric> | null;
}

export const DiseaseSelector: React.FC<DiseaseSelectorProps> = ({
  activeTab,
  onSelectTab,
  metrics
}) => {
  const tabs = [
    {
      id: 'heart' as const,
      label: 'Cardiovascular Risk',
      shortLabel: 'Cardiovascular (Heart)',
      cohort: 'Cleveland Clinic',
      params: '13 Biomarkers',
      icon: HeartPulse,
      accuracy: metrics?.heart?.test_accuracy || 86.8,
      accentColor: 'rose',
      iconContainerActive: 'bg-rose-100 text-rose-700 border border-rose-200/90',
      iconContainerInactive: 'bg-[#F7FAF9] text-rose-500 border border-[#E2E8F0]',
      iconColor: 'text-rose-600'
    },
    {
      id: 'diabetes' as const,
      label: 'Type 2 Diabetes',
      shortLabel: 'Type 2 Diabetes',
      cohort: 'Pima Indians',
      params: '8 Parameters',
      icon: Droplet,
      accuracy: metrics?.diabetes?.test_accuracy || 78.1,
      accentColor: 'blue',
      iconContainerActive: 'bg-blue-100 text-blue-700 border border-blue-200/90',
      iconContainerInactive: 'bg-[#F7FAF9] text-blue-500 border border-[#E2E8F0]',
      iconColor: 'text-blue-600'
    },
    {
      id: 'kidney' as const,
      label: 'Chronic Kidney Disease',
      shortLabel: 'Chronic Kidney (CKD)',
      cohort: 'Renal Labs',
      params: '15 Indicators',
      icon: ShieldAlert,
      accuracy: metrics?.kidney?.test_accuracy || 99.1,
      accentColor: 'teal',
      iconContainerActive: 'bg-teal-100 text-teal-700 border border-teal-200/90',
      iconContainerInactive: 'bg-[#F7FAF9] text-teal-600 border border-[#E2E8F0]',
      iconColor: 'text-teal-600'
    },
    {
      id: 'liver' as const,
      label: 'Liver & Hepatitis Disease',
      shortLabel: 'Liver (Hepatitis)',
      cohort: 'Indian Liver (ILPD)',
      params: '10 Enzymes',
      icon: Layers,
      accuracy: metrics?.liver?.test_accuracy || 76.0,
      accentColor: 'amber',
      iconContainerActive: 'bg-amber-100 text-amber-700 border border-amber-200/90',
      iconContainerInactive: 'bg-[#F7FAF9] text-amber-600 border border-[#E2E8F0]',
      iconColor: 'text-amber-600'
    },
  ];

  return (
    <div className="bg-white border-b border-[#E2E8F0] shadow-2xs sticky top-16 sm:top-18 z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <nav className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 py-3" aria-label="Clinical Modules">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2.5 sm:space-x-3 p-2.5 sm:p-3 rounded-xl transition-all duration-200 cursor-pointer border w-full min-w-0 text-left ${
                  isActive
                    ? 'border-[#16A34A] bg-[#DCFCE7]/40 text-[#172033] ring-1 ring-[#16A34A]/30 shadow-xs'
                    : 'bg-white text-slate-700 hover:text-[#172033] hover:bg-[#F7FAF9] border-[#E2E8F0] hover:border-emerald-300/80 shadow-2xs'
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    isActive ? tab.iconContainerActive : tab.iconContainerInactive
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-bold text-xs sm:text-sm tracking-tight truncate ${isActive ? 'text-[#172033]' : 'text-slate-800'}`} title={tab.shortLabel}>
                      {tab.shortLabel}
                    </span>
                    <span
                      className={`font-mono text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold transition-colors shrink-0 ${
                        isActive
                          ? 'bg-[#166534] text-white shadow-2xs'
                          : 'bg-[#F7FAF9] text-[#64748B] border border-[#E2E8F0]'
                      }`}
                    >
                      {tab.accuracy}%
                    </span>
                  </div>
                  <span className={`text-[11px] sm:text-xs block font-medium truncate mt-0.5 ${isActive ? 'text-[#166534] font-semibold' : 'text-[#64748B]'}`}>
                    {tab.params} &bull; {tab.cohort}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
