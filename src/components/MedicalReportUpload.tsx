import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { DiseaseKey, ExtractedReportData } from '../types';

interface MedicalReportUploadProps {
  activeDisease: DiseaseKey;
  onApplyExtractedData: (data: Record<string, any>) => void;
  onClearExtractedData?: () => void;
}

export const MedicalReportUpload: React.FC<MedicalReportUploadProps> = ({
  activeDisease,
  onApplyExtractedData,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractedReportData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setErrorMsg(null);
    setExtractionResult(null);

    // Create preview for images or note PDF
    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleProcessReport = async () => {
    if (!file) {
      setErrorMsg('Kripya pehle apni Lab Report (PDF ya Image) chunein.');
      return;
    }

    setAnalyzing(true);
    setErrorMsg(null);

    try {
      // Convert file to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await fetch('/api/ai/extract-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64Data,
            mimeType: file.type || 'application/pdf',
            targetDisease: activeDisease
          })
        });

        const json = await res.json();
        if (json.status === 'success') {
          const data: ExtractedReportData = json.data;
          if (!data.is_valid_medical_report) {
            setExtractionResult(null);
            setErrorMsg(data.rejection_reason || 'Invalid Medical Report / No Biomarkers Found. Uploaded document does not contain verifiable clinical diagnostic parameters.');
          } else {
            setExtractionResult(data);
          }
        } else {
          setExtractionResult(null);
          setErrorMsg(json.message || 'Invalid Medical Report / No Biomarkers Found. Uploaded document does not contain verifiable clinical diagnostic parameters.');
        }
        setAnalyzing(false);
      };
    } catch (err: any) {
      setErrorMsg('Server connection error: ' + err.message);
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-emerald-950">
              Multimodal Medical Report Scanner (PDF / Photo)
            </h3>
          </div>
          <p className="text-sm text-emerald-700/90 mt-1">
            Haath se medical terms bharne ki zaroorat nahi. Apni blood test ya lab report upload karein, AI automatic biomarkers extract karke form me bhar dega.
          </p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          Gemini 1.5 Vision OCR Active
        </span>
      </div>

      {/* Upload Zone */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-6 flex flex-col justify-center">
          <label className="relative border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/70 hover:bg-emerald-50/50">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <Upload className="w-9 h-9 text-emerald-600 mb-2" />
            <span className="text-sm font-semibold text-emerald-900">
              {file ? file.name : 'Report PDF ya Photo Upload Karein'}
            </span>
            <span className="text-xs text-emerald-600 mt-1">
              Supports PDF, PNG, JPG, JPEG (Max 15MB)
            </span>
          </label>

          {file && (
            <div className="mt-3 flex items-center justify-between bg-white border border-emerald-200 px-4 py-2.5 rounded-xl">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-medium text-emerald-900 truncate">{file.name}</span>
                <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(0)} KB)</span>
              </div>
              <button
                onClick={handleProcessReport}
                disabled={analyzing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    Scan & Fill
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Preview / Extraction Feedback Column */}
        <div className="md:col-span-6 bg-white border border-emerald-200 rounded-xl p-4 flex flex-col justify-between min-h-[160px]">
          {!extractionResult ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              {previewUrl ? (
                <img src={previewUrl} alt="Report Preview" className="max-h-28 object-contain rounded-lg border border-emerald-100" />
              ) : (
                <>
                  <FileText className="w-8 h-8 text-emerald-300 mb-2" />
                  <p className="text-xs font-medium text-emerald-800">Koi Report Scan Nahi Hui</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Upload karke "Scan & Fill" par click karein. AI biomarkers pehchanega aur missing inputs warning dega.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Validation Status */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Report Verified ({Object.keys(extractionResult.extracted_parameters).length} Biomarkers Scanned)
                </span>
                <button
                  onClick={() => onApplyExtractedData(extractionResult.extracted_parameters)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                >
                  Apply to Form Values
                </button>
              </div>

              {/* Layman Summary */}
              {extractionResult.layman_summary && (
                <p className="text-xs text-gray-700 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 leading-relaxed">
                  💡 <span className="font-semibold text-emerald-900">Summary: </span>
                  {extractionResult.layman_summary}
                </p>
              )}

              {/* Missing Inputs Warning */}
              {extractionResult.missing_parameters && extractionResult.missing_parameters.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
                  <div className="flex items-center gap-1.5 text-amber-900 text-xs font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Missing Biomarkers Alert ({extractionResult.missing_parameters.length} nahi mile):</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1">
                    Aapki report me yeh inputs nahi mile: <strong className="underline">{extractionResult.missing_parameters.join(', ')}</strong>. Prediction default normal reference par chalegi, accurate result ke liye inhe form me manually check karein.
                  </p>
                </div>
              )}

              {/* Dangerous Out-of-Range Parameters Found */}
              {extractionResult.dangerous_parameters && extractionResult.dangerous_parameters.length > 0 && (
                <div className="bg-red-50 border border-red-200 p-2.5 rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-red-900 text-xs font-bold">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                    <span>Critical High Values Flagged:</span>
                  </div>
                  {extractionResult.dangerous_parameters.map((dp, i) => (
                    <div key={i} className="text-[11px] text-red-700 flex justify-between items-center border-t border-red-100 pt-1">
                      <span><strong>{dp.param}:</strong> {dp.value} {dp.unit}</span>
                      <span className="font-medium bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-[10px]">{dp.severity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
