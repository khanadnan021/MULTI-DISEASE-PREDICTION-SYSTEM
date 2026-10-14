import { DiseaseKey } from '../types';

export interface FieldDefinition {
  name: string;
  label: string;
  laymanLabel?: string;
  type: 'number' | 'select';
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: number }[];
  placeholder?: string;
  tooltip?: string;
  normalRange?: string;
  warningThreshold?: number;
  criticalThreshold?: number;
  defaultValue: number;
}

export const HEART_FIELDS: FieldDefinition[] = [
  {
    name: 'age',
    label: 'Age',
    laymanLabel: 'Umra (Age in Years)',
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
    laymanLabel: 'Ling (Male / Female)',
    type: 'select',
    defaultValue: 1,
    options: [
      { label: 'Male (Purush - 1)', value: 1 },
      { label: 'Female (Mahila - 0)', value: 0 }
    ],
    tooltip: '1 = Male, 0 = Female'
  },
  {
    name: 'cp',
    label: 'Chest Pain Type (CP)',
    laymanLabel: 'Seene Me Dard Ka Type',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: 'Typical Angina (Dabaav jaisa dard) [0]', value: 0 },
      { label: 'Atypical Angina (Chubhan jaisa) [1]', value: 1 },
      { label: 'Non-Anginal Pain (Gas ya acidity) [2]', value: 2 },
      { label: 'Asymptomatic (Koi dard nahi) [3]', value: 3 }
    ],
    tooltip: 'Type of chest pain experienced'
  },
  {
    name: 'trestbps',
    label: 'Resting Blood Pressure',
    laymanLabel: 'Resting BP (Aaram ke waqt BP)',
    type: 'number',
    unit: 'mm Hg',
    min: 80,
    max: 220,
    step: 1,
    defaultValue: 120,
    normalRange: 'Normal: 90 - 120 mm Hg',
    warningThreshold: 140,
    criticalThreshold: 160,
    tooltip: 'Resting blood pressure upon admission'
  },
  {
    name: 'chol',
    label: 'Serum Cholesterol',
    laymanLabel: 'Khoon me Cholesterol (Fat)',
    type: 'number',
    unit: 'mg/dL',
    min: 100,
    max: 600,
    step: 1,
    defaultValue: 200,
    normalRange: 'Normal: < 200 mg/dL',
    warningThreshold: 240,
    criticalThreshold: 280,
    tooltip: 'Serum cholesterol in mg/dL'
  },
  {
    name: 'fbs',
    label: 'Fasting Blood Sugar > 120 mg/dL',
    laymanLabel: 'Khali Pet Sugar > 120 mg/dL',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: 'No / Normal (<= 120 mg/dL) [0]', value: 0 },
      { label: 'Yes / Elevated (> 120 mg/dL) [1]', value: 1 }
    ],
    tooltip: 'Fasting blood sugar greater than 120 mg/dL'
  },
  {
    name: 'restecg',
    label: 'Resting ECG Results',
    laymanLabel: 'ECG Ki Report Ka Status',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: 'Normal (Bilkul normal) [0]', value: 0 },
      { label: 'ST-T Wave Abnormality (Tarang me badlav) [1]', value: 1 },
      { label: 'Left Ventricular Hypertrophy (Dil ki deewar moti) [2]', value: 2 }
    ],
    tooltip: 'Resting electrocardiographic results'
  },
  {
    name: 'thalach',
    label: 'Maximum Heart Rate Achieved',
    laymanLabel: 'Dhadkan Ki Max Speed (BPM)',
    type: 'number',
    unit: 'bpm',
    min: 60,
    max: 220,
    step: 1,
    defaultValue: 150,
    normalRange: 'Normal: 120 - 180 bpm',
    tooltip: 'Maximum heart rate achieved during exercise stress test'
  },
  {
    name: 'exang',
    label: 'Exercise-Induced Angina',
    laymanLabel: 'Chalne / Daudne Par Seene Me Dard',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: 'No (Nahi hota) [0]', value: 0 },
      { label: 'Yes (Hota hai) [1]', value: 1 }
    ],
    tooltip: 'Exercise induced chest pain'
  },
  {
    name: 'oldpeak',
    label: 'ST Depression Induced by Exercise',
    laymanLabel: 'ECG ST Depression (Ischemia Index)',
    type: 'number',
    unit: 'mm',
    min: 0.0,
    max: 7.0,
    step: 0.1,
    defaultValue: 1.0,
    normalRange: 'Normal: 0.0 - 1.0 mm',
    warningThreshold: 1.5,
    criticalThreshold: 2.0,
    tooltip: 'ST depression induced by exercise relative to rest'
  },
  {
    name: 'slope',
    label: 'Slope of Peak Exercise ST Segment',
    laymanLabel: 'ST Dhalan (Slope)',
    type: 'select',
    defaultValue: 1,
    options: [
      { label: 'Upsloping (Upar jaati) [0]', value: 0 },
      { label: 'Flat (Seedhi) [1]', value: 1 },
      { label: 'Downsloping (Neeche aati - High Risk) [2]', value: 2 }
    ],
    tooltip: 'Slope of the peak exercise ST segment'
  },
  {
    name: 'ca',
    label: 'Number of Major Cardiac Vessels (0-3)',
    laymanLabel: 'Kitni Naliyon Me Blockage Dikh Rahi Hai',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: '0 Vessels (Koi blockage nahi)', value: 0 },
      { label: '1 Vessel (Ek nali me)', value: 1 },
      { label: '2 Vessels (Do naliyon me)', value: 2 },
      { label: '3 Vessels (Teeno naliyon me - Critical)', value: 3 }
    ],
    tooltip: 'Number of major vessels (0-3) colored by flourosopy'
  },
  {
    name: 'thal',
    label: 'Thalassemia Stress Scan Result',
    laymanLabel: 'Thalassemia Blood Flow Status',
    type: 'select',
    defaultValue: 2,
    options: [
      { label: 'Normal Blood Flow [0]', value: 0 },
      { label: 'Fixed Defect (Permanently Kam) [1]', value: 1 },
      { label: 'Reversible Defect (Temporary Kam) [2]', value: 2 }
    ],
    tooltip: 'Thalassemia heart blood flow scan'
  }
];

export const DIABETES_FIELDS: FieldDefinition[] = [
  {
    name: 'Pregnancies',
    label: 'Pregnancies',
    laymanLabel: 'Garbhadharan Ki Sankhya',
    type: 'number',
    min: 0,
    max: 20,
    step: 1,
    defaultValue: 1,
    tooltip: 'Number of times pregnant'
  },
  {
    name: 'Glucose',
    label: 'Glucose (2-hr Oral Glucose Tolerance)',
    laymanLabel: 'Fasting / Post-Meal Sugar Level',
    type: 'number',
    unit: 'mg/dL',
    min: 50,
    max: 300,
    step: 1,
    defaultValue: 110,
    normalRange: 'Normal: 70 - 100 mg/dL (Fasting)',
    warningThreshold: 140,
    criticalThreshold: 180,
    tooltip: 'Plasma glucose concentration at 2 hours in an oral glucose tolerance test'
  },
  {
    name: 'BloodPressure',
    label: 'Diastolic Blood Pressure',
    laymanLabel: 'Neeche Wala BP (Diastolic)',
    type: 'number',
    unit: 'mm Hg',
    min: 40,
    max: 140,
    step: 1,
    defaultValue: 72,
    normalRange: 'Normal: 60 - 80 mm Hg',
    warningThreshold: 90,
    criticalThreshold: 100
  },
  {
    name: 'SkinThickness',
    label: 'Triceps Skin Fold Thickness',
    laymanLabel: 'Skin Fat Thickness (Triceps)',
    type: 'number',
    unit: 'mm',
    min: 5,
    max: 100,
    step: 1,
    defaultValue: 23,
    normalRange: 'Normal: 10 - 30 mm'
  },
  {
    name: 'Insulin',
    label: '2-Hour Serum Insulin',
    laymanLabel: 'Khoon Me Insulin Level',
    type: 'number',
    unit: 'mu U/ml',
    min: 10,
    max: 850,
    step: 1,
    defaultValue: 80,
    normalRange: 'Normal: 16 - 166 mu U/ml'
  },
  {
    name: 'BMI',
    label: 'Body Mass Index (BMI)',
    laymanLabel: 'Body Mass Index (Vajan vs Height)',
    type: 'number',
    unit: 'kg/m²',
    min: 15.0,
    max: 60.0,
    step: 0.1,
    defaultValue: 25.5,
    normalRange: 'Normal: 18.5 - 24.9 kg/m²',
    warningThreshold: 30.0,
    criticalThreshold: 38.0
  },
  {
    name: 'DiabetesPedigreeFunction',
    label: 'Diabetes Pedigree Function',
    laymanLabel: 'Parivar Me Sugar Ka Itihas (Genetics)',
    type: 'number',
    min: 0.05,
    max: 2.5,
    step: 0.01,
    defaultValue: 0.35,
    normalRange: 'Normal: 0.1 - 0.5'
  },
  {
    name: 'Age',
    label: 'Age',
    laymanLabel: 'Umra (Age in Years)',
    type: 'number',
    unit: 'years',
    min: 18,
    max: 100,
    step: 1,
    defaultValue: 33
  }
];

export const KIDNEY_FIELDS: FieldDefinition[] = [
  { name: 'age', label: 'Age', laymanLabel: 'Umra', type: 'number', min: 10, max: 100, step: 1, defaultValue: 48 },
  { name: 'bp', label: 'Blood Pressure', laymanLabel: 'Blood Pressure (BP)', type: 'number', unit: 'mm Hg', min: 50, max: 180, step: 5, defaultValue: 80, normalRange: 'Normal: 70 - 80 mm Hg' },
  { name: 'sg', label: 'Specific Gravity (Urine)', laymanLabel: 'Peshab Ka Gaadhapan', type: 'number', min: 1.005, max: 1.030, step: 0.005, defaultValue: 1.020, normalRange: 'Normal: 1.015 - 1.025' },
  { name: 'al', label: 'Albumin (Urine Protein Grade 0-5)', laymanLabel: 'Peshab Me Protein (Albumin)', type: 'number', min: 0, max: 5, step: 1, defaultValue: 0, normalRange: 'Normal: 0 (Negative)', warningThreshold: 1, criticalThreshold: 3 },
  { name: 'su', label: 'Sugar in Urine (0-5)', laymanLabel: 'Peshab Me Sugar', type: 'number', min: 0, max: 5, step: 1, defaultValue: 0, normalRange: 'Normal: 0' },
  { name: 'bgr', label: 'Blood Glucose Random', laymanLabel: 'Random Khoon Ki Sugar', type: 'number', unit: 'mg/dL', min: 60, max: 500, step: 1, defaultValue: 110, normalRange: 'Normal: 70 - 140 mg/dL' },
  { name: 'bu', label: 'Blood Urea Nitrogen', laymanLabel: 'Blood Urea (Kachra)', type: 'number', unit: 'mg/dL', min: 10, max: 300, step: 1, defaultValue: 32, normalRange: 'Normal: 15 - 40 mg/dL' },
  { name: 'sc', label: 'Serum Creatinine', laymanLabel: 'Serum Creatinine (Kidney Filtration)', type: 'number', unit: 'mg/dL', min: 0.4, max: 15.0, step: 0.1, defaultValue: 1.0, normalRange: 'Normal: 0.6 - 1.2 mg/dL', warningThreshold: 1.5, criticalThreshold: 2.0 },
  { name: 'sod', label: 'Sodium Electrolyte', laymanLabel: 'Sodium Level', type: 'number', unit: 'mEq/L', min: 100, max: 170, step: 1, defaultValue: 138, normalRange: 'Normal: 135 - 145 mEq/L' },
  { name: 'pot', label: 'Potassium Electrolyte', laymanLabel: 'Potassium Level', type: 'number', unit: 'mEq/L', min: 2.5, max: 8.0, step: 0.1, defaultValue: 4.2, normalRange: 'Normal: 3.5 - 5.0 mEq/L', warningThreshold: 5.2, criticalThreshold: 5.8 },
  { name: 'hemo', label: 'Hemoglobin', laymanLabel: 'Hemoglobin (Khoon Ki Matra)', type: 'number', unit: 'g/dL', min: 4.0, max: 20.0, step: 0.1, defaultValue: 14.5, normalRange: 'Normal: 12.0 - 16.5 g/dL' },
  { name: 'pcv', label: 'Packed Cell Volume (PCV)', laymanLabel: 'Hematocrit (PCV)', type: 'number', unit: '%', min: 15, max: 60, step: 1, defaultValue: 42, normalRange: 'Normal: 36 - 48%' },
  { name: 'wc', label: 'White Blood Cell Count (WBC)', laymanLabel: 'WBC (Immunity Cells)', type: 'number', unit: 'cells/cumm', min: 2000, max: 25000, step: 100, defaultValue: 7500, normalRange: 'Normal: 4000 - 11000' },
  { name: 'rc', label: 'Red Blood Cell Count (RBC)', laymanLabel: 'RBC (Lal Rakt Kanika)', type: 'number', unit: 'millions/cmm', min: 2.0, max: 7.5, step: 0.1, defaultValue: 5.0, normalRange: 'Normal: 4.5 - 5.5' },
  { name: 'htn', label: 'Hypertension Present', laymanLabel: 'High BP Ki Bimari Hai?', type: 'select', defaultValue: 0, options: [{ label: 'No (Nahi) [0]', value: 0 }, { label: 'Yes (Haan) [1]', value: 1 }] }
];

export const LIVER_FIELDS: FieldDefinition[] = [
  { name: 'Age', label: 'Age', laymanLabel: 'Umra', type: 'number', min: 10, max: 100, step: 1, defaultValue: 46 },
  { name: 'Gender', label: 'Gender', laymanLabel: 'Ling', type: 'select', defaultValue: 1, options: [{ label: 'Male [1]', value: 1 }, { label: 'Female [0]', value: 0 }] },
  { name: 'Total_Bilirubin', label: 'Total Bilirubin (Jaundice)', laymanLabel: 'Total Bilirubin (Peeliya Marker)', type: 'number', unit: 'mg/dL', min: 0.2, max: 30.0, step: 0.1, defaultValue: 0.9, normalRange: 'Normal: 0.2 - 1.2 mg/dL', warningThreshold: 1.8, criticalThreshold: 2.5 },
  { name: 'Direct_Bilirubin', label: 'Direct Bilirubin', laymanLabel: 'Direct Bilirubin', type: 'number', unit: 'mg/dL', min: 0.1, max: 15.0, step: 0.1, defaultValue: 0.3, normalRange: 'Normal: 0.0 - 0.3 mg/dL' },
  { name: 'Alkaline_Phosphotase', label: 'Alkaline Phosphatase (ALP)', laymanLabel: 'Alkaline Phosphatase (ALP)', type: 'number', unit: 'U/L', min: 50, max: 1500, step: 5, defaultValue: 195, normalRange: 'Normal: 44 - 147 U/L' },
  { name: 'Alamine_Aminotransferase', label: 'Alamine Aminotransferase (ALT / SGPT)', laymanLabel: 'SGPT / ALT (Liver Damage Indicator)', type: 'number', unit: 'U/L', min: 5, max: 800, step: 1, defaultValue: 32, normalRange: 'Normal: 7 - 45 U/L', warningThreshold: 55, criticalThreshold: 80 },
  { name: 'Aspartate_Aminotransferase', label: 'Aspartate Aminotransferase (AST / SGOT)', laymanLabel: 'SGOT / AST (Liver Cell Health)', type: 'number', unit: 'U/L', min: 5, max: 800, step: 1, defaultValue: 30, normalRange: 'Normal: 8 - 40 U/L', warningThreshold: 50, criticalThreshold: 75 },
  { name: 'Total_Proteins', label: 'Total Proteins', laymanLabel: 'Total Khoon Ka Protein', type: 'number', unit: 'g/dL', min: 2.0, max: 10.0, step: 0.1, defaultValue: 6.8, normalRange: 'Normal: 6.0 - 8.3 g/dL' },
  { name: 'Albumin', label: 'Albumin Protein', laymanLabel: 'Albumin Protein', type: 'number', unit: 'g/dL', min: 1.0, max: 6.0, step: 0.1, defaultValue: 3.8, normalRange: 'Normal: 3.5 - 5.0 g/dL' },
  { name: 'Albumin_and_Globulin_Ratio', label: 'A/G Ratio', laymanLabel: 'Albumin / Globulin Ratio', type: 'number', min: 0.2, max: 3.0, step: 0.05, defaultValue: 1.2, normalRange: 'Normal: 1.0 - 2.2' }
];

export const STROKE_FIELDS: FieldDefinition[] = [
  { name: 'age', label: 'Age', laymanLabel: 'Umra (Age)', type: 'number', unit: 'years', min: 18, max: 100, step: 1, defaultValue: 58 },
  {
    name: 'hypertension',
    label: 'Chronic Hypertension History',
    laymanLabel: 'High Blood Pressure Ka Itihas',
    type: 'select',
    defaultValue: 0,
    options: [{ label: 'No (Normal BP) [0]', value: 0 }, { label: 'Yes (High BP Patient) [1]', value: 1 }],
    tooltip: '1 if patient has clinical diagnosis of hypertension'
  },
  {
    name: 'heart_disease',
    label: 'Co-existing Heart Disease',
    laymanLabel: 'Dil Ki Bimari Ka Itihas',
    type: 'select',
    defaultValue: 0,
    options: [{ label: 'No (Swasth Dil) [0]', value: 0 }, { label: 'Yes (Heart Condition) [1]', value: 1 }],
    tooltip: '1 if patient has coronary or valvular heart disease history'
  },
  {
    name: 'avg_glucose_level',
    label: 'Average Blood Glucose Level',
    laymanLabel: 'Average Sugar Level',
    type: 'number',
    unit: 'mg/dL',
    min: 60,
    max: 300,
    step: 1,
    defaultValue: 105,
    normalRange: 'Normal: 70 - 120 mg/dL',
    warningThreshold: 140,
    criticalThreshold: 200,
    tooltip: 'Average fasting or 3-month estimated glucose'
  },
  {
    name: 'bmi',
    label: 'Body Mass Index (BMI)',
    laymanLabel: 'Vajan vs Height (BMI)',
    type: 'number',
    unit: 'kg/m²',
    min: 15.0,
    max: 55.0,
    step: 0.1,
    defaultValue: 27.2,
    normalRange: 'Normal: 18.5 - 24.9 kg/m²',
    warningThreshold: 30.0,
    criticalThreshold: 35.0
  },
  {
    name: 'smoking_status',
    label: 'Tobacco Smoking Status',
    laymanLabel: 'Bidi / Cigarette / Tambaku Ki Aadat',
    type: 'select',
    defaultValue: 0,
    options: [
      { label: 'Never Smoked (Kabhi nahi) [0]', value: 0 },
      { label: 'Formerly Smoked (Pehle peete the, ab chhod di) [1]', value: 1 },
      { label: 'Currently Smokes (Roz peete hain) [2]', value: 2 }
    ],
    tooltip: 'Smoking exposure directly hardens cerebral arteries'
  }
];

export const DISEASE_CONFIGS = [
  {
    id: 'heart' as const,
    title: 'Heart Disease',
    subtitle: 'Cleveland Clinic 13-Biomarker Cardiovascular Risk Model',
    route: '/api/predict/heart',
    icon: 'Activity',
    color: 'emerald',
    targetMetric: 'Cardiovascular Risk'
  },
  {
    id: 'diabetes' as const,
    title: 'Diabetes Mellitus',
    subtitle: 'Pima Metabolic & Insulin Resistance Profile Model',
    route: '/api/predict/diabetes',
    icon: 'Droplet',
    color: 'emerald',
    targetMetric: 'Metabolic & Glycemic Risk'
  },
  {
    id: 'kidney' as const,
    title: 'Kidney Disease',
    subtitle: 'Renal Function & Biochemical Filtration Model (15 Parameters)',
    route: '/api/predict/kidney',
    icon: 'ShieldAlert',
    color: 'emerald',
    targetMetric: 'Glomerular Filtration Rate'
  },
  {
    id: 'liver' as const,
    title: 'Liver Disease',
    subtitle: 'ILPD Hepatic Function & Enzyme Profile Model',
    route: '/api/predict/liver',
    icon: 'Layers',
    color: 'emerald',
    targetMetric: 'Hepatic Enzyme & Bilirubin'
  },
  {
    id: 'stroke' as const,
    title: 'Stroke & Brain Risk',
    subtitle: 'Cerebrovascular Arterial Occlusion & Ischemic Stroke Model',
    route: '/api/predict/stroke',
    icon: 'Brain',
    color: 'emerald',
    targetMetric: 'Cerebrovascular Health'
  }
];

export const DISEASE_FIELDS: Record<DiseaseKey, FieldDefinition[]> = {
  heart: HEART_FIELDS,
  diabetes: DIABETES_FIELDS,
  kidney: KIDNEY_FIELDS,
  liver: LIVER_FIELDS,
  stroke: STROKE_FIELDS,
  other: [], // 'other' uses AI chat — no structured fields
};
