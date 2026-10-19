import React from 'react';
import { DiseaseKey } from '../types';
import { Heart, Activity, AlertTriangle, ShieldCheck, Stethoscope, Droplet } from 'lucide-react';

interface AnatomicalOrganViewProps {
  disease: DiseaseKey;
  isPositive: boolean;
  features?: Record<string, number>;
}

export const AnatomicalOrganView: React.FC<AnatomicalOrganViewProps> = ({
  disease,
  isPositive,
  features = {}
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

  const getOrganDetails = () => {
    switch (disease) {
      case 'heart': {
        const oldpeak = getVal('oldpeak', 0);
        const cp = getVal('cp', 0);
        const ca = getVal('ca', 0);
        return {
          organName: 'Cardiovascular System (Myocardium & Coronary Arteries)',
          statusText: isPositive ? 'Coronary Ischemia & Ventricular Strain' : 'Healthy Cardiac Perfusion',
          organTheme: 'rose',
          hotspots: [
            {
              name: 'Left Anterior Descending (LAD) Artery',
              status: ca > 0 || isPositive ? 'Fluoroscopy Stenosis / High Plaque Burden' : 'Clear Arterial Lumen',
              risk: ca > 0 || isPositive
            },
            {
              name: 'Left Ventricular Wall (Subendocardium)',
              status: oldpeak >= 1.5 ? 'Severe Ischemic ST Depression (>1.5mm)' : 'Normal Myocardial Repolarization',
              risk: oldpeak >= 1.0
            },
            {
              name: 'Cardiac Conduction & Sinoatrial Node',
              status: isPositive ? 'Exertional Angina / Chronotropic Strain' : 'Normal Hemodynamic Capacity',
              risk: isPositive
            }
          ],
          renderSvg: () => (
            <svg viewBox="0 0 160 160" className="w-28 h-28 shrink-0 drop-shadow-sm">
              <defs>
                <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isPositive ? '#f43f5e' : '#38bdf8'} />
                  <stop offset="100%" stopColor={isPositive ? '#be123c' : '#0284c7'} />
                </linearGradient>
              </defs>
              {/* Outer Heart Contour */}
              <path
                d="M80 140 C 40 100, 10 70, 25 38 C 36 15, 65 15, 80 42 C 95 15, 124 15, 135 38 C 150 70, 120 100, 80 140 Z"
                fill="url(#heartGrad)"
                stroke={isPositive ? '#881337' : '#0369a1'}
                strokeWidth="3"
              />
              {/* Aorta Arch */}
              <path
                d="M66 32 C 66 12, 94 12, 94 32"
                fill="none"
                stroke={isPositive ? '#fda4af' : '#bae6fd'}
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Left Anterior Descending Artery branch */}
              <path
                d="M80 45 Q 85 85, 75 110"
                fill="none"
                stroke={isPositive ? '#ffe4e6' : '#e0f2fe'}
                strokeWidth="2.5"
                strokeDasharray={isPositive ? "4 2" : "none"}
              />
              {/* Pulsing Hotspot Node */}
              <circle
                cx="77"
                cy="85"
                r="5"
                fill={isPositive ? '#dc2626' : '#10b981'}
                stroke="#ffffff"
                strokeWidth="2"
                className={isPositive ? "animate-ping" : ""}
              />
              <circle
                cx="77"
                cy="85"
                r="4"
                fill={isPositive ? '#ef4444' : '#10b981'}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </svg>
          )
        };
      }

      case 'diabetes': {
        const glucose = getVal('Glucose', 100);
        const bmi = getVal('BMI', 25);
        return {
          organName: 'Endocrine Pancreas & Peripheral Insulin Receptors',
          statusText: isPositive ? 'Beta-Cell Strain & Insulin Resistance' : 'Normal Glycemic Homeostasis',
          organTheme: 'amber',
          hotspots: [
            {
              name: 'Islets of Langerhans (Pancreatic Beta-Cells)',
              status: glucose >= 140 ? 'Impaired Insulin Biosynthesis & Secretion' : 'Normosecretory Beta-Cells',
              risk: glucose >= 120
            },
            {
              name: 'Skeletal Muscle & Adipose GLUT-4 Receptors',
              status: bmi >= 30 ? 'Severe Peripheral Adiposity Resistance' : 'High Insulin Sensitivity',
              risk: bmi >= 27
            },
            {
              name: 'Hepatic Glucose Production (Gluconeogenesis)',
              status: glucose >= 120 ? 'Excessive Basal Hepatic Output' : 'Regulated Glycogenolysis',
              risk: glucose >= 115
            }
          ],
          renderSvg: () => (
            <svg viewBox="0 0 160 160" className="w-28 h-28 shrink-0 drop-shadow-sm">
              <defs>
                <linearGradient id="pancreasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isPositive ? '#f59e0b' : '#34d399'} />
                  <stop offset="100%" stopColor={isPositive ? '#b45309' : '#059669'} />
                </linearGradient>
              </defs>
              {/* Pancreas Organ Shape */}
              <path
                d="M25 85 C 20 60, 45 45, 75 52 C 105 60, 135 65, 145 78 C 150 88, 140 98, 120 95 C 85 90, 50 105, 30 100 C 22 98, 20 92, 25 85 Z"
                fill="url(#pancreasGrad)"
                stroke={isPositive ? '#78350f' : '#065f46'}
                strokeWidth="3"
              />
              {/* Pancreatic Duct (Wirsung) */}
              <path
                d="M35 84 Q 80 75, 135 80"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              {/* Islets nodes */}
              <circle cx="65" cy="74" r="4.5" fill={isPositive ? '#ef4444' : '#10b981'} stroke="#fff" strokeWidth="1.5" />
              <circle cx="95" cy="78" r="4.5" fill={isPositive ? '#ef4444' : '#10b981'} stroke="#fff" strokeWidth="1.5" />
            </svg>
          )
        };
      }

      case 'kidney': {
        const sc = getVal('sc', 1.0);
        const al = getVal('al', 0);
        return {
          organName: 'Renal Nephron Architecture & Glomerular Filtration',
          statusText: isPositive ? 'Glomerulosclerosis & Reduced GFR' : 'Preserved Renal Filtration',
          organTheme: 'teal',
          hotspots: [
            {
              name: 'Glomerular Capillary Tuft & Podocyte Barrier',
              status: al > 0 ? `Proteinuria Detected (Albumin Grade ${al}+)` : 'Intact Podocyte Slit Diaphragms',
              risk: al > 0
            },
            {
              name: 'Proximal & Distal Convoluted Tubules',
              status: sc >= 1.4 ? `Serum Creatinine Retained (${sc} mg/dL)` : 'Optimal Clearance Rate',
              risk: sc >= 1.3
            },
            {
              name: 'Renal Microvasculature & Afferent Arteriole',
              status: isPositive ? 'Elevated Intraglomerular Hydrostatic Pressure' : 'Normal Renal Blood Flow',
              risk: isPositive
            }
          ],
          renderSvg: () => (
            <svg viewBox="0 0 160 160" className="w-28 h-28 shrink-0 drop-shadow-sm">
              <defs>
                <linearGradient id="kidneyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isPositive ? '#0d9488' : '#38bdf8'} />
                  <stop offset="100%" stopColor={isPositive ? '#115e59' : '#0284c7'} />
                </linearGradient>
              </defs>
              {/* Kidney Bean Contour */}
              <path
                d="M45 40 C 70 15, 125 35, 130 80 C 135 125, 80 145, 50 125 C 30 110, 55 85, 45 70 C 38 58, 30 50, 45 40 Z"
                fill="url(#kidneyGrad)"
                stroke={isPositive ? '#042f2e' : '#0369a1'}
                strokeWidth="3"
              />
              {/* Renal Pelvis & Ureter */}
              <path
                d="M48 75 C 30 80, 25 110, 20 140"
                fill="none"
                stroke={isPositive ? '#f43f5e' : '#bae6fd'}
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Glomerular nodes */}
              <circle cx="95" cy="65" r="4.5" fill={isPositive ? '#ef4444' : '#10b981'} stroke="#fff" strokeWidth="1.5" />
              <circle cx="100" cy="95" r="4.5" fill={isPositive ? '#ef4444' : '#10b981'} stroke="#fff" strokeWidth="1.5" />
            </svg>
          )
        };
      }

      case 'liver': {
        const tb = getVal('Total_Bilirubin', 0.8);
        const sgpt = getVal('Alamine_Aminotransferase', 30);
        return {
          organName: 'Hepatic Lobules, Sinusoids & Biliary Canaliculi',
          statusText: isPositive ? 'Hepatocyte Necroinflammation / Cholestasis' : 'Normal Hepatic Synthesis',
          organTheme: 'indigo',
          hotspots: [
            {
              name: 'Hepatocyte Cell Membranes',
              status: sgpt >= 45 ? `Cytosolic Leakage (ALT ${sgpt} U/L)` : 'Intact Hepatocellular Integrity',
              risk: sgpt >= 40
            },
            {
              name: 'Biliary Excretory Tree (Canaliculi)',
              status: tb >= 1.5 ? `Hyperbilirubinemia Retention (${tb} mg/dL)` : 'Normal Bile Drainage',
              risk: tb >= 1.3
            },
            {
              name: 'Sinusoidal Kupffer Cells & Endothelium',
              status: isPositive ? 'Inflammatory Fibrogenic Activation' : 'Normal Hepatic Architecture',
              risk: isPositive
            }
          ],
          renderSvg: () => (
            <svg viewBox="0 0 160 160" className="w-28 h-28 shrink-0 drop-shadow-sm">
              <defs>
                <linearGradient id="liverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isPositive ? '#6366f1' : '#38bdf8'} />
                  <stop offset="100%" stopColor={isPositive ? '#4338ca' : '#0284c7'} />
                </linearGradient>
              </defs>
              {/* Wedge Shaped Liver Contour */}
              <path
                d="M20 65 C 40 30, 110 30, 140 45 C 145 75, 120 125, 80 125 C 40 125, 15 95, 20 65 Z"
                fill="url(#liverGrad)"
                stroke={isPositive ? '#312e81' : '#0369a1'}
                strokeWidth="3"
              />
              {/* Gallbladder */}
              <path
                d="M75 118 C 70 135, 90 135, 85 118 Z"
                fill="#22c55e"
                stroke="#15803d"
                strokeWidth="2"
              />
              {/* Hepatic Vein & Sinusoid Branches */}
              <path
                d="M75 42 L 75 75 M 50 60 L 75 75 L 105 65"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="75" cy="75" r="4.5" fill={isPositive ? '#ef4444' : '#10b981'} stroke="#fff" strokeWidth="1.5" />
            </svg>
          )
        };
      }

      case 'stroke': {
        const bp = getVal('hypertension', 0);
        const glucose = getVal('avg_glucose_level', 100);
        const smoke = getVal('smoking_status', 0);
        return {
          organName: 'Cerebrovascular Circulation & Circle of Willis (Brain)',
          statusText: isPositive ? 'Cerebral Microvascular Ischemia / Thromboembolic Risk' : 'Intact Intracranial Perfusion',
          organTheme: 'emerald',
          hotspots: [
            {
              name: 'Middle Cerebral Artery (MCA)',
              status: bp === 1 ? 'High Arterial Shear Stress (Hypertensive)' : 'Normal Hemodynamic Flow',
              risk: bp === 1
            },
            {
              name: 'Endothelial Blood-Brain Barrier',
              status: glucose >= 140 ? `Glycemic Endothelial Injury (${glucose} mg/dL)` : 'Intact Endothelial Tight Junctions',
              risk: glucose >= 140
            },
            {
              name: 'Internal Carotid Bifurcation',
              status: smoke > 0 || isPositive ? 'Atherosclerotic Plaque / Embolic Threat' : 'Clear Carotid Lumen',
              risk: smoke > 0 || isPositive
            }
          ],
          renderSvg: () => (
            <svg viewBox="0 0 160 160" className="w-28 h-28 shrink-0 drop-shadow-sm">
              <defs>
                <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isPositive ? '#ef4444' : '#10b981'} />
                  <stop offset="100%" stopColor={isPositive ? '#991b1b' : '#047857'} />
                </linearGradient>
              </defs>
              <path
                d="M40 80 C 25 50, 45 25, 80 25 C 115 25, 135 50, 120 80 C 135 110, 105 135, 80 135 C 55 135, 25 110, 40 80 Z"
                fill="url(#brainGrad)"
                stroke={isPositive ? '#7f1d1d' : '#065f46'}
                strokeWidth="3"
              />
              <path d="M80 30 Q 75 80 80 130" stroke="#ffffff" strokeWidth="2" strokeDasharray="3,3" />
              <circle cx="65" cy="70" r="4.5" fill={isPositive ? '#ef4444' : '#10b981'} stroke="#fff" strokeWidth="1.5" />
              <circle cx="95" cy="70" r="4.5" fill={isPositive ? '#ef4444' : '#10b981'} stroke="#fff" strokeWidth="1.5" />
            </svg>
          )
        };
      }
      default: {
        return {
          organName: 'Systemic Organ System',
          statusText: isPositive ? 'Pathology Present' : 'Normal Physiology',
          organTheme: 'emerald',
          hotspots: [],
          renderSvg: () => <div />
        };
      }
    }
  };

  const details = getOrganDetails();

  return (
    <div className="bg-slate-850/80 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Target Anatomy & Pathophysiology
          </span>
          <h4 className="text-base font-bold text-white mt-0.5">{details.organName}</h4>
        </div>
        <div
          className={`self-start sm:self-auto inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border ${
            isPositive 
              ? 'bg-rose-950/60 text-rose-300 border-rose-800/80 shadow-2xs' 
              : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 shadow-2xs'
          }`}
        >
          {isPositive ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{details.statusText}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-5 pt-1">
        {/* Anatomical Schematic Illustration */}
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center shrink-0 w-full sm:w-auto">
          {details.renderSvg()}
          <span className="text-[10px] text-slate-400 font-mono mt-2 uppercase tracking-wider">
            Interactive Bio-Schematic
          </span>
        </div>

        {/* Clinical Anatomical Hotspots */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {details.hotspots.map((hotspot, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${
                hotspot.risk
                  ? 'bg-rose-950/40 border-rose-800/80 text-rose-200 shadow-2xs'
                  : 'bg-slate-900 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    hotspot.risk
                      ? 'bg-rose-500 ring-2 ring-rose-900 animate-pulse'
                      : 'bg-emerald-500'
                  }`}
                />
                <span className="text-xs font-bold tracking-tight">{hotspot.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                {hotspot.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

