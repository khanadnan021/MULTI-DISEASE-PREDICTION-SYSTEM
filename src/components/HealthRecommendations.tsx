import React, { useState } from 'react';
import { DiseaseKey, PredictionResult } from '../types';
import {
  Stethoscope,
  Apple,
  Dumbbell,
  AlertOctagon,
  ShieldCheck,
  Printer,
  ChevronRight,
  Pill,
  HeartPulse,
  Info
} from 'lucide-react';

interface HealthRecommendationsProps {
  disease: DiseaseKey;
  result: PredictionResult;
}

export const HealthRecommendations: React.FC<HealthRecommendationsProps> = ({
  disease,
  result
}) => {
  const [activeCategory, setActiveCategory] = useState<'medical' | 'diet' | 'lifestyle' | 'emergency'>('medical');
  const isPositive = result.is_positive;
  const isHighRisk = result.risk_level === 'High Risk';

  const handlePrint = () => {
    window.print();
  };

  const getDiseaseContent = () => {
    switch (disease) {
      case 'heart':
        return {
          specialist: 'Cardiologist (Heart Specialist)',
          tests: [
            '12-Lead Electrocardiogram (ECG / EKG) & Echocardiogram (2D Echo)',
            'Treadmill Stress Test (TMT) / Nuclear Myocardial Perfusion Scan',
            'Coronary CT Angiography (CCTA) or Cardiac Catheterization',
            'Comprehensive Lipid Profile (Total, LDL-C, HDL-C, Triglycerides, ApoB)'
          ],
          questions: [
            'Based on my ST depression and cholesterol, is further coronary imaging recommended?',
            'What is my optimal target LDL-C level (<70 mg/dL or <55 mg/dL)?',
            'Do I require statin therapy or antiplatelet cardioprotection?'
          ],
          dietDos: [
            'Follow the Mediterranean or DASH diet rich in leafy greens, berries, and legumes',
            'Incorporate Omega-3 fatty acids from walnuts, flaxseeds, or oily fish',
            'Use extra virgin olive oil as the primary cooking fat'
          ],
          dietDonts: [
            'Restrict dietary sodium strictly to < 1,500 - 2,000 mg/day (cut canned/processed soups)',
            'Avoid saturated fats and industrial trans-fats (fried street food, palm oil, heavy pastries)',
            'Avoid excessive caffeine and energy drinks that elevate resting heart rate'
          ],
          exerciseGuidance: isPositive
            ? 'Engage in low-impact supervised cardiac walking (20-30 mins/day). Avoid heavy isometric weight lifting until medically cleared by your cardiologist.'
            : 'Aim for at least 150 minutes of moderate-intensity aerobic exercise per week (brisk walking, cycling, swimming) plus 2 days of strength training.',
          emergencySigns: [
            'Sudden crushing or squeezing chest pressure or pain radiating to left arm, neck, or jaw',
            'Sudden shortness of breath accompanied by cold sweats or lightheadedness',
            'Rapid or irregular heart flutter lasting more than a few minutes with dizziness'
          ]
        };

      case 'diabetes':
        return {
          specialist: 'Endocrinologist / Diabetologist',
          tests: [
            'Glycated Hemoglobin (HbA1c test) to evaluate 3-month average glucose',
            'Fasting Plasma Glucose (FPG) and 2-hour Oral Glucose Tolerance Test (OGTT)',
            'Urine Albumin-to-Creatinine Ratio (UACR) for microalbuminuria check',
            'Dilated Eye Fundus Examination (Diabetic Retinopathy screening)'
          ],
          questions: [
            'Does my clinical profile represent pre-diabetes or overt Type 2 Diabetes?',
            'What is my personalized target fasting glucose range?',
            'Should I begin continuous glucose monitoring (CGM) or metformin therapy?'
          ],
          dietDos: [
            'Prioritize low glycemic index (GI) carbohydrates: steel-cut oats, quinoa, lentils, sprouted beans',
            'Fill 50% of your plate with non-starchy vegetables (spinach, broccoli, cucumbers)',
            'Incorporate lean proteins (tofu, eggs, grilled fish, paneer) to blunt post-meal sugar spikes'
          ],
          dietDonts: [
            'Eliminate sugar-sweetened beverages, commercial fruit juices, and sodas',
            'Limit refined white flour (maida), white rice, and ultra-processed baked goods',
            'Avoid skipping meals as this triggers rebound hyperglycemia and insulin spikes'
          ],
          exerciseGuidance: isPositive
            ? 'Take a brisk 15-minute walk immediately after major meals to activate muscle glucose uptake (GLUT-4 transporters). Include progressive resistance training.'
            : 'Maintain active metabolic conditioning: 150-300 mins weekly of moderate physical activity, avoiding prolonged sedentary sitting periods.',
          emergencySigns: [
            'Fruity-smelling breath, extreme thirst, confusion, and nausea (Ketoacidosis warning)',
            'Shakiness, severe cold sweating, disorientation, or fainting (Hypoglycemia < 60 mg/dL)',
            'Non-healing sores, blisters, or loss of sensation in the feet'
          ]
        };

      case 'kidney':
        return {
          specialist: 'Nephrologist (Kidney Specialist)',
          tests: [
            'Estimated Glomerular Filtration Rate (eGFR calculation via Serum Creatinine)',
            '24-Hour Urine Protein / Albumin Excretion and Spot Urine Dipstick',
            'Renal Ultrasound (KUB - Kidney, Ureter, Bladder morphology)',
            'Serum Electrolytes (Potassium, Sodium, Calcium, Phosphorus)'
          ],
          questions: [
            'What Chronic Kidney Disease (CKD) stage do my creatinine and protein levels indicate?',
            'Are any of my current medications nephrotoxic (e.g. NSAID painkillers)?',
            'Should I be started on ACE inhibitors or SGLT2 inhibitors for renal preservation?'
          ],
          dietDos: [
            'Maintain disciplined daily hydration (consult doctor for precise volume allowance)',
            'Switch to a controlled plant-dominant low-protein diet to decrease glomerular hyperfiltration',
            'Opt for fresh homemade meals with natural herbs instead of commercial seasoning blends'
          ],
          dietDonts: [
            'Strictly eliminate over-the-counter NSAID pain killers (Ibuprofen, Diclofenac, Naproxen)',
            'Limit high-potassium foods if directed by nephrologist (bananas, potatoes, dried fruits)',
            'Restrict dietary phosphorus (colaborative sodas, processed cheese, organ meats)'
          ],
          exerciseGuidance: isPositive
            ? 'Gentle aerobic exercise like casual walking, stationary cycling, or water aerobics. Avoid strenuous dehydrating heat workouts.'
            : 'Regular cardiovascular exercise helps regulate systemic blood pressure, the #1 safeguard for preserving kidney microvasculature.',
          emergencySigns: [
            'Sudden severe swelling in the ankles, feet, or periorbital area around eyes (fluid overload)',
            'Significant drop in 24-hour urine output or dark foamy tea-colored urine',
            'Severe shortness of breath when lying flat, persistent nausea, and metallic taste'
          ]
        };

      case 'liver':
        return {
          specialist: 'Hepatologist / Gastroenterologist',
          tests: [
            'Comprehensive Liver Function Test (LFT: ALT, AST, Alkaline Phosphatase, Bilirubin)',
            'Abdominal Ultrasound / Transient Elastography (FibroScan) to assess liver stiffness',
            'Viral Hepatitis Serology Panel (HBsAg, Anti-HCV)',
            'Serum Ferritin and Fasting Lipid Profile'
          ],
          questions: [
            'Does my elevated enzyme profile point to Non-Alcoholic Fatty Liver (NAFLD) or acute inflammation?',
            'What is the degree of hepatic fibrosis or steatosis?',
            'Are any supplements or hepatoprotective antioxidants indicated?'
          ],
          dietDos: [
            'Adopt a liver-protective Mediterranean diet rich in antioxidants (cruciferous vegetables, green tea)',
            'Moderate black coffee consumption (clinically shown to reduce liver enzyme elevation)',
            'Eat high-fiber foods that bind excess bile acids in the intestine'
          ],
          dietDonts: [
            'Completely abstain from all alcoholic beverages (beer, wine, spirits)',
            'Eliminate high-fructose corn syrup (HFCS), sugary sodas, and packaged confectionery',
            'Avoid unverified herbal concoctions or unprescribed paracetamol overdoses'
          ],
          exerciseGuidance: isPositive
            ? 'Gradual weight loss (5-7% of total body weight over 6 months) through daily 30-minute brisk walking has been clinically proven to reverse hepatic fat deposition.'
            : 'Sustained weekly moderate exercise supports metabolic liver clearance and insulin sensitivity.',
          emergencySigns: [
            'Noticeable yellowing of the sclera (eyes) or skin (acute jaundice)',
            'Swelling of the abdomen (ascites) or confusion and memory lapses (hepatic encephalopathy)',
            'Black tarry stools or vomiting blood'
          ]
        };
    }
  };

  const content = getDiseaseContent();

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
      {/* Header bar */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-slate-800 text-white shrink-0 border border-slate-700">
            <HeartPulse className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Clinical Care Plan & Evidence-Based Guidance
            </h3>
            <p className="text-xs text-slate-300">
              {isPositive
                ? 'Actionable medical roadmap and protective lifestyle adjustments based on positive findings'
                : 'Preventive wellness regimen to maintain baseline health and prevent future disease progression'}
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="self-start sm:self-center flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export Plan</span>
        </button>
      </div>

      {/* Category Navigation Tabs */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-4 sm:px-5 flex overflow-x-auto space-x-2 py-2">
        <button
          onClick={() => setActiveCategory('medical')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === 'medical'
              ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Stethoscope className="w-4 h-4 text-blue-600" />
          <span>Medical Next Steps</span>
        </button>

        <button
          onClick={() => setActiveCategory('diet')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === 'diet'
              ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Apple className="w-4 h-4 text-emerald-600" />
          <span>Dietary Regimen</span>
        </button>

        <button
          onClick={() => setActiveCategory('lifestyle')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === 'lifestyle'
              ? 'bg-white text-violet-700 shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Dumbbell className="w-4 h-4 text-violet-600" />
          <span>Exercise & Habits</span>
        </button>

        <button
          onClick={() => setActiveCategory('emergency')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === 'emergency'
              ? 'bg-white text-rose-700 shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertOctagon className="w-4 h-4 text-rose-600" />
          <span>Red Flag Warnings</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-5 sm:p-6">
        {activeCategory === 'medical' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  Recommended Specialist
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  {content.specialist}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {isPositive
                    ? 'Schedule a formal clinical consultation for confirmatory diagnostics and treatment planning.'
                    : 'Maintain routine annual preventive health visits with your primary healthcare provider.'}
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-semibold shadow-2xs">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Consult Physician</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Confirmatory Tests to Request */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Pill className="w-3.5 h-3.5 text-blue-600" />
                  <span>Confirmatory Clinical Tests</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {content.tests.map((test, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span>{test}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Questions to Ask Doctor */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Questions for Your Consultation</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {content.questions.map((q, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="italic">"{q}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'diet' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Foods to Adopt */}
            <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50/40 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Recommended Nutritional Choices (Do's)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {content.dietDos.map((item, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                    <span className="leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Foods to Avoid */}
            <div className="p-4 rounded-lg border border-rose-200 bg-rose-50/40 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>Dietary Restrictions (Don'ts)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {content.dietDonts.map((item, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                    <span className="leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeCategory === 'lifestyle' && (
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Dumbbell className="w-4 h-4 text-violet-600" />
              <span>Physical Activity & Lifestyle Regimen</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {content.exerciseGuidance}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                <p className="font-bold text-slate-800">Sleep Hygiene</p>
                <p className="text-slate-500 text-[11px] mt-1">
                  Aim for 7-8 hours of continuous restorative sleep to regulate cortisol and inflammatory markers.
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                <p className="font-bold text-slate-800">Daily Hydration</p>
                <p className="text-slate-500 text-[11px] mt-1">
                  Drink 2.0 to 2.5 liters of water daily unless on nephrological fluid restriction.
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                <p className="font-bold text-slate-800">Stress Reduction</p>
                <p className="text-slate-500 text-[11px] mt-1">
                  Practice 10 minutes of diaphragmatic breathing or meditation to decrease sympathetic vascular tone.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'emergency' && (
          <div className="p-4 rounded-lg border border-rose-200 bg-rose-50/60 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>Critical Emergency Warning Signs (Seek Immediate ER Attention)</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              If you or the patient experience any of the following acute symptoms, do not delay—contact emergency services or go to the nearest emergency department immediately:
            </p>
            <ul className="space-y-2 text-xs text-slate-800">
              {content.emergencySigns.map((sign, i) => (
                <li key={i} className="flex items-start space-x-2.5 p-2 rounded bg-white border border-rose-200 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0 mt-1"></span>
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Clinical Disclaimer footer */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="italic">
          * Note: This AI clinical care plan is an educational decision-support aid based on standard clinical guidelines and is not a substitute for formal medical diagnosis.
        </span>
      </div>
    </div>
  );
};
