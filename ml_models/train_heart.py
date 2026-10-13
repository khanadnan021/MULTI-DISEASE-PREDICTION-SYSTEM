"""
Training script for Heart Disease Prediction Model.
Uses 75% training and 25% testing data split (test_size=0.25).
Saves trained pipeline (StandardScaler + RandomForestClassifier) to heart_model.joblib.
"""

import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

def train_heart_model():
    dataset_path = os.path.join(os.path.dirname(__file__), "datasets", "heart.csv")
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}")
    
    df = pd.read_csv(dataset_path)
    
    feature_cols = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
        'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
    ]
    target_col = 'target'
    
    X = df[feature_cols]
    y = df[target_col]
    
    # 75% Training and 25% Testing Split (test_size=0.25)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )
    
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier(
            n_estimators=120,
            max_depth=6,
            random_state=42,
            min_samples_split=4
        ))
    ])
    
    pipeline.fit(X_train, y_train)
    
    y_pred = pipeline.predict(X_test)
    y_train_pred = pipeline.predict(X_train)
    
    metrics = {
        "disease": "Heart Disease",
        "model_type": "Random Forest Classifier (Pipeline with StandardScaler)",
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "test_size": 0.25,
        "train_accuracy": round(accuracy_score(y_train, y_train_pred) * 100, 2),
        "test_accuracy": round(accuracy_score(y_test, y_pred) * 100, 2),
        "precision": round(precision_score(y_test, y_pred, zero_division=0) * 100, 2),
        "recall": round(recall_score(y_test, y_pred, zero_division=0) * 100, 2),
        "f1_score": round(f1_score(y_test, y_pred, zero_division=0) * 100, 2),
        "features": feature_cols
    }
    
    # Save model
    model_output_path = os.path.join(os.path.dirname(__file__), "heart_model.joblib")
    joblib.dump(pipeline, model_output_path)
    print(f"✅ Heart Model successfully saved to {model_output_path}")
    print(f"   Accuracy on 25% Test Set: {metrics['test_accuracy']}%")
    print(f"   Precision: {metrics['precision']}%, Recall: {metrics['recall']}%, F1: {metrics['f1_score']}%")
    
    return pipeline, metrics

if __name__ == "__main__":
    train_heart_model()
