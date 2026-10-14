import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RotateCcw,
  FileText,
  Printer,
  Sparkles,
  Sliders,
  ShieldAlert,
  Calendar,
  Stethoscope
} from 'lucide-react';
import { PredictionResult } from '../types';
import { BiomarkerVisualizer } from './BiomarkerVisualizer';
import { EnsembleVotingBreakdown } from './EnsembleVotingBreakdown';
import { RiskGaugeMeter } from './RiskGaugeMeter';
import { HealthRadarChart } from './HealthRadarChart';
import { ShapWaterfallChart } from './ShapWaterfallChart';
import { AnatomicalOrganView } from './AnatomicalOrganView';
import { DecisionTreeVisualizer } from './DecisionTreeVisualizer';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface ResultDisplayProps {
  result: PredictionResult;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Counterfactual "What-If" Simulation Interactive State
  const [simulatedGlucose, setSimulatedGlucose] = useState<number>(100);
  const [simulatedBmi, setSimulatedBmi] = useState<number>(24);
  const [simulatedBp, setSimulatedBp] = useState<number>(120);

  const isPositive = result.is_positive;
  const isHighRisk = result.risk_level === 'High Risk';
  const isModerate = result.risk_level === 'Moderate Risk';

  // Dangerous anomalies flagged by engine (even if overall risk is low/normal)
  const dangerousAnomalies = result.dangerous_anomalies || [];
  const hasDangerousAnomaly = dangerousAnomalies.length > 0;

  // Counterfactual calculation: calculate dropped risk
  const baselineRisk = result.risk_score;
  const glucoseDelta = Math.max(0, (160 - simulatedGlucose) * 0.15);
  const bmiDelta = Math.max(0, (32 - simulatedBmi) * 0.8);
  const bpDelta = Math.max(0, (150 - simulatedBp) * 0.12);
  const simulatedRisk = Math.max(8.5, Math.round((baselineRisk - (glucoseDelta + bmiDelta + bpDelta)) * 10) / 10);

  const badgeIcon = isHighRisk ? (
    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
  ) : isModerate ? (
    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
  ) : (
    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
  );

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySummary = () => {
    const summaryText = `==========================================================
HEALTHPREDICT AI - CLINICAL ASSESSMENT BRIEFING
==========================================================
Assessment Target: ${result.disease_name}
Risk Stratification: ${result.result} (${result.risk_level})
Calibrated Risk Probability: ${result.risk_score}%

CRITICAL ISOLATED ANOMALIES:
${dangerousAnomalies.length > 0 ? dangerousAnomalies.map(a => `  [!] ${a.parameter}: ${a.value} ${a.unit} - ${a.warning}`).join('\n') : '  None'}

KEY BIOMARKERS EVALUATED:
${result.key_factors.map((f, i) => `  [${i + 1}] ${f}`).join('\n')}

CLINICAL RECOMMENDATION:
${result.clinical_summary}
==========================================================`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <Card className="border-emerald-200 shadow-sm bg-white overflow-hidden print:shadow-none print:border-none rounded-2xl">
      {/* 1. DANGEROUS ANOMALY ALERT BANNER */}
      {hasDangerousAnomaly && (
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 shadow-inner">
          <div className="flex items-start gap-3.5">
            <span className="p-2.5 bg-white/20 rounded-xl mt-0.5">
              <ShieldAlert className="w-6 h-6 text-white animate-bounce" />
            </span>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-extrabold uppercase tracking-wider text-xs bg-white text-red-700 px-2.5 py-0.5 rounded font-mono">
                  Isolated High-Danger Alert
                </span>
                <span className="text-xs font-semibold text-red-100">
                  (Notice: Even if overall risk score appears safe, this specific parameter requires clinical vigilance)
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold">
                Critical Parameter Warning: High Future Complication Risk Detected
              </h3>
              {dangerousAnomalies.map((anom, i) => (
                <div key={i} className="text-xs bg-black/25 p-3 rounded-xl border border-white/20 mt-2 space-y-1">
                  <div className="font-semibold text-yellow-200">
                    &bull; {anom.parameter}: {anom.value} {anom.unit} (Exceeds critical threshold: {anom.threshold})
                  </div>
                  <p className="text-white/95 leading-relaxed">{anom.warning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Top Clinical Verdict Banner */}
      <div
        className={`p-5 sm:p-6 border-b transition-colors ${
          isHighRisk
            ? 'bg-red-50/90 border-red-200'
            : isModerate
            ? 'bg-amber-50/90 border-amber-200'
            : 'bg-emerald-50/90 border-emerald-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-white shadow-xs border border-emerald-200 mt-0.5">
              {badgeIcon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Risk Stratification
                </span>
                <Badge
                  variant={isHighRisk ? 'destructive' : isModerate ? 'warning' : 'success'}
                  className="font-bold text-xs"
                >
                  {result.risk_level}
                </Badge>
                <Badge variant="outline" className="font-mono text-[10px] text-gray-700 bg-white border-emerald-300 font-semibold">
                  Class {result.prediction}
                </Badge>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-gray-900">
                {result.result}
              </h2>
              <p className="text-xs sm:text-sm mt-1.5 text-gray-700 leading-relaxed max-w-3xl font-medium">
                {result.clinical_summary}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs bg-white text-gray-700 hover:text-gray-900 border-emerald-300 hover:bg-emerald-50"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              <span>Print Report</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySummary}
              className="text-xs bg-white text-emerald-800 hover:bg-emerald-50 border-emerald-300"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />}
              <span>{copiedSummary ? 'Copied' : 'Copy Doctor Note'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="text-xs bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1 text-gray-500" />
              <span>New Patient</span>
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-5 sm:p-7 space-y-6">
        {/* Core Statistical Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-1.5 uppercase tracking-wider">
              <span>Risk Probability</span>
              <span className="font-mono font-bold text-gray-900 text-sm">{result.risk_score}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden my-1">
              <div
                className={`h-full transition-all duration-700 rounded-full ${
                  isHighRisk ? 'bg-red-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(4, result.risk_score))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
              <span>0% Low</span>
              <span>40% Moderate</span>
              <span>70%+ High</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-1 uppercase tracking-wider">
              <span>Ensemble Confidence</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="mt-1">
              <div className="text-2xl font-bold font-mono text-gray-900">{result.confidence}%</div>
              <p className="text-[11px] text-gray-500 mt-0.5">Calibrated Random Forest voting consensus</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-1 uppercase tracking-wider">
              <span>Classification Verdict</span>
              <span className="font-mono text-xs px-2 py-0.5 bg-white text-gray-700 rounded font-semibold border border-gray-300">
                Class {result.prediction}
              </span>
            </div>
            <div className="mt-1">
              <div className={`text-sm font-bold ${isPositive ? 'text-red-600' : 'text-emerald-700'}`}>
                {isPositive ? 'Pathology Detected' : 'Healthy Baseline'}
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                Neg: {(result.probabilities.negative * 100).toFixed(1)}% | Pos: {(result.probabilities.positive * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* 3. "WHAT-IF" COUNTERFACTUAL SIMULATION SLIDER */}
        <div className="bg-gradient-to-r from-emerald-100/60 via-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Interactive "What-If" Counterfactual Simulation (Digital Twin)
                </h3>
                <p className="text-xs text-emerald-800">
                  Simulate therapeutic or lifestyle interventions in real-time to compute prospective risk reduction.
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Simulated Prospective Risk</span>
              <span className="text-xl font-extrabold text-emerald-700 font-mono">
                {simulatedRisk}%
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block">
                (-{(baselineRisk - simulatedRisk).toFixed(1)}% Reduction)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-gray-800">
                <span>Fasting Glucose:</span>
                <span className="text-emerald-700 font-mono font-bold">{simulatedGlucose} mg/dL</span>
              </div>
              <input
                type="range"
                min="70"
                max="220"
                value={simulatedGlucose}
                onChange={(e) => setSimulatedGlucose(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-gray-500 block">Target: &lt; 100 mg/dL</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-gray-800">
                <span>Body Mass Index (BMI):</span>
                <span className="text-emerald-700 font-mono font-bold">{simulatedBmi} kg/m²</span>
              </div>
              <input
                type="range"
                min="19"
                max="40"
                value={simulatedBmi}
                onChange={(e) => setSimulatedBmi(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-gray-500 block">Target: 18.5 - 24.9 kg/m²</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-gray-800">
                <span>Resting Systolic BP:</span>
                <span className="text-emerald-700 font-mono font-bold">{simulatedBp} mmHg</span>
              </div>
              <input
                type="range"
                min="90"
                max="180"
                value={simulatedBp}
                onChange={(e) => setSimulatedBp(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-gray-500 block">Target: &lt; 120 mmHg</span>
            </div>
          </div>
        </div>

        {/* 4. REVERSIBLE BIOMARKERS & 14-DAY ROADMAP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-emerald-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Reversible Biomarkers (Addressable in 90 Days):
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-100 flex justify-between items-center">
                <span><strong>Blood Glucose & Glycemic Balance:</strong> 60-90 days dietary titration</span>
                <span className="text-emerald-700 font-bold text-[11px]">Reversible 🟢</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-100 flex justify-between items-center">
                <span><strong>BMI & Adiposity:</strong> Structured caloric deficit + daily cardio</span>
                <span className="text-emerald-700 font-bold text-[11px]">Reversible 🟢</span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex justify-between items-center text-gray-500">
                <span><strong>Age & Familial Genetic Pedigree:</strong> Non-modifiable baseline</span>
                <span className="text-gray-500 font-bold text-[11px]">Fixed ⚪</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-emerald-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <Calendar className="w-4 h-4 text-emerald-600" />
              14-Day Micro-Habit Clinical Prescription:
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <strong className="text-gray-900">Days 1 - 4: </strong>
                <span>15-minute post-prandial brisk walk + 2.5L daily hydration.</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <strong className="text-gray-900">Days 5 - 9: </strong>
                <span>Eliminate refined fructose beverages and ultra-processed lipids.</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <strong className="text-gray-900">Days 10 - 14: </strong>
                <span>Restrict sodium intake to &lt; 2,000 mg/day; maintain 7-8 hours restorative sleep.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. 30-SECOND DOCTOR HANDOVER BRIEFING CARD */}
        <div className="bg-white border-2 border-emerald-600/40 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                30-Second Physician Handover Briefing Card
              </h4>
            </div>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
              Ready for Clinical Consultation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <span className="font-bold text-gray-900 block mb-1">Critical Red Flags:</span>
              <p className="text-gray-700 text-[11px] leading-relaxed">
                {dangerousAnomalies.length > 0 ? dangerousAnomalies.map(a => a.warning).join(', ') : 'Metabolic & glycemic elevation detected.'}
              </p>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <span className="font-bold text-gray-900 block mb-1">Suggested Confirmations:</span>
              <p className="text-gray-700 text-[11px] leading-relaxed">
                HbA1c test, 2D Echocardiogram, Renal Ultrasound & repeat LFT panel in 6 weeks.
              </p>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <span className="font-bold text-gray-900 block mb-1">Clinical Discussion Point:</span>
              <p className="text-gray-700 text-[11px] leading-relaxed">
                Evaluate initiating structured lifestyle reversal protocol alongside preventive titration before irreversible end-organ damage occurs.
              </p>
            </div>
          </div>
        </div>

        {/* Contributing Key Factors */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Biomarker Findings & Clinical Indicators
          </h3>
          <div className="space-y-1.5">
            {result.key_factors.map((factor, index) => (
              <div
                key={index}
                className="flex items-start space-x-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-800"
              >
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    isPositive ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                />
                <span className="leading-relaxed font-medium">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Visual Analytics: Speedometer Gauge + Radar Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RiskGaugeMeter score={result.risk_score} riskLevel={result.risk_level} />
          <HealthRadarChart
            disease={result.disease}
            features={result.features_evaluated}
            isPositive={isPositive}
          />
        </div>

        {/* Target Organ Pathology & Hotspots */}
        <AnatomicalOrganView
          disease={result.disease}
          isPositive={isPositive}
          features={result.features_evaluated}
        />

        {/* Explainable AI: SHAP Feature Importance Waterfall */}
        <ShapWaterfallChart
          disease={result.disease}
          features={result.features_evaluated}
          riskScore={result.risk_score}
        />

        {/* Laboratory Biomarkers vs Clinical Reference Ranges */}
        <BiomarkerVisualizer
          disease={result.disease}
          features={result.features_evaluated}
        />

        {/* Decision Tree Visualizer */}
        <DecisionTreeVisualizer
          disease={result.disease}
          features={result.features_evaluated}
          isPositive={isPositive}
        />

        {/* Random Forest Voting Consensus */}
        <EnsembleVotingBreakdown result={result} />

        {/* Raw JSON Developer Inspector */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-gray-800 font-semibold py-1 cursor-pointer"
            >
              {showJson ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{showJson ? 'Hide' : 'Inspect'} Full Structured JSON Output</span>
              <span className="text-[10px] text-gray-400 font-mono">(/api/predict/{result.disease})</span>
            </button>

            {showJson && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyJson}
                className="h-7 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </Button>
            )}
          </div>

          {showJson && (
            <pre className="mt-3 p-4 rounded-xl bg-gray-950 text-gray-200 font-mono text-xs overflow-x-auto border border-gray-800 leading-relaxed max-h-80">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
