export type DiseaseKey = 'heart' | 'diabetes' | 'kidney' | 'liver' | 'stroke' | 'other';

export interface ModelMetric {
  disease: string;
  model_type: string;
  train_samples: number;
  test_samples: number;
  test_size: number;
  train_accuracy: number;
  test_accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  features: string[];
}

export interface DangerousAnomaly {
  parameter: string;
  value: number;
  unit: string;
  threshold: number;
  warning: string;
  future_risk: string;
}

export interface PredictionResult {
  status: string;
  disease: DiseaseKey;
  disease_name: string;
  prediction: number;
  is_positive: boolean;
  result: string;
  risk_level: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  risk_score: number;
  confidence: number;
  probabilities: {
    negative: number;
    positive: number;
  };
  key_factors: string[];
  dangerous_anomalies?: DangerousAnomaly[];
  clinical_summary: string;
  features_evaluated?: Record<string, number>;
  error?: string;
}

export interface SampleCase {
  name: string;
  expected_output: string;
  expected_class: number;
  parameters: Record<string, any>;
}

export interface ExtractedReportData {
  is_valid_medical_report: boolean;
  rejection_reason?: string | null;
  extracted_parameters: Record<string, any>;
  missing_parameters: string[];
  dangerous_parameters: {
    param: string;
    value: number;
    unit: string;
    severity: string;
    concern: string;
  }[];
  parameter_contributions: {
    param: string;
    value: number;
    status: string;
    direction: string;
    explanation: string;
  }[];
  layman_summary: string;
}

export interface ECGAnalysisResult {
  rhythm: string;
  heart_rate_bpm: number;
  st_segment_status: string;
  t_wave_morphology: string;
  qtc_interval_ms: number;
  is_arrhythmia_detected: boolean;
  risk_severity: string;
  urgent_alert: boolean;
  sub_visual_findings: string;
  layman_explanation: string;
  doctor_handover_notes: string[];
}

export interface CTScanAnalysisResult {
  scan_type: string;
  anatomical_region: string;
  severity: string;
  key_findings: string[];
  urgent_flag: boolean;
  layman_summary: string;
  provisional_report: {
    technique: string;
    findings: string;
    impression: string;
  };
}

export interface DrugWarning {
  drug: string;
  affected_organ: string;
  severity: string;
  reason: string;
  layman_tip: string;
}

export interface SymptomCheckResult {
  probable_conditions: {
    disease: string;
    probability: string;
    matching_symptoms: string[];
  }[];
  triage_urgency: string;
  recommended_lab_tests: {
    test_name: string;
    reason: string;
  }[];
  hinglish_guidance: string;
}

export interface ClinicalSynthesisResult {
  critical_alert: string | null;
  layman_hinglish_summary: string;
  reversible_targets: {
    factor: string;
    target: string;
    reversal_timeline: string;
  }[];
  micro_habit_plan: {
    days: string;
    action: string;
  }[];
  doctor_handover_note: {
    red_flags: string[];
    suggested_tests: string[];
    clinical_discussion_points: string;
  };
}
