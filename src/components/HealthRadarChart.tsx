import React from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip 
} from 'recharts';
import { DiseaseKey } from '../types';

interface HealthRadarChartProps {
  disease: DiseaseKey;
  features?: Record<string, number>;
  isPositive: boolean;
}

interface RadarDataPoint {
  biomarker: string;
  patient: number;
  baseline: number;
  actualDisplay: string;
}

export const HealthRadarChart: React.FC<HealthRadarChartProps> = ({
  disease,
  features = {},
  isPositive
}) => {
  const feat: Record<string, number> = features as Record<string, number>;
  const getVal = (k: string, defVal = 0): number => (feat && feat[k] !== undefined ? feat[k] : defVal);

  const getData = (): RadarDataPoint[] => {
    switch (disease) {
      case 'heart': {
        const bp = getVal('trestbps', 120);
        const chol = getVal('chol', 200);
        const oldpeak = getVal('oldpeak', 0);
        const thalach = getVal('thalach', 150);
        const age = getVal('age', 55);
        const ca = getVal('ca', 0);

        return [
          {
            biomarker: 'Blood Pressure',
            patient: Math.min(100, Math.max(10, ((bp - 90) / (180 - 90)) * 100)),
            baseline: 35,
            actualDisplay: `${bp} mmHg`
          },
          {
            biomarker: 'Cholesterol',
            patient: Math.min(100, Math.max(10, ((chol - 130) / (340 - 130)) * 100)),
            baseline: 40,
            actualDisplay: `${chol} mg/dL`
          },
          {
            biomarker: 'ST Depression',
            patient: Math.min(100, Math.max(10, (oldpeak / 3.5) * 100)),
            baseline: 15,
            actualDisplay: `${oldpeak} mm`
          },
          {
            biomarker: 'Cardiac Stress',
            patient: Math.min(100, Math.max(10, ((200 - thalach) / (200 - 80)) * 100)),
            baseline: 30,
            actualDisplay: `${thalach} bpm`
          },
          {
            biomarker: 'Fluoroscopy Vessels',
            patient: Math.min(100, Math.max(10, (ca / 3) * 100)),
            baseline: 10,
            actualDisplay: `${ca} vessels`
          },
          {
            biomarker: 'Age Factor',
            patient: Math.min(100, Math.max(15, ((age - 25) / (80 - 25)) * 100)),
            baseline: 45,
            actualDisplay: `${age} yrs`
          }
        ];
      }

      case 'diabetes': {
        const gluc = getVal('Glucose', 100);
        const bmi = getVal('BMI', 25);
        const bp = getVal('BloodPressure', 70);
        const ins = getVal('Insulin', 80);
        const dpf = getVal('DiabetesPedigreeFunction', 0.35);
        const age = getVal('Age', 30);

        return [
          {
            biomarker: 'Glucose Conc.',
            patient: Math.min(100, Math.max(10, ((gluc - 70) / (250 - 70)) * 100)),
            baseline: 30,
            actualDisplay: `${gluc} mg/dL`
          },
          {
            biomarker: 'Body Mass (BMI)',
            patient: Math.min(100, Math.max(10, ((bmi - 18) / (50 - 18)) * 100)),
            baseline: 30,
            actualDisplay: `${bmi} kg/m²`
          },
          {
            biomarker: 'Blood Pressure',
            patient: Math.min(100, Math.max(10, ((bp - 50) / (120 - 50)) * 100)),
            baseline: 35,
            actualDisplay: `${bp} mmHg`
          },
          {
            biomarker: 'Serum Insulin',
            patient: Math.min(100, Math.max(10, ((ins - 15) / (300 - 15)) * 100)),
            baseline: 30,
            actualDisplay: `${ins} μU/mL`
          },
          {
            biomarker: 'Genetic Pedigree',
            patient: Math.min(100, Math.max(10, (dpf / 2.0) * 100)),
            baseline: 20,
            actualDisplay: `${dpf}`
          },
          {
            biomarker: 'Age Variance',
            patient: Math.min(100, Math.max(10, ((age - 20) / (70 - 20)) * 100)),
            baseline: 35,
            actualDisplay: `${age} yrs`
          }
        ];
      }

      case 'kidney': {
        const sc = getVal('sc', 1.0);
        const bu = getVal('bu', 30);
        const hemo = getVal('hemo', 14);
        const al = getVal('al', 0);
        const bp = getVal('bp', 75);
        const sg = getVal('sg', 1.020);

        return [
          {
            biomarker: 'Serum Creatinine',
            patient: Math.min(100, Math.max(10, (sc / 6.0) * 100)),
            baseline: 15,
            actualDisplay: `${sc} mg/dL`
          },
          {
            biomarker: 'Blood Urea',
            patient: Math.min(100, Math.max(10, (bu / 150) * 100)),
            baseline: 20,
            actualDisplay: `${bu} mg/dL`
          },
          {
            biomarker: 'Anemia Deficit',
            patient: Math.min(100, Math.max(10, ((16 - hemo) / (16 - 6)) * 100)),
            baseline: 15,
            actualDisplay: `${hemo} g/dL`
          },
          {
            biomarker: 'Albuminuria',
            patient: Math.min(100, Math.max(10, (al / 4) * 100)),
            baseline: 5,
            actualDisplay: `Grade ${al}`
          },
          {
            biomarker: 'Specific Gravity Deficit',
            patient: Math.min(100, Math.max(10, ((1.030 - sg) / (1.030 - 1.005)) * 100)),
            baseline: 30,
            actualDisplay: `${sg}`
          },
          {
            biomarker: 'Vascular BP',
            patient: Math.min(100, Math.max(10, ((bp - 60) / (150 - 60)) * 100)),
            baseline: 30,
            actualDisplay: `${bp} mmHg`
          }
        ];
      }

      case 'liver': {
        const tb = getVal('Total_Bilirubin', 0.8);
        const alt = getVal('Alamine_Aminotransferase', 30);
        const ast = getVal('Aspartate_Aminotransferase', 30);
        const alp = getVal('Alkaline_Phosphotase', 180);
        const alb = getVal('Albumin', 3.5);
        const ratio = getVal('Albumin_and_Globulin_Ratio', 1.0);

        return [
          {
            biomarker: 'Total Bilirubin',
            patient: Math.min(100, Math.max(10, (tb / 6.0) * 100)),
            baseline: 15,
            actualDisplay: `${tb} mg/dL`
          },
          {
            biomarker: 'ALT / SGPT',
            patient: Math.min(100, Math.max(10, (alt / 200) * 100)),
            baseline: 15,
            actualDisplay: `${alt} U/L`
          },
          {
            biomarker: 'AST / SGOT',
            patient: Math.min(100, Math.max(10, (ast / 200) * 100)),
            baseline: 15,
            actualDisplay: `${ast} U/L`
          },
          {
            biomarker: 'Alk. Phosphatase',
            patient: Math.min(100, Math.max(10, (alp / 450) * 100)),
            baseline: 30,
            actualDisplay: `${alp} U/L`
          },
          {
            biomarker: 'Albumin Deficit',
            patient: Math.min(100, Math.max(10, ((4.5 - alb) / (4.5 - 1.5)) * 100)),
            baseline: 15,
            actualDisplay: `${alb} g/dL`
          },
          {
            biomarker: 'A/G Inversion',
            patient: Math.min(100, Math.max(10, ((1.8 - ratio) / (1.8 - 0.4)) * 100)),
            baseline: 20,
            actualDisplay: `${ratio}`
          }
        ];
      }

      default:
        return [];
    }
  };

  const data = getData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload as RadarDataPoint;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-md shadow-md text-xs border border-slate-800">
          <p className="font-semibold text-slate-100">{pData.biomarker}</p>
          <p className="font-mono text-slate-300 mt-0.5">Value: {pData.actualDisplay}</p>
          <div className="mt-1 flex items-center space-x-3 text-[11px]">
            <span className="text-blue-400">Patient: {Math.round(pData.patient)}% dev</span>
            <span className="text-emerald-400">Baseline: {Math.round(pData.baseline)}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col p-4 sm:p-5 bg-slate-850/80 rounded-xl border border-slate-800 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Biomarker Footprint
          </span>
          <h4 className="text-xs font-bold text-slate-200">
            Multidimensional Deviation Radar
          </h4>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          vs Healthy Cohort
        </span>
      </div>

      <div className="w-full h-56 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="biomarker" 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: '#64748b', fontSize: 9 }} 
              stroke="#334155" 
            />
            <Radar
              name="Healthy Baseline"
              dataKey="baseline"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.15}
              strokeWidth={1.5}
            />
            <Radar
              name="Patient Profile"
              dataKey="patient"
              stroke={isPositive ? '#ef4444' : '#3b82f6'}
              fill={isPositive ? '#ef4444' : '#3b82f6'}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Clean clinical legend */}
      <div className="flex items-center justify-center space-x-6 text-xs mt-2 pt-2 border-t border-slate-800">
        <div className="flex items-center space-x-1.5 text-emerald-400 font-medium text-[11px]">
          <span className="w-3 h-1.5 rounded-xs bg-emerald-500 inline-block" />
          <span>Population Normal Baseline</span>
        </div>
        <div className="flex items-center space-x-1.5 font-medium text-[11px]">
          <span className={`w-3 h-1.5 rounded-xs inline-block ${isPositive ? 'bg-red-500' : 'bg-blue-500'}`} />
          <span className={isPositive ? 'text-red-400' : 'text-blue-400'}>Patient Clinical Profile</span>
        </div>
      </div>
    </div>
  );
};
