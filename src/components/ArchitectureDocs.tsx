import React, { useState } from 'react';
import {
  FolderTree,
  Terminal,
  Server,
  FileCode,
  CheckCircle2,
  Copy,
  Check,
  Play,
  RotateCw,
  Presentation,
  Download
} from 'lucide-react';
import { SampleCase } from '../types';

interface ArchitectureDocsProps {
  samples: Record<string, SampleCase[]> | null;
}

export const ArchitectureDocs: React.FC<ArchitectureDocsProps> = ({ samples }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [retraining, setRetraining] = useState(false);
  const [retrainOutput, setRetrainOutput] = useState<string | null>(null);

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleRetrainAll = async () => {
    setRetraining(true);
    setRetrainOutput(null);
    try {
      const res = await fetch('/api/retrain', { method: 'POST' });
      const data = await res.json();
      setRetrainOutput(data.output || 'Models successfully trained!');
    } catch (e: any) {
      setRetrainOutput('Error retraining: ' + e.message);
    } finally {
      setRetraining(false);
    }
  };

  const folderStructureText = `multi-disease-prediction-system/
├── ml_models/                       # Python Machine Learning core
│   ├── datasets/                    # Medical training datasets
│   │   ├── heart.csv                # Cleveland Heart Disease benchmark
│   │   ├── diabetes.csv             # Pima Indians Diabetes benchmark
│   │   ├── kidney.csv               # Chronic Kidney Disease (CKD) benchmark
│   │   └── liver.csv                # Indian Liver Patient (ILPD) benchmark
│   ├── generate_datasets.py         # Statistical dataset generator
│   ├── train_heart.py               # Heart model training (75/25 split)
│   ├── train_diabetes.py            # Diabetes model training (75/25 split)
│   ├── train_kidney.py              # Kidney model training (75/25 split)
│   ├── train_liver.py               # Liver model training (75/25 split)
│   ├── train_all.py                 # Master training execution script
│   ├── predict.py                   # Prediction child process engine
│   ├── heart_model.joblib           # Trained heart pipeline model
│   ├── diabetes_model.joblib        # Trained diabetes pipeline model
│   ├── kidney_model.joblib          # Trained kidney pipeline model
│   ├── liver_model.joblib           # Trained liver pipeline model
│   ├── model_metrics.json           # Real evaluation metrics (Acc, Precision, F1)
│   └── sample_test_data.json        # Test cases (Healthy vs At-Risk)
├── public/                          # Static assets and standalone client
│   └── index.html                   # Pure HTML/JS frontend entry
├── src/                             # Modern React application
│   ├── components/                  # Modular UI components
│   ├── data/diseaseFields.ts        # Parameter specifications
│   ├── types.ts                     # TypeScript definitions
│   ├── App.tsx                      # Main app shell
│   └── main.tsx                     # Entry point
├── server.js                        # Standalone Node.js Express server
├── server.ts                        # Full-Stack Express + Vite dev server
├── package.json                     # Dependencies and scripts
└── tsconfig.json                    # TypeScript compiler config`;

  const nodeSnippet = `// Backend (server.js / server.ts): Spawning Python child process
const { spawn } = require('child_process');
const path = require('path');

function executePrediction(disease, inputData) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'ml_models', 'predict.py');
    const child = spawn('python3', [scriptPath, disease, JSON.stringify(inputData)]);
    
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(stderr || \`Exited with code \${code}\`));
      try {
        resolve(JSON.parse(stdout.trim()));
      } catch (err) {
        reject(new Error('Failed to parse model JSON'));
      }
    });
  });
}

// Routes
app.post('/predict/heart', async (req, res) => {
  const result = await executePrediction('heart', req.body);
  res.json(result);
});`;

  const pythonSplitSnippet = `# Machine Learning Script (train_heart.py): 75% Train / 25% Test Split
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib

# 1. 75% Training and 25% Testing data split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

# 2. Build Pipeline (Normalization + Classification)
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(n_estimators=120, max_depth=6, random_state=42))
])

# 3. Fit on 75% training split
pipeline.fit(X_train, y_train)

# 4. Evaluate on 25% testing split
y_pred = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy on 25% Test Set: {accuracy * 100:.2f}%")

# 5. Save model
joblib.dump(pipeline, "ml_models/heart_model.joblib")`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Overview Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Full-Stack Architecture & Verification
            </span>
            <h2 className="text-2xl font-bold tracking-tight mt-1">
              Multi-Disease Prediction System Specifications
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Complete setup covering Heart Disease, Diabetes, Chronic Kidney Disease, and Liver
              Disease with self-trained scikit-learn models (75/25 split) executed locally via Node.js
              child process.
            </p>
          </div>

          <button
            onClick={handleRetrainAll}
            disabled={retraining}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
          >
            <RotateCw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
            <span>{retraining ? 'Retraining All 4 Models...' : 'Re-run Model Training'}</span>
          </button>
        </div>

        {retrainOutput && (
          <pre className="mt-4 p-3 bg-slate-950 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto border border-slate-800">
            {retrainOutput}
          </pre>
        )}
      </div>

      {/* Project Presentation PPTX Download Card */}
      <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wide">
                PowerPoint Presentation (.PPTX)
              </span>
              <span className="text-xs text-slate-400 font-mono">8 Comprehensive Slides</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <Presentation className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Multi-Disease Decision Support System Slide Deck</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Curated 8-slide presentation covering project motivation, 3-tier architecture, dataset specifications, Random Forest modeling rationale, stratified 75/25 test performance, and SHAP explainability.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
              <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">Slide 1: Title & Overview</span>
              <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">Slide 2: Clinical Problem</span>
              <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">Slide 3: Architecture</span>
              <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">Slide 4: Datasets</span>
              <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">Slide 5: ML Models</span>
              <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">Slide 6: Evaluation</span>
              <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">Slide 7: Explainable AI</span>
              <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">Slide 8: Future Roadmap</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center">
            <a
              href="/Multi_Disease_Prediction_System_Presentation.pptx"
              download="Multi_Disease_Prediction_System_Presentation.pptx"
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Download PPTX File</span>
            </a>
          </div>
        </div>
      </div>

      {/* 1. Project Folder Structure */}
      <div className="bg-slate-850/80 rounded-xl border border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <FolderTree className="w-5 h-5 text-slate-300" />
            <h3 className="text-base font-bold text-white">1. Project Folder Structure</h3>
          </div>
          <button
            onClick={() => copyCode('folder', folderStructureText)}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            {copiedSection === 'folder' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'folder' ? 'Copied' : 'Copy Structure'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Directory layout showing where the Node.js server (<code className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded">server.js</code>), frontend (<code className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded">public/</code> and <code className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded">src/</code>), and the Python ML folder (<code className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded">ml_models/</code>) reside.
        </p>
        <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
          {folderStructureText}
        </pre>
      </div>

      {/* 2. Machine Learning Scripts with Train-Test Split (75/25) */}
      <div className="bg-slate-850/80 rounded-xl border border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <FileCode className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              2. Python ML Training with 75/25 Train-Test Split
            </h3>
          </div>
          <button
            onClick={() => copyCode('python', pythonSplitSnippet)}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            {copiedSection === 'python' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'python' ? 'Copied' : 'Copy Python'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Each training script splits data using <code className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-300">train_test_split(X, y, test_size=0.25, random_state=42)</code>, fits a StandardScaler + RandomForestClassifier pipeline, and saves the weights via <code className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded">joblib.dump()</code>.
        </p>
        <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
          {pythonSplitSnippet}
        </pre>
      </div>

      {/* 3. Backend Express Child Process Spawning */}
      <div className="bg-slate-850/80 rounded-xl border border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <Server className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              3. Node.js / Express Child Process Backend
            </h3>
          </div>
          <button
            onClick={() => copyCode('node', nodeSnippet)}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            {copiedSection === 'node' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'node' ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Express exposes <code className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-300">/predict/heart</code>, <code className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-300">/predict/diabetes</code>, <code className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-300">/predict/kidney</code>, and <code className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-300">/predict/liver</code>, securely spawning <code className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded">predict.py</code> as a child process.
        </p>
        <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
          {nodeSnippet}
        </pre>
      </div>

      {/* 4. Sample Test Data Table */}
      <div className="bg-slate-850/80 rounded-xl border border-slate-800 p-6 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">
            4. Sample Test Data (Expected Outputs)
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Verified test rows for each disease. You can also click the quick-loader buttons inside each form tab to prefill them instantly.
        </p>

        {samples && (
          <div className="space-y-6">
            {Object.entries(samples).map(([diseaseKey, cases]) => (
              <div key={diseaseKey} className="border border-slate-800 rounded-lg overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-700">
                  {diseaseKey.toUpperCase()} DISEASE TEST SAMPLES
                </div>
                <div className="divide-y divide-slate-800">
                  {(cases as SampleCase[]).map((c, idx) => {
                    const isAtRisk = c.expected_class === 1;
                    return (
                      <div key={idx} className="p-4 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{c.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold border ${
                              isAtRisk
                                ? 'bg-rose-950/60 text-rose-300 border-rose-800/80'
                                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                            }`}
                          >
                            Expected: {c.expected_output}
                          </span>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                          {JSON.stringify(c.parameters)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Step-by-Step Instructions */}
      <div className="bg-slate-850/80 rounded-xl border border-slate-800 p-6 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-4">
          <Terminal className="w-5 h-5 text-slate-300" />
          <h3 className="text-base font-bold text-white">
            5. Step-by-Step Instructions to Run Locally
          </h3>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-bold text-white block mb-1">
              Step 1: Install Python ML Libraries
            </span>
            <pre className="p-2.5 bg-slate-950 text-slate-100 rounded font-mono text-xs overflow-x-auto border border-slate-800">
              pip install scikit-learn pandas numpy joblib
            </pre>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-bold text-white block mb-1">
              Step 2: Train the 4 Models (75% Train / 25% Test Split)
            </span>
            <pre className="p-2.5 bg-slate-950 text-slate-100 rounded font-mono text-xs overflow-x-auto border border-slate-800">
              python3 ml_models/train_all.py
            </pre>
            <p className="mt-1.5 text-slate-400 text-[11px]">
              This evaluates models with <code className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded">test_size=0.25</code> and outputs <code className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded">heart_model.joblib</code>, <code className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded">diabetes_model.joblib</code>, <code className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded">kidney_model.joblib</code>, and <code className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded">liver_model.joblib</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-bold text-white block mb-1">
              Step 3: Install Node.js Dependencies
            </span>
            <pre className="p-2.5 bg-slate-950 text-slate-100 rounded font-mono text-xs overflow-x-auto border border-slate-800">
              npm install
            </pre>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-bold text-white block mb-1">
              Step 4: Start the Full-Stack Application
            </span>
            <pre className="p-2.5 bg-slate-950 text-slate-100 rounded font-mono text-xs overflow-x-auto border border-slate-800">
              npm run dev
            </pre>
            <p className="mt-1.5 text-slate-400 text-[11px]">
              Or to run standalone Node.js server directly: <code className="font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded">node server.js</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
