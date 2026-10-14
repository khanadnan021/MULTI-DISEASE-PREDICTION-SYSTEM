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
  Info,
  Brain,
  Sparkles
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

const FIELD_GROUPS: Record<DiseaseKey, { title: string; subtitle: string; icon: any; fields: string[] }[]> = {
  heart: [
    {
      title: 'Vitals & Demographics',
      subtitle: 'Patient age, biological sex, and resting blood pressure',
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
      title: 'Hepatocellular Enzyme Profile',
      subtitle: 'Transaminases indicating hepatic cellular injury',
      icon: Activity,
      fields: ['Alamine_Aminotransferase', 'Aspartate_Aminotransferase'],
    },
    {
      title: 'Synthetic Function & Patient Bio',
      subtitle: 'Serum proteins and albumin ratios',
      icon: Layers,
      fields: ['Age', 'Gender', 'Total_Proteins', 'Albumin', 'Albumin_and_Globulin_Ratio'],
    },
  ],
  stroke: [
    {
      title: 'Cerebrovascular & Neurological Profile',
      subtitle: 'Vascular history and intracranial arterial stress metrics',
      icon: Brain,
      fields: ['age', 'hypertension', 'heart_disease'],
    },
    {
      title: 'Metabolic & Lifestyle Accelerators',
      subtitle: 'Glycemic endothelial damage, adiposity, and tobacco exposure',
      icon: Activity,
      fields: ['avg_glucose_level', 'bmi', 'smoking_status'],
    }
  ],
  other: [], // 'other' tab uses Dr. Aria AI chat — no structured prediction form
};

export const PredictionForm: React.FC<PredictionFormProps> = ({
  disease,
  onPredictionComplete,
  onClearResult,
  samples,
  currentResult,
  modelAccuracy,
  externalFormData,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fields = DISEASE_FIELDS[disease] || [];
  const currentConfig = DISEASE_CONFIGS.find((c) => c.id === disease) || DISEASE_CONFIGS[0];

  const getDefaultValues = () => {
    const defaults: Record<string, any> = {};
    fields.forEach((field) => {
      defaults[field.name] = field.defaultValue;
    });
    return defaults;
  };

  const form = useForm({
    resolver: zodResolver(DISEASE_SCHEMAS[disease]),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form;

  // Sync external prefilled data (from report upload)
  useEffect(() => {
    if (externalFormData) {
      Object.entries(externalFormData).forEach(([key, val]) => {
        setValue(key as any, val, { shouldValidate: true, shouldDirty: true });
      });
    }
  }, [externalFormData, setValue]);

  // Reset form when disease changes
  useEffect(() => {
    reset(getDefaultValues());
    onClearResult();
    setApiError(null);
  }, [disease, reset]);

  const onSubmit = async (data: Record<string, any>) => {
    setSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch(`/api/predict/${disease}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.message || `HTTP ${response.status}: Prediction failed`);
      }

      const result: PredictionResult = await response.json();
      onPredictionComplete(result);
    } catch (err: any) {
      setApiError(err.message || 'Error occurred while contacting clinical ML engine');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplySample = (sample: SampleCase) => {
    Object.entries(sample.parameters).forEach(([k, v]) => {
      setValue(k as any, v, { shouldValidate: true });
    });
    setApiError(null);
  };

  const currentSamples = samples ? samples[disease] || [] : [];
  const groups = FIELD_GROUPS[disease] || [{ title: 'All Biomarkers', subtitle: 'Clinical Inputs', icon: Activity, fields: fields.map(f => f.name) }];

  // Watch form values for live layman colored sliders
  const formValues = watch();

  return (
    <div className="space-y-6">
      {/* Sample Cohort Preloader Pill */}
      {currentSamples.length > 0 && (
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-emerald-950">Quick-Load Verified Test Patients:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentSamples.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySample(sample)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition shadow-xs flex items-center gap-1.5 ${
                  sample.expected_class === 1
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                }`}
              >
                <span>{sample.name}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  ({sample.expected_class === 1 ? 'High Risk' : 'Healthy'})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Clinical Card */}
      <Card className="border-emerald-200 shadow-sm bg-white overflow-hidden rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-emerald-50/70 to-white border-b border-emerald-100 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <CardTitle className="text-xl font-bold text-emerald-950 tracking-tight">
                  {currentConfig.title} Biomarker Assessment
                </CardTitle>
                <Badge className="bg-emerald-600 text-white border-emerald-700 text-xs font-semibold px-2.5 py-0.5">
                  Accuracy: {modelAccuracy ? `${modelAccuracy}%` : 'Calibrated'}
                </Badge>
              </div>
              <CardDescription className="text-xs text-emerald-800/80 mt-1">
                {currentConfig.subtitle} &bull; Visual sliders alert on normal (green), warning (yellow), and dangerous (red) zones.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                reset(getDefaultValues());
                onClearResult();
              }}
              className="border-emerald-200 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Reset All
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {groups.map((group, gIdx) => {
              const GroupIcon = group.icon;
              return (
                <div key={gIdx} className="space-y-4">
                  {/* Group Header */}
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                      <GroupIcon className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                        {group.title}
                      </h4>
                      <p className="text-[11px] text-gray-500">{group.subtitle}</p>
                    </div>
                  </div>

                  {/* Input Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {group.fields.map((fieldName) => {
                      const field = fields.find((f) => f.name === fieldName);
                      if (!field) return null;

                      const val = formValues[fieldName];
                      const isDanger = field.criticalThreshold && val >= field.criticalThreshold;
                      const isWarn = field.warningThreshold && val >= field.warningThreshold && !isDanger;

                      return (
                        <div key={field.name} className="space-y-1.5 bg-gray-50/60 p-3.5 rounded-xl border border-gray-200/70 hover:border-emerald-300 transition">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={field.name} className="text-xs font-bold text-gray-800 truncate">
                              {field.label}
                            </Label>
                            {field.unit && (
                              <span className="text-[10px] font-mono font-medium text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                {field.unit}
                              </span>
                            )}
                          </div>

                          {/* Layman Sub-Label */}
                          {field.laymanLabel && (
                            <p className="text-[11px] text-emerald-800 font-medium">
                              {field.laymanLabel}
                            </p>
                          )}

                          {/* Field Input (Number or Select) */}
                          {field.type === 'select' ? (
                            <select
                              id={field.name}
                              {...register(field.name as any, { valueAsNumber: true })}
                              className="w-full text-xs bg-white border border-gray-300 rounded-lg p-2 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              {field.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              id={field.name}
                              type="number"
                              step={field.step || 'any'}
                              min={field.min}
                              max={field.max}
                              placeholder={field.placeholder}
                              {...register(field.name as any, { valueAsNumber: true })}
                              className={`bg-white text-xs font-medium ${
                                isDanger ? 'border-red-500 ring-1 ring-red-500' : isWarn ? 'border-amber-400' : 'border-gray-300'
                              }`}
                            />
                          )}

                          {/* Colored Status Range Bar (Layman Visual Range) */}
                          {field.type === 'number' && (
                            <div className="pt-1 space-y-1">
                              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex">
                                <div className="h-full bg-emerald-500 w-1/2" title="Normal Range" />
                                <div className="h-full bg-amber-400 w-1/4" title="Borderline Warning" />
                                <div className="h-full bg-red-500 w-1/4" title="Dangerous High Zone" />
                              </div>
                              <div className="flex justify-between text-[10px] text-gray-500">
                                <span>{field.normalRange || 'Normal Range'}</span>
                                {isDanger ? (
                                  <span className="text-red-600 font-bold">Critical High!</span>
                                ) : isWarn ? (
                                  <span className="text-amber-600 font-semibold">Borderline</span>
                                ) : (
                                  <span className="text-emerald-700 font-medium">Normal</span>
                                )}
                              </div>
                            </div>
                          )}

                          {errors[field.name] && (
                            <p className="text-[10px] text-red-600 font-medium flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3 h-3 flex-shrink-0" />
                              {(errors[field.name]?.message as string) || 'Invalid value'}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Error Message */}
            {apiError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                <div className="space-y-1">
                  <span className="font-bold">Prediction Failed:</span>
                  <p>{apiError}</p>
                </div>
              </div>
            )}

            {/* Submit Bar */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Runs Scikit-Learn Model + Gemini Multi-Modal Engine</span>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-sm"
              >
                {submitting ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    Calculating Clinical Risk...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Multi-Disease Diagnosis
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
