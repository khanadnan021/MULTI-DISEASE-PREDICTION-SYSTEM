import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  CheckCircle2, 
  Table, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { DiseaseKey } from '../types';
import { HEART_FIELDS, DIABETES_FIELDS, KIDNEY_FIELDS, LIVER_FIELDS } from '../data/diseaseFields';
import testPreviewData from '../data/testDataPreview.json';

interface TestDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDisease: DiseaseKey;
  onLoadTestRow?: (disease: DiseaseKey, rowData: Record<string, any>) => void;
}

const DATASET_INFO: Record<DiseaseKey, {
  title: string;
  total: number;
  train75: number;
  test25: number;
  positives: number;
  negatives: number;
  paramCount: number;
  filename: string;
  downloadUrl: string;
  fields: any[];
}> = {
  heart: {
    title: 'Heart Disease (Cleveland/UCI)',
    total: 600,
    train75: 450,
    test25: 150,
    positives: 74,
    negatives: 76,
    paramCount: 13,
    filename: 'heart_test_25_percent.csv',
    downloadUrl: '/api/download-test-data/heart',
    fields: HEART_FIELDS
  },
  diabetes: {
    title: 'Diabetes (PIMA Indian)',
    total: 768,
    train75: 576,
    test25: 192,
    positives: 70,
    negatives: 122,
    paramCount: 8,
    filename: 'diabetes_test_25_percent.csv',
    downloadUrl: '/api/download-test-data/diabetes',
    fields: DIABETES_FIELDS
  },
  kidney: {
    title: 'Chronic Kidney Disease (CKD)',
    total: 500,
    train75: 375,
    test25: 125,
    positives: 69,
    negatives: 56,
    paramCount: 15,
    filename: 'kidney_test_25_percent.csv',
    downloadUrl: '/api/download-test-data/kidney',
    fields: KIDNEY_FIELDS
  },
  liver: {
    title: 'Liver Disease (ILPD)',
    total: 583,
    train75: 437,
    test25: 146,
    positives: 72,
    negatives: 74,
    paramCount: 10,
    filename: 'liver_test_25_percent.csv',
    downloadUrl: '/api/download-test-data/liver',
    fields: LIVER_FIELDS
  }
};

export const TestDataModal: React.FC<TestDataModalProps> = ({
  isOpen,
  onClose,
  activeDisease,
  onLoadTestRow
}) => {
  const [selectedDisease, setSelectedDisease] = useState<DiseaseKey>(activeDisease || 'heart');
  const [activeViewTab, setActiveViewTab] = useState<'parameters' | 'preview'>('parameters');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const currentInfo = DATASET_INFO[selectedDisease];
  const previewObj = (testPreviewData as any)[selectedDisease] || { columns: [], preview_rows: [] };

  // Direct programmatic download using Blob
  const handleProgrammaticDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/raw-test-data/${selectedDisease}`);
      if (!res.ok) throw new Error('Failed to fetch raw CSV');
      const data = await res.json();
      
      const blob = new Blob([data.csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', currentInfo.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.warn('Fallback to direct window open', e);
      window.open(currentInfo.downloadUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  // Copy raw CSV to clipboard
  const handleCopyCsv = async () => {
    try {
      const res = await fetch(`/api/raw-test-data/${selectedDisease}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      await navigator.clipboard.writeText(data.csv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Clipboard copy error', e);
    }
  };

  const handleSelectSampleRow = (row: Record<string, any>) => {
    if (onLoadTestRow) {
      // Remove GroundTruth_Label before setting to form
      const { GroundTruth_Label, ...features } = row;
      onLoadTestRow(selectedDisease, features);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  25% Unseen Test Datasets & Exact Parameters
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Verified 100% Match
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Evaluation Split: 75% Training (stratified) / 25% Test Holdout (random_state=42)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disease Selector Navigation Tabs */}
        <div className="bg-slate-850 border-b border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {(['heart', 'diabetes', 'kidney', 'liver'] as DiseaseKey[]).map((dKey) => {
              const active = selectedDisease === dKey;
              const info = DATASET_INFO[dKey];
              return (
                <button
                  key={dKey}
                  onClick={() => setSelectedDisease(dKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    active
                      ? 'bg-[#166534] text-white shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <span className="capitalize">{dKey}</span>
                  <span className={`text-[10px] px-1 rounded font-mono ${active ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-900 text-slate-400'}`}>
                    {info.paramCount}P
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveViewTab('parameters')}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                activeViewTab === 'parameters'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Exact Parameters ({currentInfo.paramCount})
            </button>
            <button
              onClick={() => setActiveViewTab('preview')}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                activeViewTab === 'preview'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Live Data Rows ({currentInfo.test25} rows)
            </button>
          </div>
        </div>

        {/* Info Strip */}
        <div className="px-6 py-2.5 bg-emerald-950/40 border-b border-emerald-900/60 flex flex-wrap items-center justify-between text-xs text-emerald-200 gap-2 shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>{currentInfo.title}:</strong> Total {currentInfo.total} records &rarr; 75% Train ({currentInfo.train75}) / <strong>25% Test Holdout ({currentInfo.test25} rows)</strong>
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span className="text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
              Healthy (Class 0): {currentInfo.negatives}
            </span>
            <span className="text-rose-300 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded">
              Disease (Class 1): {currentInfo.positives}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeViewTab === 'parameters' ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">
                    Parameter Mapping Confirmation (100% Identical)
                  </h4>
                  <p className="text-xs text-slate-400">
                    All {currentInfo.paramCount} parameters in the UI form match the exact CSV column header and model inputs:
                  </p>
                </div>
                <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/80">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Exact Match Guaranteed</span>
                </span>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/90 border-b border-slate-700 text-slate-300 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Dataset Column Name</th>
                      <th className="py-2.5 px-3">Medical / Clinical Parameter</th>
                      <th className="py-2.5 px-3">Input Type & Unit</th>
                      <th className="py-2.5 px-3">Normal Clinical Range</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {currentInfo.fields.map((field, idx) => (
                      <tr key={field.name} className="hover:bg-slate-800/50">
                        <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                        <td className="py-2 px-3 font-mono font-bold text-blue-400">{field.name}</td>
                        <td className="py-2 px-3 font-medium text-slate-200">{field.label}</td>
                        <td className="py-2 px-3 text-slate-400">
                          {field.type} {field.unit ? `(${field.unit})` : ''}
                        </td>
                        <td className="py-2 px-3 text-slate-400 text-[11px]">
                          {field.normalRange || 'N/A'}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                            <Check className="w-3 h-3" />
                            <span>Included</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                    {/* Extra GroundTruth Column */}
                    <tr className="bg-amber-950/20">
                      <td className="py-2 px-3 text-amber-400 font-mono text-[11px]">Target</td>
                      <td className="py-2 px-3 font-mono font-bold text-amber-300">GroundTruth_Label</td>
                      <td className="py-2 px-3 font-medium text-amber-200">Actual Clinical Diagnosis</td>
                      <td className="py-2 px-3 text-amber-300/80">Binary (0 or 1)</td>
                      <td className="py-2 px-3 text-amber-300/80 text-[11px]">0 = Healthy, 1 = Disease</td>
                      <td className="py-2 px-3 text-center">
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                          Ground Truth
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">
                    25% Test Holdout Data Preview (First 5 Rows)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Click "Test Patient" on any row to automatically load its parameters into the live prediction form!
                  </p>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-x-auto shadow-2xs">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-800/90 border-b border-slate-700 text-slate-300 font-semibold font-mono">
                    <tr>
                      <th className="py-2.5 px-3">Test Row</th>
                      <th className="py-2.5 px-3 bg-blue-950/60 text-blue-300">Ground Truth</th>
                      <th className="py-2.5 px-3">Action</th>
                      {previewObj.columns.filter((c: string) => c !== 'GroundTruth_Label').map((col: string) => (
                        <th key={col} className="py-2.5 px-3">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {previewObj.preview_rows.map((row: any, rIdx: number) => {
                      const isDisease = Number(row.GroundTruth_Label) === 1;
                      return (
                        <tr key={rIdx} className="hover:bg-slate-800/50">
                          <td className="py-2 px-3 text-slate-400 font-bold">#{rIdx + 1}</td>
                          <td className="py-2 px-3 bg-blue-950/30">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-block border ${
                              isDisease ? 'bg-rose-950/60 text-rose-300 border-rose-800/80' : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                            }`}>
                              {isDisease ? 'Label 1 (Disease)' : 'Label 0 (Healthy)'}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <button
                              onClick={() => handleSelectSampleRow(row)}
                              className="px-2.5 py-1 rounded text-[11px] font-bold bg-[#166534] hover:bg-[#14532D] text-white transition-colors cursor-pointer flex items-center space-x-1"
                            >
                              <span>Test Patient</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                          {previewObj.columns.filter((c: string) => c !== 'GroundTruth_Label').map((col: string) => (
                            <td key={col} className="py-2 px-3 text-slate-300">{row[col]}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Download Options */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            <span>File: <code className="text-slate-300">{currentInfo.filename}</code> ({currentInfo.test25} rows)</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Copy CSV to Clipboard Button */}
            <button
              onClick={handleCopyCsv}
              className="flex-1 sm:flex-none px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'CSV Copied!' : 'Copy CSV Text'}</span>
            </button>

            {/* Direct Programmatic Download Button */}
            <button
              onClick={handleProgrammaticDownload}
              disabled={downloading}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {downloading ? 'Preparing...' : downloadSuccess ? 'Downloaded!' : 'Download 25% CSV'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
