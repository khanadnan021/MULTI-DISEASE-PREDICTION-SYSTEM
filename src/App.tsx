/**
 * HealthPredict AI — Clinical Decision Support & Multi-Disease Risk Stratification System
 * Academic Capstone & Healthcare ML Machine Learning Project
 * Full-stack architecture powered by Scikit-Learn Random Forest Pipelines (100 Trees)
 */

import React, { useState, useEffect } from 'react';
import { ClinicalHeader } from './components/ClinicalHeader';
import { DiseaseSelector } from './components/DiseaseSelector';
import { ClinicalCohortStrip } from './components/ClinicalCohortStrip';
import { PredictionForm } from './components/PredictionForm';
import { ResultDisplay } from './components/ResultDisplay';
import { ArchitectureDocs } from './components/ArchitectureDocs';
import { TestDataModal } from './components/TestDataModal';
import { DiseaseKey, ModelMetric, PredictionResult, SampleCase } from './types';
import { ShieldCheck, FileSpreadsheet, Presentation, ExternalLink, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<DiseaseKey | 'docs'>('heart');
  const [metrics, setMetrics] = useState<Record<string, ModelMetric> | null>(null);
  const [samples, setSamples] = useState<Record<string, SampleCase[]> | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [showTestDataModal, setShowTestDataModal] = useState(false);
  const [externalFormData, setExternalFormData] = useState<Record<string, any> | null>(null);

  // Load metrics and sample test data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [metricsRes, samplesRes] = await Promise.all([
          fetch('/api/models/metrics'),
          fetch('/api/sample-data'),
        ]);

        if (metricsRes.ok) {
          const mData = await metricsRes.json();
          if (mData.status === 'success') {
            setMetrics(mData.metrics);
          }
        }

        if (samplesRes.ok) {
          const sData = await samplesRes.json();
          if (sData.status === 'success') {
            setSamples(sData.samples);
          }
        }
      } catch (err) {
        console.warn('Backend metrics loading:', err);
      } finally {
        setLoadingMetrics(false);
      }
    }

    loadData();
  }, []);

  const handlePredictionComplete = (res: PredictionResult) => {
    setPredictionResult(res);
  };

  const handleClearResult = () => {
    setPredictionResult(null);
  };

  const currentDiseaseKey = activeTab === 'docs' ? 'heart' : activeTab;
  const currentMetric = metrics ? metrics[currentDiseaseKey] : undefined;
  const currentSamples = samples ? samples[currentDiseaseKey] || [] : [];

  return (
    <div className="min-h-screen w-full bg-[#F7FAF9] font-sans text-[#172033] antialiased flex flex-col selection:bg-[#16A34A] selection:text-white">
      {/* 1. Clinical Institutional Header */}
      <ClinicalHeader
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setPredictionResult(null);
        }}
        onOpenTestDataModal={() => setShowTestDataModal(true)}
        modelsLoaded={!loadingMetrics && metrics !== null}
      />

      {/* 2. Clinical Module Navigation Tabs */}
      <DiseaseSelector
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setPredictionResult(null);
        }}
        metrics={metrics}
      />

      {/* 3. Main Clinical Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'docs' ? (
          <ArchitectureDocs samples={samples} />
        ) : (
          <div className="space-y-6">
            {/* Model Spec & Cohort Preloader Strip */}
            <ClinicalCohortStrip
              disease={activeTab}
              metric={currentMetric}
              samples={currentSamples}
              onLoadSample={(sample) => {
                setExternalFormData({ ...sample.parameters });
                setPredictionResult(null);
              }}
              onResetToBaseline={() => {
                setExternalFormData({});
                setPredictionResult(null);
              }}
              onOpenTestDataModal={() => setShowTestDataModal(true)}
            />

            {/* Active Prediction Result Card (When calculated) */}
            {predictionResult && (
              <div id="prediction-result-anchor">
                <ResultDisplay
                  result={predictionResult}
                  onReset={() => setPredictionResult(null)}
                />
              </div>
            )}

            {/* Parameter Input Form with React Hook Form + Zod Validation */}
            <PredictionForm
              disease={activeTab}
              samples={samples || undefined}
              currentResult={predictionResult}
              modelAccuracy={currentMetric?.test_accuracy || 86.8}
              externalFormData={externalFormData}
              onPredictionComplete={handlePredictionComplete}
              onClearResult={handleClearResult}
            />
          </div>
        )}
      </main>

      {/* 4. Clinical System Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-500 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-medium text-slate-700">
              HealthPredict AI &bull; Scikit-Learn Random Forest Pipelines (100 Trees, Stratified 75/25 Split)
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowTestDataModal(true)}
              className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>25% Held-Out Test Set (CSV)</span>
            </button>

            <a
              href="/Multi_Disease_Prediction_System_Presentation.pptx"
              download="Multi_Disease_Prediction_System_Presentation.pptx"
              className="text-amber-600 hover:text-amber-800 font-semibold inline-flex items-center space-x-1.5 transition-colors"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Project Slides (.PPTX)</span>
            </a>

            <a
              href="/standalone.html"
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center space-x-1 transition-colors"
            >
              <span>Offline Client</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* 5. 25% Held-out Test Data Modal */}
      <TestDataModal
        isOpen={showTestDataModal}
        onClose={() => setShowTestDataModal(false)}
        activeDisease={activeTab === 'docs' ? 'heart' : activeTab}
        onLoadTestRow={(disease, rowData) => {
          setActiveTab(disease);
          setExternalFormData({ ...rowData });
          setPredictionResult(null);
        }}
      />
    </div>
  );
}
