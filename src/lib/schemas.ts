import { z } from "zod";
import { DiseaseKey } from "../types";

export const heartSchema = z.object({
  age: z.coerce.number().min(18, "Age must be >= 18").max(110, "Age must be <= 110"),
  sex: z.coerce.number().int().min(0).max(1),
  cp: z.coerce.number().int().min(0).max(3),
  trestbps: z.coerce.number().min(60, "Resting BP must be >= 60 mmHg").max(240, "Resting BP must be <= 240 mmHg"),
  chol: z.coerce.number().min(90, "Serum cholesterol must be >= 90 mg/dL").max(650, "Serum cholesterol must be <= 650 mg/dL"),
  fbs: z.coerce.number().int().min(0).max(1),
  restecg: z.coerce.number().int().min(0).max(2),
  thalach: z.coerce.number().min(50, "Max heart rate must be >= 50 bpm").max(230, "Max heart rate must be <= 230 bpm"),
  exang: z.coerce.number().int().min(0).max(1),
  oldpeak: z.coerce.number().min(0, "ST depression must be >= 0 mm").max(8, "ST depression must be <= 8.0 mm"),
  slope: z.coerce.number().int().min(0).max(2),
  ca: z.coerce.number().int().min(0).max(3),
  thal: z.coerce.number().int().min(0).max(3),
});

export const diabetesSchema = z.object({
  Pregnancies: z.coerce.number().int().min(0, "Pregnancies cannot be negative").max(20, "Maximum 20 pregnancies"),
  Glucose: z.coerce.number().min(40, "Fasting glucose must be >= 40 mg/dL").max(400, "Fasting glucose must be <= 400 mg/dL"),
  BloodPressure: z.coerce.number().min(40, "Diastolic BP must be >= 40 mmHg").max(180, "Diastolic BP must be <= 180 mmHg"),
  SkinThickness: z.coerce.number().min(0, "Skin thickness cannot be negative").max(99, "Skin thickness must be <= 99 mm"),
  Insulin: z.coerce.number().min(0, "Serum insulin cannot be negative").max(850, "Serum insulin must be <= 850 μU/mL"),
  BMI: z.coerce.number().min(12, "BMI must be >= 12.0 kg/m²").max(70, "BMI must be <= 70.0 kg/m²"),
  DiabetesPedigreeFunction: z.coerce.number().min(0.05, "DPF must be >= 0.05").max(2.5, "DPF must be <= 2.50"),
  Age: z.coerce.number().min(18, "Age must be >= 18").max(110, "Age must be <= 110"),
});

export const kidneySchema = z.object({
  age: z.coerce.number().min(2, "Age must be >= 2").max(105, "Age must be <= 105"),
  bp: z.coerce.number().min(50, "Blood pressure must be >= 50 mmHg").max(220, "Blood pressure must be <= 220 mmHg"),
  sg: z.coerce.number().min(1.005, "Specific gravity must be >= 1.005").max(1.030, "Specific gravity must be <= 1.030"),
  al: z.coerce.number().int().min(0).max(5),
  su: z.coerce.number().int().min(0).max(5),
  bgr: z.coerce.number().min(50, "Random glucose must be >= 50 mg/dL").max(500, "Random glucose must be <= 500 mg/dL"),
  bu: z.coerce.number().min(5, "Blood urea must be >= 5 mg/dL").max(350, "Blood urea must be <= 350 mg/dL"),
  sc: z.coerce.number().min(0.3, "Serum creatinine must be >= 0.3 mg/dL").max(18.0, "Serum creatinine must be <= 18.0 mg/dL"),
  sod: z.coerce.number().min(100, "Sodium must be >= 100 mEq/L").max(170, "Sodium must be <= 170 mEq/L"),
  pot: z.coerce.number().min(2.0, "Potassium must be >= 2.0 mEq/L").max(10.0, "Potassium must be <= 10.0 mEq/L"),
  hemo: z.coerce.number().min(3.0, "Hemoglobin must be >= 3.0 g/dL").max(20.0, "Hemoglobin must be <= 20.0 g/dL"),
  pcv: z.coerce.number().min(12, "PCV must be >= 12%").max(60, "PCV must be <= 60%"),
  wc: z.coerce.number().min(1500, "White blood cell count must be >= 1500 /μL").max(30000, "WBC must be <= 30000 /μL"),
  rc: z.coerce.number().min(1.5, "Red blood cell count must be >= 1.5 million/μL").max(8.5, "RBC must be <= 8.5 million/μL"),
  htn: z.coerce.number().int().min(0).max(1),
});

export const liverSchema = z.object({
  Age: z.coerce.number().min(5, "Age must be >= 5").max(100, "Age must be <= 100"),
  Gender: z.coerce.number().int().min(0).max(1),
  Total_Bilirubin: z.coerce.number().min(0.3, "Total bilirubin must be >= 0.3 mg/dL").max(35.0, "Total bilirubin must be <= 35.0 mg/dL"),
  Direct_Bilirubin: z.coerce.number().min(0.1, "Direct bilirubin must be >= 0.1 mg/dL").max(20.0, "Direct bilirubin must be <= 20.0 mg/dL"),
  Alkaline_Phosphotase: z.coerce.number().min(50, "Alk Phos must be >= 50 U/L").max(2000, "Alk Phos must be <= 2000 U/L"),
  Alamine_Aminotransferase: z.coerce.number().min(8, "ALT/SGPT must be >= 8 U/L").max(1500, "ALT/SGPT must be <= 1500 U/L"),
  Aspartate_Aminotransferase: z.coerce.number().min(8, "AST/SGOT must be >= 8 U/L").max(1500, "AST/SGOT must be <= 1500 U/L"),
  Total_Proteins: z.coerce.number().min(2.5, "Total proteins must be >= 2.5 g/dL").max(10.5, "Total proteins must be <= 10.5 g/dL"),
  Albumin: z.coerce.number().min(1.0, "Albumin must be >= 1.0 g/dL").max(6.0, "Albumin must be <= 6.0 g/dL"),
  Albumin_and_Globulin_Ratio: z.coerce.number().min(0.2, "A/G ratio must be >= 0.2").max(3.0, "A/G ratio must be <= 3.0"),
});

export const DISEASE_SCHEMAS: Record<DiseaseKey, z.ZodObject<any>> = {
  heart: heartSchema,
  diabetes: diabetesSchema,
  kidney: kidneySchema,
  liver: liverSchema,
};
