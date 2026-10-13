/**
 * Standalone Node.js Express server for Multi-Disease Prediction System.
 * Can be run directly with: node server.js
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;
const ML_DIR = path.join(__dirname, 'ml_models');
const PREDICT_SCRIPT = path.join(ML_DIR, 'predict.py');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// Helper function to spawn Python prediction process
function executePrediction(disease, inputData) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [PREDICT_SCRIPT, disease, JSON.stringify(inputData)]);
    
    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(stderrData || `Python script exited with code ${code}`));
      }

      try {
        const jsonResult = JSON.parse(stdoutData.trim());
        if (jsonResult.status === 'error') {
          return reject(new Error(jsonResult.error));
        }
        resolve(jsonResult);
      } catch (err) {
        reject(new Error(`Failed to parse prediction output: ${stdoutData}`));
      }
    });

    pythonProcess.on('error', (err) => {
      reject(new Error(`Failed to spawn Python process: ${err.message}`));
    });
  });
}

// -------------------------------------------------------------
// API Prediction Routes
// -------------------------------------------------------------

// Heart Disease
app.post(['/predict/heart', '/api/predict/heart'], async (req, res) => {
  try {
    const result = await executePrediction('heart', req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// Diabetes
app.post(['/predict/diabetes', '/api/predict/diabetes'], async (req, res) => {
  try {
    const result = await executePrediction('diabetes', req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// Chronic Kidney Disease
app.post(['/predict/kidney', '/api/predict/kidney'], async (req, res) => {
  try {
    const result = await executePrediction('kidney', req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// Liver Disease
app.post(['/predict/liver', '/api/predict/liver'], async (req, res) => {
  try {
    const result = await executePrediction('liver', req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// Metrics & evaluation status
app.get('/api/models/metrics', (req, res) => {
  const metricsPath = path.join(ML_DIR, 'model_metrics.json');
  if (fs.existsSync(metricsPath)) {
    const data = JSON.parse(fs.readFileSync(metricsPath, 'utf-8'));
    return res.json({ status: 'success', metrics: data });
  }
  res.status(404).json({ status: 'error', message: 'Metrics not found' });
});

// Sample test data
app.get('/api/sample-data', (req, res) => {
  const samplePath = path.join(ML_DIR, 'sample_test_data.json');
  if (fs.existsSync(samplePath)) {
    const data = JSON.parse(fs.readFileSync(samplePath, 'utf-8'));
    return res.json({ status: 'success', samples: data });
  }
  res.status(404).json({ status: 'error', message: 'Sample test data not found' });
});

// SPA fallback
app.get('*', (req, res) => {
  const publicIndex = path.join(__dirname, 'public', 'index.html');
  const distIndex = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(distIndex)) {
    return res.sendFile(distIndex);
  }
  if (fs.existsSync(publicIndex)) {
    return res.sendFile(publicIndex);
  }
  res.send('Multi-Disease Prediction API is active.');
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Node.js Prediction Server running on port ${PORT}`);
  });
}

module.exports = app;
