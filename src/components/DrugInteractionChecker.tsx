import React, { useState } from 'react';
import { Pill, AlertTriangle, Plus, Trash2, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { DrugWarning } from '../types';

interface DrugInteractionCheckerProps {
  currentLabData?: Record<string, any>;
}

export const DrugInteractionChecker: React.FC<DrugInteractionCheckerProps> = ({ currentLabData }) => {
  const [medications, setMedications] = useState<string[]>([
    'Ibuprofen 400mg (NSAID Analgesic)',
    'Metformin 500mg'
  ]);
  const [newMed, setNewMed] = useState('');
  const [loading, setLoading] = useState(false);
  const [warnings, setWarnings] = useState<DrugWarning[] | null>(null);

  const handleAddMed = () => {
    if (!newMed.trim()) return;
    setMedications([...medications, newMed.trim()]);
    setNewMed('');
    setWarnings(null);
  };

  const handleRemoveMed = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
    setWarnings(null);
  };

  const handleCheckInteractions = async () => {
    if (medications.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ai/check-drug-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medications,
          labResults: currentLabData || {}
        })
      });

      const json = await res.json();
      if (json.status === 'success') {
        setWarnings(json.data.drug_warnings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-emerald-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Pill className="w-5 h-5 text-emerald-700" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Pharmacological Drug-Lab Interaction & Organ Load Checker
            </h4>
            <p className="text-xs text-gray-500">
              Cross-references active medications with laboratory biomarkers to detect renal clearance stress or hepatotoxicity.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {medications.map((med, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-lg text-xs font-medium"
            >
              <span>{med}</span>
              <button
                type="button"
                onClick={() => handleRemoveMed(idx)}
                className="text-gray-400 hover:text-red-500 p-0.5 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2.5">
          <input
            type="text"
            placeholder="Enter medication name (e.g. Paracetamol 650mg, Atorvastatin, Diclofenac)..."
            value={newMed}
            onChange={(e) => setNewMed(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMed();
              }
            }}
            className="flex-1 text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={handleAddMed}
            className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Drug
          </button>
          <button
            type="button"
            onClick={handleCheckInteractions}
            disabled={loading || medications.length === 0}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Screening Bio-Load...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Screen Organ Load
              </>
            )}
          </button>
        </div>
      </div>

      {warnings && (
        <div className="space-y-2.5 pt-2">
          {warnings.map((w, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                w.severity.includes('Critical') || w.severity.includes('High')
                  ? 'bg-red-50/70 border-red-200 text-red-950'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-2">
                  {w.severity.includes('Critical') || w.severity.includes('High') ? (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  {w.drug} &rarr; Target Organ: {w.affected_organ}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    w.severity.includes('Critical') || w.severity.includes('High')
                      ? 'bg-red-200 text-red-900'
                      : 'bg-emerald-200 text-emerald-900'
                  }`}
                >
                  {w.severity}
                </span>
              </div>
              <p className="text-gray-700 text-[11px] leading-relaxed">{w.reason}</p>
              <div className="bg-white/90 p-2.5 rounded-lg border border-gray-200 text-[11px] font-medium text-emerald-950 mt-1">
                <strong>Clinical Advisory:</strong> {w.layman_tip}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
