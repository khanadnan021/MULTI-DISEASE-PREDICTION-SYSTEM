import React from 'react';
import { DiseaseKey } from '../types';
import { Activity, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';

interface BiomarkerMetric {
  key: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  normalRange: [number, number];
  borderlineRange?: [number, number];
  status: 'normal' | 'borderline' | 'abnormal';
  statusLabel: string;
  clinicalNote: string;
}

interface BiomarkerVisualizerProps {
  disease: DiseaseKey;
  features?: Record<string, number>;
}

export const BiomarkerVisualizer: React.FC<BiomarkerVisualizerProps> = ({ disease, features = {} }) => {
  if (!features || Object.keys(features).length === 0) {
    return null;
  }

  const feat: Record<string, number> = features;
  const getVal = (k: string, defVal = 0): number => (feat[k] !== undefined ? feat[k] : defVal);

  const getMetrics = (): BiomarkerMetric[] => {
    switch (disease) {
      case 'heart': {
        const trestbps = getVal('trestbps', 120);
        const chol = getVal('chol', 200);
        const thalach = getVal('thalach', 150);
        const oldpeak = getVal('oldpeak', 0);
        const fbs = getVal('fbs', 0);

        return [
          {
            key: 'trestbps',
            name: 'Resting Blood Pressure',
            value: trestbps,
            unit: 'mmHg',
            min: 80,
            max: 200,
            normalRange: [90, 120],
            borderlineRange: [121, 139],
            status: trestbps >= 140 ? 'abnormal' : trestbps >= 121 ? 'borderline' : 'normal',
            statusLabel: trestbps >= 140 ? 'Hypertensive' : trestbps >= 121 ? 'Pre-Hypertension' : 'Normal',
            clinicalNote: trestbps >= 140 ? 'High pressure strains cardiac walls' : 'Optimal vascular workload'
          },
          {
            key: 'chol',
            name: 'Serum Cholesterol',
            value: chol,
            unit: 'mg/dL',
            min: 120,
            max: 400,
            normalRange: [120, 200],
            borderlineRange: [201, 239],
            status: chol >= 240 ? 'abnormal' : chol >= 201 ? 'borderline' : 'normal',
            statusLabel: chol >= 240 ? 'High Risk' : chol >= 201 ? 'Borderline' : 'Desirable',
            clinicalNote: chol >= 240 ? 'Elevated atherogenic plaque risk' : 'Healthy lipid distribution'
          },
          {
            key: 'thalach',
            name: 'Max Heart Rate (Stress)',
            value: thalach,
            unit: 'bpm',
            min: 70,
            max: 210,
            normalRange: [130, 200],
            borderlineRange: [115, 129],
            status: thalach < 115 ? 'abnormal' : thalach < 130 ? 'borderline' : 'normal',
            statusLabel: thalach < 115 ? 'Low Reserve' : thalach < 130 ? 'Borderline' : 'Optimal Reserve',
            clinicalNote: thalach < 120 ? 'Sub-optimal aerobic myocardial response' : 'Good cardiovascular endurance'
          },
          {
            key: 'oldpeak',
            name: 'ST Depression (Oldpeak)',
            value: oldpeak,
            unit: 'mm',
            min: 0,
            max: 6,
            normalRange: [0, 1.0],
            borderlineRange: [1.0, 1.9],
            status: oldpeak >= 2.0 ? 'abnormal' : oldpeak >= 1.0 ? 'borderline' : 'normal',
            statusLabel: oldpeak >= 2.0 ? 'Significant Ischemia' : oldpeak >= 1.0 ? 'Mild Depression' : 'Normal Baseline',
            clinicalNote: oldpeak >= 1.5 ? 'Suggestive of exercise-induced coronary ischemia' : 'Normal repolarization pattern'
          },
          {
            key: 'fbs',
            name: 'Fasting Blood Sugar > 120',
            value: fbs,
            unit: fbs === 1 ? 'High (>120)' : 'Normal (<=120)',
            min: 0,
            max: 1,
            normalRange: [0, 0],
            status: fbs === 1 ? 'borderline' : 'normal',
            statusLabel: fbs === 1 ? 'Elevated' : 'Normal',
            clinicalNote: fbs === 1 ? 'Impaired fasting glucose contributes to microvascular risk' : 'Normal glycemic metabolism'
          }
        ];
      }

      case 'diabetes': {
        const glucose = getVal('Glucose', 100);
        const bmi = getVal('BMI', 24);
        const bp = getVal('BloodPressure', 72);
        const insulin = getVal('Insulin', 80);
        const dpf = getVal('DiabetesPedigreeFunction', 0.3);

        return [
          {
            key: 'Glucose',
            name: 'Plasma Glucose (2hr test)',
            value: glucose,
            unit: 'mg/dL',
            min: 60,
            max: 240,
            normalRange: [70, 100],
            borderlineRange: [101, 139],
            status: glucose >= 140 ? 'abnormal' : glucose >= 101 ? 'borderline' : 'normal',
            statusLabel: glucose >= 140 ? 'Diabetic Range' : glucose >= 101 ? 'Impaired Glucose' : 'Normal Range',
            clinicalNote: glucose >= 140 ? 'High circulating sugar levels detected' : 'Well-controlled carbohydrate metabolism'
          },
          {
            key: 'BMI',
            name: 'Body Mass Index (BMI)',
            value: bmi,
            unit: 'kg/m²',
            min: 15,
            max: 50,
            normalRange: [18.5, 24.9],
            borderlineRange: [25.0, 29.9],
            status: bmi >= 30.0 ? 'abnormal' : bmi >= 25.0 ? 'borderline' : 'normal',
            statusLabel: bmi >= 30.0 ? 'Obesity Class' : bmi >= 25.0 ? 'Overweight' : 'Normal Weight',
            clinicalNote: bmi >= 30 ? 'Visceral adipose tissue increases insulin resistance' : 'Healthy weight ratio'
          },
          {
            key: 'BloodPressure',
            name: 'Diastolic Blood Pressure',
            value: bp,
            unit: 'mmHg',
            min: 40,
            max: 130,
            normalRange: [60, 80],
            borderlineRange: [81, 89],
            status: bp >= 90 ? 'abnormal' : bp >= 81 ? 'borderline' : 'normal',
            statusLabel: bp >= 90 ? 'Stage 2 HTN' : bp >= 81 ? 'Pre-HTN' : 'Optimal',
            clinicalNote: bp >= 90 ? 'Hypertension accelerates diabetic nephropathy' : 'Normotensive'
          },
          {
            key: 'Insulin',
            name: 'Serum Insulin Level',
            value: insulin,
            unit: 'µU/mL',
            min: 10,
            max: 400,
            normalRange: [16, 166],
            borderlineRange: [167, 240],
            status: insulin > 240 ? 'abnormal' : insulin > 166 ? 'borderline' : 'normal',
            statusLabel: insulin > 240 ? 'Hyperinsulinemia' : insulin > 166 ? 'Borderline High' : 'Normal',
            clinicalNote: insulin > 166 ? 'Indicates compensatory pancreatic secretion' : 'Normal pancreatic response'
          },
          {
            key: 'DPF',
            name: 'Diabetes Pedigree Score',
            value: dpf,
            unit: 'ratio',
            min: 0.05,
            max: 2.0,
            normalRange: [0.05, 0.4],
            borderlineRange: [0.41, 0.7],
            status: dpf >= 0.7 ? 'abnormal' : dpf >= 0.41 ? 'borderline' : 'normal',
            statusLabel: dpf >= 0.7 ? 'High Genetic Risk' : dpf >= 0.41 ? 'Moderate Heritage' : 'Low Heritage',
            clinicalNote: dpf >= 0.5 ? 'Significant familial incidence of diabetes mellitus' : 'Low hereditary correlation'
          }
        ];
      }

      case 'kidney': {
        const sc = getVal('sc', 1.0);
        const al = getVal('al', 0);
        const bu = getVal('bu', 30);
        const hemo = getVal('hemo', 14);
        const bp = getVal('bp', 80);

        return [
          {
            key: 'sc',
            name: 'Serum Creatinine',
            value: sc,
            unit: 'mg/dL',
            min: 0.4,
            max: 8.0,
            normalRange: [0.6, 1.2],
            borderlineRange: [1.3, 1.8],
            status: sc >= 1.9 ? 'abnormal' : sc >= 1.3 ? 'borderline' : 'normal',
            statusLabel: sc >= 1.9 ? 'Elevated / Impaired' : sc >= 1.3 ? 'Borderline' : 'Normal',
            clinicalNote: sc >= 1.4 ? 'Reduced glomerular filtration rate (GFR)' : 'Healthy renal filtration capacity'
          },
          {
            key: 'al',
            name: 'Albuminuria (Urine Protein)',
            value: al,
            unit: `Grade ${al}+`,
            min: 0,
            max: 5,
            normalRange: [0, 0],
            borderlineRange: [1, 1],
            status: al >= 2 ? 'abnormal' : al === 1 ? 'borderline' : 'normal',
            statusLabel: al >= 2 ? 'Proteinuria' : al === 1 ? 'Microalbuminuria' : 'Nil (Negative)',
            clinicalNote: al > 0 ? 'Kidney podocyte barrier leakage detected' : 'Intact glomerular barrier'
          },
          {
            key: 'bu',
            name: 'Blood Urea',
            value: bu,
            unit: 'mg/dL',
            min: 10,
            max: 160,
            normalRange: [15, 45],
            borderlineRange: [46, 65],
            status: bu >= 66 ? 'abnormal' : bu >= 46 ? 'borderline' : 'normal',
            statusLabel: bu >= 66 ? 'Uremia Risk' : bu >= 46 ? 'Borderline High' : 'Normal',
            clinicalNote: bu >= 50 ? 'Impaired nitrogenous waste excretion' : 'Adequate urea clearance'
          },
          {
            key: 'hemo',
            name: 'Hemoglobin (Renal Anemia)',
            value: hemo,
            unit: 'g/dL',
            min: 4,
            max: 18,
            normalRange: [13, 17.5],
            borderlineRange: [11.0, 12.9],
            status: hemo < 11.0 ? 'abnormal' : hemo < 13.0 ? 'borderline' : 'normal',
            statusLabel: hemo < 11.0 ? 'Renal Anemia' : hemo < 13.0 ? 'Mild Anemia' : 'Normal',
            clinicalNote: hemo < 12.0 ? 'Decreased erythropoietin production by kidneys' : 'Adequate oxygen-carrying capacity'
          },
          {
            key: 'bp',
            name: 'Blood Pressure',
            value: bp,
            unit: 'mmHg',
            min: 50,
            max: 140,
            normalRange: [60, 80],
            borderlineRange: [81, 89],
            status: bp >= 90 ? 'abnormal' : bp >= 81 ? 'borderline' : 'normal',
            statusLabel: bp >= 90 ? 'Hypertensive' : bp >= 81 ? 'Pre-HTN' : 'Normal',
            clinicalNote: bp >= 80 ? 'Hypertension accelerates nephron loss' : 'Normal vascular pressure'
          }
        ];
      }

      case 'liver': {
        const tb = getVal('Total_Bilirubin', 0.8);
        const db = getVal('Direct_Bilirubin', 0.2);
        const sgpt = getVal('Alamine_Aminotransferase', 30);
        const sgot = getVal('Aspartate_Aminotransferase', 32);
        const alb = getVal('Albumin', 4.0);

        return [
          {
            key: 'tb',
            name: 'Total Bilirubin',
            value: tb,
            unit: 'mg/dL',
            min: 0.1,
            max: 10.0,
            normalRange: [0.2, 1.2],
            borderlineRange: [1.3, 1.9],
            status: tb >= 2.0 ? 'abnormal' : tb >= 1.3 ? 'borderline' : 'normal',
            statusLabel: tb >= 2.0 ? 'Jaundice Level' : tb >= 1.3 ? 'Borderline High' : 'Normal',
            clinicalNote: tb >= 1.5 ? 'Impaired biliary excretion or hepatocellular breakdown' : 'Normal biliary metabolism'
          },
          {
            key: 'sgpt',
            name: 'ALT / SGPT (Liver Enzyme)',
            value: sgpt,
            unit: 'U/L',
            min: 5,
            max: 300,
            normalRange: [7, 40],
            borderlineRange: [41, 60],
            status: sgpt >= 61 ? 'abnormal' : sgpt >= 41 ? 'borderline' : 'normal',
            statusLabel: sgpt >= 61 ? 'Hepatitis / Elevated' : sgpt >= 41 ? 'Borderline' : 'Normal',
            clinicalNote: sgpt >= 45 ? 'Cellular leakage indicating hepatocyte stress or inflammation' : 'Healthy liver cell membranes'
          },
          {
            key: 'sgot',
            name: 'AST / SGOT (Transaminase)',
            value: sgot,
            unit: 'U/L',
            min: 5,
            max: 300,
            normalRange: [8, 40],
            borderlineRange: [41, 60],
            status: sgot >= 61 ? 'abnormal' : sgot >= 41 ? 'borderline' : 'normal',
            statusLabel: sgot >= 61 ? 'Elevated' : sgot >= 41 ? 'Borderline' : 'Normal',
            clinicalNote: sgot >= 45 ? 'Elevated alongside ALT confirms hepatic injury pattern' : 'Standard baseline enzyme level'
          },
          {
            key: 'db',
            name: 'Direct (Conjugated) Bilirubin',
            value: db,
            unit: 'mg/dL',
            min: 0.0,
            max: 5.0,
            normalRange: [0.0, 0.3],
            borderlineRange: [0.4, 0.7],
            status: db >= 0.8 ? 'abnormal' : db >= 0.4 ? 'borderline' : 'normal',
            statusLabel: db >= 0.8 ? 'Obstructive Pattern' : db >= 0.4 ? 'Borderline' : 'Normal',
            clinicalNote: db >= 0.4 ? 'Potential intrahepatic cholestasis' : 'Normal bile passage'
          },
          {
            key: 'alb',
            name: 'Serum Albumin',
            value: alb,
            unit: 'g/dL',
            min: 1.5,
            max: 5.5,
            normalRange: [3.5, 5.0],
            borderlineRange: [3.0, 3.4],
            status: alb < 3.0 ? 'abnormal' : alb < 3.5 ? 'borderline' : 'normal',
            statusLabel: alb < 3.0 ? 'Hypoalbuminemia' : alb < 3.5 ? 'Borderline Low' : 'Adequate',
            clinicalNote: alb < 3.5 ? 'Reduced hepatic protein synthesis capacity' : 'Robust hepatic protein synthesis'
          }
        ];
      }

      default:
        return [];
    }
  };

  const metrics = getMetrics();

  return (
    <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Patient Biomarker Reference Range Breakdown
          </h3>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center space-x-1 text-slate-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block"></span>
            <span>Optimal</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 inline-block"></span>
            <span>Borderline</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block"></span>
            <span>High Risk</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {metrics.map((m) => {
          const clampedVal = Math.min(m.max, Math.max(m.min, m.value));
          const percentage = ((clampedVal - m.min) / (m.max - m.min)) * 100;

          const badgeBg =
            m.status === 'abnormal'
              ? 'bg-rose-950/60 text-rose-300 border-rose-800/80'
              : m.status === 'borderline'
              ? 'bg-amber-950/60 text-amber-300 border-amber-800/80'
              : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80';

          const statusIcon =
            m.status === 'abnormal' ? (
              <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
            ) : m.status === 'borderline' ? (
              <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
            );

          return (
            <div
              key={m.key}
              className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-slate-200">{m.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{m.clinicalNote}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold font-mono text-white">
                    {m.value}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-1 font-mono">
                    {m.unit}
                  </span>
                  <div
                    className={`mt-1 inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold border ${badgeBg}`}
                  >
                    {statusIcon}
                    <span>{m.statusLabel}</span>
                  </div>
                </div>
              </div>

              {/* Range Visual Bar with Pointer Indicator */}
              <div className="space-y-1 pt-1">
                <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  {/* Segment: Normal zone */}
                  <div className="h-full bg-emerald-500 opacity-80" style={{ width: '50%' }}></div>
                  {/* Segment: Borderline zone */}
                  <div className="h-full bg-amber-500 opacity-80" style={{ width: '25%' }}></div>
                  {/* Segment: Abnormal zone */}
                  <div className="h-full bg-rose-500 opacity-80" style={{ width: '25%' }}></div>
                </div>

                {/* Relative Marker Pin */}
                <div className="relative h-2 w-full">
                  <div
                    className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-700"
                    style={{ left: `${Math.min(98, Math.max(2, percentage))}%` }}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full border-2 border-slate-900 shadow-xs ${
                        m.status === 'abnormal'
                          ? 'bg-rose-500 ring-2 ring-rose-900'
                          : m.status === 'borderline'
                          ? 'bg-amber-400 ring-2 ring-amber-900'
                          : 'bg-emerald-400 ring-2 ring-emerald-900'
                      }`}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Min: {m.min}</span>
                  <span>Normal: {m.normalRange[0]}-{m.normalRange[1]}</span>
                  <span>Max: {m.max}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
