import React, { useState } from 'react';
import { Layers, Scan, Upload, FileCheck2, AlertCircle, Clock, CheckCircle2, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { CTScanAnalysisResult } from '../types';

export const CTScanAnalyzerModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ctFile, setCtFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanRegion, setScanRegion] = useState('Abdomen & Pelvis (Liver / Kidney)');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CTScanAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCtFile(file);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyzeScan = async () => {
    if (!ctFile || !preview) {
      setError('Please select a CT scan image slice or radiological cross-section.');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/analyze-ct-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: preview,
          mimeType: ctFile.type || 'image/jpeg',
          scanType: 'Helical Computed Tomography (CT)',
          scanRegion: scanRegion
        })
      });

      const json = await res.json();
      if (json.status === 'success') {
        setResult(json.data);
      } else {
        setError(json.message || 'Radiological scan parsing failed.');
      }
    } catch (err: any) {
      setError('Server communication error: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 shadow-xs transition"
      >
        <Scan className="w-4 h-4 text-emerald-600" />
        <span>CT Scan Immediate Reader</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-emerald-200">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-50/70">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-emerald-700 text-white rounded-xl shadow-xs">
                  <Layers className="w-5 h-5 text-white" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      CT Scan Provisional Radiology Accelerator
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Overcomes 24-48hr Hospital Wait
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Hospital radiology reports often take 24 to 48 hours to finalize. This engine generates immediate provisional radiological impressions.
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
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-6 space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-gray-800 block mb-1">
                      Target Anatomical Region:
                    </label>
                    <select
                      value={scanRegion}
                      onChange={(e) => setScanRegion(e.target.value)}
                      className="w-full text-xs bg-white border border-emerald-200 rounded-xl p-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Abdomen & Pelvis (Liver / Kidney)">Abdomen & Pelvis (Hepatic / Renal Parenchyma)</option>
                      <option value="Chest / Thorax (Lungs / Heart / Aorta)">Chest & Thorax (Pulmonary / Coronary Calcification)</option>
                      <option value="Brain / Head (Stroke / Hemorrhage / Infarct)">Brain & Neurovascular (Cerebral Infarct / Hemorrhage)</option>
                    </select>
                  </div>

                  <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition bg-emerald-50/30 hover:bg-emerald-50/60 min-h-[140px]">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Upload className="w-7 h-7 text-emerald-600 mb-2" />
                    <span className="text-xs font-bold text-gray-900 text-center">
                      {ctFile ? ctFile.name : 'Upload CT Scan Cross-Section or DICOM Slice'}
                    </span>
                    <span className="text-[11px] text-gray-500 mt-1">
                      Supports JPG, PNG (Axial, Coronal, or Sagittal CT reconstructions)
                    </span>
                  </label>

                  {ctFile && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleAnalyzeScan}
                        disabled={analyzing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50"
                      >
                        {analyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Evaluating Attenuation (Hounsfield Units)...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Generate Provisional Report
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="md:col-span-6 border border-emerald-200 rounded-xl bg-gray-900 p-2 flex items-center justify-center h-[220px] relative overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="CT preview" className="max-h-full max-w-full object-contain rounded" />
                  ) : (
                    <div className="text-center text-xs text-gray-400 p-4">
                      <Scan className="w-10 h-10 mx-auto mb-2 text-gray-500 opacity-60" />
                      <p>CT scan cross-sectional visual window</p>
                      <p className="text-[10px] text-gray-500 mt-1">Tissue density and margins will be segmented</p>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  {error}
                </div>
              )}

              {/* Analysis Results View */}
              {result && (
                <div className="space-y-5 border-t border-emerald-100 pt-5">
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Executive Diagnostic Summary:
                    </div>
                    <p className="text-xs text-gray-800 leading-relaxed">
                      {result.layman_summary}
                    </p>
                  </div>

                  <div className="bg-white border border-emerald-200 rounded-xl p-4 space-y-2">
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-emerald-600" />
                      Anatomical Organ Findings & Parenchymal Status:
                    </div>
                    <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
                      {result.key_findings.map((f, i) => (
                        <li key={i} className="leading-relaxed">{f}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Formal Written Radiology Draft */}
                  <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 font-mono text-[11px] space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="font-bold text-gray-900 uppercase">
                        Provisional Radiology Report (Instant Automated Draft)
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                        Ready for Physician Correlation
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-800">TECHNIQUE: </span>
                      <span className="text-gray-700">{result.provisional_report.technique}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-800">FINDINGS: </span>
                      <p className="text-gray-700 mt-0.5 leading-relaxed">{result.provisional_report.findings}</p>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-gray-200">
                      <span className="font-bold text-gray-900">IMPRESSION: </span>
                      <p className="text-gray-900 font-semibold mt-0.5 whitespace-pre-line">
                        {result.provisional_report.impression}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Scanner
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
