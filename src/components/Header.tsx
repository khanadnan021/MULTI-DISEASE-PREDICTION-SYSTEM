import React from 'react';
import { Activity, Droplet, ShieldAlert, Layers, Cpu, BookOpen } from 'lucide-react';
import { DiseaseKey } from '../types';

interface HeaderProps {
  activeTab: DiseaseKey | 'docs';
  onSelectTab: (tab: DiseaseKey | 'docs') => void;
  modelsLoaded: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  modelsLoaded
}) => {
  const tabs = [
    { id: 'heart' as const, label: 'Heart Disease', icon: Activity, badge: '13 Params' },
    { id: 'diabetes' as const, label: 'Diabetes', icon: Droplet, badge: '8 Params' },
    { id: 'kidney' as const, label: 'Kidney Disease', icon: ShieldAlert, badge: '15 Params' },
    { id: 'liver' as const, label: 'Liver Disease', icon: Layers, badge: '10 Params' },
    { id: 'docs' as const, label: 'Documentation & Test Data', icon: BookOpen, badge: 'Guide' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  Multi-Disease Prediction System
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  {modelsLoaded ? 'Scikit-Learn (75/25 Split Active)' : 'Initializing Models...'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Custom self-trained Random Forest ML pipelines via Node.js Express child processes
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-xs text-slate-500 font-mono hidden md:inline-block bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              test_size=0.25
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none border-t border-slate-100 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive
                      ? 'bg-slate-800 text-emerald-300'
                      : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
