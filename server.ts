import express from "express";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const ML_DIR = path.join(process.cwd(), "ml_models");
const PREDICT_SCRIPT = path.join(ML_DIR, "predict.py");

// Helper function to execute prediction Python child process
function executePrediction(disease: string, inputData: Record<string, any>): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", [PREDICT_SCRIPT, disease, JSON.stringify(inputData)]);
    
    let stdoutData = "";
    let stderrData = "";

    pythonProcess.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(stderrData || `Python prediction process exited with code ${code}`));
      }

      try {
        const jsonResult = JSON.parse(stdoutData.trim());
        if (jsonResult.status === "error") {
          return reject(new Error(jsonResult.error));
        }
        resolve(jsonResult);
      } catch (err) {
        reject(new Error(`Failed to parse prediction output: ${stdoutData}`));
      }
    });

    pythonProcess.on("error", (err) => {
      reject(new Error(`Failed to spawn Python process: ${err.message}`));
    });
  });
}

async function startServer() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS / logging middleware
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      models: ["heart", "diabetes", "kidney", "liver"]
    });
  });

  // Metrics endpoint to display accuracy and evaluation results
  app.get("/api/models/metrics", (req, res) => {
    const metricsPath = path.join(ML_DIR, "model_metrics.json");
    if (fs.existsSync(metricsPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(metricsPath, "utf-8"));
        return res.json({ status: "success", metrics: data });
      } catch (e) {
        return res.status(500).json({ status: "error", message: "Failed to read metrics" });
      }
    }
    res.status(404).json({ status: "error", message: "Metrics not yet available. Train models first." });
  });

  // Sample data endpoint for quick testing
  app.get("/api/sample-data", (req, res) => {
    const samplePath = path.join(ML_DIR, "sample_test_data.json");
    if (fs.existsSync(samplePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(samplePath, "utf-8"));
        return res.json({ status: "success", samples: data });
      } catch (e) {
        return res.status(500).json({ status: "error", message: "Failed to read sample data" });
      }
    }
    res.status(404).json({ status: "error", message: "Sample test data not found" });
  });

  // Dedicated 25% test data raw CSV download & JSON API
  app.get("/api/download-test-data/:disease", (req, res) => {
    const { disease } = req.params;
    const cleanDisease = disease.replace(/[^a-z]/gi, "").toLowerCase();
    const filePath = path.join(process.cwd(), "public", "test_data_split", `${cleanDisease}_test_25_percent.csv`);
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Disposition", `attachment; filename="${cleanDisease}_test_25_percent.csv"`);
      res.setHeader("Content-Type", "text/csv");
      return fs.createReadStream(filePath).pipe(res);
    }
    res.status(404).json({ status: "error", message: "Dataset split file not found" });
  });

  // Dedicated endpoint to get raw CSV text for clipboard copying or in-browser preview
  app.get("/api/raw-test-data/:disease", (req, res) => {
    const { disease } = req.params;
    const cleanDisease = disease.replace(/[^a-z]/gi, "").toLowerCase();
    const filePath = path.join(process.cwd(), "public", "test_data_split", `${cleanDisease}_test_25_percent.csv`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return res.json({ status: "success", csv: content, disease: cleanDisease });
    }
    res.status(404).json({ status: "error", message: "Dataset split file not found" });
  });

  // Static serving for public files like /test_data_split/*.csv
  app.use("/test_data_split", express.static(path.join(process.cwd(), "public", "test_data_split")));
  app.use(express.static(path.join(process.cwd(), "public")));

  // 1. Heart Disease Prediction route
  const handleHeart = async (req: express.Request, res: express.Response) => {
    try {
      const result = await executePrediction("heart", req.body);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ status: "error", message: err.message });
    }
  };
  app.post("/predict/heart", handleHeart);
  app.post("/api/predict/heart", handleHeart);

  // 2. Diabetes Prediction route
  const handleDiabetes = async (req: express.Request, res: express.Response) => {
    try {
      const result = await executePrediction("diabetes", req.body);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ status: "error", message: err.message });
    }
  };
  app.post("/predict/diabetes", handleDiabetes);
  app.post("/api/predict/diabetes", handleDiabetes);

  // 3. Chronic Kidney Disease Prediction route
  const handleKidney = async (req: express.Request, res: express.Response) => {
    try {
      const result = await executePrediction("kidney", req.body);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ status: "error", message: err.message });
    }
  };
  app.post("/predict/kidney", handleKidney);
  app.post("/api/predict/kidney", handleKidney);

  // 4. Liver Disease Prediction route
  const handleLiver = async (req: express.Request, res: express.Response) => {
    try {
      const result = await executePrediction("liver", req.body);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ status: "error", message: err.message });
    }
  };
  app.post("/predict/liver", handleLiver);
  app.post("/api/predict/liver", handleLiver);

  // Trigger retrain route
  app.post("/api/retrain", (req, res) => {
    const trainScript = path.join(ML_DIR, "train_all.py");
    const trainProcess = spawn("python3", [trainScript]);
    
    let output = "";
    trainProcess.stdout.on("data", (data) => { output += data.toString(); });
    trainProcess.stderr.on("data", (data) => { output += data.toString(); });

    trainProcess.on("close", (code) => {
      if (code === 0) {
        res.json({ status: "success", message: "All 4 models retrained successfully", output });
      } else {
        res.status(500).json({ status: "error", message: "Retraining failed", output });
      }
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Multi-Disease Prediction Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
