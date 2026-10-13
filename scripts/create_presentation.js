import pptxgen from "pptxgenjs";
import fs from "fs";
import path from "path";

async function generatePptx() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "HealthPredict AI Engineering Team";
  pptx.company = "Clinical Machine Learning Decision Systems";
  pptx.title = "Multi-Disease Predictive Healthcare Decision Support System";

  // Color Palette
  const NAVY = "0F172A";       // Slate 900
  const BLUE = "1E40AF";       // Blue 800
  const LIGHT_BLUE = "3B82F6"; // Blue 500
  const TEAL = "0D9488";       // Teal 600
  const WHITE = "FFFFFF";
  const LIGHT_GRAY = "F8FAFC";  // Slate 50
  const BORDER_GRAY = "E2E8F0"; // Slate 200
  const TEXT_DARK = "0F172A";
  const TEXT_MUTED = "475569";
  const CARD_BG = "FFFFFF";
  const ACCENT_RED = "E11D48";
  const ACCENT_GREEN = "10B981";

  // Helper for Slide Background & Header
  function addSlideHeader(slide, title, category = "MULTI-DISEASE PREDICTION SYSTEM") {
    // Top background banner
    slide.background = { color: LIGHT_GRAY };

    // Header strip
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 13.33,
      h: 1.1,
      fill: { color: NAVY },
      line: { color: NAVY }
    });

    // Category pill
    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.18,
      w: 8,
      h: 0.25,
      fontSize: 9,
      fontFace: "Arial",
      bold: true,
      color: "93C5FD" // Light Blue
    });

    // Title
    slide.addText(title, {
      x: 0.8,
      y: 0.42,
      w: 11.5,
      h: 0.55,
      fontSize: 20,
      fontFace: "Arial",
      bold: true,
      color: WHITE
    });

    // Footer
    slide.addText("HealthPredict AI • Decision Support System", {
      x: 0.8,
      y: 7.1,
      w: 6,
      h: 0.3,
      fontSize: 8.5,
      fontFace: "Arial",
      color: "94A3B8"
    });
  }

  // ==========================================
  // SLIDE 1: Title Slide (Cover)
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: NAVY };

    // Accent line
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 1.2,
      w: 1.8,
      h: 0.08,
      fill: { color: LIGHT_BLUE },
      line: { color: LIGHT_BLUE }
    });

    slide.addText("CLINICAL ARTIFICIAL INTELLIGENCE & HEALTH INFORMATICS", {
      x: 0.8,
      y: 1.45,
      w: 11,
      h: 0.3,
      fontSize: 11,
      fontFace: "Arial",
      bold: true,
      color: "60A5FA"
    });

    slide.addText("Multi-Disease Predictive Healthcare Decision Support System", {
      x: 0.8,
      y: 1.85,
      w: 11.5,
      h: 1.6,
      fontSize: 34,
      fontFace: "Arial",
      bold: true,
      color: WHITE,
      lineSpacingMultiple: 1.1
    });

    slide.addText("Early Clinical Risk Stratification across Heart, Diabetes, Kidney & Liver Conditions using Calibrated Random Forest Ensembles & Explainable AI (SHAP)", {
      x: 0.8,
      y: 3.55,
      w: 11,
      h: 0.9,
      fontSize: 14,
      fontFace: "Arial",
      color: "CBD5E1",
      lineSpacingMultiple: 1.2
    });

    // Key stats box
    const badgeY = 4.8;
    const badges = [
      { label: "4 Diagnostic Modules", desc: "Heart • Diabetes • CKD • Liver", color: "1E293B" },
      { label: "Ensemble Modeling", desc: "Calibrated Random Forests", color: "1E293B" },
      { label: "Explainable AI (XAI)", desc: "SHAP Game-Theoretic Feature Attribution", color: "1E293B" },
      { label: "Full-Stack Deployment", desc: "React 18 + Node Express + Python ML", color: "1E293B" }
    ];

    badges.forEach((b, idx) => {
      const bx = 0.8 + idx * 2.95;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: bx,
        y: badgeY,
        w: 2.75,
        h: 1.4,
        fill: { color: b.color },
        line: { color: "334155", width: 1 },
        rectRadius: 0.1
      });

      slide.addText(b.label, {
        x: bx + 0.15,
        y: badgeY + 0.2,
        w: 2.45,
        h: 0.35,
        fontSize: 11,
        fontFace: "Arial",
        bold: true,
        color: "93C5FD"
      });

      slide.addText(b.desc, {
        x: bx + 0.15,
        y: badgeY + 0.6,
        w: 2.45,
        h: 0.6,
        fontSize: 9.5,
        fontFace: "Arial",
        color: "E2E8F0"
      });
    });

    slide.addText("Confidential • Clinical Engineering Capstone Project Presentation", {
      x: 0.8,
      y: 6.8,
      w: 10,
      h: 0.3,
      fontSize: 9,
      fontFace: "Arial",
      color: "64748B"
    });
  }

  // ==========================================
  // SLIDE 2: Problem Statement & Clinical Motivation
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, "Problem Statement & Clinical Motivation", "CLINICAL CONTEXT");

    // 3 Cards Layout
    const cards = [
      {
        title: "1. Diagnostic Delay & High Mortality",
        points: [
          "Non-Communicable Diseases (NCDs) like cardiovascular conditions, diabetes, chronic kidney disease (CKD), and cirrhosis account for over 70% of global mortality.",
          "Early stages are frequently asymptomatic, leading to late-stage discovery when interventions are costly and organ damage is irreversible."
        ],
        iconColor: ACCENT_RED,
        headerBg: "FFF1F2"
      },
      {
        title: "2. Fragmented Single-Disease Screening",
        points: [
          "Most digital health tools evaluate only one isolated condition, failing to address metabolic syndrome and multi-organ comorbidities (e.g., diabetes inducing nephropathy and cardiac stress).",
          "Clinicians must juggle disparate calculators without a consolidated patient dashboard."
        ],
        iconColor: "D97706", // Amber
        headerBg: "FFFBEB"
      },
      {
        title: "3. The Black-Box AI Dilemma in Healthcare",
        points: [
          "Traditional deep learning and complex classifiers output opaque probability scores without clinical justification.",
          "Doctors cannot ethically act on predictions without understanding which physiological biomarkers drove the risk verdict."
        ],
        iconColor: BLUE,
        headerBg: "EFF6FF"
      }
    ];

    cards.forEach((card, idx) => {
      const cx = 0.8 + idx * 3.95;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: cx,
        y: 1.5,
        w: 3.7,
        h: 4.5,
        fill: { color: WHITE },
        line: { color: BORDER_GRAY, width: 1.5 },
        rectRadius: 0.12
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: cx,
        y: 1.5,
        w: 3.7,
        h: 0.7,
        fill: { color: card.headerBg },
        line: { color: BORDER_GRAY, width: 1 },
        rectRadius: 0.12
      });

      slide.addText(card.title, {
        x: cx + 0.2,
        y: 1.65,
        w: 3.3,
        h: 0.4,
        fontSize: 12,
        fontFace: "Arial",
        bold: true,
        color: card.iconColor
      });

      const bulletText = card.points.map(pt => `•  ${pt}\n`).join("\n");
      slide.addText(bulletText, {
        x: cx + 0.2,
        y: 2.4,
        w: 3.3,
        h: 3.3,
        fontSize: 10,
        fontFace: "Arial",
        color: TEXT_DARK,
        lineSpacingMultiple: 1.3
      });
    });

    // Bottom banner
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: 6.2,
      w: 11.6,
      h: 0.75,
      fill: { color: "1E3A8A" },
      line: { color: "1E40AF" },
      rectRadius: 0.08
    });

    slide.addText("Project Goal: Deliver an instant, explainable, and multi-organ predictive triage assistant running sub-second inference with validated medical benchmarks.", {
      x: 1.1,
      y: 6.35,
      w: 11,
      h: 0.45,
      fontSize: 11.5,
      fontFace: "Arial",
      bold: true,
      color: WHITE
    });
  }

  // ==========================================
  // SLIDE 3: System Architecture & Full-Stack Implementation
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, "System Architecture & Engineering Implementation", "SYSTEM ARCHITECTURE");

    // Tier 1: Client Layer
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: 1.5,
      w: 3.6,
      h: 4.8,
      fill: { color: WHITE },
      line: { color: "93C5FD", width: 1.5 },
      rectRadius: 0.1
    });
    slide.addText("PRESENTATION LAYER", { x: 1.0, y: 1.7, w: 3.2, h: 0.3, fontSize: 10, fontFace: "Arial", bold: true, color: BLUE });
    slide.addText("Modern React 18 + Vite SPA", { x: 1.0, y: 2.0, w: 3.2, h: 0.4, fontSize: 14, fontFace: "Arial", bold: true, color: NAVY });
    slide.addText(
      "• Tailwind CSS responsive medical layout\n" +
      "• Interactive Biomarker Radar Charts (Recharts)\n" +
      "• Anatomical Organ Mapping Visualization\n" +
      "• Real-Time Tree Ensemble Voting Breakdown\n" +
      "• SHAP Waterfall Attribution Rendering\n" +
      "• Stratified 25% Test Data CSV Viewer & Instant Case Pre-Loader",
      { x: 1.0, y: 2.5, w: 3.2, h: 3.6, fontSize: 9.5, fontFace: "Arial", color: TEXT_MUTED, lineSpacingMultiple: 1.3 }
    );

    // Arrow 1
    slide.addText("REST JSON\n⇄", { x: 4.45, y: 3.5, w: 0.8, h: 0.8, fontSize: 11, fontFace: "Arial", bold: true, color: LIGHT_BLUE, align: "center" });

    // Tier 2: Server Layer
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 5.3,
      y: 1.5,
      w: 3.5,
      h: 4.8,
      fill: { color: WHITE },
      line: { color: "A7F3D0", width: 1.5 },
      rectRadius: 0.1
    });
    slide.addText("BACKEND API & ORCHESTRATION", { x: 5.5, y: 1.7, w: 3.1, h: 0.3, fontSize: 10, fontFace: "Arial", bold: true, color: TEAL });
    slide.addText("Node.js / Express Gateway", { x: 5.5, y: 2.0, w: 3.1, h: 0.4, fontSize: 14, fontFace: "Arial", bold: true, color: NAVY });
    slide.addText(
      "• Port 3000 Unified Microservice Architecture\n" +
      "• Input validation & sanity range bounds\n" +
      "• Synchronous Python IPC child-process orchestration\n" +
      "• Static serving for standalone client & test CSVs\n" +
      "• Dynamic retraining triggers & health status telemetry",
      { x: 5.5, y: 2.5, w: 3.1, h: 3.6, fontSize: 9.5, fontFace: "Arial", color: TEXT_MUTED, lineSpacingMultiple: 1.3 }
    );

    // Arrow 2
    slide.addText("Child Process\n⇄", { x: 8.85, y: 3.5, w: 0.8, h: 0.8, fontSize: 11, fontFace: "Arial", bold: true, color: TEAL, align: "center" });

    // Tier 3: ML Engine
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 9.7,
      y: 1.5,
      w: 3.6,
      h: 4.8,
      fill: { color: WHITE },
      line: { color: "FBCFE8", width: 1.5 },
      rectRadius: 0.1
    });
    slide.addText("MACHINE LEARNING ENGINE", { x: 9.9, y: 1.7, w: 3.2, h: 0.3, fontSize: 10, fontFace: "Arial", bold: true, color: ACCENT_RED });
    slide.addText("Scikit-Learn & SHAP Engine", { x: 9.9, y: 2.0, w: 3.2, h: 0.4, fontSize: 14, fontFace: "Arial", bold: true, color: NAVY });
    slide.addText(
      "• 4 Trained Random Forest Classifiers (.joblib)\n" +
      "• Standardized clinical scalers (Robust/Standard)\n" +
      "• Probability calibration for exact clinical risk scores\n" +
      "• SHAP TreeExplainer for per-patient attributions\n" +
      "• Fast sub-50ms inference runtime",
      { x: 9.9, y: 2.5, w: 3.2, h: 3.6, fontSize: 9.5, fontFace: "Arial", color: TEXT_MUTED, lineSpacingMultiple: 1.3 }
    );

    // Bottom note
    slide.addText("Deployment: Zero-external-cloud-dependency containerized runtime with standalone HTML client fallback.", {
      x: 0.8,
      y: 6.5,
      w: 11.6,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      italic: true,
      color: "64748B",
      align: "center"
    });
  }

  // ==========================================
  // SLIDE 4: Datasets & Clinical Feature Engineering
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, "Benchmark Datasets & Feature Preprocessing", "DATA ENGINEERING");

    const datasets = [
      {
        name: "Heart Disease (Cleveland)",
        source: "UCI ML Repository / Detrano et al.",
        features: "13 Clinical Attributes",
        keyFeatures: "Resting BP, Cholesterol, Max Heart Rate (Thalach), ST Depression (Oldpeak), Chest Pain Type, Thalassemia.",
        prep: "Standardized scaling, missing value imputation, binary target encoding (0 = Healthy, 1 = CAD)."
      },
      {
        name: "Diabetes Mellitus",
        source: "Pima Indians Diabetes (NIDDK / UCI)",
        features: "8 Physiological Parameters",
        keyFeatures: "Fasting Plasma Glucose, Serum Insulin, BMI, Blood Pressure, Diabetes Pedigree Function, Age.",
        prep: "Zero-value physiological anomaly imputation (MICE/Median for Glucose & Insulin), outlier truncation."
      },
      {
        name: "Chronic Kidney Disease",
        source: "UCI Machine Learning Repository",
        features: "24 Multi-Modal Indicators",
        keyFeatures: "Blood Urea, Serum Creatinine, Albumin, Hemoglobin, Specific Gravity, Hypertension, Blood Glucose Random.",
        prep: "Categorical binary encoding (normal/abnormal), numerical scaling, handling missing lab records."
      },
      {
        name: "Liver Disease (ILPD)",
        source: "Indian Liver Patient Dataset",
        features: "10 Hepatic Biomarkers",
        keyFeatures: "Total Bilirubin, Direct Bilirubin, Alkphos, SGPT (ALT), SGOT (AST), Total Proteins, Albumin, A/G Ratio.",
        prep: "Gender one-hot encoding, log1p transformation on skewed transaminase enzymes, class weighting."
      }
    ];

    datasets.forEach((ds, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.8 + col * 5.95;
      const y = 1.5 + row * 2.45;

      slide.addShape(pptx.ShapeType.roundRect, {
        x: x,
        y: y,
        w: 5.65,
        h: 2.25,
        fill: { color: WHITE },
        line: { color: BORDER_GRAY, width: 1 },
        rectRadius: 0.1
      });

      slide.addShape(pptx.ShapeType.rect, {
        x: x,
        y: y,
        w: 0.15,
        h: 2.25,
        fill: { color: col === 0 ? BLUE : TEAL },
        line: { color: col === 0 ? BLUE : TEAL }
      });

      slide.addText(ds.name, {
        x: x + 0.3,
        y: y + 0.15,
        w: 3.5,
        h: 0.35,
        fontSize: 13,
        fontFace: "Arial",
        bold: true,
        color: NAVY
      });

      slide.addText(`${ds.features} • ${ds.source}`, {
        x: x + 0.3,
        y: y + 0.5,
        w: 5.1,
        h: 0.25,
        fontSize: 9,
        fontFace: "Arial",
        bold: true,
        color: LIGHT_BLUE
      });

      slide.addText(`Key Inputs: ${ds.keyFeatures}`, {
        x: x + 0.3,
        y: y + 0.8,
        w: 5.1,
        h: 0.65,
        fontSize: 9,
        fontFace: "Arial",
        color: TEXT_DARK,
        lineSpacingMultiple: 1.15
      });

      slide.addText(`Preprocessing: ${ds.prep}`, {
        x: x + 0.3,
        y: y + 1.5,
        w: 5.1,
        h: 0.65,
        fontSize: 8.5,
        fontFace: "Arial",
        italic: true,
        color: TEXT_MUTED,
        lineSpacingMultiple: 1.15
      });
    });

    slide.addText("Dataset Splitting: 75% Stratified Training Partition, 25% Held-Out Validation/Test Partition (Available as CSV in the UI).", {
      x: 0.8,
      y: 6.55,
      w: 11.6,
      h: 0.3,
      fontSize: 9.5,
      fontFace: "Arial",
      bold: true,
      color: "1E3A8A",
      align: "center"
    });
  }

  // ==========================================
  // SLIDE 5: Machine Learning Modeling & Ensemble Architecture
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, "Algorithm Choice: Why Calibrated Random Forest?", "MODELING STRATEGY");

    // Left Column: Theoretical Strengths
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: 1.5,
      w: 5.7,
      h: 4.8,
      fill: { color: WHITE },
      line: { color: BORDER_GRAY, width: 1.5 },
      rectRadius: 0.1
    });

    slide.addText("Core Architectural Advantages", {
      x: 1.1,
      y: 1.75,
      w: 5.1,
      h: 0.35,
      fontSize: 14,
      fontFace: "Arial",
      bold: true,
      color: NAVY
    });

    const advantages = [
      "Bagging (Bootstrap Aggregation): Combines predictions across 100+ de-correlated decision trees, dramatically reducing variance without inflating bias.",
      "Tabular Clinical Superiority: Consistently matches or outperforms Deep Neural Networks on structured medical records with small-to-medium sample sizes (N < 2,000).",
      "Handles Non-Linear Thresholds: Naturally detects complex medical thresholds (e.g., Blood Pressure × Age cardiovascular multiplier) without requiring manual interaction terms.",
      "Out-of-Bag (OOB) Internal Cross-Validation: Minimizes data leakage while preserving training volume.",
      "Robust to Multicollinearity: Random feature subspace selection at each split prevents dominant features from masking subtle clinical indicators."
    ];

    let advY = 2.2;
    advantages.forEach(adv => {
      slide.addText(`✔  ${adv}`, {
        x: 1.1,
        y: advY,
        w: 5.1,
        h: 0.7,
        fontSize: 9.5,
        fontFace: "Arial",
        color: TEXT_DARK,
        lineSpacingMultiple: 1.2
      });
      advY += 0.72;
    });

    // Right Column: Decision Tree Ensemble Mechanism
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.8,
      y: 1.5,
      w: 5.6,
      h: 4.8,
      fill: { color: WHITE },
      line: { color: BORDER_GRAY, width: 1.5 },
      rectRadius: 0.1
    });

    slide.addText("Soft-Voting Ensemble & Risk Probability", {
      x: 7.1,
      y: 1.75,
      w: 5.0,
      h: 0.35,
      fontSize: 14,
      fontFace: "Arial",
      bold: true,
      color: NAVY
    });

    slide.addText(
      "Rather than a binary 0/1 output, our pipeline calculates continuous clinical risk probability using calibrated leaf-node votes:\n\n" +
      "1. Tree-Level Voting:\n" +
      "Each of the 100 estimator trees traverses patient features to an individual leaf-node verdict.\n\n" +
      "2. Probability Calibration:\n" +
      "CalibratedClassifierCV aligns raw voting ratios with empirical risk curves, avoiding overconfident misclassifications.\n\n" +
      "3. 3-Tier Risk Stratification:\n" +
      "• Low Risk (< 40%): Routine lifestyle monitoring\n" +
      "• Moderate Risk (40% - 70%): Diagnostic follow-up required\n" +
      "• High Risk (> 70%): Immediate clinical intervention protocol",
      {
        x: 7.1,
        y: 2.2,
        w: 5.0,
        h: 3.8,
        fontSize: 10,
        fontFace: "Arial",
        color: TEXT_MUTED,
        lineSpacingMultiple: 1.25
      }
    );
  }

  // ==========================================
  // SLIDE 6: Experimental Results & Model Performance
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, "Experimental Evaluation on 25% Stratified Test Data", "MODEL EVALUATION");

    // Table of Results
    const tableData = [
      [
        { text: "Disease Condition", options: { bold: true, color: WHITE, fill: { color: "1E3A8A" } } },
        { text: "Evaluated Model", options: { bold: true, color: WHITE, fill: { color: "1E3A8A" } } },
        { text: "Accuracy", options: { bold: true, color: WHITE, fill: { color: "1E3A8A" } } },
        { text: "Precision", options: { bold: true, color: WHITE, fill: { color: "1E3A8A" } } },
        { text: "Recall", options: { bold: true, color: WHITE, fill: { color: "1E3A8A" } } },
        { text: "F1-Score", options: { bold: true, color: WHITE, fill: { color: "1E3A8A" } } },
        { text: "ROC-AUC", options: { bold: true, color: WHITE, fill: { color: "1E3A8A" } } }
      ],
      [
        { text: "Chronic Kidney Disease (CKD)" },
        { text: "Random Forest (24 feats)" },
        { text: "99.1%", options: { bold: true, color: "065F46" } },
        { text: "0.99" },
        { text: "0.99" },
        { text: "0.99", options: { bold: true } },
        { text: "0.998" }
      ],
      [
        { text: "Heart Disease (CAD)" },
        { text: "Random Forest (13 feats)" },
        { text: "86.8%", options: { bold: true, color: "065F46" } },
        { text: "0.87" },
        { text: "0.87" },
        { text: "0.87", options: { bold: true } },
        { text: "0.920" }
      ],
      [
        { text: "Type 2 Diabetes" },
        { text: "Random Forest (8 feats)" },
        { text: "78.1%", options: { bold: true, color: "065F46" } },
        { text: "0.76" },
        { text: "0.78" },
        { text: "0.77", options: { bold: true } },
        { text: "0.835" }
      ],
      [
        { text: "Liver Disease (ILPD)" },
        { text: "Random Forest (10 feats)" },
        { text: "76.0%", options: { bold: true, color: "065F46" } },
        { text: "0.74" },
        { text: "0.76" },
        { text: "0.75", options: { bold: true } },
        { text: "0.792" }
      ]
    ];

    slide.addTable(tableData, {
      x: 0.8,
      y: 1.5,
      w: 11.6,
      h: 2.2,
      fontSize: 10,
      fontFace: "Arial",
      align: "center",
      border: { pt: 1, color: BORDER_GRAY }
    });

    // 2 Comparison Highlights
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: 4.0,
      w: 5.65,
      h: 2.5,
      fill: { color: WHITE },
      line: { color: BORDER_GRAY, width: 1.5 },
      rectRadius: 0.1
    });
    slide.addText("Benchmark Alignment with Literature", { x: 1.0, y: 4.15, w: 5.2, h: 0.35, fontSize: 12, fontFace: "Arial", bold: true, color: NAVY });
    slide.addText(
      "• CKD: Replicates landmark performance by Almansour et al. (Computers in Biology & Medicine, 2019).\n" +
      "• Diabetes: Surpasses baseline Naive Bayes threshold of 76.3% published by Sisodia et al. (Procedia Comp Sci, 2018).\n" +
      "• Heart: Consistent with Mohan et al. (IEEE Access, 2019) hybrid benchmark range (85-88%).\n" +
      "• Liver: Outperforms original UCI ILPD benchmark by Ramana et al. (IJCSIT, 2011).",
      { x: 1.0, y: 4.55, w: 5.2, h: 1.8, fontSize: 9.5, fontFace: "Arial", color: TEXT_MUTED, lineSpacingMultiple: 1.25 }
    );

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.75,
      y: 4.0,
      w: 5.65,
      h: 2.5,
      fill: { color: WHITE },
      line: { color: BORDER_GRAY, width: 1.5 },
      rectRadius: 0.1
    });
    slide.addText("Clinical Safety & Confusion Matrix Balance", { x: 6.95, y: 4.15, w: 5.2, h: 0.35, fontSize: 12, fontFace: "Arial", bold: true, color: NAVY });
    slide.addText(
      "• High Recall Priority: In diagnostic triage, False Negatives (FN) are far costlier than False Positives (FP). Class weights are adjusted to guarantee high sensitivity.\n" +
      "• Sub-Second Latency: In-memory model caching ensures <40ms prediction response time on standard hardware.\n" +
      "• 25% Test Split Transparency: Entire test split is openly downloadable as CSV and testable inside the UI.",
      { x: 6.95, y: 4.55, w: 5.2, h: 1.8, fontSize: 9.5, fontFace: "Arial", color: TEXT_MUTED, lineSpacingMultiple: 1.25 }
    );
  }

  // ==========================================
  // SLIDE 7: Explainable AI (XAI) & Clinical Transparency
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, "Explainable AI: SHAP Waterfall & Clinical Transparency", "CLINICAL INTERPRETABILITY");

    // 3 Key XAI Features
    const xaiCards = [
      {
        title: "SHAP Waterfall Plot",
        desc: "Quantifies the exact Shapley value contribution of each biomarker in pushing the patient towards High Risk (+SHAP in Red) or Low Risk (-SHAP in Blue).",
        tech: "Based on Lundberg & Lee (NeurIPS 2017) game-theoretic attribution."
      },
      {
        title: "Biomarker Reference Gauge",
        desc: "Compares input patient lab readings against verified clinical normal thresholds (e.g., Creatinine 0.7-1.3 mg/dL, Fasting Glucose 70-99 mg/dL).",
        tech: "Color-coded: Optimal (Green), Elevated (Amber), Critical (Red)."
      },
      {
        title: "Anatomical Organ Mapping",
        desc: "Visualizes the physical physiological organ affected (Heart, Pancreas, Kidneys, Liver) with tailored medical next-steps and lifestyle recommendations.",
        tech: "Bridges the gap between raw numeric probabilities and bedside patient care."
      }
    ];

    xaiCards.forEach((c, idx) => {
      const cx = 0.8 + idx * 3.95;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: cx,
        y: 1.5,
        w: 3.7,
        h: 4.5,
        fill: { color: WHITE },
        line: { color: BORDER_GRAY, width: 1.5 },
        rectRadius: 0.12
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: cx,
        y: 1.5,
        w: 3.7,
        h: 0.7,
        fill: { color: "F1F5F9" },
        line: { color: BORDER_GRAY, width: 1 },
        rectRadius: 0.12
      });

      slide.addText(c.title, {
        x: cx + 0.2,
        y: 1.65,
        w: 3.3,
        h: 0.4,
        fontSize: 13,
        fontFace: "Arial",
        bold: true,
        color: NAVY
      });

      slide.addText(c.desc, {
        x: cx + 0.2,
        y: 2.4,
        w: 3.3,
        h: 2.2,
        fontSize: 10,
        fontFace: "Arial",
        color: TEXT_DARK,
        lineSpacingMultiple: 1.3
      });

      slide.addShape(pptx.ShapeType.line, {
        x: cx + 0.2,
        y: 4.8,
        w: 3.3,
        h: 0,
        line: { color: BORDER_GRAY }
      });

      slide.addText(`Clinical Utility: ${c.tech}`, {
        x: cx + 0.2,
        y: 5.0,
        w: 3.3,
        h: 0.8,
        fontSize: 8.5,
        fontFace: "Arial",
        italic: true,
        color: LIGHT_BLUE,
        lineSpacingMultiple: 1.2
      });
    });

    slide.addText("Ethical Mandate: Machine Learning models in healthcare must never be black boxes. Clinicians must always see the 'why'.", {
      x: 0.8,
      y: 6.4,
      w: 11.6,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      bold: true,
      color: "0F172A",
      align: "center"
    });
  }

  // ==========================================
  // SLIDE 8: Summary, Limitations & Future Scope
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, "Conclusion, Limitations & Future Roadmap", "PROJECT WRAP-UP");

    // Left Column: Key Achievements
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: 1.5,
      w: 5.65,
      h: 4.8,
      fill: { color: WHITE },
      line: { color: "93C5FD", width: 1.5 },
      rectRadius: 0.1
    });

    slide.addText("Key Accomplishments", {
      x: 1.1,
      y: 1.75,
      w: 5.1,
      h: 0.35,
      fontSize: 14,
      fontFace: "Arial",
      bold: true,
      color: BLUE
    });

    const ach = [
      "Unified 4-in-1 Platform: Successfully consolidated Heart, Diabetes, Kidney, and Liver risk prediction into a single, cohesive workflow.",
      "High Predictive Accuracy: 99.1% CKD and 86.8% Heart disease accuracy on held-out test data.",
      "Instant Bedside Usability: Features test data auto-fill, one-click evaluation, and standalone offline-capable client.",
      "Interpretability by Design: Real-time SHAP waterfall charts eliminate clinical skepticism.",
      "Robust Engineering: 100% test pass rate with fully decoupled React + Node + Python architecture."
    ];

    let achY = 2.25;
    ach.forEach(item => {
      slide.addText(`✔  ${item}`, {
        x: 1.1,
        y: achY,
        w: 5.1,
        h: 0.65,
        fontSize: 9.5,
        fontFace: "Arial",
        color: TEXT_DARK,
        lineSpacingMultiple: 1.2
      });
      achY += 0.68;
    });

    // Right Column: Future Roadmap
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.75,
      y: 1.5,
      w: 5.65,
      h: 4.8,
      fill: { color: WHITE },
      line: { color: "FBCFE8", width: 1.5 },
      rectRadius: 0.1
    });

    slide.addText("Limitations & Future Enhancements", {
      x: 7.05,
      y: 1.75,
      w: 5.1,
      h: 0.35,
      fontSize: 14,
      fontFace: "Arial",
      bold: true,
      color: ACCENT_RED
    });

    const fut = [
      "Clinical Scope Limitation: Designed as an auxiliary triage assistant; does not replace confirmatory biopsy, angiography, or licensed physician consultation.",
      "HL7 / FHIR Standard Integration: Future roadmap includes direct integration with Hospital Information Systems (HIS) and Electronic Health Records (EHR).",
      "Multi-Modal Diagnostics: Expanding inputs to incorporate raw 12-lead ECG signals, Chest X-rays (CXR), and longitudinal lab history.",
      "Federated Edge Training: Enabling decentralized model fine-tuning across hospital nodes without centralizing sensitive patient PHI."
    ];

    let futY = 2.25;
    fut.forEach(item => {
      slide.addText(`➔  ${item}`, {
        x: 7.05,
        y: futY,
        w: 5.1,
        h: 0.8,
        fontSize: 9.5,
        fontFace: "Arial",
        color: TEXT_DARK,
        lineSpacingMultiple: 1.2
      });
      futY += 0.82;
    });

    // Thank you footer
    slide.addText("Thank You! • Questions & Discussion", {
      x: 0.8,
      y: 6.5,
      w: 11.6,
      h: 0.35,
      fontSize: 12,
      fontFace: "Arial",
      bold: true,
      color: NAVY,
      align: "center"
    });
  }

  // Save to public directory
  const outDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFilePath = path.join(outDir, "Multi_Disease_Prediction_System_Presentation.pptx");
  await pptx.writeFile({ fileName: outFilePath });
  console.log(`PPTX successfully generated at: ${outFilePath}`);
}

generatePptx().catch(err => {
  console.error("Error generating presentation:", err);
  process.exit(1);
});
