import React, { useState } from 'react';
import { Activity, Heart, Upload, AlertTriangle, CheckCircle2, ShieldCheck, Loader2, Sparkles, FileText } from 'lucide-react';
import { ECGAnalysisResult } from '../types';

export const ECGVisualizerModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ecgFile, setEcgFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ECGAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEcgFile(file);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyzeECG = async () => {
    if (!ecgFile || !preview) {
      setError('Please select an ECG strip or smartwatch waveform recording.');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/analyze-ecg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: preview,
          mimeType: ecgFile.type || 'image/jpeg',
          patientAge: 52,
          patientGender: 1
        })
      });

      const json = await res.json();
      if (json.status === 'success') {
        setResult(json.data);
      } else {
        setError(json.message || 'Error occurred during ECG waveform evaluation.');
      }
    } catch (err: any) {
      setError('Server communication error: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      {/* Trigger Button in Header */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition hover:shadow-sm"
      >
        <Activity className="w-4 h-4 text-emerald-200 animate-pulse" />
        <span>ECG & Rhythm Scanner</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-emerald-200">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-50/70">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                  <Heart className="w-5 h-5 text-white" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    12-Lead Electrocardiogram & Rhythm Analyzer
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Micro-voltage ST-segment deviations and occult arrhythmia detection (Vision AI Engine)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-emerald-50/30 hover:bg-emerald-50/60 min-h-[160px]">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Upload className="w-8 h-8 text-emerald-600 mb-2" />
                  <span className="text-xs font-bold text-gray-900 text-center">
                    {ecgFile ? ecgFile.name : 'Upload 12-Lead ECG Paper Strip or Digital Waveform'}
                  </span>
                  <span className="text-[11px] text-gray-500 mt-1 text-center">
                    Supports JPG, PNG (Clinical Paper ECG, Apple Watch / Wearable ECG graphs)
                  </span>
                </label>

                <div className="border border-emerald-100 rounded-xl bg-gray-50 p-3 h-[160px] flex items-center justify-center overflow-hidden relative">
                  {preview ? (
                    <img src={preview} alt="ECG preview" className="max-h-full max-w-full object-contain rounded-lg" />
                  ) : (
                    <div className="text-center text-xs text-gray-400">
                      <FileText className="w-7 h-7 mx-auto mb-1 text-gray-300" />
                      Waveform recording preview will appear here
                    </div>
                  )}
                </div>
              </div>

              {ecgFile && (
                <div className="flex justify-end">
                  <button
                    onClick={handleAnalyzeECG}
                    disabled={analyzing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Evaluating Micro-Waveforms...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Execute Rhythm Analysis
                      </>
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  {error}
                </div>
              )}

              {/* Analysis Results View */}
              {result && (
                <div className="space-y-4 border-t border-emerald-100 pt-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60">
                      <div className="text-[11px] text-emerald-800 font-semibold">Cardiac Rhythm</div>
                      <div className="text-xs font-bold text-gray-900 mt-1 truncate">{result.rhythm}</div>
                    </div>
                    <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60">
                      <div className="text-[11px] text-emerald-800 font-semibold">Heart Rate</div>
                      <div className="text-sm font-bold text-gray-900 mt-1">{result.heart_rate_bpm} BPM</div>
                    </div>
                    <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60">
                      <div className="text-[11px] text-emerald-800 font-semibold">ST-Segment</div>
                      <div className="text-xs font-bold text-amber-900 mt-1">{result.st_segment_status}</div>
                    </div>
                    <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60">
                      <div className="text-[11px] text-emerald-800 font-semibold">Clinical Stratification</div>
                      <div className="text-sm font-bold text-red-600 mt-1">{result.risk_severity}</div>
                    </div>
                  </div>

                  {/* Sub-Visual Findings */}
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                      Sub-Visual Micro-Fluctuation Findings (Beyond Naked-Eye Inspection):
                    </div>
                    <p className="text-xs leading-relaxed text-gray-300">
                      {result.sub_visual_findings}
                    </p>
                  </div>

                  {/* Diagnostic Explanation */}
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Patient Summary & Clinical Meaning:
                    </div>
                    <p className="text-xs text-gray-800 leading-relaxed">
                      {result.layman_explanation}
                    </p>
                  </div>

                  {/* Doctor Handover Notes */}
                  {result.doctor_handover_notes && result.doctor_handover_notes.length > 0 && (
                    <div className="bg-white border border-gray-200 p-4 rounded-xl space-y-2">
                      <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Cardiology Handover & Confirmatory Recommendations:
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                        {result.doctor_handover_notes.map((note, i) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
