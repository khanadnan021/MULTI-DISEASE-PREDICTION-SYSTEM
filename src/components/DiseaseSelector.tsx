import React from 'react';
import { 
  HeartPulse, 
  Droplet, 
  ShieldAlert, 
  Layers, 
  Brain,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { DiseaseKey, ModelMetric } from '../types';

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
      shortLabel: 'Heart Disease',
      cohort: 'Cleveland Clinic',
      params: '13 Biomarkers',
      icon: HeartPulse,
      accuracy: metrics?.heart?.test_accuracy || 92.0,
      isOther: false,
    },
    {
      id: 'diabetes' as const,
      label: 'Type 2 Diabetes',
      shortLabel: 'Diabetes Mellitus',
      cohort: 'Pima Indians',
      params: '8 Parameters',
      icon: Droplet,
      accuracy: metrics?.diabetes?.test_accuracy || 84.9,
      isOther: false,
    },
    {
      id: 'kidney' as const,
      label: 'Chronic Kidney Disease',
      shortLabel: 'Kidney Disease (CKD)',
      cohort: 'Renal Labs',
      params: '15 Indicators',
      icon: ShieldAlert,
      accuracy: metrics?.kidney?.test_accuracy || 100.0,
      isOther: false,
    },
    {
      id: 'liver' as const,
      label: 'Liver Disease',
      shortLabel: 'Liver Pathology (ILPD)',
      cohort: 'Indian Liver',
      params: '10 Enzymes',
      icon: Layers,
      accuracy: metrics?.liver?.test_accuracy || 100.0,
      isOther: false,
    },
    {
      id: 'stroke' as const,
      label: 'Stroke & Cerebrovascular Risk',
      shortLabel: 'Stroke & Brain Risk',
      cohort: 'UCI Stroke Set',
      params: '6 Arterial Factors',
      icon: Brain,
      accuracy: metrics?.stroke?.test_accuracy || 74.8,
      isOther: false,
    },
    {
      id: 'other' as const,
      label: 'Other / General Conditions',
      shortLabel: 'Others & General',
      cohort: 'Dr. Aria AI',
      params: 'Chat Guidance',
      icon: HelpCircle,
      accuracy: null as any,
      isOther: true,
    },
  ];

  return (
    <div className="bg-white border-b border-emerald-100 shadow-xs sticky top-16 sm:top-18 z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <nav className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 py-3" aria-label="Clinical Modules">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2.5 p-2 sm:p-2.5 rounded-xl transition-all duration-200 cursor-pointer border w-full min-w-0 text-left ${
                  tab.isOther
                    ? isActive
                      ? 'border-violet-500 bg-violet-50/70 text-violet-950 ring-1 ring-violet-500/30 shadow-xs'
                      : 'bg-white text-gray-700 hover:text-violet-900 hover:bg-violet-50/30 border-gray-200 hover:border-violet-300 shadow-2xs'
                    : isActive
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500/30 shadow-xs'
                      : 'bg-white text-gray-700 hover:text-emerald-900 hover:bg-emerald-50/30 border-gray-200 hover:border-emerald-300 shadow-2xs'
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    tab.isOther
                      ? isActive
                        ? 'bg-violet-600 text-white'
                        : 'bg-violet-50 text-violet-700 border border-violet-200'
                      : isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs truncate leading-tight text-gray-900">
                      {tab.shortLabel}
                    </span>
                    {isActive && (
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${tab.isOther ? 'text-violet-600' : 'text-emerald-600'}`} />
                    )}
                  </div>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-[10px] text-gray-500 truncate font-medium">
                      {tab.params}
                    </span>
                    {!tab.isOther && (
                      <>
                        <span className="text-gray-300 text-[9px]">&bull;</span>
                        <span className="text-[10px] font-mono font-semibold text-emerald-800">
                          {tab.accuracy}%
                        </span>
                      </>
                    )}
                    {tab.isOther && (
                      <span className="text-[10px] font-semibold text-violet-700">🤖 AI Chat</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
