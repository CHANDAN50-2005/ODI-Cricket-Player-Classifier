# Cricket Analyzer Pro

A Flask web app for predicting ODI cricket player performance level and comparing two players side-by-side.

## Project overview

- `app.py` is the Flask backend.
- `templates/` contains the HTML pages used by the app.
- `static/` contains JavaScript and CSS used by the frontend.
- `cricket_model.joblib`, `scaler.joblib`, and `model_columns.joblib` are the saved model artifacts used for prediction.
- `Bowling_ODI.csv`, `Fielding_ODI.csv`, and `ODI data.csv` are dataset files included for analysis but are not required to run the app.

## How it works

1. `app.py` loads the ML model, scaler, and expected input column order at startup.
2. The main page (`/`) allows the user to select a player type and enter stats.
3. When the form is submitted, the browser redirects to `result.html` with form values passed as query parameters.
4. `static/result.js` maps those query parameters to the model feature names and sends them to the backend `/predict` endpoint.
5. The backend scales the data using the saved scaler and makes a prediction with the saved model.
6. The result page shows the predicted category and a probability chart.
7. The compare page (`/compare`) allows comparing two players by submitting both players' stats to the backend `/compare` endpoint.

## Pages

- `/` — main player prediction page where you choose the player type and enter stats
- `/result` — prediction result page that displays the predicted category and probability bar chart
- `/compare` — player vs player comparison page for comparing two players side-by-side

## Visual flow

1. **Home page**: Select a player type and enter the relevant batting, bowling, and fielding stats. The stats form is dynamic and shows only the fields needed for the chosen player type.
2. **Prediction submission**: The app sends those stats to the `/predict` endpoint and then shows the result page.
3. **Result page**: Displays the predicted category (`Beginner`, `Intermediate`, or `Professional`) and a horizontal probability chart with the model confidence scores.
4. **Compare page**: Enter two players' stats together and submit them to the `/compare` endpoint. The comparison page shows both players’ predictions, a side-by-side probability chart, and highlights the winner or tie.

## Player vs Player feature

The compare feature allows you to:

- Choose a player type for each player independently.
- Enter stats for both Player 1 and Player 2 on the same screen.
- Submit both players’ stats together.
- View the predictions for each player side-by-side.
- See a bar chart comparison of category probabilities.
- See a winner banner when one player has a stronger predicted category or a tie if both are equal.

## Prerequisites

- Python 3.11
- `venv` or another virtual environment tool

## Setup

1. Create and activate a virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

## Running the app

From the project root:

```powershell
python app.py
```

Then open in your browser:

- `http://127.0.0.1:5000`
- `http://127.0.0.1:5000/compare`

## Notes

- Keep the model files (`cricket_model.joblib`, `scaler.joblib`, `model_columns.joblib`) in the project root.
- If you change the model input features, update `static/result.js` field mappings and the backend column order accordingly.
- The app is running in Flask debug mode, which is suitable for development only.

## Recommended GitHub exclusions

Don’t commit:

- virtual environments and installed packages
- Python cache files
- editor or OS temporary files
- local environment secrets

See `.gitignore` for details.
