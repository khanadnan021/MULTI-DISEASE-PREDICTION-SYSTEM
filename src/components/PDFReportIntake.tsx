import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  AlertCircle,
  FileCheck2,
  Cpu
} from 'lucide-react';
import { DiseaseKey, ExtractedReportData, PredictionResult } from '../types';

interface PDFReportIntakeProps {
  activeDisease: DiseaseKey;
  onPredictionComplete: (result: PredictionResult) => void;
  onBiomarkersExtracted?: (params: Record<string, any>) => void;
  modelAccuracy?: number;
}

export const PDFReportIntake: React.FC<PDFReportIntakeProps> = ({
  activeDisease,
  onPredictionComplete,
  onBiomarkersExtracted,
  modelAccuracy
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractedReportData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const applySelectedFile = (selected: File) => {
    setFile(selected);
    setErrorMsg(null);
    setExtractionResult(null);
    setIsSuccess(false);

    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      applySelectedFile(selected);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      applySelectedFile(droppedFile);
      e.dataTransfer.clearData();
    }
  };

  const handleProcessAndPredict = async () => {
    if (!file) {
      setErrorMsg('Please select your laboratory PDF report or scanned document first.');
      return;
    }

    setAnalyzing(true);
    setErrorMsg(null);
    setIsSuccess(false);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;

        // Step 1: Extract Biomarkers via Vision OCR & validate report validity
        const extractRes = await fetch('/api/ai/extract-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64Data,
            mimeType: file.type || 'application/pdf',
            targetDisease: activeDisease
          })
        });

        const extractJson = await extractRes.json();
        if (extractJson.status !== 'success') {
          throw new Error(extractJson.message || 'Failed to parse laboratory document.');
        }

        const data: ExtractedReportData = extractJson.data;
        setExtractionResult(data);

        // Strict rejection for non-medical documents
        if (!data.is_valid_medical_report) {
          setErrorMsg(
            data.rejection_reason || 
            'The uploaded document could not be verified as a recognized clinical laboratory report. Please upload a genuine blood test or diagnostic PDF panel.'
          );
          setAnalyzing(false);
          return;
        }

        if (onBiomarkersExtracted) {
          onBiomarkersExtracted(data.extracted_parameters);
        }

        // Step 2: Directly execute the ML Prediction pipeline using extracted biomarkers
        const predictRes = await fetch(`/api/predict/${activeDisease}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data.extracted_parameters)
        });

        if (!predictRes.ok) {
          const errData = await predictRes.json();
          throw new Error(errData.message || 'Prediction execution error.');
        }

        const prediction: PredictionResult = await predictRes.json();
        setIsSuccess(true);
        onPredictionComplete(prediction);
        setAnalyzing(false);
      };
    } catch (err: any) {
      setErrorMsg(err.message || 'Network connection error during document parsing.');
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-white border border-emerald-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              Clinical Report Intake & Automated Analysis
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            Upload your laboratory blood test panel, biochemical profile, or diagnostic PDF. The clinical engine extracts biomarkers, screens for dangerous anomalies, and computes risk stratification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Cpu className="w-3.5 h-3.5 text-emerald-700" />
            Gemini Vision OCR + Scikit-Learn Model
          </span>
          <a
            href="/sample_patient_lab_report.pdf"
            download="sample_patient_lab_report.pdf"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
            title="Download realistic test PDF"
          >
            Download Test PDF
          </a>
          {modelAccuracy && (
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-gray-100 text-gray-700 border border-gray-200">
              Accuracy: {modelAccuracy}%
            </span>
          )}
        </div>
      </div>

      {/* Main Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Upload Drop Zone */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <label 
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-7 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[190px] group ${
              isDragging 
                ? 'border-emerald-600 bg-emerald-100/80 scale-[1.01] ring-4 ring-emerald-300' 
                : 'border-emerald-300 hover:border-emerald-600 bg-emerald-50/20 hover:bg-emerald-50/50'
            }`}
          >
            <input
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform ${
              isDragging ? 'bg-emerald-600 text-white scale-110 animate-bounce' : 'bg-emerald-100 text-emerald-700 group-hover:scale-105'
            }`}>
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-gray-900 text-center">
              {isDragging ? 'Release to Drop PDF File Here!' : file ? file.name : 'Click to Browse or Drag & Drop PDF Medical Report'}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Supports official lab PDF documents, JPG, PNG (Max 25MB)
            </span>
          </label>

          {/* Selected File Badge & Submit Button */}
          {file && (
            <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-200 px-4 py-3 rounded-xl">
              <div className="flex items-center gap-2.5 min-w-0 pr-3">
                <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-gray-800 truncate">{file.name}</span>
                <span className="text-[11px] text-gray-400 font-mono">({(file.size / 1024).toFixed(0)} KB)</span>
              </div>
              <button
                onClick={handleProcessAndPredict}
                disabled={analyzing}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50 shrink-0"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Extracting & Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze & Stratify Risk
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5">
              <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Live Extraction & Validation Feedback Panel */}
        <div className="lg:col-span-6 bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between">
          {!extractionResult ? (
            <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-center p-4 space-y-2">
              <FileCheck2 className="w-10 h-10 text-emerald-300" />
              <p className="text-xs font-semibold text-gray-700">Awaiting Clinical Document Upload</p>
              <p className="text-[11px] text-gray-500 max-w-sm">
                Once uploaded, the engine automatically extracts relevant parameters, verifies reference ranges, and identifies any missing or critical out-of-range indicators.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Document Verified ({Object.keys(extractionResult.extracted_parameters).length} Biomarkers Parsed)
                </span>
                {isSuccess && (
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    Risk Assessment Generated Below ↓
                  </span>
                )}
              </div>

              {/* Clinical Summary */}
              {extractionResult.layman_summary && (
                <div className="text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-200 leading-relaxed">
                  <span className="font-bold text-emerald-950">Diagnostic Readout: </span>
                  {extractionResult.layman_summary}
                </div>
              )}

              {/* Missing Biomarkers Warning */}
              {extractionResult.missing_parameters && extractionResult.missing_parameters.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Unreported Biomarker Parameters ({extractionResult.missing_parameters.length} missing):</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    The uploaded report does not contain values for: <strong className="underline">{extractionResult.missing_parameters.join(', ')}</strong>. The assessment will incorporate calibrated physiological population reference baselines.
                  </p>
                </div>
              )}

              {/* Dangerous Parameters Flagged */}
              {extractionResult.dangerous_parameters && extractionResult.dangerous_parameters.length > 0 && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-red-900 text-xs font-bold">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                    <span>Critical Biomarker Deviations Flagged:</span>
                  </div>
                  {extractionResult.dangerous_parameters.map((dp, i) => (
                    <div key={i} className="text-[11px] text-red-800 flex justify-between items-center border-t border-red-100 pt-1">
                      <span><strong>{dp.param}:</strong> {dp.value} {dp.unit} &mdash; {dp.concern}</span>
                      <span className="font-semibold bg-red-100 text-red-900 px-2 py-0.5 rounded text-[10px]">{dp.severity}</span>
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
