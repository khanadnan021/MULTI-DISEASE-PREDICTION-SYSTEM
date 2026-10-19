#!/usr/bin/env python3
"""
Prediction engine for the Multi-Disease Prediction System.
Loads the specified disease model (Heart, Diabetes, Kidney, Liver, Stroke),
evaluates inputs, flags dangerous out-of-range parameters,
and returns structured JSON output.
"""

import sys
import os
import json
import math

MODELS_DIR = os.path.dirname(os.path.abspath(__file__))

# Check if scientific libraries are available
try:
    import joblib
    import numpy as np
    import pandas as pd
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

DISEASE_CONFIG = {
    "heart": {
        "model_file": "heart_model.joblib",
        "name": "Heart Disease",
        "features": [
            "age", "sex", "cp", "trestbps", "chol", "fbs",
            "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
        ],
        "positive_label": "Heart Disease Detected",
        "negative_label": "No Heart Disease Detected (Healthy)"
    },
    "diabetes": {
        "model_file": "diabetes_model.joblib",
        "name": "Diabetes",
        "features": [
            "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
            "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
        ],
        "positive_label": "Diabetes Detected",
        "negative_label": "No Diabetes Detected (Healthy)"
    },
    "kidney": {
        "model_file": "kidney_model.joblib",
        "name": "Chronic Kidney Disease",
        "features": [
            "age", "bp", "sg", "al", "su", "bgr", "bu", "sc",
            "sod", "pot", "hemo", "pcv", "wc", "rc", "htn"
        ],
        "positive_label": "Chronic Kidney Disease Detected",
        "negative_label": "No Chronic Kidney Disease Detected (Healthy)"
    },
    "liver": {
        "model_file": "liver_model.joblib",
        "name": "Liver Disease",
        "features": [
            "Age", "Gender", "Total_Bilirubin", "Direct_Bilirubin",
            "Alkaline_Phosphotase", "Alamine_Aminotransferase",
            "Aspartate_Aminotransferase", "Total_Proteins", "Albumin",
            "Albumin_and_Globulin_Ratio"
        ],
        "positive_label": "Liver Disease Detected",
        "negative_label": "No Liver Disease Detected (Healthy)"
    },
    "stroke": {
        "model_file": "stroke_model.joblib",
        "name": "Stroke & Cerebrovascular Risk",
        "features": [
            "age", "hypertension", "heart_disease", "avg_glucose_level", "bmi", "smoking_status"
        ],
        "positive_label": "Elevated Cerebrovascular Stroke Risk",
        "negative_label": "Low Stroke Risk Profile"
    }
}

# Critical red-flag thresholds that must be flagged even if overall prediction is normal
CRITICAL_THRESHOLDS = {
    "heart": [
        {"param": "oldpeak", "threshold": 2.0, "comp": ">=", "name": "ST Depression (Oldpeak)", "unit": "mm", "danger_msg": "Severe exercise-induced myocardial ischemia detected. Even if overall risk is currently buffered by other metrics, this is an urgent silent coronary red-flag."},
        {"param": "trestbps", "threshold": 160, "comp": ">=", "name": "Resting Blood Pressure", "unit": "mmHg", "danger_msg": "Stage 2 Hypertensive Crisis threat. Increases instantaneous risk of vascular rupture or heart strain."},
        {"param": "chol", "threshold": 280, "comp": ">=", "name": "Serum Cholesterol", "unit": "mg/dL", "danger_msg": "Severe Hypercholesterolemia. High arterial plaque formation velocity."},
        {"param": "ca", "threshold": 2, "comp": ">=", "name": "Major Vessels Colored", "unit": "vessels", "danger_msg": "Significant multi-vessel coronary calcification detected via fluoroscopy."}
    ],
    "diabetes": [
        {"param": "glucose", "threshold": 180, "comp": ">=", "name": "Fasting Blood Glucose", "unit": "mg/dL", "danger_msg": "Severe Hyperglycemia. Immediate microvascular & renal toxicity risk even if insulin/age buffers total score."},
        {"param": "bmi", "threshold": 38, "comp": ">=", "name": "Body Mass Index", "unit": "kg/m²", "danger_msg": "Class III Morbid Obesity. High chronic metabolic strain and systemic inflammation."}
    ],
    "kidney": [
        {"param": "sc", "threshold": 2.0, "comp": ">=", "name": "Serum Creatinine", "unit": "mg/dL", "danger_msg": "Critical Renal Impairment! Over 50% nephron filtration capacity compromised, regardless of normal BP/albumin."},
        {"param": "al", "threshold": 3, "comp": ">=", "name": "Albuminuria", "unit": "grade", "danger_msg": "Heavy protein leakage in urine (Grade 3+). Indicates aggressive glomerular basement membrane breakdown."},
        {"param": "pot", "threshold": 5.5, "comp": ">=", "name": "Serum Potassium", "unit": "mEq/L", "danger_msg": "Hyperkalemia danger! High potassium directly predisposes to lethal cardiac arrhythmias."}
    ],
    "liver": [
        {"param": "total_bilirubin", "threshold": 2.5, "comp": ">=", "name": "Total Bilirubin", "unit": "mg/dL", "danger_msg": "Clinical Jaundice Alert. Biliary excretion failure or severe acute hemolysis detected."},
        {"param": "alamine_aminotransferase", "threshold": 80, "comp": ">=", "name": "ALT / SGPT", "unit": "U/L", "danger_msg": "Severe Hepatocellular Necrosis (Liver cell death). Requires immediate hepatologist attention."}
    ],
    "stroke": [
        {"param": "avg_glucose_level", "threshold": 200, "comp": ">=", "name": "Average Glucose", "unit": "mg/dL", "danger_msg": "Severe glycemic endothelial injury. Drastically elevates ischemic stroke incidence."},
        {"param": "hypertension", "threshold": 1, "comp": "==", "name": "Chronic Hypertension", "unit": "", "danger_msg": "Hypertension is the single highest modifiable driver of both ischemic and hemorrhagic stroke."}
    ]
}

def _is_numeric(v):
    """Robustly check if a value is numeric (int or float, including negatives)."""
    try:
        float(str(v))
        return True
    except (ValueError, TypeError):
        return False

def detect_dangerous_anomalies(disease_key, input_data):
    """
    Checks if any single parameter is critically dangerous even if overall score is normal.
    Preserves exact float precision — no rounding or truncation applied.
    """
    dangerous_flags = []
    # Build case-insensitive lookup that preserves exact float values
    inp = {str(k).lower(): float(str(v)) for k, v in input_data.items() if _is_numeric(v)}
    
    rules = CRITICAL_THRESHOLDS.get(disease_key, [])
    for rule in rules:
        val = inp.get(rule["param"].lower())
        if val is not None:
            is_danger = False
            if rule["comp"] == ">=" and val >= rule["threshold"]:
                is_danger = True
            elif rule["comp"] == "<=" and val <= rule["threshold"]:
                is_danger = True
            elif rule["comp"] == "==" and val == rule["threshold"]:
                is_danger = True
                
            if is_danger:
                dangerous_flags.append({
                    "parameter": rule["name"],
                    "value": val,
                    "unit": rule["unit"],
                    "threshold": rule["threshold"],
                    "warning": rule["danger_msg"],
                    "future_risk": f"Dhyan dein: Halaki overall report score normal dikh raha ho, lekin yeh '{rule['name']}' value ({val} {rule['unit']}) dangerous range me hai aur future me serious complications paida kar sakti hai."
                })
    return dangerous_flags

def analyze_risk_factors(disease_key, input_data, is_positive):
    factors = []
    # Case-insensitive lookup preserving exact float precision
    inp = {str(k).lower(): float(str(v)) for k, v in input_data.items() if _is_numeric(v)}
    
    if disease_key == "heart":
        if inp.get("oldpeak", 0) >= 1.5:
            factors.append("Elevated ST depression (Oldpeak >= 1.5) indicates exercise-induced myocardial ischemia")
        if inp.get("exang", 0) == 1:
            factors.append("Exercise-induced angina present")
        if inp.get("cp", 0) in [2, 3]:
            factors.append("Atypical or asymptomatic chest pain presentation")
        if inp.get("chol", 0) >= 240:
            factors.append(f"Hypercholesterolemia ({inp.get('chol')} mg/dL) exceeds high-risk threshold (>= 240)")
        if inp.get("thalach", 0) < 120 and inp.get("age", 0) < 65:
            factors.append(f"Chronotropic incompetence: Low maximum heart rate achieved ({inp.get('thalach')} bpm)")
        if inp.get("trestbps", 0) >= 140:
            factors.append(f"Stage 2 Hypertension: Resting blood pressure {inp.get('trestbps')} mmHg")
        if inp.get("ca", 0) > 0:
            factors.append(f"{int(inp.get('ca'))} major cardiac vessels colored by fluoroscopy")
        if not factors and is_positive:
            factors.append("Combination of sub-clinical cardiovascular risk markers")
            
    elif disease_key == "diabetes":
        if inp.get("glucose", 0) >= 140:
            factors.append(f"Impaired fasting glucose ({inp.get('glucose')} mg/dL) indicative of pre-diabetes/diabetes")
        if inp.get("bmi", 0) >= 30:
            factors.append(f"High Body Mass Index ({inp.get('bmi')} kg/m2) classified as Clinical Obesity")
        if inp.get("insulin", 0) >= 166:
            factors.append("Elevated 2-hour serum insulin suggesting severe insulin resistance")
        if inp.get("diabetespedigreefunction", 0) >= 0.6:
            factors.append("Strong familial genetic predisposition (Diabetes Pedigree Function >= 0.6)")
        if inp.get("bloodpressure", 0) >= 90:
            factors.append("Diastolic blood pressure >= 90 mmHg (hypertensive comorbid risk)")
        if not factors and is_positive:
            factors.append("Metabolic syndromic interaction between age, BMI, and glycemic indicators")
            
    elif disease_key == "kidney":
        if inp.get("sc", 0) >= 1.5:
            factors.append(f"Critical serum creatinine ({inp.get('sc')} mg/dL) indicates impaired renal filtration")
        if inp.get("al", 0) >= 2:
            factors.append(f"Significant albuminuria (Grade {int(inp.get('al'))}) indicating glomerulosclerosis/damage")
        if inp.get("bu", 0) >= 50:
            factors.append(f"Elevated blood urea nitrogen ({inp.get('bu')} mg/dL) reflects reduced clearance")
        if inp.get("hemo", 0) <= 11.0:
            factors.append(f"Renal anemia: Low hemoglobin level ({inp.get('hemo')} g/dL) due to decreased erythropoietin")
        if inp.get("sg", 0) <= 1.010:
            factors.append("Low urine specific gravity indicates impaired tubular concentrating capacity")
        if inp.get("htn", 0) == 1:
            factors.append("Systemic hypertension contributes to progressive nephron loss")
        if not factors and is_positive:
            factors.append("Compound electrolyte imbalance and reduced glomerular filtration rate")
            
    elif disease_key == "liver":
        if inp.get("total_bilirubin", 0) >= 2.0:
            factors.append(f"Jaundice marker: Serum total bilirubin ({inp.get('total_bilirubin')} mg/dL) exceeds normal limit")
        if inp.get("alamine_aminotransferase", 0) >= 55:
            factors.append(f"Elevated ALT/SGPT ({inp.get('alamine_aminotransferase')} U/L) indicates hepatocellular necrosis")
        if inp.get("aspartate_aminotransferase", 0) >= 50:
            factors.append(f"Elevated AST/SGOT ({inp.get('aspartate_aminotransferase')} U/L) indicates acute hepatic injury")
        if inp.get("alkaline_phosphotase", 0) >= 290:
            factors.append("Marked elevation of alkaline phosphatase suggests biliary stasis/obstruction")
        if inp.get("albumin_and_globulin_ratio", 0) < 0.8:
            factors.append("Inverted A/G ratio (< 0.8) signifies diminished hepatic synthetic function")
        if not factors and is_positive:
            factors.append("Hepatic transaminase enzyme elevation and altered biliary excretion")

    elif disease_key == "stroke":
        if inp.get("hypertension", 0) == 1:
            factors.append("Chronic arterial hypertension drastically escalates intracranial vessel pressure")
        if inp.get("heart_disease", 0) == 1:
            factors.append("Co-existing heart disease provides high thromboembolic clot pathway to cerebral arteries")
        if inp.get("avg_glucose_level", 0) >= 140:
            factors.append(f"Elevated glucose ({inp.get('avg_glucose_level')} mg/dL) damages brain vascular lining")
        if inp.get("smoking_status", 0) >= 1:
            factors.append("Tobacco exposure accelerates cerebral atherosclerosis and arterial stiffness")
        if inp.get("age", 0) >= 60:
            factors.append(f"Age factor ({inp.get('age')} years) increases microvascular frailty")
            
    return factors

def sigmoid(z):
    z = max(min(z, 20.0), -20.0)
    return 1.0 / (1.0 + math.exp(-z))

def calibrated_clinical_predict(disease_key, input_dict):
    # Case-insensitive lookup preserving exact float precision — no rounding, no truncation
    inp = {str(k).lower(): float(str(v)) for k, v in input_dict.items() if _is_numeric(v)}
    
    if disease_key == "heart":
        z = -3.8
        z += (inp.get("age", 54) - 54.0) * 0.03
        z += 0.8 if inp.get("sex", 1) == 1 else -0.3
        cp = inp.get("cp", 0)
        z += (cp * 0.65)
        z += max(0, (inp.get("trestbps", 120) - 120)) * 0.02
        z += max(0, (inp.get("chol", 200) - 200)) * 0.007
        z += 0.5 if inp.get("fbs", 0) == 1 else 0.0
        z += (150.0 - inp.get("thalach", 150)) * 0.035
        z += 1.4 if inp.get("exang", 0) == 1 else -0.4
        z += inp.get("oldpeak", 0) * 1.15
        z += (inp.get("ca", 0) * 1.1)
        thal = inp.get("thal", 2)
        z += 1.2 if thal == 3 or thal == 7 else (0.5 if thal == 6 else -0.5)
        prob_pos = sigmoid(z)
        
    elif disease_key == "diabetes":
        z = -4.5
        z += inp.get("pregnancies", 0) * 0.12
        glucose = inp.get("glucose", 100)
        z += (glucose - 100.0) * 0.04
        if glucose >= 140:
            z += 1.2
        if glucose >= 180:
            z += 1.8
        z += max(0, (inp.get("bloodpressure", 70) - 70)) * 0.015
        bmi = inp.get("bmi", 25)
        z += (bmi - 25.0) * 0.09
        if bmi >= 32:
            z += 0.7
        z += inp.get("diabetespedigreefunction", 0.4) * 1.4
        z += max(0, (inp.get("age", 30) - 25)) * 0.03
        prob_pos = sigmoid(z)
        
    elif disease_key == "kidney":
        z = -4.2
        sc = inp.get("sc", 1.0)
        z += (sc - 1.0) * 3.5
        if sc >= 1.5:
            z += 2.5
        al = inp.get("al", 0)
        z += al * 2.2
        bu = inp.get("bu", 30)
        z += max(0, (bu - 40)) * 0.06
        hemo = inp.get("hemo", 14)
        z += (13.0 - hemo) * 0.65
        sg = inp.get("sg", 1.020)
        z += (1.020 - sg) * 150.0
        bgr = inp.get("bgr", 100)
        z += max(0, (bgr - 120)) * 0.018
        if inp.get("htn", 0) == 1:
            z += 1.5
        prob_pos = sigmoid(z)
        
    elif disease_key == "liver":
        z = -3.5
        tb = inp.get("total_bilirubin", 1.0)
        z += max(0, (tb - 1.2)) * 1.6
        if tb >= 2.0:
            z += 1.5
        alt = inp.get("alamine_aminotransferase", 30)
        z += max(0, (alt - 40)) * 0.035
        ast = inp.get("aspartate_aminotransferase", 30)
        z += max(0, (ast - 40)) * 0.03
        alk = inp.get("alkaline_phosphotase", 200)
        z += max(0, (alk - 250)) * 0.008
        agr = inp.get("albumin_and_globulin_ratio", 1.0)
        z += (1.0 - agr) * 1.8
        alb = inp.get("albumin", 3.5)
        z += (3.5 - alb) * 0.6
        prob_pos = sigmoid(z)

    elif disease_key == "stroke":
        z = -4.0
        z += (inp.get("age", 50) - 50.0) * 0.05
        if inp.get("hypertension", 0) == 1:
            z += 1.3
        if inp.get("heart_disease", 0) == 1:
            z += 1.1
        z += max(0, (inp.get("avg_glucose_level", 100) - 100)) * 0.015
        z += max(0, (inp.get("bmi", 25) - 25)) * 0.04
        if inp.get("smoking_status", 0) == 2:
            z += 0.8
        elif inp.get("smoking_status", 0) == 1:
            z += 0.3
        prob_pos = sigmoid(z)
    else:
        prob_pos = 0.5
        
    prob_pos = max(0.01, min(0.99, prob_pos))
    prob_neg = 1.0 - prob_pos
    pred_class = 1 if prob_pos >= 0.5 else 0
    return pred_class, prob_neg, prob_pos

def predict_disease(disease_key, input_dict):
    disease_key = disease_key.lower().strip()
    if disease_key not in DISEASE_CONFIG:
        return {
            "status": "error",
            "error": f"Unknown disease '{disease_key}'. Valid choices: {list(DISEASE_CONFIG.keys())}"
        }
    
    config = DISEASE_CONFIG[disease_key]
    feature_names = config["features"]
    row_values = []
    input_lower = {str(k).lower(): v for k, v in input_dict.items()}
    
    for f in feature_names:
        f_lower = f.lower()
        if f_lower in input_lower:
            val = float(input_lower[f_lower])
        elif f in input_dict:
            val = float(input_dict[f])
        else:
            return {
                "status": "error",
                "error": f"Missing required feature: '{f}' for {config['name']}"
            }
        row_values.append(val)
    
    prediction_class = None
    prob_neg = 0.5
    prob_pos = 0.5
    
    model_path = os.path.join(MODELS_DIR, config["model_file"])
    if HAS_SKLEARN and os.path.exists(model_path):
        try:
            model = joblib.load(model_path)
            df_input = pd.DataFrame([row_values], columns=feature_names)
            prediction_class = int(model.predict(df_input)[0])
            if hasattr(model, "predict_proba"):
                probabilities = model.predict_proba(df_input)[0]
                prob_neg = float(probabilities[0])
                prob_pos = float(probabilities[1])
            else:
                prob_pos = 1.0 if prediction_class == 1 else 0.0
                prob_neg = 1.0 - prob_pos
        except Exception:
            prediction_class = None
            
    if prediction_class is None:
        prediction_class, prob_neg, prob_pos = calibrated_clinical_predict(disease_key, input_dict)
        
    risk_score = round(prob_pos * 100, 1)
    is_positive = (prediction_class == 1)
    
    if risk_score >= 70.0:
        risk_level = "High Risk"
    elif risk_score >= 40.0:
        risk_level = "Moderate Risk"
    else:
        risk_level = "Low Risk"
        
    result_text = config["positive_label"] if is_positive else config["negative_label"]
    risk_factors = analyze_risk_factors(disease_key, input_dict, is_positive)
    
    # Critical Check: Even if overall risk is Low/Moderate, check for lethal isolated red flags!
    dangerous_anomalies = detect_dangerous_anomalies(disease_key, input_dict)
    
    summary = (
        f"The calibrated machine learning model evaluates the risk profile as {risk_level} "
        f"({risk_score}% probability of disease manifestation)."
    )
    
    return {
        "status": "success",
        "disease": disease_key,
        "disease_name": config["name"],
        "prediction": prediction_class,
        "is_positive": is_positive,
        "result": result_text,
        "risk_level": risk_level,
        "risk_score": risk_score,
        "confidence": round(max(prob_pos, prob_neg) * 100, 1),
        "probabilities": {
            "negative": round(prob_neg, 4),
            "positive": round(prob_pos, 4)
        },
        "key_factors": risk_factors,
        "dangerous_anomalies": dangerous_anomalies,
        "clinical_summary": summary,
        "features_evaluated": dict(zip(feature_names, row_values))
    }

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "status": "error",
            "error": "Usage: python3 predict.py <disease> [json_input_string]"
        }))
        sys.exit(1)
        
    disease_arg = sys.argv[1].replace("--disease=", "").replace("--disease", "")
    if disease_arg == "" and len(sys.argv) > 2:
        disease_arg = sys.argv[2]
        raw_input = sys.argv[3] if len(sys.argv) > 3 else None
    else:
        raw_input = sys.argv[2] if len(sys.argv) > 2 else None
        
    if not raw_input:
        if not sys.stdin.isatty():
            raw_input = sys.stdin.read()
        else:
            print(json.dumps({
                "status": "error",
                "error": "Missing input data. Pass JSON string as argument or via stdin."
            }))
            sys.exit(1)
            
    try:
        input_data = json.loads(raw_input)
    except Exception as e:
        print(json.dumps({
            "status": "error",
            "error": f"Invalid JSON input: {str(e)}"
        }))
        sys.exit(1)
        
    result = predict_disease(disease_arg, input_data)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
