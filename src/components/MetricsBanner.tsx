import React from 'react';
import { Database, Sliders, CheckCircle2 } from 'lucide-react';
import { ModelMetric } from '../types';

interface MetricsBannerProps {
  metrics: Record<string, ModelMetric> | null;
  loading: boolean;
  onRefresh?: () => void;
  onOpenTestDataModal?: () => void;
}

export const MetricsBanner: React.FC<MetricsBannerProps> = ({ metrics, loading, onOpenTestDataModal }) => {
  if (loading || !metrics) {
    return (
      <div className="bg-slate-50 border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-xs text-slate-500 animate-pulse">
          <span>Loading local machine learning model evaluation metrics (75% train / 25% test split)...</span>
        </div>
      </div>
    );
  }

  const items = [
    { key: 'heart', label: 'Heart Disease', metric: metrics.heart },
    { key: 'diabetes', label: 'Diabetes', metric: metrics.diabetes },
    { key: 'kidney', label: 'Chronic Kidney', metric: metrics.kidney },
    { key: 'liver', label: 'Liver Disease', metric: metrics.liver }
  ];

  return (
    <div className="bg-slate-50 border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span>Local Scikit-Learn Pipelines (75/25 Split):</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {items.map(({ key, label, metric }) => {
            if (!metric) return null;
            return (
              <div
                key={key}
                className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 flex items-center justify-between shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 ring-2 ring-teal-100"></span>
                  <span className="font-semibold text-slate-800 truncate max-w-[100px]">{label}</span>
                </div>
                <div className="flex items-center space-x-1 pl-2">
                  <span className="font-mono font-bold text-blue-600">
                    {metric.test_accuracy}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">acc</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden xl:flex items-center space-x-3 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>RandomForest (test_size=0.25)</span>
          </div>
          {onOpenTestDataModal && (
            <button
              onClick={onOpenTestDataModal}
              className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold transition-colors border border-blue-200 cursor-pointer"
            >
              Inspect 25% Test Set &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
