"""
Master Training Script for all 5 Disease Prediction Models (Including Stroke).
- Evaluates 75% Training and 25% Testing splits (test_size=0.25)
- Saves model files (.joblib)
- Exports model_metrics.json for the backend and UI to display
"""

import os
import json
from train_heart import train_heart_model
from train_diabetes import train_diabetes_model
from train_kidney import train_kidney_model
from train_liver import train_liver_model
from train_stroke import train_stroke_model

def main():
    print("=" * 60)
    print("🚀 Training Multi-Disease Prediction Machine Learning Models")
    print("   Data Split: 75% Training / 25% Testing (test_size=0.25)")
    print("=" * 60)
    
    all_metrics = {}
    
    # 1. Heart Disease
    print("\n[1/5] Training Heart Disease Model...")
    _, heart_metrics = train_heart_model()
    all_metrics["heart"] = heart_metrics
    
    # 2. Diabetes
    print("\n[2/5] Training Diabetes Model...")
    _, diabetes_metrics = train_diabetes_model()
    all_metrics["diabetes"] = diabetes_metrics
    
    # 3. Kidney Disease
    print("\n[3/5] Training Chronic Kidney Disease Model...")
    _, kidney_metrics = train_kidney_model()
    all_metrics["kidney"] = kidney_metrics
    
    # 4. Liver Disease
    print("\n[4/5] Training Liver Disease Model...")
    _, liver_metrics = train_liver_model()
    all_metrics["liver"] = liver_metrics

    # 5. Stroke & Cerebrovascular Risk
    print("\n[5/5] Training Stroke Risk Model...")
    _, stroke_metrics = train_stroke_model()
    all_metrics["stroke"] = stroke_metrics
    
    # Save all metrics
    metrics_file = os.path.join(os.path.dirname(__file__), "model_metrics.json")
    with open(metrics_file, "w") as f:
        json.dump(all_metrics, f, indent=2)
    
    print("\n" + "=" * 60)
    print("🎉 All 5 Models Successfully Trained and Saved!")
    print(f"📄 Performance summary written to: {metrics_file}")
    print("=" * 60)
    print(f"{'Disease':<24} | {'Train Acc':<10} | {'Test Acc (25%)':<14} | {'F1-Score':<10}")
    print("-" * 65)
    for key, m in all_metrics.items():
        print(f"{m['disease']:<24} | {m['train_accuracy']}%    | {m['test_accuracy']}%        | {m['f1_score']}%")
    print("=" * 60)

if __name__ == "__main__":
    main()
