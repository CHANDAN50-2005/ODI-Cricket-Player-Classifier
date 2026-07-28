# ODI Cricket Player Classifier

> A polished Flask web app to predict ODI cricket player categories and compare players side-by-side.

---

## ✨ What this app does

- Predicts whether a player is a **Beginner**, **Intermediate**, or **Professional**.
- Displays prediction confidence using a bar chart.
- Supports a **Player vs Player** comparison mode.
- Uses saved model artifacts (`joblib`) for fast inference.

---

## 📌 Highlights

- Dynamic input form based on player type
- Clean result visualization with probabilities
- Side-by-side player comparison
- Easy local setup and run

---

## 🧭 Screenshot Preview

> Add your screenshot images into `screenshots/` and GitHub will render them here.

### Homepage

![Homepage](screenshots/homepage.png)

### Prediction Result

![Prediction Result](screenshots/result-page.png)

### Compare Page

![Compare Page](screenshots/compare-page.png)

---

## 🛠️ How it works

1. `app.py` starts a Flask server and loads the saved model artifacts:
   - `cricket_model.joblib`
   - `scaler.joblib`
   - `model_columns.joblib`
2. The main page (`/`) allows users to select a player type and enter stats.
3. The form forwards the data to `/predict` through `result.html`.
4. The backend scales the input, predicts the category, and returns probability scores.
5. The result page displays the predicted category and confidence chart.
6. The compare page (`/compare`) accepts two players and returns a side-by-side comparison.

---

## 🌐 Pages

- `/` — Main player prediction page
- `/result` — Prediction result page
- `/compare` — Player vs Player comparison page

---

## ⚙️ Setup

### Prerequisites

- Python 3.11
- `venv` or another virtual environment tool

### Install dependencies

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Run locally

```powershell
python app.py
```

Then visit:

- `http://127.0.0.1:5000`
- `http://127.0.0.1:5000/compare`

---

## 📁 Recommended repository structure

```
cricket_analyzer_pro/
├── app.py
├── README.md
├── requirements.txt
├── cricket_model.joblib
├── scaler.joblib
├── model_columns.joblib
├── templates/
├── static/
└── screenshots/
```

---

## 💡 Notes

- The model artifacts must remain in the project root for the app to work.
- If you change model inputs, update `static/result.js` and `app.py` to keep feature names in sync.
- This app is configured for development with Flask debug mode.

---

## 🚫 Do not commit

Keep the repository clean by ignoring:

- virtual environments: `venv/`, `.venv/`, `env/`
- notebook files: `*.ipynb`
- datasets: `*.csv`
- generated images: `top_10_*.png`
- editor files: `.vscode/`, `.idea/`

See `.gitignore` for details.
