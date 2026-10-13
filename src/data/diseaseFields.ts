import { DiseaseKey } from '../types';

export interface FieldDefinition {
  name: string;
  label: string;
  type: 'number' | 'select';
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: number }[];
  placeholder?: string;
  tooltip?: string;
  normalRange?: string;
  defaultValue: number;
}

export const HEART_FIELDS: FieldDefinition[] = [
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    unit: 'years',
    min: 20,
    max: 100,
    step: 1,
    defaultValue: 45,
    placeholder: 'e.g. 52',
    normalRange: 'Adult (18-100)',
    tooltip: 'Age of the patient in years'
  },
  {
    name: 'sex',
    label: 'Gender / Biological Sex',
    type: 'select',
    defaultValue: 1,
    options: [
      { label: 'Male (1)', value: 1 },
      { label: 'Female (0)', value: 0 }
    ],
    tooltip: '1 = Male, 0 = Female'
  },
  {
    name: 'cp',
    label: 'Chest Pain Type (CP)',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: 'Typical Angina (0)', value: 0 },
      { label: 'Atypical Angina (1)', value: 1 },
      { label: 'Non-Anginal Pain (2)', value: 2 },
      { label: 'Asymptomatic (3)', value: 3 }
    ],
    tooltip: 'Type of chest pain experienced'
  },
  {
    name: 'trestbps',
    label: 'Resting Blood Pressure',
    type: 'number',
    unit: 'mm Hg',
    min: 80,
    max: 220,
    step: 1,
    defaultValue: 120,
    normalRange: 'Normal: 90 - 120 mm Hg',
    tooltip: 'Resting blood pressure upon hospital admission'
  },
  {
    name: 'chol',
    label: 'Serum Cholesterol',
    type: 'number',
    unit: 'mg/dL',
    min: 100,
    max: 600,
    step: 1,
    defaultValue: 200,
    normalRange: 'Normal: < 200 mg/dL',
    tooltip: 'Serum cholesterol in mg/dL'
  },
  {
    name: 'fbs',
    label: 'Fasting Blood Sugar > 120 mg/dL',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: 'False (<= 120 mg/dL) [0]', value: 0 },
      { label: 'True (> 120 mg/dL) [1]', value: 1 }
    ],
    tooltip: 'Fasting blood sugar greater than 120 mg/dL'
  },
  {
    name: 'restecg',
    label: 'Resting ECG Results',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: 'Normal (0)', value: 0 },
      { label: 'ST-T Wave Abnormality (1)', value: 1 },
      { label: 'Left Ventricular Hypertrophy (2)', value: 2 }
    ],
    tooltip: 'Resting electrocardiographic results'
  },
  {
    name: 'thalach',
    label: 'Maximum Heart Rate Achieved',
    type: 'number',
    unit: 'bpm',
    min: 60,
    max: 220,
    step: 1,
    defaultValue: 160,
    normalRange: 'Target: 100 - 180 bpm',
    tooltip: 'Maximum heart rate achieved during exercise stress test'
  },
  {
    name: 'exang',
    label: 'Exercise Induced Angina',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: 'No [0]', value: 0 },
      { label: 'Yes [1]', value: 1 }
    ],
    tooltip: 'Angina provoked by physical exertion'
  },
  {
    name: 'oldpeak',
    label: 'ST Depression (Oldpeak)',
    type: 'number',
    unit: 'mm',
    min: 0,
    max: 8,
    step: 0.1,
    defaultValue: 0.2,
    normalRange: 'Normal: 0.0 - 1.0 mm',
    tooltip: 'ST depression induced by exercise relative to resting state'
  },
  {
    name: 'slope',
    label: 'Slope of Peak Exercise ST',
    type: 'select',
    defaultValue: 2,
    options: [
      { label: 'Upsloping (0)', value: 0 },
      { label: 'Flat (1)', value: 1 },
      { label: 'Downsloping (2)', value: 2 }
    ],
    tooltip: 'The slope of the peak exercise ST segment'
  },
  {
    name: 'ca',
    label: 'Major Vessels Colored by Fluoroscopy',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: '0 vessels', value: 0 },
      { label: '1 vessel', value: 1 },
      { label: '2 vessels', value: 2 },
      { label: '3 vessels', value: 3 }
    ],
    tooltip: 'Number of major vessels (0-3) colored by flourosopy'
  },
  {
    name: 'thal',
    label: 'Thalassemia',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: 'Normal (0)', value: 0 },
      { label: 'Fixed Defect (1)', value: 1 },
      { label: 'Reversible Defect (2)', value: 2 }
    ],
    tooltip: 'Blood disorder score'
  }
];

export const DIABETES_FIELDS: FieldDefinition[] = [
  {
    name: 'Pregnancies',
    label: 'Pregnancies',
    type: 'number',
    min: 0,
    max: 20,
    step: 1,
    defaultValue: 1,
    placeholder: 'e.g. 2',
    tooltip: 'Number of times pregnant (0 for males/nulliparous)'
  },
  {
    name: 'Glucose',
    label: 'Plasma Glucose Concentration',
    type: 'number',
    unit: 'mg/dL',
    min: 40,
    max: 300,
    step: 1,
    defaultValue: 100,
    normalRange: 'Normal: 70 - 120 mg/dL',
    tooltip: 'Plasma glucose concentration at 2 hours in an oral glucose tolerance test'
  },
  {
    name: 'BloodPressure',
    label: 'Diastolic Blood Pressure',
    type: 'number',
    unit: 'mm Hg',
    min: 40,
    max: 150,
    step: 1,
    defaultValue: 72,
    normalRange: 'Normal: 60 - 80 mm Hg',
    tooltip: 'Diastolic blood pressure'
  },
  {
    name: 'SkinThickness',
    label: 'Triceps Skin Fold Thickness',
    type: 'number',
    unit: 'mm',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 23,
    normalRange: 'Normal: 15 - 30 mm',
    tooltip: 'Triceps skin fold thickness in mm'
  },
  {
    name: 'Insulin',
    label: '2-Hour Serum Insulin',
    type: 'number',
    unit: 'μU/mL',
    min: 0,
    max: 900,
    step: 1,
    defaultValue: 80,
    normalRange: 'Normal: 15 - 160 μU/mL',
    tooltip: '2-Hour serum insulin'
  },
  {
    name: 'BMI',
    label: 'Body Mass Index (BMI)',
    type: 'number',
    unit: 'kg/m²',
    min: 15.0,
    max: 70.0,
    step: 0.1,
    defaultValue: 24.5,
    normalRange: 'Normal: 18.5 - 24.9',
    tooltip: 'Weight in kg / (height in m)^2'
  },
  {
    name: 'DiabetesPedigreeFunction',
    label: 'Diabetes Pedigree Function',
    type: 'number',
    min: 0.05,
    max: 3.0,
    step: 0.01,
    defaultValue: 0.35,
    normalRange: 'Normal: 0.1 - 0.5',
    tooltip: 'Genetic predisposition score based on family diabetes history'
  },
  {
    name: 'Age',
    label: 'Age',
    type: 'number',
    unit: 'years',
    min: 18,
    max: 100,
    step: 1,
    defaultValue: 30,
    tooltip: 'Patient age in years'
  }
];

export const KIDNEY_FIELDS: FieldDefinition[] = [
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    unit: 'years',
    min: 10,
    max: 100,
    step: 1,
    defaultValue: 45
  },
  {
    name: 'bp',
    label: 'Blood Pressure (BP)',
    type: 'number',
    unit: 'mm Hg',
    min: 50,
    max: 180,
    step: 1,
    defaultValue: 75,
    normalRange: 'Normal: 70 - 85 mm Hg'
  },
  {
    name: 'sg',
    label: 'Specific Gravity (SG)',
    type: 'select',
    defaultValue: 1.020,
    options: [
      { label: '1.005', value: 1.005 },
      { label: '1.010', value: 1.010 },
      { label: '1.015', value: 1.015 },
      { label: '1.020 (Normal)', value: 1.020 },
      { label: '1.025 (Healthy)', value: 1.025 }
    ],
    tooltip: 'Urine specific gravity concentration'
  },
  {
    name: 'al',
    label: 'Albumin in Urine (AL)',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: '0 - Nil (Normal)', value: 0 },
      { label: '1 - Low (+)', value: 1 },
      { label: '2 - Moderate (++)', value: 2 },
      { label: '3 - High (+++)', value: 3 },
      { label: '4 - Very High (++++)', value: 4 }
    ],
    tooltip: 'Albumin protein detected in urine'
  },
  {
    name: 'su',
    label: 'Sugar in Urine (SU)',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: '0 - Nil (Normal)', value: 0 },
      { label: '1 - Slight (+)', value: 1 },
      { label: '2 - Moderate (++)', value: 2 },
      { label: '3 - Marked (+++)', value: 3 }
    ],
    tooltip: 'Glycosuria indicator'
  },
  {
    name: 'bgr',
    label: 'Blood Glucose Random (BGR)',
    type: 'number',
    unit: 'mg/dL',
    min: 60,
    max: 500,
    step: 1,
    defaultValue: 105,
    normalRange: 'Normal: 70 - 140 mg/dL'
  },
  {
    name: 'bu',
    label: 'Blood Urea (BU)',
    type: 'number',
    unit: 'mg/dL',
    min: 10,
    max: 350,
    step: 1,
    defaultValue: 30,
    normalRange: 'Normal: 15 - 45 mg/dL',
    tooltip: 'Nitrogen compound waste indicator'
  },
  {
    name: 'sc',
    label: 'Serum Creatinine (SC)',
    type: 'number',
    unit: 'mg/dL',
    min: 0.3,
    max: 18.0,
    step: 0.1,
    defaultValue: 0.9,
    normalRange: 'Normal: 0.6 - 1.2 mg/dL',
    tooltip: 'Primary biomarker for renal filtration impairment'
  },
  {
    name: 'sod',
    label: 'Sodium (SOD)',
    type: 'number',
    unit: 'mEq/L',
    min: 100,
    max: 170,
    step: 0.5,
    defaultValue: 140,
    normalRange: 'Normal: 135 - 145 mEq/L'
  },
  {
    name: 'pot',
    label: 'Potassium (POT)',
    type: 'number',
    unit: 'mEq/L',
    min: 2.0,
    max: 9.0,
    step: 0.1,
    defaultValue: 4.5,
    normalRange: 'Normal: 3.5 - 5.0 mEq/L'
  },
  {
    name: 'hemo',
    label: 'Hemoglobin (HEMO)',
    type: 'number',
    unit: 'g/dL',
    min: 3.0,
    max: 20.0,
    step: 0.1,
    defaultValue: 14.5,
    normalRange: 'Normal: 12.0 - 16.5 g/dL'
  },
  {
    name: 'pcv',
    label: 'Packed Cell Volume (PCV)',
    type: 'number',
    unit: '%',
    min: 15,
    max: 60,
    step: 1,
    defaultValue: 45,
    normalRange: 'Normal: 38 - 50 %'
  },
  {
    name: 'wc',
    label: 'White Blood Cell Count (WC)',
    type: 'number',
    unit: 'cells/μL',
    min: 2000,
    max: 25000,
    step: 100,
    defaultValue: 7500,
    normalRange: 'Normal: 4500 - 11000'
  },
  {
    name: 'rc',
    label: 'Red Blood Cell Count (RC)',
    type: 'number',
    unit: 'mill/μL',
    min: 1.5,
    max: 7.5,
    step: 0.1,
    defaultValue: 5.0,
    normalRange: 'Normal: 4.2 - 5.9'
  },
  {
    name: 'htn',
    label: 'Hypertension Comorbidity',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: 'No (0)', value: 0 },
      { label: 'Yes (1)', value: 1 }
    ]
  }
];

export const LIVER_FIELDS: FieldDefinition[] = [
  {
    name: 'Age',
    label: 'Age',
    type: 'number',
    unit: 'years',
    min: 15,
    max: 95,
    step: 1,
    defaultValue: 40
  },
  {
    name: 'Gender',
    label: 'Gender',
    type: 'select',
    defaultValue: 1,
    options: [
      { label: 'Male (1)', value: 1 },
      { label: 'Female (0)', value: 0 }
    ]
  },
  {
    name: 'Total_Bilirubin',
    label: 'Total Bilirubin',
    type: 'number',
    unit: 'mg/dL',
    min: 0.2,
    max: 45.0,
    step: 0.1,
    defaultValue: 0.9,
    normalRange: 'Normal: 0.3 - 1.2 mg/dL',
    tooltip: 'Bile pigment breakdown product'
  },
  {
    name: 'Direct_Bilirubin',
    label: 'Direct (Conjugated) Bilirubin',
    type: 'number',
    unit: 'mg/dL',
    min: 0.1,
    max: 25.0,
    step: 0.1,
    defaultValue: 0.2,
    normalRange: 'Normal: 0.1 - 0.3 mg/dL'
  },
  {
    name: 'Alkaline_Phosphotase',
    label: 'Alkaline Phosphatase (ALP)',
    type: 'number',
    unit: 'IU/L',
    min: 50,
    max: 1500,
    step: 1,
    defaultValue: 190,
    normalRange: 'Normal: 44 - 240 IU/L',
    tooltip: 'Enzyme related to bile ducts'
  },
  {
    name: 'Alamine_Aminotransferase',
    label: 'Alamine Aminotransferase (SGPT / ALT)',
    type: 'number',
    unit: 'IU/L',
    min: 5,
    max: 1000,
    step: 1,
    defaultValue: 25,
    normalRange: 'Normal: 7 - 45 IU/L',
    tooltip: 'Key indicator of acute hepatocellular injury'
  },
  {
    name: 'Aspartate_Aminotransferase',
    label: 'Aspartate Aminotransferase (SGOT / AST)',
    type: 'number',
    unit: 'IU/L',
    min: 5,
    max: 1000,
    step: 1,
    defaultValue: 28,
    normalRange: 'Normal: 8 - 40 IU/L'
  },
  {
    name: 'Total_Proteins',
    label: 'Total Proteins',
    type: 'number',
    unit: 'g/dL',
    min: 2.5,
    max: 10.5,
    step: 0.1,
    defaultValue: 7.2,
    normalRange: 'Normal: 6.0 - 8.3 g/dL'
  },
  {
    name: 'Albumin',
    label: 'Albumin',
    type: 'number',
    unit: 'g/dL',
    min: 1.0,
    max: 6.0,
    step: 0.1,
    defaultValue: 4.1,
    normalRange: 'Normal: 3.5 - 5.0 g/dL'
  },
  {
    name: 'Albumin_and_Globulin_Ratio',
    label: 'Albumin and Globulin Ratio (A/G Ratio)',
    type: 'number',
    min: 0.2,
    max: 3.0,
    step: 0.05,
    defaultValue: 1.2,
    normalRange: 'Normal: 1.0 - 2.2'
  }
];

export const DISEASE_CONFIGS = [
  {
    id: 'heart' as const,
    title: 'Heart Disease',
    subtitle: 'Cleveland Clinic 13-Biomarker Cardiovascular Risk Model',
    route: '/predict/heart',
    icon: 'Activity',
    color: 'emerald',
    targetMetric: 'Cardiovascular Risk'
  },
  {
    id: 'diabetes' as const,
    title: 'Diabetes',
    subtitle: 'Pima Indians Metabolic & Glycemic Profile Model',
    route: '/predict/diabetes',
    icon: 'Droplet',
    color: 'blue',
    targetMetric: 'Metabolic & Insulin Resistance'
  },
  {
    id: 'kidney' as const,
    title: 'Chronic Kidney Disease',
    subtitle: 'Renal Function & Biochemical Filtration Model (15 Parameters)',
    route: '/predict/kidney',
    icon: 'ShieldAlert',
    color: 'amber',
    targetMetric: 'Glomerular & Renal Health'
  },
  {
    id: 'liver' as const,
    title: 'Liver (Hepatitis)',
    subtitle: 'ILPD Hepatic Function & Enzyme Profile Model',
    route: '/predict/liver',
    icon: 'Layers',
    color: 'purple',
    targetMetric: 'Hepatic Enzyme & Bilirubin Balance'
  }
];

export const DISEASE_FIELDS: Record<DiseaseKey, FieldDefinition[]> = {
  heart: HEART_FIELDS,
  diabetes: DIABETES_FIELDS,
  kidney: KIDNEY_FIELDS,
  liver: LIVER_FIELDS
};

