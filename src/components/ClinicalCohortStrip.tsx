import React from 'react';
import { Sparkles } from 'lucide-react';
import { DiseaseKey, ModelMetric, SampleCase } from '../types';
import { DISEASE_CONFIGS } from '../data/diseaseFields';

interface ClinicalCohortStripProps {
  disease: DiseaseKey;
  metric?: ModelMetric;
  samples?: SampleCase[];
  onLoadSample?: (sample: SampleCase) => void;
  onResetToBaseline?: () => void;
  onOpenTestDataModal?: () => void;
}

export const ClinicalCohortStrip: React.FC<ClinicalCohortStripProps> = ({
  disease,
  metric,
}) => {
  const config = DISEASE_CONFIGS.find((c) => c.id === disease);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-3.5 shadow-xs mb-6">
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Main Pipeline Badge */}
        <div className="flex items-center space-x-2 text-white font-bold text-xs sm:text-sm bg-[#245e43] px-3.5 sm:px-4 py-2 rounded-lg shadow-2xs">
          <Sparkles className="w-4 h-4 text-[#86efac] shrink-0" />
          <span className="tracking-tight">{config?.title} Pipeline</span>
        </div>

        {/* Metric 1: Accuracy */}
        <div className="flex items-center space-x-1.5 bg-[#F2FBF6] border border-[#CDEBD9] px-3 sm:px-3.5 py-1.5 rounded-lg text-xs shadow-2xs">
          <span className="font-semibold text-[#4D7C6B]">Accuracy:</span>
          <span className="font-bold font-mono text-[#1B4332] text-xs sm:text-sm">
            {metric?.test_accuracy || 86.8}%
          </span>
        </div>

        {/* Metric 2: Precision */}
        <div className="flex items-center space-x-1.5 bg-[#F2FBF6] border border-[#CDEBD9] px-3 sm:px-3.5 py-1.5 rounded-lg text-xs shadow-2xs">
          <span className="font-semibold text-[#4D7C6B]">Precision:</span>
          <span className="font-bold font-mono text-[#1B4332] text-xs sm:text-sm">
            {metric?.precision || 85.2}%
          </span>
        </div>

        {/* Metric 3: Recall */}
        <div className="flex items-center space-x-1.5 bg-[#F2FBF6] border border-[#CDEBD9] px-3 sm:px-3.5 py-1.5 rounded-lg text-xs shadow-2xs">
          <span className="font-semibold text-[#4D7C6B]">Recall:</span>
          <span className="font-bold font-mono text-[#1B4332] text-xs sm:text-sm">
            {metric?.recall || 88.0}%
          </span>
        </div>

        {/* Metric 4: ROC-AUC */}
        <div className="flex items-center space-x-1.5 bg-[#F2FBF6] border border-[#CDEBD9] px-3 sm:px-3.5 py-1.5 rounded-lg text-xs shadow-2xs">
          <span className="font-semibold text-[#4D7C6B]">ROC-AUC:</span>
          <span className="font-bold font-mono text-[#1B4332] text-xs sm:text-sm">
            {metric?.roc_auc || 0.91}
          </span>
        </div>
      </div>
    </div>
  );
};
