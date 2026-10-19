"""
Generate Test Input Files for Multi Disease Prediction System
- 5 Lab Report PDFs (Heart, Diabetes, Kidney, Liver, Stroke)
- 4 CT Scan Images (Chest, Abdomen, Brain, Kidney)
- 4 ECG Strip Images (Normal, Tachycardia, Bradycardia, ST-Depression)
"""

import os
import math
import random

# ─────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(BASE_DIR, "public", "test_inputs")
PDF_DIR = os.path.join(OUT_DIR, "lab_reports")
CT_DIR  = os.path.join(OUT_DIR, "ct_scans")
ECG_DIR = os.path.join(OUT_DIR, "ecg_strips")

for d in [PDF_DIR, CT_DIR, ECG_DIR]:
    os.makedirs(d, exist_ok=True)

# ─────────────────────────────────────────────
# 1. PDF LAB REPORTS  (reportlab)
# ─────────────────────────────────────────────
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

W, H = A4

def make_pdf(filename, patient, disease_title, rows, risk_note, ref_note):
    path = os.path.join(PDF_DIR, filename)
    doc  = SimpleDocTemplate(path, pagesize=A4,
                             leftMargin=1.8*cm, rightMargin=1.8*cm,
                             topMargin=1.5*cm, bottomMargin=1.5*cm)
    styles = getSampleStyleSheet()

    # Custom styles
    TEAL = colors.HexColor("#0e7490")
    RED  = colors.HexColor("#dc2626")
    GRY  = colors.HexColor("#6b7280")
    BG   = colors.HexColor("#f0fdfa")

    title_style = ParagraphStyle("Title", parent=styles["Title"],
                                 fontSize=18, textColor=TEAL, spaceAfter=4,
                                 alignment=TA_CENTER)
    sub_style   = ParagraphStyle("Sub", parent=styles["Normal"],
                                 fontSize=10, textColor=GRY, alignment=TA_CENTER)
    hdr_style   = ParagraphStyle("Hdr", parent=styles["Normal"],
                                 fontSize=12, textColor=TEAL,
                                 fontName="Helvetica-Bold", spaceBefore=12, spaceAfter=4)
    note_style  = ParagraphStyle("Note", parent=styles["Normal"],
                                 fontSize=8.5, textColor=GRY, spaceAfter=6)
    risk_style  = ParagraphStyle("Risk", parent=styles["Normal"],
                                 fontSize=10, textColor=RED,
                                 fontName="Helvetica-Bold", spaceBefore=8)

    story = []

    # Header
    story.append(Paragraph("🏥  BioMed Diagnostics Laboratory", title_style))
    story.append(Paragraph("NABL Accredited | ISO 15189:2012 Certified", sub_style))
    story.append(Spacer(1, 0.3*cm))
    story.append(HRFlowable(width="100%", thickness=2, color=TEAL))
    story.append(Spacer(1, 0.3*cm))

    # Patient info table
    info_data = [
        ["Patient Name:", patient["name"],  "Report ID:",  patient["report_id"]],
        ["Age / Gender:", f"{patient['age']} yrs / {patient['gender']}",
         "Date:",         patient["date"]],
        ["Doctor Ref.:",  patient["doctor"], "Department:", disease_title],
    ]
    info_tbl = Table(info_data, colWidths=[3.5*cm, 6*cm, 3*cm, 5*cm])
    info_tbl.setStyle(TableStyle([
        ("FONTNAME",    (0,0),(-1,-1), "Helvetica"),
        ("FONTNAME",    (0,0),(0,-1),  "Helvetica-Bold"),
        ("FONTNAME",    (2,0),(2,-1),  "Helvetica-Bold"),
        ("FONTSIZE",    (0,0),(-1,-1), 9),
        ("TEXTCOLOR",   (0,0),(0,-1),  TEAL),
        ("TEXTCOLOR",   (2,0),(2,-1),  TEAL),
        ("BOTTOMPADDING",(0,0),(-1,-1), 4),
    ]))
    story.append(info_tbl)
    story.append(Spacer(1, 0.3*cm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.lightgrey))
    story.append(Spacer(1, 0.2*cm))

    # Test title
    story.append(Paragraph(f"📋  {disease_title} — Diagnostic Report", hdr_style))

    # Results table
    tbl_data = [["Parameter", "Value", "Unit", "Reference Range", "Status"]]
    for r in rows:
        flag = "⚠️ HIGH" if r[4] == "H" else ("⬇ LOW" if r[4] == "L" else "✓ Normal")
        flag_color = colors.red if r[4] in ("H","L") else colors.green
        tbl_data.append([r[0], r[1], r[2], r[3], flag])

    col_w = [5.8*cm, 2.5*cm, 2*cm, 4.5*cm, 2.5*cm]
    result_tbl = Table(tbl_data, colWidths=col_w)
    result_tbl.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,0),  TEAL),
        ("TEXTCOLOR",    (0,0),(-1,0),  colors.white),
        ("FONTNAME",     (0,0),(-1,0),  "Helvetica-Bold"),
        ("FONTSIZE",     (0,0),(-1,-1), 9),
        ("ALIGN",        (0,0),(-1,-1), "CENTER"),
        ("ALIGN",        (0,1),(0,-1),  "LEFT"),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[BG, colors.white]),
        ("GRID",         (0,0),(-1,-1), 0.4, colors.lightgrey),
        ("BOTTOMPADDING",(0,0),(-1,-1), 5),
        ("TOPPADDING",   (0,0),(-1,-1), 5),
    ]))
    # Color abnormal rows
    for i, r in enumerate(rows, 1):
        if r[4] in ("H", "L"):
            result_tbl.setStyle(TableStyle([
                ("TEXTCOLOR", (4,i),(4,i), colors.red),
                ("FONTNAME",  (4,i),(4,i), "Helvetica-Bold"),
            ]))
    story.append(result_tbl)
    story.append(Spacer(1, 0.4*cm))

    # Risk note
    story.append(Paragraph(f"⚠️  Clinical Note: {risk_note}", risk_style))
    story.append(Spacer(1, 0.2*cm))
    story.append(Paragraph(ref_note, note_style))
    story.append(Spacer(1, 0.4*cm))

    # Footer
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.lightgrey))
    story.append(Paragraph(
        "This report is computer-generated and digitally verified. "
        "Please correlate clinically. For queries contact: lab@biomedai.in | +91-9000000000",
        ParagraphStyle("Footer", parent=styles["Normal"],
                       fontSize=7.5, textColor=GRY, alignment=TA_CENTER, spaceBefore=6)
    ))

    doc.build(story)
    print(f"  ✅ PDF: {filename}")


# ── PDF 1 — Heart Disease (High Risk) ─────────────────────
make_pdf(
    "patient_01_heart_disease_high_risk.pdf",
    {"name":"Ramesh Kumar", "age":58, "gender":"Male",
     "report_id":"RPT-2024-001", "date":"14 Oct 2024", "doctor":"Dr. S. Mehta"},
    "Cardiac Function Panel",
    [
        # param, value, unit, ref_range, flag (H/L/N)
        ["Age",                      "58",     "years",  "—",             "N"],
        ["Sex (Male=1)",             "1",      "code",   "0=F, 1=M",      "N"],
        ["Chest Pain Type (cp)",     "3",      "code",   "0–3",           "H"],
        ["Resting Blood Pressure",   "172",    "mmHg",   "< 120",         "H"],
        ["Serum Cholesterol",        "298",    "mg/dL",  "< 200",         "H"],
        ["Fasting Blood Sugar > 120","1",      "code",   "0=No, 1=Yes",   "H"],
        ["Resting ECG (restecg)",    "1",      "code",   "0–2",           "N"],
        ["Max Heart Rate (thalach)", "108",    "bpm",    "100–200",       "L"],
        ["Exercise Angina (exang)",  "1",      "code",   "0=No, 1=Yes",   "H"],
        ["ST Depression (oldpeak)",  "2.8",    "mm",     "< 1.0",         "H"],
        ["Slope of ST (slope)",      "2",      "code",   "0–2",           "N"],
        ["Major Vessels (ca)",       "3",      "vessels","0–3",           "H"],
        ["Thal",                     "3",      "code",   "1=Normal, 3=Fixed","H"],
    ],
    "Multiple critical cardiac markers elevated. High probability of Coronary Artery Disease. Immediate Cardiologist referral advised.",
    "Reference: AHA/ACC 2023 Guidelines. Thal: 3=Fixed Defect, 6=Normal, 7=Reversible Defect."
)

# ── PDF 2 — Diabetes (Moderate Risk) ──────────────────────
make_pdf(
    "patient_02_diabetes_moderate_risk.pdf",
    {"name":"Priya Sharma", "age":44, "gender":"Female",
     "report_id":"RPT-2024-002", "date":"14 Oct 2024", "doctor":"Dr. R. Gupta"},
    "Diabetes & Metabolic Panel",
    [
        ["Pregnancies",              "3",     "count",  "0–17",          "N"],
        ["Fasting Glucose",          "155",   "mg/dL",  "70–99",         "H"],
        ["Diastolic Blood Pressure", "84",    "mmHg",   "60–80",         "H"],
        ["Skin Thickness",           "29",    "mm",     "10–50",         "N"],
        ["2-hr Serum Insulin",       "185",   "µIU/mL", "16–166",        "H"],
        ["BMI",                      "33.2",  "kg/m²",  "18.5–24.9",     "H"],
        ["Diabetes Pedigree Fn.",    "0.68",  "score",  "0.08–2.42",     "H"],
        ["Age",                      "44",    "years",  "—",             "N"],
    ],
    "Elevated fasting glucose + high insulin suggests insulin resistance. Pre-diabetic / early diabetic profile. HbA1c recommended.",
    "Reference: ADA Standards of Medical Care in Diabetes 2024. Normal Fasting Glucose: 70–99 mg/dL."
)

# ── PDF 3 — Chronic Kidney Disease (High Risk) ────────────
make_pdf(
    "patient_03_kidney_disease_high_risk.pdf",
    {"name":"Suresh Patel", "age":62, "gender":"Male",
     "report_id":"RPT-2024-003", "date":"14 Oct 2024", "doctor":"Dr. A. Nair"},
    "Renal Function Panel",
    [
        ["Age",                   "62",    "years",  "—",            "N"],
        ["Blood Pressure",        "148",   "mmHg",   "< 120",        "H"],
        ["Specific Gravity (sg)", "1.008", "ratio",  "1.005–1.025",  "L"],
        ["Albumin (al)",          "4",     "grade",  "0–1",          "H"],
        ["Sugar (su)",            "2",     "grade",  "0",            "H"],
        ["Blood Glucose Random",  "182",   "mg/dL",  "70–140",       "H"],
        ["Blood Urea (bu)",       "78",    "mg/dL",  "7–20",         "H"],
        ["Serum Creatinine (sc)", "3.2",   "mg/dL",  "0.6–1.2",      "H"],
        ["Sodium (sod)",          "128",   "mEq/L",  "136–145",      "L"],
        ["Potassium (pot)",       "5.8",   "mEq/L",  "3.5–5.0",      "H"],
        ["Hemoglobin (hemo)",     "9.4",   "g/dL",   "13.5–17.5",    "L"],
        ["PCV",                   "28",    "%",       "41–50",        "L"],
        ["WBC Count (wc)",        "9200",  "cells/µL","4000–11000",  "N"],
        ["RBC Count (rc)",        "3.1",   "mil/µL", "4.5–5.5",      "L"],
        ["Hypertension (htn)",    "1",     "code",   "0=No, 1=Yes",  "H"],
    ],
    "Serum Creatinine critically elevated (3.2 mg/dL). Stage 4 CKD suspected. Nephrology consultation urgently needed.",
    "Reference: KDIGO 2024 CKD Classification. GFR estimation required for staging."
)

# ── PDF 4 — Liver Disease (Moderate Risk) ─────────────────
make_pdf(
    "patient_04_liver_disease_moderate.pdf",
    {"name":"Anjali Singh", "age":37, "gender":"Female",
     "report_id":"RPT-2024-004", "date":"14 Oct 2024", "doctor":"Dr. K. Rao"},
    "Liver Function Test (LFT)",
    [
        ["Age",                       "37",   "years",  "—",            "N"],
        ["Gender (Female=0)",         "0",    "code",   "0=F, 1=M",     "N"],
        ["Total Bilirubin",           "2.8",  "mg/dL",  "0.2–1.2",      "H"],
        ["Direct Bilirubin",          "1.4",  "mg/dL",  "0.0–0.3",      "H"],
        ["Alkaline Phosphatase",      "320",  "U/L",    "44–147",        "H"],
        ["ALT / SGPT",                "92",   "U/L",    "7–40",          "H"],
        ["AST / SGOT",                "78",   "U/L",    "10–40",         "H"],
        ["Total Proteins",            "5.8",  "g/dL",   "6.3–8.2",       "L"],
        ["Albumin",                   "2.9",  "g/dL",   "3.5–5.0",       "L"],
        ["Albumin/Globulin Ratio",    "0.71", "ratio",  "1.1–2.5",       "L"],
    ],
    "Elevated bilirubin + transaminases suggest hepatocellular injury. Possible hepatitis or fatty liver. Ultrasound abdomen advised.",
    "Reference: AASLD Practice Guidance 2023. ALT > 3× ULN requires further evaluation."
)

# ── PDF 5 — Stroke Risk (High Risk) ───────────────────────
make_pdf(
    "patient_05_stroke_high_risk.pdf",
    {"name":"Mohammed Irfan", "age":67, "gender":"Male",
     "report_id":"RPT-2024-005", "date":"14 Oct 2024", "doctor":"Dr. P. Verma"},
    "Cerebrovascular Risk Assessment",
    [
        ["Age",                    "67",    "years",  "—",             "N"],
        ["Hypertension",           "1",     "code",   "0=No, 1=Yes",   "H"],
        ["Heart Disease",          "1",     "code",   "0=No, 1=Yes",   "H"],
        ["Average Glucose Level",  "218",   "mg/dL",  "70–140",        "H"],
        ["BMI",                    "31.5",  "kg/m²",  "18.5–24.9",     "H"],
        ["Smoking Status",         "2",     "code",   "0=Never,1=Former,2=Smokes","H"],
    ],
    "High cerebrovascular stroke risk profile. Hypertension + Heart Disease + Hyperglycemia = Critical triad. Immediate neurological review.",
    "Reference: AHA/ASA Stroke Guidelines 2024. Smoking=2 (current smoker) significantly elevates ischemic stroke risk."
)

print("\n✅ All 5 Lab Report PDFs generated!\n")


# ─────────────────────────────────────────────
# 2. CT SCAN IMAGES  (Pillow)
# ─────────────────────────────────────────────
from PIL import Image, ImageDraw, ImageFont

def get_font(size):
    try:
        return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", size)
    except:
        return ImageFont.load_default()

def get_font_reg(size):
    try:
        return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", size)
    except:
        return ImageFont.load_default()

def make_ct_scan(filename, title, region, findings, severity_color, organ_shapes):
    """Generate a realistic-looking grayscale CT scan slice with annotations."""
    W, H = 800, 650
    img = Image.new("RGB", (W, H), (10, 10, 10))
    draw = ImageDraw.Draw(img)

    # Background gradient (dark gray)
    for y in range(H):
        v = int(8 + (y / H) * 12)
        draw.line([(0, y), (W, y)], fill=(v, v, v))

    # ── Draw organ/tissue shapes ──
    for shape in organ_shapes:
        kind   = shape["type"]
        color  = shape["color"]
        coords = shape["coords"]
        if kind == "ellipse":
            draw.ellipse(coords, fill=color)
        elif kind == "polygon":
            draw.polygon(coords, fill=color)
        elif kind == "rectangle":
            draw.rectangle(coords, fill=color)

    # Add noise/texture to look like real CT
    import random as rnd
    for _ in range(18000):
        x = rnd.randint(0, W-1)
        y = rnd.randint(0, H-1)
        v = rnd.randint(0, 30)
        try:
            existing = img.getpixel((x, y))
            new_val  = tuple(min(255, c + v) for c in existing)
            img.putpixel((x, y), new_val)
        except:
            pass

    # ── Header bar ──
    draw.rectangle([(0, 0), (W, 52)], fill=(20, 20, 20))
    draw.line([(0, 52), (W, 52)], fill=(60, 60, 60), width=1)

    # Hospital / scan info
    f_bold = get_font(14)
    f_reg  = get_font_reg(10)
    draw.text((12, 8),  "BioMed Diagnostics | Helical CT Scan",         fill=(200, 200, 200), font=f_bold)
    draw.text((12, 30), f"Region: {region}  |  Slice Thickness: 5mm  |  kVp: 120  |  mAs: 250",
              fill=(140, 140, 140), font=f_reg)

    # Top-right patient info
    draw.text((W-220, 8),  "Patient: TEST CASE",     fill=(180, 180, 180), font=f_reg)
    draw.text((W-220, 22), "Study: CT - Oct 2024",   fill=(140, 140, 140), font=f_reg)
    draw.text((W-220, 36), f"WW:400  WL:40",         fill=(140, 140, 140), font=f_reg)

    # ── Annotation arrows & labels ──
    ann_y = 460
    for i, finding in enumerate(findings):
        x0 = 20 + i * 180
        col = severity_color if "abnormal" in finding.lower() or "mass" in finding.lower() \
              or "lesion" in finding.lower() or "enlarged" in finding.lower() \
              or "calcif" in finding.lower() or "nodule" in finding.lower() \
              or "effusion" in finding.lower() else (100, 220, 100)
        draw.text((x0, ann_y + i*18), f"▶ {finding}", fill=col, font=f_reg)

    # ── Bottom info bar ──
    draw.rectangle([(0, H-50), (W, H)], fill=(20, 20, 20))
    draw.line([(0, H-50), (W, H-50)], fill=(60, 60, 60), width=1)

    f_sev = get_font(13)
    draw.text((12, H-40), f"Findings: {title}",   fill=(220, 220, 100), font=f_sev)
    draw.text((12, H-22), "⚠ FOR DIAGNOSTIC REVIEW ONLY — NOT FOR CLINICAL USE WITHOUT RADIOLOGIST SIGN-OFF",
              fill=(160, 80, 80), font=f_reg)

    # Severity badge
    sev_labels = {(220,50,50):"HIGH SEVERITY", (220,160,50):"MODERATE", (100,200,100):"NORMAL"}
    sev_text   = sev_labels.get(severity_color, "REVIEW")
    badge_x    = W - 160
    draw.rectangle([(badge_x, H-45), (W-10, H-5)], fill=severity_color)
    draw.text((badge_x+10, H-36), sev_text, fill=(10,10,10), font=get_font(12))

    path = os.path.join(CT_DIR, filename)
    img.save(path, "PNG", dpi=(150, 150))
    print(f"  ✅ CT: {filename}")


# CT 1 — Chest CT (Lung nodule)
make_ct_scan(
    "ct_01_chest_lung_nodule.png",
    "Solitary Pulmonary Nodule — Right Upper Lobe",
    "Thorax / Chest",
    ["Solitary nodule RUL ~12mm", "No pleural effusion", "Mediastinum normal", "Abnormal density noted"],
    (220, 160, 50),
    [
        # ribcage ellipse
        {"type":"ellipse",    "color":(55,55,55),  "coords":[80, 90, 720, 580]},
        # lung left
        {"type":"ellipse",    "color":(30,30,30),  "coords":[100,130, 360, 540]},
        # lung right
        {"type":"ellipse",    "color":(30,30,30),  "coords":[380,130, 700, 540]},
        # spine
        {"type":"ellipse",    "color":(190,190,190),"coords":[365,270, 430, 380]},
        # heart shadow
        {"type":"ellipse",    "color":(70,40,40),  "coords":[250,210, 420, 420]},
        # pulmonary nodule (bright spot)
        {"type":"ellipse",    "color":(200,200,180),"coords":[510,155, 540, 185]},
        # vessels
        {"type":"ellipse",    "color":(90,50,50),  "coords":[290,220, 320, 300]},
        {"type":"ellipse",    "color":(90,50,50),  "coords":[450,220, 480, 310]},
    ]
)

# CT 2 — Abdomen CT (Liver lesion)
make_ct_scan(
    "ct_02_abdomen_liver_lesion.png",
    "Hypodense Hepatic Lesion — Segment VII",
    "Abdomen & Pelvis (Liver / Kidney)",
    ["Hypodense lesion ~3.2cm seg VII", "Enlarged liver span 18cm", "Abnormal portal enhancement", "Spleen mildly enlarged"],
    (220, 50, 50),
    [
        # abdominal wall
        {"type":"ellipse",    "color":(45,35,25),  "coords":[60,70, 740, 590]},
        # liver (large right)
        {"type":"ellipse",    "color":(120,80,60), "coords":[80,100, 490, 420]},
        # liver lesion (dark hypodense)
        {"type":"ellipse",    "color":(40,25,20),  "coords":[350,140, 450,230]},
        # spleen (left)
        {"type":"ellipse",    "color":(100,60,60), "coords":[530,120, 700, 290]},
        # stomach
        {"type":"ellipse",    "color":(35,35,40),  "coords":[350,250, 560, 420]},
        # aorta
        {"type":"ellipse",    "color":(140,50,50), "coords":[370,300, 410, 560]},
        # kidneys
        {"type":"ellipse",    "color":(100,70,50), "coords":[160,340, 280, 470]},
        {"type":"ellipse",    "color":(100,70,50), "coords":[510,340, 630, 470]},
        # spine
        {"type":"ellipse",    "color":(180,180,170),"coords":[358,380, 425, 470]},
    ]
)

# CT 3 — Brain CT (Ischemic stroke)
make_ct_scan(
    "ct_03_brain_ischemic_stroke.png",
    "Hypodense Area — Left MCA Territory (Ischemic Stroke)",
    "Head / Brain (Non-contrast)",
    ["Hypodense area left MCA zone", "Mass effect on lateral ventricle", "Abnormal midline shift ~4mm", "No hemorrhage seen"],
    (220, 50, 50),
    [
        # skull outer
        {"type":"ellipse",    "color":(190,185,175),"coords":[80,50, 720,610]},
        # skull inner
        {"type":"ellipse",    "color":(55,50,45),   "coords":[105,75, 695,585]},
        # right hemisphere (normal gray)
        {"type":"ellipse",    "color":(75,68,62),   "coords":[390,100, 680,530]},
        # left hemisphere (normal)
        {"type":"ellipse",    "color":(75,68,62),   "coords":[120,100, 410,530]},
        # ischemic area (hypodense — darker)
        {"type":"ellipse",    "color":(35,30,28),   "coords":[130,140, 360,380]},
        # lateral ventricles
        {"type":"ellipse",    "color":(20,20,35),   "coords":[310,220, 380,310]},
        {"type":"ellipse",    "color":(20,20,35),   "coords":[420,220, 490,310]},
        # falx cerebri
        {"type":"rectangle",  "color":(130,125,115),"coords":[395,100, 410,530]},
        # brainstem
        {"type":"ellipse",    "color":(90,80,70),   "coords":[340,440, 460,560]},
    ]
)

# CT 4 — Kidney CT (Renal calculi)
make_ct_scan(
    "ct_04_kidney_renal_calculi.png",
    "Bilateral Renal Calculi — Hydronephrosis Right Kidney",
    "Abdomen — Renal Protocol CT",
    ["Calculus right renal pelvis 8mm", "Mild hydronephrosis right", "Left kidney normal", "No abnormal lymph nodes"],
    (220, 160, 50),
    [
        # body wall
        {"type":"ellipse",    "color":(38,30,22),   "coords":[60,60, 740,600]},
        # right kidney (enlarged with hydro)
        {"type":"ellipse",    "color":(115,75,55),  "coords":[80,180, 300,440]},
        # right renal pelvis (dilated)
        {"type":"ellipse",    "color":(30,30,50),   "coords":[140,260, 260,370]},
        # kidney stone (bright)
        {"type":"ellipse",    "color":(235,230,200),"coords":[183,298, 205,320]},
        # left kidney (normal)
        {"type":"ellipse",    "color":(110,72,52),  "coords":[490,190, 700,420]},
        # left renal pelvis (normal)
        {"type":"ellipse",    "color":(45,35,30),   "coords":[545,260, 645,360]},
        # aorta & IVC
        {"type":"ellipse",    "color":(140,50,50),  "coords":[358,200, 395,560]},
        {"type":"ellipse",    "color":(80,60,100),  "coords":[400,200, 435,560]},
        # spine
        {"type":"ellipse",    "color":(185,180,170),"coords":[355,290, 440,430]},
        # liver top right
        {"type":"ellipse",    "color":(100,68,50),  "coords":[80,60,  430,200]},
    ]
)

print("\n✅ All 4 CT Scan images generated!\n")


# ─────────────────────────────────────────────
# 3. ECG STRIP IMAGES  (Pillow)
# ─────────────────────────────────────────────
import math

def draw_ecg_strip(filename, title, subtitle, bpm, rhythm_type, qt_ms, notes, severe=False):
    """Draw a realistic multi-lead ECG strip."""
    W, H = 1100, 700
    img = Image.new("RGB", (W, H), (255, 252, 245))
    draw = ImageDraw.Draw(img)

    GRID_LIGHT = (255, 220, 220)
    GRID_DARK  = (255, 180, 180)
    ECG_COLOR  = (10, 30, 180)
    HDR_BG     = (30, 60, 120)

    # ── Grid ──
    grid_small = 10   # 1mm
    grid_large = 50   # 5mm

    for x in range(0, W, grid_small):
        col = GRID_DARK if x % grid_large == 0 else GRID_LIGHT
        draw.line([(x, 60), (x, H-80)], fill=col, width=1 if x % grid_large != 0 else 2)
    for y in range(60, H-80, grid_small):
        col = GRID_DARK if (y-60) % grid_large == 0 else GRID_LIGHT
        draw.line([(0, y), (W, y)], fill=col, width=1 if (y-60) % grid_large != 0 else 2)

    # ── Header ──
    draw.rectangle([(0,0),(W,58)], fill=HDR_BG)
    f_h   = get_font(15)
    f_sub = get_font_reg(10)
    draw.text((14, 8),  f"BioMed ECG Analyzer — {title}",      fill=(255,255,255), font=f_h)
    draw.text((14, 30), f"{subtitle}  |  HR: {bpm} bpm  |  QTc: {qt_ms} ms  |  25 mm/s  |  10 mm/mV",
              fill=(200,220,255), font=f_sub)

    # Severity badge
    sev_col  = (220,50,50) if severe else (50,180,100)
    sev_text = "⚠ ABNORMAL" if severe else "NORMAL"
    draw.rectangle([(W-140,8),(W-8,50)], fill=sev_col)
    draw.text((W-132, 20), sev_text, fill=(255,255,255), font=get_font(13))

    # ── Lead labels & ECG waveforms ──
    leads = ["I","II","III","aVR","aVL","aVF","V1","V2","V3","V4","V5","V6"]
    rows  = 3   # 3 rows of 4 leads
    cols  = 4
    cell_w = W // cols
    cell_h = (H - 60 - 80) // rows

    def ecg_wave(x, lead_idx, rhythm, bpm, t_offset=0):
        """Generate ECG sample value for a given x position."""
        cycle_len = (60.0 / bpm) * 250   # pixels per beat at 25mm/s, 10px/mm
        t = (x + t_offset * 80) % cycle_len
        p = t / cycle_len

        # Baseline
        y = 0.0

        # P wave (atrial depolarization)
        if 0.05 < p < 0.15:
            y += 0.3 * math.sin(math.pi * (p - 0.05) / 0.10)

        # PR segment flat
        # QRS complex
        if 0.18 < p < 0.20:   y -= 0.4   # Q
        if 0.20 < p < 0.22:   y += 2.5 if rhythm != "bradycardia" else 2.0   # R peak
        if 0.22 < p < 0.24:   y -= 0.5   # S

        # ST segment
        if 0.24 < p < 0.35:
            st_dep = -0.6 if rhythm == "st_depression" else 0.0
            y += st_dep * math.sin(math.pi * (p - 0.24) / 0.11)

        # T wave
        if 0.35 < p < 0.55:
            t_amp = -0.8 if rhythm == "st_depression" else 0.7
            if rhythm == "tachycardia": t_amp = 0.5
            y += t_amp * math.sin(math.pi * (p - 0.35) / 0.20)

        # Noise
        y += random.gauss(0, 0.04)
        return y

    for i, lead in enumerate(leads):
        row = i // cols
        col = i  % cols
        x0 = col * cell_w + 5
        y0 = 60 + row * cell_h
        baseline = y0 + cell_h // 2
        amp = cell_h * 0.30

        # Lead label
        draw.text((x0 + 5, y0 + 5), lead, fill=(80,80,80), font=get_font(11))
        draw.line([(x0, y0 + cell_h - 1), (x0 + cell_w, y0 + cell_h - 1)],
                  fill=(220, 200, 200), width=1)

        # Calibration pulse
        draw.line([(x0+8, baseline+int(amp)), (x0+8,  baseline-int(amp))], fill=ECG_COLOR, width=2)
        draw.line([(x0+8, baseline-int(amp)), (x0+18, baseline-int(amp))], fill=ECG_COLOR, width=2)
        draw.line([(x0+18,baseline-int(amp)), (x0+18, baseline+int(amp))], fill=ECG_COLOR, width=2)

        # ECG waveform
        pts = []
        for px in range(x0+25, x0+cell_w-5):
            val = ecg_wave(px - (x0+25), i, rhythm_type, bpm, t_offset=i)
            py  = int(baseline - val * amp)
            py  = max(y0+2, min(y0+cell_h-2, py))
            pts.append((px, py))
        if len(pts) > 1:
            draw.line(pts, fill=ECG_COLOR, width=2)

    # ── Long rhythm strip (Lead II) at bottom ──
    strip_y  = H - 78
    strip_h  = 60
    base_ii  = strip_y + strip_h // 2
    amp_ii   = strip_h * 0.38

    draw.rectangle([(0, strip_y - 2), (W, strip_y + strip_h + 2)], fill=(250, 248, 240))
    draw.line([(0,strip_y-2),(W,strip_y-2)], fill=GRID_DARK, width=1)
    draw.text((8, strip_y + 4), "Rhythm Strip — Lead II (Long)", fill=(80,80,80), font=f_sub)

    pts_ii = []
    for px in range(0, W):
        val = ecg_wave(px, 1, rhythm_type, bpm, t_offset=0)
        py  = int(base_ii - val * amp_ii)
        py  = max(strip_y, min(strip_y + strip_h, py))
        pts_ii.append((px, py))
    if len(pts_ii) > 1:
        draw.line(pts_ii, fill=ECG_COLOR, width=2)

    # ── Footer ──
    draw.rectangle([(0, H-22),(W,H)], fill=(240,240,240))
    draw.text((10, H-18), f"Clinical Notes: {notes}   |   Analyzed by BioMed AI ECG Engine v2.4",
              fill=(100,100,100), font=f_sub)

    path = os.path.join(ECG_DIR, filename)
    img.save(path, "PNG", dpi=(150,150))
    print(f"  ✅ ECG: {filename}")


# ECG 1 — Normal Sinus Rhythm
draw_ecg_strip(
    "ecg_01_normal_sinus_rhythm.png",
    "Normal Sinus Rhythm",
    "Patient: Healthy Adult | Age: 32 | Male",
    bpm=72, rhythm_type="normal", qt_ms=420,
    notes="Regular rhythm. Normal P, QRS, T morphology. No ST changes. QTc within normal limits.",
    severe=False
)

# ECG 2 — Sinus Tachycardia
draw_ecg_strip(
    "ecg_02_sinus_tachycardia.png",
    "Sinus Tachycardia",
    "Patient: Ramesh Kumar | Age: 45 | Male | Complaint: Palpitations",
    bpm=118, rhythm_type="tachycardia", qt_ms=360,
    notes="HR 118 bpm. Regular rapid rhythm. Normal P-QRS-T. Possible fever / anxiety / hyperthyroidism. Clinically correlate.",
    severe=True
)

# ECG 3 — Sinus Bradycardia
draw_ecg_strip(
    "ecg_03_sinus_bradycardia.png",
    "Sinus Bradycardia",
    "Patient: Sunita Devi | Age: 60 | Female | On Beta-Blockers",
    bpm=46, rhythm_type="bradycardia", qt_ms=480,
    notes="HR 46 bpm. Slow regular rhythm. Possible drug effect (beta-blocker). QTc mildly prolonged. Holter monitoring advised.",
    severe=True
)

# ECG 4 — ST Depression (Ischemia)
draw_ecg_strip(
    "ecg_04_st_depression_ischemia.png",
    "ST Segment Depression — Myocardial Ischemia",
    "Patient: Mohammed Irfan | Age: 67 | Male | Chest Pain",
    bpm=88, rhythm_type="st_depression", qt_ms=445,
    notes="ST depression ≥ 1.5mm in V4–V6. T-wave inversion noted. Findings consistent with sub-endocardial ischemia. URGENT: Troponin, Cath Lab referral.",
    severe=True
)

print("\n✅ All 4 ECG Strip images generated!\n")

# ─────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────
print("=" * 55)
print("  ALL TEST INPUT FILES GENERATED SUCCESSFULLY!")
print("=" * 55)
print(f"\n📁 Output folder: {OUT_DIR}")
print(f"\n📄 Lab Report PDFs  → {PDF_DIR}")
print("   1. patient_01_heart_disease_high_risk.pdf")
print("   2. patient_02_diabetes_moderate_risk.pdf")
print("   3. patient_03_kidney_disease_high_risk.pdf")
print("   4. patient_04_liver_disease_moderate.pdf")
print("   5. patient_05_stroke_high_risk.pdf")
print(f"\n🩻 CT Scan Images   → {CT_DIR}")
print("   1. ct_01_chest_lung_nodule.png")
print("   2. ct_02_abdomen_liver_lesion.png")
print("   3. ct_03_brain_ischemic_stroke.png")
print("   4. ct_04_kidney_renal_calculi.png")
print(f"\n❤️  ECG Strip Images → {ECG_DIR}")
print("   1. ecg_01_normal_sinus_rhythm.png")
print("   2. ecg_02_sinus_tachycardia.png")
print("   3. ecg_03_sinus_bradycardia.png")
print("   4. ecg_04_st_depression_ischemia.png")
