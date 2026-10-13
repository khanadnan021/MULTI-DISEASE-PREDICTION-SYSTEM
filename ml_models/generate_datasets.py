"""
Dataset generation script for the Multi-Disease Prediction System.
Produces realistic datasets based on standard clinical distributions:
1. Cleveland Heart Disease dataset format
2. Pima Indians Diabetes dataset format
3. Chronic Kidney Disease (CKD) dataset format
4. Indian Liver Patient Dataset (ILPD) format
"""

import os
import numpy as np
import pandas as pd

np.random.seed(42)

os.makedirs("ml_models/datasets", exist_ok=True)

# -------------------------------------------------------------
# 1. Heart Disease Dataset (approx 600 records)
# -------------------------------------------------------------
n_heart = 600
# Realistic distributions for healthy vs heart disease
heart_target = np.random.binomial(1, 0.48, n_heart)

age = np.where(heart_target == 1, np.random.normal(57, 8, n_heart), np.random.normal(50, 9, n_heart)).clip(29, 77).astype(int)
sex = np.random.binomial(1, 0.68, n_heart) # 1=male, 0=female
# cp: chest pain 0: typical, 1: atypical, 2: non-anginal, 3: asymptomatic
cp = np.where(heart_target == 1, np.random.choice([0, 1, 2, 3], p=[0.10, 0.15, 0.25, 0.50], size=n_heart),
                                np.random.choice([0, 1, 2, 3], p=[0.40, 0.30, 0.20, 0.10], size=n_heart))
trestbps = np.where(heart_target == 1, np.random.normal(136, 18, n_heart), np.random.normal(126, 14, n_heart)).clip(94, 200).astype(int)
chol = np.where(heart_target == 1, np.random.normal(255, 50, n_heart), np.random.normal(232, 42, n_heart)).clip(126, 564).astype(int)
fbs = np.where(heart_target == 1, np.random.binomial(1, 0.22, n_heart), np.random.binomial(1, 0.10, n_heart))
restecg = np.where(heart_target == 1, np.random.choice([0, 1, 2], p=[0.35, 0.55, 0.10], size=n_heart),
                                  np.random.choice([0, 1, 2], p=[0.60, 0.38, 0.02], size=n_heart))
thalach = np.where(heart_target == 1, np.random.normal(138, 22, n_heart), np.random.normal(158, 20, n_heart)).clip(71, 202).astype(int)
exang = np.where(heart_target == 1, np.random.binomial(1, 0.55, n_heart), np.random.binomial(1, 0.14, n_heart))
oldpeak = np.where(heart_target == 1, np.random.exponential(1.5, n_heart), np.random.exponential(0.5, n_heart)).clip(0.0, 6.2).round(1)
slope = np.where(heart_target == 1, np.random.choice([0, 1, 2], p=[0.10, 0.55, 0.35], size=n_heart),
                                 np.random.choice([0, 1, 2], p=[0.10, 0.30, 0.60], size=n_heart))
ca = np.where(heart_target == 1, np.random.choice([0, 1, 2, 3], p=[0.35, 0.35, 0.20, 0.10], size=n_heart),
                                np.random.choice([0, 1, 2, 3], p=[0.80, 0.14, 0.05, 0.01], size=n_heart))
thal = np.where(heart_target == 1, np.random.choice([0, 1, 2], p=[0.10, 0.25, 0.65], size=n_heart),
                                  np.random.choice([0, 1, 2], p=[0.65, 0.25, 0.10], size=n_heart))

df_heart = pd.DataFrame({
    'age': age, 'sex': sex, 'cp': cp, 'trestbps': trestbps, 'chol': chol,
    'fbs': fbs, 'restecg': restecg, 'thalach': thalach, 'exang': exang,
    'oldpeak': oldpeak, 'slope': slope, 'ca': ca, 'thal': thal, 'target': heart_target
})
df_heart.to_csv("ml_models/datasets/heart.csv", index=False)
print(f"Heart dataset saved with {len(df_heart)} rows.")

# -------------------------------------------------------------
# 2. Diabetes Dataset (approx 768 records)
# -------------------------------------------------------------
n_diab = 768
diab_target = np.random.binomial(1, 0.35, n_diab)

pregnancies = np.where(diab_target == 1, np.random.poisson(4.8, n_diab), np.random.poisson(3.2, n_diab)).clip(0, 17)
glucose = np.where(diab_target == 1, np.random.normal(142, 28, n_diab), np.random.normal(110, 20, n_diab)).clip(55, 200).astype(int)
bp_diab = np.where(diab_target == 1, np.random.normal(75, 12, n_diab), np.random.normal(68, 10, n_diab)).clip(40, 122).astype(int)
skin = np.where(diab_target == 1, np.random.normal(28, 9, n_diab), np.random.normal(22, 8, n_diab)).clip(0, 99).astype(int)
insulin = np.where(diab_target == 1, np.random.normal(120, 60, n_diab), np.random.normal(70, 40, n_diab)).clip(15, 846).astype(int)
bmi = np.where(diab_target == 1, np.random.normal(35.5, 6.5, n_diab), np.random.normal(30.2, 5.5, n_diab)).clip(18.0, 67.0).round(1)
dpf = np.where(diab_target == 1, np.random.gamma(2.5, 0.22, n_diab), np.random.gamma(1.8, 0.20, n_diab)).clip(0.08, 2.42).round(3)
age_diab = np.where(diab_target == 1, np.random.normal(37, 10, n_diab), np.random.normal(31, 9, n_diab)).clip(21, 81).astype(int)

df_diabetes = pd.DataFrame({
    'Pregnancies': pregnancies, 'Glucose': glucose, 'BloodPressure': bp_diab,
    'SkinThickness': skin, 'Insulin': insulin, 'BMI': bmi,
    'DiabetesPedigreeFunction': dpf, 'Age': age_diab, 'Outcome': diab_target
})
df_diabetes.to_csv("ml_models/datasets/diabetes.csv", index=False)
print(f"Diabetes dataset saved with {len(df_diabetes)} rows.")

# -------------------------------------------------------------
# 3. Chronic Kidney Disease Dataset (approx 500 records)
# -------------------------------------------------------------
n_ckd = 500
ckd_target = np.random.binomial(1, 0.55, n_ckd)

age_ckd = np.where(ckd_target == 1, np.random.normal(55, 12, n_ckd), np.random.normal(46, 14, n_ckd)).clip(15, 85).astype(int)
bp_ckd = np.where(ckd_target == 1, np.random.normal(83, 14, n_ckd), np.random.normal(72, 9, n_ckd)).clip(50, 140).astype(int)
sg = np.where(ckd_target == 1, np.random.choice([1.010, 1.015, 1.020], p=[0.45, 0.40, 0.15], size=n_ckd),
                              np.random.choice([1.020, 1.025], p=[0.65, 0.35], size=n_ckd))
al = np.where(ckd_target == 1, np.random.choice([0, 1, 2, 3, 4], p=[0.20, 0.30, 0.25, 0.15, 0.10], size=n_ckd),
                              np.zeros(n_ckd, dtype=int))
su = np.where(ckd_target == 1, np.random.choice([0, 1, 2, 3], p=[0.60, 0.20, 0.12, 0.08], size=n_ckd),
                              np.zeros(n_ckd, dtype=int))
bgr = np.where(ckd_target == 1, np.random.normal(160, 55, n_ckd), np.random.normal(108, 18, n_ckd)).clip(70, 450).astype(int)
bu = np.where(ckd_target == 1, np.random.normal(68, 38, n_ckd), np.random.normal(32, 10, n_ckd)).clip(10, 300).round(1)
sc = np.where(ckd_target == 1, np.random.normal(3.8, 2.4, n_ckd), np.random.normal(0.9, 0.2, n_ckd)).clip(0.4, 15.0).round(2)
sod = np.where(ckd_target == 1, np.random.normal(133, 8, n_ckd), np.random.normal(141, 4, n_ckd)).clip(105, 160).round(1)
pot = np.where(ckd_target == 1, np.random.normal(4.8, 0.9, n_ckd), np.random.normal(4.4, 0.5, n_ckd)).clip(2.5, 7.5).round(1)
hemo = np.where(ckd_target == 1, np.random.normal(10.2, 2.1, n_ckd), np.random.normal(15.1, 1.4, n_ckd)).clip(4.0, 17.8).round(1)
pcv = np.where(ckd_target == 1, np.random.normal(32, 6, n_ckd), np.random.normal(46, 4, n_ckd)).clip(15, 54).astype(int)
wc = np.where(ckd_target == 1, np.random.normal(9200, 2400, n_ckd), np.random.normal(7400, 1600, n_ckd)).clip(3000, 22000).astype(int)
rc = np.where(ckd_target == 1, np.random.normal(3.8, 0.7, n_ckd), np.random.normal(5.1, 0.5, n_ckd)).clip(2.1, 6.5).round(1)
htn = np.where(ckd_target == 1, np.random.binomial(1, 0.65, n_ckd), np.random.binomial(1, 0.08, n_ckd))

df_ckd = pd.DataFrame({
    'age': age_ckd, 'bp': bp_ckd, 'sg': sg, 'al': al, 'su': su,
    'bgr': bgr, 'bu': bu, 'sc': sc, 'sod': sod, 'pot': pot,
    'hemo': hemo, 'pcv': pcv, 'wc': wc, 'rc': rc, 'htn': htn,
    'classification': ckd_target
})
df_ckd.to_csv("ml_models/datasets/kidney.csv", index=False)
print(f"Kidney dataset saved with {len(df_ckd)} rows.")

# -------------------------------------------------------------
# 4. Liver Disease Dataset (ILPD format, approx 583 records)
# -------------------------------------------------------------
n_liver = 583
liver_target = np.random.binomial(1, 0.50, n_liver)

age_liv = np.random.normal(45, 14, n_liver).clip(15, 85).astype(int)
gender_liv = np.random.binomial(1, 0.75, n_liver) # 1=Male, 0=Female
tot_bili = np.where(liver_target == 1, np.random.exponential(3.2, n_liver) + 1.2, np.random.exponential(0.6, n_liver) + 0.5).clip(0.4, 40.0).round(1)
dir_bili = (tot_bili * np.where(liver_target == 1, np.random.uniform(0.4, 0.65, n_liver), np.random.uniform(0.2, 0.35, n_liver))).clip(0.1, 20.0).round(1)
alk_phos = np.where(liver_target == 1, np.random.normal(360, 140, n_liver), np.random.normal(210, 45, n_liver)).clip(90, 1200).astype(int)
sgpt = np.where(liver_target == 1, np.random.exponential(75, n_liver) + 35, np.random.exponential(18, n_liver) + 18).clip(12, 800).astype(int)
sgot = np.where(liver_target == 1, np.random.exponential(90, n_liver) + 40, np.random.exponential(20, n_liver) + 20).clip(15, 950).astype(int)
tot_prot = np.where(liver_target == 1, np.random.normal(6.3, 0.9, n_liver), np.random.normal(7.1, 0.7, n_liver)).clip(3.5, 9.5).round(1)
alb = np.where(liver_target == 1, np.random.normal(2.9, 0.6, n_liver), np.random.normal(3.8, 0.4, n_liver)).clip(1.2, 5.5).round(1)
ag_ratio = (alb / np.maximum(tot_prot - alb, 0.5)).clip(0.3, 2.5).round(2)

df_liver = pd.DataFrame({
    'Age': age_liv, 'Gender': gender_liv,
    'Total_Bilirubin': tot_bili, 'Direct_Bilirubin': dir_bili,
    'Alkaline_Phosphotase': alk_phos, 'Alamine_Aminotransferase': sgpt,
    'Aspartate_Aminotransferase': sgot, 'Total_Proteins': tot_prot,
    'Albumin': alb, 'Albumin_and_Globulin_Ratio': ag_ratio,
    'Dataset': liver_target
})
df_liver.to_csv("ml_models/datasets/liver.csv", index=False)
print(f"Liver dataset saved with {len(df_liver)} rows.")
print("All datasets generated successfully!")
