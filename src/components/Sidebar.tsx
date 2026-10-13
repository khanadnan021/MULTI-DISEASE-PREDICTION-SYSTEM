import React from 'react';
import { Activity, Droplet, ShieldAlert, Layers, BookOpen, ExternalLink, X, FileSpreadsheet, Presentation } from 'lucide-react';
import { DiseaseKey } from '../types';

interface SidebarProps {
  activeTab: DiseaseKey | 'docs';
  onSelectTab: (tab: DiseaseKey | 'docs') => void;
  modelsLoaded: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpenTestDataModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  modelsLoaded,
  isOpen,
  onClose,
  onOpenTestDataModal
}) => {
  const modules = [
    { id: 'heart' as const, label: 'Heart Disease', icon: Activity, badge: '13 Params' },
    { id: 'diabetes' as const, label: 'Diabetes', icon: Droplet, badge: '8 Params' },
    { id: 'kidney' as const, label: 'Chronic Kidney', icon: ShieldAlert, badge: '15 Params' },
    { id: 'liver' as const, label: 'Liver Disease', icon: Layers, badge: '10 Params' },
    { id: 'docs' as const, label: 'Documentation & CLI', icon: BookOpen, badge: 'Guide' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col h-full shrink-0 border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-lg text-white shadow-xs">
              H
            </div>
            <div>
              <span className="font-semibold text-lg tracking-tight text-white">
                HealthPredict <span className="text-blue-400">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide">
                MULTI-DISEASE SYSTEM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-3">
            Disease Modules
          </div>

          {modules.map((m) => {
            const isActive = activeTab === m.id;
            return (
              <button
                key={m.id}
                id={`nav-item-${m.id}`}
                onClick={() => {
                  onSelectTab(m.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <span
                    className={`w-2 h-2 rounded-full mr-3 transition-colors ${
                      isActive ? 'bg-blue-300' : 'bg-slate-700 group-hover:bg-slate-500'
                    }`}
                  />
                  <span>{m.label}</span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-blue-700/60 text-blue-100' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {m.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Standalone client & Test data quicklink */}
        <div className="px-4 py-2 border-t border-slate-800/80 space-y-1">
          {onOpenTestDataModal && (
            <button
              onClick={() => {
                onOpenTestDataModal();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-blue-400 hover:text-white hover:bg-blue-900/40 rounded-lg transition-colors border border-blue-900/50 cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                <span>25% Test Data (CSV)</span>
              </div>
              <span className="text-[10px] px-1 bg-blue-800/60 rounded text-blue-200">View</span>
            </button>
          )}

          <a
            href="/Multi_Disease_Prediction_System_Presentation.pptx"
            download="Multi_Disease_Prediction_System_Presentation.pptx"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-amber-300 hover:text-white hover:bg-amber-900/40 rounded-lg transition-colors border border-amber-800/50 cursor-pointer"
            title="Download 8-Slide Capstone Project Presentation (PPTX)"
          >
            <div className="flex items-center space-x-2">
              <Presentation className="w-3.5 h-3.5 text-amber-400" />
              <span>Project Slides (PPTX)</span>
            </div>
            <span className="text-[10px] px-1 bg-amber-900/70 rounded text-amber-200">8 Slides</span>
          </a>

          <a
            href="/standalone.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            <span>Standalone HTML Client</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* System Status Panel */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/50">
            <div className="text-xs text-slate-400 mb-1.5 font-medium">System Status</div>
            <div className="flex items-center text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
              <span>{modelsLoaded ? 'Models: Local / Active' : 'Initializing Models...'}</span>
            </div>
            <div className="mt-1.5 text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>Split: 75/25</span>
              <span>RandomForest</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
