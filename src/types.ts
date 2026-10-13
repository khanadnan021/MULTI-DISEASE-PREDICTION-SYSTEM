export type DiseaseKey = 'heart' | 'diabetes' | 'kidney' | 'liver';

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

export interface DiseaseConfig {
  id: DiseaseKey;
  title: string;
  subtitle: string;
  route: string;
  icon: string;
  color: string;
  targetMetric: string;
}
