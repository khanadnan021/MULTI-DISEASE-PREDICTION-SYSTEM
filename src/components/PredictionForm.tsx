import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Activity, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  FlaskConical, 
  HeartPulse, 
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';
import { DiseaseKey, PredictionResult, SampleCase } from '../types';
import { DISEASE_CONFIGS, DISEASE_FIELDS, FieldDefinition } from '../data/diseaseFields';
import { DISEASE_SCHEMAS } from '../lib/schemas';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface PredictionFormProps {
  disease: DiseaseKey;
  onPredictionComplete: (result: PredictionResult) => void;
  onClearResult: () => void;
  samples?: Record<string, SampleCase[]>;
  currentResult?: PredictionResult | null;
  modelAccuracy?: number;
  externalFormData?: Record<string, any> | null;
}

// Group definitions for clinical readability
const FIELD_GROUPS: Record<DiseaseKey, { title: string; subtitle: string; icon: any; fields: string[] }[]> = {
  heart: [
    {
      title: 'Vitals & Demographics',
      subtitle: 'Patient age, biological sex, and hemodynamic measurements',
      icon: HeartPulse,
      fields: ['age', 'sex', 'trestbps', 'thalach'],
    },
    {
      title: 'Lipid & Glycemic Profile',
      subtitle: 'Biochemical blood serum markers',
      icon: FlaskConical,
      fields: ['chol', 'fbs'],
    },
    {
      title: 'Electrocardiography & Exercise Stress',
      subtitle: 'Resting ECG, exertional symptoms, and fluoroscopic markers',
      icon: Activity,
      fields: ['cp', 'restecg', 'exang', 'oldpeak', 'slope', 'ca', 'thal'],
    },
  ],
  diabetes: [
    {
      title: 'Glycemic & Insulin Dynamics',
      subtitle: 'Fasting plasma glucose and insulin response parameters',
      icon: FlaskConical,
      fields: ['Glucose', 'Insulin', 'DiabetesPedigreeFunction'],
    },
    {
      title: 'Anthropometrics & Hemodynamics',
      subtitle: 'Body mass composition and vascular pressure',
      icon: Activity,
      fields: ['BMI', 'BloodPressure', 'SkinThickness'],
    },
    {
      title: 'Demographics & Obstetric History',
      subtitle: 'Patient age and clinical obstetric profile',
      icon: Layers,
      fields: ['Age', 'Pregnancies'],
    },
  ],
  kidney: [
    {
      title: 'Renal Clearance & Glomerular Filtration',
      subtitle: 'Creatinine, blood urea, and urinalysis biomarkers',
      icon: FlaskConical,
      fields: ['sc', 'bu', 'sg', 'al', 'su'],
    },
    {
      title: 'Hematology & Serum Electrolytes',
      subtitle: 'Anemia markers and ionic electrolyte homeostasis',
      icon: Activity,
      fields: ['hemo', 'pcv', 'sod', 'pot', 'wc', 'rc'],
    },
    {
      title: 'Systemic & Metabolic Markers',
      subtitle: 'Vascular hypertension, glucose, and patient demographics',
      icon: HeartPulse,
      fields: ['age', 'bp', 'bgr', 'htn'],
    },
  ],
  liver: [
    {
      title: 'Biliary Excretion & Cholestasis',
      subtitle: 'Bilirubin fractions and alkaline phosphatase',
      icon: FlaskConical,
      fields: ['Total_Bilirubin', 'Direct_Bilirubin', 'Alkaline_Phosphotase'],
    },
    {
      title: 'Hepatic Transaminase Necrosis',
      subtitle: 'Intracellular hepatocellular enzymes ALT/SGPT and AST/SGOT',
      icon: Activity,
      fields: ['Alamine_Aminotransferase', 'Aspartate_Aminotransferase'],
    },
    {
      title: 'Hepatic Protein Synthesis & Demographics',
      subtitle: 'Serum proteins, albumin ratio, and patient profile',
      icon: Layers,
      fields: ['Total_Proteins', 'Albumin', 'Albumin_and_Globulin_Ratio', 'Age', 'Gender'],
    },
  ],
};

export const PredictionForm: React.FC<PredictionFormProps> = ({
  disease,
  onPredictionComplete,
  onClearResult,
  samples,
  currentResult,
  modelAccuracy = 86.8,
  externalFormData,
}) => {
  const currentConfig = DISEASE_CONFIGS.find((c) => c.id === disease)!;
  const allFields = DISEASE_FIELDS[disease];
  const fieldGroups = FIELD_GROUPS[disease];

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Derive initial values from field definitions
  const getInitialDefaults = () => {
    const initial: Record<string, any> = {};
    allFields.forEach((f) => {
      initial[f.name] = f.defaultValue;
    });
    return initial;
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DISEASE_SCHEMAS[disease]),
    defaultValues: getInitialDefaults(),
    mode: 'onTouched',
  });

  // Reinitialize form when disease changes
  useEffect(() => {
    reset(getInitialDefaults());
    setServerError(null);
  }, [disease]);

  // Handle external data injection from 25% test data modal
  useEffect(() => {
    if (externalFormData && Object.keys(externalFormData).length > 0) {
      reset(externalFormData);
      setServerError(null);
    }
  }, [externalFormData]);

  const onSubmit = async (data: Record<string, any>) => {
    setLoading(true);
    setServerError(null);

    try {
      const response = await fetch(`/api/predict/${disease}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `Server responded with status ${response.status}`);
      }

      const result: PredictionResult = await response.json();
      onPredictionComplete(result);

      // Smooth scroll to results
      const anchor = document.getElementById('prediction-result-anchor');
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err: any) {
      console.error('Prediction API error:', err);
      setServerError(err.message || 'Error executing ML pipeline inference.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset(getInitialDefaults());
    setServerError(null);
    onClearResult();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <h3 className="text-lg sm:text-xl text-[#172033] font-bold tracking-tight">
              Patient Clinical Parameter Input
            </h3>
            <span className="font-mono text-xs sm:text-sm font-bold text-[#166534] bg-[#DCFCE7] border border-emerald-200 px-3 py-0.5 rounded-md">
              {allFields.length} Features
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B] font-medium">
            Calibrated inputs for the {currentConfig.title} Random Forest classifier. All fields undergo strict physiological boundary checks.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-9 px-3.5 text-xs sm:text-sm font-semibold text-[#172033] hover:text-[#166534] rounded-lg border-[#E2E8F0] bg-white hover:bg-[#F7FAF9] hover:border-emerald-300 shadow-2xs"
          >
            <RotateCcw className="w-4 h-4 mr-1.5 text-[#64748B]" />
            Reset Baseline
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Server error notification */}
        {serverError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-2.5 shadow-2xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-900">Inference Error: </span>
              <span>{serverError}</span>
            </div>
          </div>
        )}

        {/* Form categorized into physiological panels inside distinct cards */}
        {fieldGroups.map((group, gIdx) => {
          const GroupIcon = group.icon;
          const groupFieldDefs = allFields.filter((f) => group.fields.includes(f.name));

          if (groupFieldDefs.length === 0) return null;

          return (
            <div 
              key={gIdx} 
              className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs p-5 sm:p-6 transition-all hover:border-emerald-300/80"
            >
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#DCFCE7]/70 text-[#166534] flex items-center justify-center border border-emerald-200/80 shadow-2xs">
                    <GroupIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-[#172033] tracking-tight">
                      {group.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#64748B] font-medium">{group.subtitle}</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#64748B] bg-[#F7FAF9] border border-[#E2E8F0] px-2.5 py-1 rounded-md font-mono shadow-2xs">
                  {groupFieldDefs.length} parameters
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {groupFieldDefs.map((field) => {
                  const error = errors[field.name];

                  return (
                    <div key={field.name} className="space-y-1.5">
                      <Label
                        htmlFor={field.name}
                        unit={field.unit}
                        normalRange={field.normalRange}
                      >
                        {field.label}
                      </Label>

                      {field.type === 'select' ? (
                        <div className="relative">
                          <select
                            id={field.name}
                            {...register(field.name, { valueAsNumber: true })}
                            className={`flex h-11 sm:h-12 w-full appearance-none rounded-lg border bg-white px-4 py-2 text-base font-semibold text-[#172033] shadow-2xs transition-all duration-200 hover:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
                              error
                                ? 'border-rose-500 focus:ring-rose-500/20 bg-rose-50/50 text-rose-900'
                                : 'border-[#E2E8F0]'
                            }`}
                          >
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-white text-[#172033] font-medium">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <Input
                          id={field.name}
                          type="number"
                          step={field.step || (field.name === 'BMI' || field.name === 'oldpeak' || field.name === 'DiabetesPedigreeFunction' || field.name.includes('Bilirubin') || field.name.includes('Ratio') || field.name === 'sc' ? '0.01' : '1')}
                          placeholder={field.placeholder || `e.g. ${field.defaultValue}`}
                          error={!!error}
                          {...register(field.name, { valueAsNumber: true })}
                        />
                      )}

                      {error && (
                        <p className="text-xs text-rose-600 flex items-center gap-1 font-mono pt-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{error.message as string}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Action Controls Footer */}
        <div className="p-5 sm:p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-[#64748B]">
            <Info className="w-4 h-4 text-[#0F766E] shrink-0" />
            <span className="font-medium">
              Inference is calculated in real-time by the Python ensemble pipeline with probability calibration.
            </span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="w-1/2 sm:w-auto text-xs rounded-lg border-[#E2E8F0] bg-white text-[#172033] hover:text-[#166534] hover:bg-[#F7FAF9] hover:border-emerald-300"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-[#64748B]" />
              Clear
            </Button>

            <Button
              type="submit"
              variant="clinical"
              disabled={loading}
              className="w-1/2 sm:w-auto text-xs font-semibold px-6 py-2.5 rounded-lg shadow-xs bg-[#166534] hover:bg-[#14532D] text-white border-0"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  <span>Evaluating Pipeline...</span>
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5 mr-2" />
                  <span>Execute Risk Assessment</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
