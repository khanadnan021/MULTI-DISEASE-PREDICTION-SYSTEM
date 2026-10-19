import React from 'react';
import { DiseaseKey } from '../types';
import { GitFork, ArrowDownRight, ArrowDownLeft, CheckCircle2, AlertOctagon } from 'lucide-react';

interface DecisionTreeVisualizerProps {
  disease: DiseaseKey;
  features?: Record<string, number>;
  isPositive: boolean;
}

export const DecisionTreeVisualizer: React.FC<DecisionTreeVisualizerProps> = ({
  disease,
  features = {},
  isPositive
}) => {
  const feat: Record<string, any> = features;
  const getVal = (k: string, defVal = 0): number => {
    if (!feat) return defVal;
    const v = feat[k] !== undefined ? feat[k] : feat[k.toLowerCase()];
    if (v !== undefined && v !== null && v !== '') {
      const num = Number(v);
      return !isNaN(num) ? num : defVal;
    }
    return defVal;
  };

  const getTreeRules = () => {
    switch (disease) {
      case 'heart': {
        const oldpeak = getVal('oldpeak', 0);
        const cp = getVal('cp', 0);
        const ca = getVal('ca', 0);
        const thalach = getVal('thalach', 150);

        const rootConditionMet = oldpeak >= 1.5;
        const leftBranchMet = cp === 0;
        const rightBranchMet = ca > 0;

        return {
          rootQuestion: 'ST Depression (Oldpeak) >= 1.5 mm?',
          rootValue: `${oldpeak} mm`,
          rootPassed: rootConditionMet,
          leftNode: {
            question: 'Chest Pain (cp) == Typical Angina (0)?',
            value: `cp = ${cp}`,
            passed: leftBranchMet,
            trueLeaf: 'High Risk (Class 1) — Ischemia Confirmed',
            falseLeaf: 'Intermediate Risk — Check Thalach'
          },
          rightNode: {
            question: 'Fluoroscopy Vessels (ca) > 0?',
            value: `ca = ${ca}`,
            passed: rightBranchMet,
            trueLeaf: 'Coronary Plaque (Class 1)',
            falseLeaf: 'Normal Baseline (Class 0)'
          }
        };
      }

      case 'diabetes': {
        const glucose = getVal('Glucose', 100);
        const bmi = getVal('BMI', 25);
        const age = getVal('Age', 30);

        const rootConditionMet = glucose >= 125;
        const leftBranchMet = bmi >= 30;
        const rightBranchMet = age >= 40;

        return {
          rootQuestion: 'Fasting Plasma Glucose >= 125 mg/dL?',
          rootValue: `${glucose} mg/dL`,
          rootPassed: rootConditionMet,
          leftNode: {
            question: 'Body Mass Index (BMI) >= 30 kg/m²?',
            value: `BMI = ${bmi}`,
            passed: leftBranchMet,
            trueLeaf: 'Diabetic Mellitus (Class 1)',
            falseLeaf: 'Impaired Glucose (Class 1/0)'
          },
          rightNode: {
            question: 'Patient Age >= 40 years?',
            value: `Age = ${age}`,
            passed: rightBranchMet,
            trueLeaf: 'Pre-Diabetic Watch (Class 1)',
            falseLeaf: 'Normoglycemic (Class 0)'
          }
        };
      }

      case 'kidney': {
        const sc = getVal('sc', 1.0);
        const al = getVal('al', 0);
        const bu = getVal('bu', 30);

        const rootConditionMet = sc >= 1.4;
        const leftBranchMet = al >= 1;
        const rightBranchMet = bu >= 50;

        return {
          rootQuestion: 'Serum Creatinine (sc) >= 1.4 mg/dL?',
          rootValue: `${sc} mg/dL`,
          rootPassed: rootConditionMet,
          leftNode: {
            question: 'Albuminuria (al) >= Grade 1+?',
            value: `al = ${al}`,
            passed: leftBranchMet,
            trueLeaf: 'Chronic Kidney Disease (Class 1)',
            falseLeaf: 'Renal Insufficiency (Class 1)'
          },
          rightNode: {
            question: 'Blood Urea (bu) >= 50 mg/dL?',
            value: `bu = ${bu}`,
            passed: rightBranchMet,
            trueLeaf: 'Azotemia Risk (Class 1)',
            falseLeaf: 'Preserved Renal Function (Class 0)'
          }
        };
      }

      case 'liver': {
        const tb = getVal('Total_Bilirubin', 0.8);
        const sgpt = getVal('Alamine_Aminotransferase', 30);
        const alb = getVal('Albumin', 4.0);

        const rootConditionMet = tb >= 1.5;
        const leftBranchMet = sgpt >= 45;
        const rightBranchMet = alb < 3.5;

        return {
          rootQuestion: 'Total Bilirubin >= 1.5 mg/dL?',
          rootValue: `${tb} mg/dL`,
          rootPassed: rootConditionMet,
          leftNode: {
            question: 'ALT / SGPT Enzyme >= 45 U/L?',
            value: `ALT = ${sgpt}`,
            passed: leftBranchMet,
            trueLeaf: 'Hepatocellular Injury (Class 1)',
            falseLeaf: 'Biliary Cholestasis (Class 1)'
          },
          rightNode: {
            question: 'Serum Albumin < 3.5 g/dL?',
            value: `Albumin = ${alb}`,
            passed: rightBranchMet,
            trueLeaf: 'Hypoalbuminemia (Class 1)',
            falseLeaf: 'Healthy Liver Baseline (Class 0)'
          }
        };
      }

      case 'stroke': {
        const htn = getVal('hypertension', 0);
        const glucose = getVal('avg_glucose_level', 100);
        const smoke = getVal('smoking_status', 0);

        const rootConditionMet = htn === 1;
        const leftBranchMet = glucose >= 140;
        const rightBranchMet = smoke === 2;

        return {
          rootQuestion: 'Chronic Arterial Hypertension Present?',
          rootValue: htn === 1 ? 'Yes' : 'No',
          rootPassed: rootConditionMet,
          leftNode: {
            question: 'Average Blood Glucose >= 140 mg/dL?',
            value: `Glucose = ${glucose} mg/dL`,
            passed: leftBranchMet,
            trueLeaf: 'Severe Stroke Risk (Class 1) — Endothelial Shear',
            falseLeaf: 'High Hypertensive Stroke Strain (Class 1)'
          },
          rightNode: {
            question: 'Current Tobacco Smoker (smoke == 2)?',
            value: `Smoking = ${smoke}`,
            passed: rightBranchMet,
            trueLeaf: 'Moderate Stroke Threat (Class 1)',
            falseLeaf: 'Low Cerebrovascular Baseline (Class 0)'
          }
        };
      }

      default: {
        return {
          rootQuestion: 'Evaluating Baseline Risk Factor?',
          rootValue: '0',
          rootPassed: false,
          leftNode: { question: 'Node L', value: '0', passed: false, trueLeaf: 'Class 1', falseLeaf: 'Class 0' },
          rightNode: { question: 'Node R', value: '0', passed: false, trueLeaf: 'Class 1', falseLeaf: 'Class 0' }
        };
      }
    }
  };

  const tree = getTreeRules();

  return (
    <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <GitFork className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Representative Decision Tree Flowchart (Sample from 100 Forest Trees)
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Depth=2 Path Trace
        </span>
      </div>

      <p className="text-xs text-slate-400">
        In a Random Forest, each tree asks sequential hierarchical threshold questions. Below is
        the exact binary decision path traversed by Tree #42 for this patient:
      </p>

      {/* Decision Tree Diagram */}
      <div className="flex flex-col items-center pt-2 space-y-3">
        {/* Root Node */}
        <div className="w-full max-w-sm bg-slate-900 p-3.5 rounded-xl border-2 border-slate-700 shadow-md text-center relative">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Level 0: Root Node Split
          </span>
          <p className="text-xs font-bold text-white mt-0.5">{tree.rootQuestion}</p>
          <div className="mt-1.5 inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-800 text-slate-200 border border-slate-700">
            <span>Patient value: {tree.rootValue}</span>
            <span
              className={`font-bold ${tree.rootPassed ? 'text-rose-400' : 'text-emerald-400'}`}
            >
              ({tree.rootPassed ? 'TRUE' : 'FALSE'})
            </span>
          </div>
        </div>

        {/* Branch Lines */}
        <div className="flex justify-between w-full max-w-md px-12 text-xs font-bold font-mono">
          <div className="flex items-center space-x-1 text-rose-400">
            <ArrowDownLeft className="w-4 h-4" />
            <span>Path: YES</span>
          </div>
          <div className="flex items-center space-x-1 text-emerald-400">
            <span>Path: NO</span>
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>

        {/* Level 1 Sub-Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
          {/* Left Branch Node */}
          <div
            className={`p-3.5 rounded-xl border-2 text-center transition-all ${
              tree.rootPassed
                ? 'bg-rose-950/40 border-rose-700/80 shadow-sm ring-2 ring-rose-900/60 text-rose-200'
                : 'bg-slate-900/60 border-slate-800 opacity-50 text-slate-400'
            }`}
          >
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Left Sub-Branch
            </span>
            <p className="text-xs font-bold text-slate-200 mt-0.5">{tree.leftNode.question}</p>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Evaluated: {tree.leftNode.value}
            </p>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-center space-x-1 text-xs font-bold text-rose-400">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>{tree.leftNode.trueLeaf}</span>
            </div>
          </div>

          {/* Right Branch Node */}
          <div
            className={`p-3.5 rounded-xl border-2 text-center transition-all ${
              !tree.rootPassed
                ? 'bg-emerald-950/40 border-emerald-700/80 shadow-sm ring-2 ring-emerald-900/60 text-emerald-200'
                : 'bg-slate-900/60 border-slate-800 opacity-50 text-slate-400'
            }`}
          >
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Right Sub-Branch
            </span>
            <p className="text-xs font-bold text-slate-200 mt-0.5">{tree.rightNode.question}</p>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Evaluated: {tree.rightNode.value}
            </p>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-center space-x-1 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{tree.rightNode.falseLeaf}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
