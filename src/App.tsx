/**
 * BioMed AI Next-Gen — Clinical Decision Support & Multi-Disease Risk Engine
 * Powered by Hybrid Machine Learning (Scikit-Learn Random Forest) + Google Gemini Multimodal Vision API
 */

import React, { useState, useEffect } from 'react';
import { ClinicalHeader } from './components/ClinicalHeader';
import { DiseaseSelector } from './components/DiseaseSelector';
import { ClinicalCohortStrip } from './components/ClinicalCohortStrip';
import { PDFReportIntake } from './components/PDFReportIntake';
import { ResultDisplay } from './components/ResultDisplay';
import { ArchitectureDocs } from './components/ArchitectureDocs';
import { TestDataModal } from './components/TestDataModal';
import { DrugInteractionChecker } from './components/DrugInteractionChecker';
import { AIChatbot } from './components/AIChatbot';
import { DiseaseKey, ModelMetric, PredictionResult, SampleCase } from './types';
import { ShieldCheck, FileSpreadsheet, Presentation, Sparkles, HelpCircle, MessageCircle, Bot, Stethoscope } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<DiseaseKey | 'docs'>('heart');
  const [metrics, setMetrics] = useState<Record<string, ModelMetric> | null>(null);
  const [samples, setSamples] = useState<Record<string, SampleCase[]> | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [showTestDataModal, setShowTestDataModal] = useState(false);
  const [extractedBiomarkers, setExtractedBiomarkers] = useState<Record<string, any> | null>(null);

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
    setTimeout(() => {
      document.getElementById('prediction-result-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleClearResult = () => {
    setPredictionResult(null);
  };

  // Called by Dr. Aria chatbot when it detects a disease and suggests switching
  const handleChatbotSuggestDisease = (disease: string) => {
    const validTabs: Array<DiseaseKey | 'docs'> = ['heart', 'diabetes', 'kidney', 'liver', 'stroke', 'other'];
    if (validTabs.includes(disease as DiseaseKey)) {
      setActiveTab(disease as DiseaseKey);
      setPredictionResult(null);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const currentDiseaseKey = (activeTab === 'docs' || activeTab === 'other') ? 'heart' : activeTab;
  const currentMetric = metrics ? metrics[currentDiseaseKey] : undefined;
  const currentSamples = samples ? samples[currentDiseaseKey] || [] : [];

  return (
    <div className="min-h-screen w-full bg-[#f4f9f6] font-sans text-gray-900 antialiased flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* 1. Clinical Institutional Header with ECG and CT Scan Modals */}
      <ClinicalHeader
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setPredictionResult(null);
        }}
        onOpenTestDataModal={() => setShowTestDataModal(true)}
        modelsLoaded={!loadingMetrics && metrics !== null}
      />

      {/* 2. Clinical Module Navigation Tabs (5 Diseases + Others) */}
      <DiseaseSelector
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setPredictionResult(null);
        }}
        metrics={metrics}
      />

      {/* 3. Main Clinical Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'docs' ? (
          <ArchitectureDocs samples={samples} />
        ) : activeTab === 'other' ? (
          /* ── Others / General Tab — AI Chat Panel ──────────────────── */
          <div className="space-y-6">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 sm:p-8 text-white shadow-lg">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 text-3xl">
                  🩺
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl sm:text-2xl font-bold">Dr. Aria — AI Medical Assistant</h1>
                    <span className="text-xs bg-white/25 px-2 py-0.5 rounded-full font-medium">Hinglish Support</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed max-w-2xl">
                    Koi bhi bimari ho — <strong>thyroid, BP, anemia, bukhar, joint pain, skin problem</strong> — Dr. Aria se baat karein.
                    Woh samjhenge ki aapki problem kya hai aur kya karna chahiye.
                  </p>
                </div>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-violet-100 p-4 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center mb-3 text-xl">💬</div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Symptoms Batayein</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Jo bhi takleef ho — Hinglish ya English mein bata sakte hain. Dr. Aria samjhega.</p>
              </div>
              <div className="bg-white rounded-xl border border-violet-100 p-4 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center mb-3 text-xl">🔍</div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">AI Analysis</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Dr. Aria symptoms analyse karta hai aur probable cause batata hai.</p>
              </div>
              <div className="bg-white rounded-xl border border-violet-100 p-4 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center mb-3 text-xl">🏥</div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Report Guidance</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Heart/Diabetes/Kidney/Liver/Stroke ke symptoms mile toh seedha woh tab recommend karega.</p>
              </div>
            </div>

            {/* Quick Symptom Chips */}
            <div className="bg-white rounded-xl border border-violet-100 p-5 shadow-sm">
              <h3 className="font-semibold text-sm text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-violet-600">⚡</span> Common Complaints — Dr. Aria se poochein:
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  '🌡️ Bukhar aur thakan', '🦴 Joint pain / Gathiya', '🧬 Thyroid check karna hai',
                  '😰 Anxiety / Stress', '🩸 Anemia / Khoon ki kami', '🤧 Allergy / Skin problem',
                  '💊 BP high rehta hai', '😴 Neend nahi aati', '🤢 Pet mein problem',
                ].map((chip, i) => (
                  <span key={i} className="text-xs bg-violet-50 border border-violet-200 text-violet-700 px-3 py-1.5 rounded-full font-medium">
                    {chip}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3 italic">
                👇 Screen ke bottom-right mein <strong>Dr. Aria</strong> ka button dabayein aur baat shuru karein
              </p>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-amber-800 font-semibold text-sm">Important Disclaimer</p>
                <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                  Dr. Aria ek AI assistant hai — professional doctor ki jagah nahi lete. Emergency situation mein turant <strong>108 ya 102</strong> call karein.
                  Yeh system sirf guidance deta hai; final diagnosis hamesha qualified doctor se karwayein.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Model Specification Banner */}
            <ClinicalCohortStrip
              disease={activeTab}
              metric={currentMetric}
              samples={currentSamples}
              onLoadSample={async (sample) => {
                setExtractedBiomarkers({ ...sample.parameters });
                try {
                  const res = await fetch(`/api/predict/${activeTab}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sample.parameters)
                  });
                  if (res.ok) {
                    const pred = await res.json();
                    handlePredictionComplete(pred);
                  }
                } catch (e) {
                  console.error(e);
                }
              }}
              onResetToBaseline={() => {
                setExtractedBiomarkers(null);
                setPredictionResult(null);
              }}
              onOpenTestDataModal={() => setShowTestDataModal(true)}
            />

            {/* PURE PDF & DOCUMENT UPLOAD INTAKE (Replaces manual text inputs entirely) */}
            <PDFReportIntake
              activeDisease={activeTab}
              modelAccuracy={currentMetric?.test_accuracy || 92.0}
              onBiomarkersExtracted={(params) => setExtractedBiomarkers(params)}
              onPredictionComplete={handlePredictionComplete}
            />

            {/* Active Prediction Result Card */}
            {predictionResult && (
              <div id="prediction-result-anchor">
                <ResultDisplay
                  result={predictionResult}
                  onReset={() => setPredictionResult(null)}
                />
              </div>
            )}

            {/* Drug-Lab Interaction & Organ Load Stress Engine */}
            <DrugInteractionChecker
              currentLabData={extractedBiomarkers || predictionResult?.features_evaluated}
            />
          </div>
        )}
      </main>

      {/* 4. Clinical System Footer */}
      <footer className="bg-white border-t border-emerald-100 py-5 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-gray-500 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium text-emerald-950">
              BioMed AI Next-Gen &bull; Multi-Disease Diagnostic Decision Support System (Scikit-Learn Ensemble + Gemini 1.5 Multimodal OCR)
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowTestDataModal(true)}
              className="text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>25% Held-Out Test Set (CSV)</span>
            </button>

            <a
              href="/Multi_Disease_Prediction_System_Presentation.pptx"
              download="Multi_Disease_Prediction_System_Presentation.pptx"
              className="text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center space-x-1.5 transition-colors"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Project Presentation Slides</span>
            </a>
          </div>
        </div>
      </footer>

      {/* 5. 25% Held-out Test Data Modal */}
      <TestDataModal
        isOpen={showTestDataModal}
        onClose={() => setShowTestDataModal(false)}
        activeDisease={activeTab === 'docs' || activeTab === 'other' ? 'heart' : activeTab}
        onLoadTestRow={async (disease, rowData) => {
          setActiveTab(disease);
          setExtractedBiomarkers({ ...rowData });
          try {
            const res = await fetch(`/api/predict/${disease}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(rowData)
            });
            if (res.ok) {
              const pred = await res.json();
              handlePredictionComplete(pred);
            }
          } catch (e) {
            console.error(e);
          }
        }}
      />

      {/* 6. Dr. Aria — AI Medical Chatbot (Floating, always visible) */}
      <AIChatbot onSuggestDisease={handleChatbotSuggestDisease} />
    </div>
  );
}
