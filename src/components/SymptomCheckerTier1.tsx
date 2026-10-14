import React, { useState } from 'react';
import { MessageSquareText, Sparkles, AlertCircle, ArrowRight, CheckCircle2, Loader2, Stethoscope } from 'lucide-react';
import { SymptomCheckResult, DiseaseKey } from '../types';

interface SymptomCheckerTier1Props {
  onSelectDiseaseTab: (disease: DiseaseKey) => void;
}

export const SymptomCheckerTier1: React.FC<SymptomCheckerTier1Props> = ({ onSelectDiseaseTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [symptomsText, setSymptomsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomCheckResult | null>(null);

  const handleRunCheck = async () => {
    if (!symptomsText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ai/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSymptoms: symptomsText })
      });

      const json = await res.json();
      if (json.status === 'success') {
        setResult(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-100/70 via-emerald-50 to-teal-50 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-emerald-950">
                Tier-1 Conversational Symptom Checker (Gemini AI)
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 border border-emerald-300">
                Lab Report Nahi Hai? No Problem!
              </span>
            </div>
            <p className="text-xs text-emerald-800/90 mt-0.5">
              Agar aapke paas abhi blood test report nahi hai, toh apne shareer ke lakshan Hinglish me likhein. AI sambhavit bimari aur zaroori lab tests batayega.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 flex-shrink-0"
        >
          <MessageSquareText className="w-4 h-4" />
          {isOpen ? 'Close Checker' : 'Describe Symptoms'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-emerald-200/60 space-y-4 animate-in fade-in duration-150">
          <div className="space-y-2">
            <textarea
              rows={3}
              value={symptomsText}
              onChange={(e) => setSymptomsText(e.target.value)}
              placeholder="Jaise: 'Mujhe pichle 1 hafte se bohot zyada pyaas lag rahi hai, thakan rehti hai aur seene me chalkar dard hota hai...'"
              className="w-full text-xs p-3 bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
            />
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-gray-500">
                Tip: Jitna detail me likhenge, triage utna accurate hoga.
              </span>
              <button
                onClick={handleRunCheck}
                disabled={loading || !symptomsText.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Run AI Diagnosis
                  </>
                )}
              </button>
            </div>
          </div>

          {result && (
            <div className="bg-white border border-emerald-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Preliminary Triage Assessment
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                  Urgency: {result.triage_urgency}
                </span>
              </div>

              {/* Hinglish Guidance */}
              <p className="text-xs text-gray-700 bg-emerald-50/60 p-3 rounded-lg border border-emerald-100 leading-relaxed">
                💬 <strong className="text-emerald-950">AI Doctor Guidance: </strong>
                {result.hinglish_guidance}
              </p>

              {/* Probable Conditions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.probable_conditions.map((cond, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>{cond.disease}</span>
                      <span className="text-emerald-700">{cond.probability}</span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Matching: {cond.matching_symptoms.join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Lab Tests */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-gray-900">
                  Recommended Confirmatory Lab Tests:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.recommended_lab_tests.map((test, i) => (
                    <div key={i} className="p-2.5 bg-emerald-50/40 rounded-lg border border-emerald-100 text-xs">
                      <div className="font-semibold text-emerald-900">{test.test_name}</div>
                      <div className="text-[11px] text-gray-600 mt-0.5">{test.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
