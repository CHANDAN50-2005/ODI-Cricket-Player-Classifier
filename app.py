from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

# Create the Flask app
app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

# Load our saved model, scaler, and columns
model = joblib.load('cricket_model.joblib')
scaler = joblib.load('scaler.joblib')
model_columns = joblib.load('model_columns.joblib')

# This is the main route for our website.
# It will send the 'index.html' file from our 'templates' folder.
@app.route('/')
def home():
    return render_template('index.html')

# ...existing code...


# Route for player vs player comparison page
@app.route('/compare')
def compare_page():
    return render_template('compare.html')

@app.route('/result')
def result():
    return render_template('result.html')

# ...existing code...


# This is the route that will receive stats and return a prediction
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    print("Received data:", data)
    
    # Create a DataFrame from the incoming data
    query_df = pd.DataFrame([data])
    
    # Print the columns we received vs what we expect
    print("Received columns:", query_df.columns.tolist())
    print("Expected columns:", model_columns)
    
    # Ensure the DataFrame has all the model columns in the correct order
    query_df = query_df.reindex(columns=model_columns, fill_value=0)
    
    # Print the data after reindexing
    print("Data after reindexing:")
    print(query_df)
    
    # Scale the user's input data using the saved scaler
    query_scaled = scaler.transform(query_df)

    # Make the prediction using the scaled data
    prediction = model.predict(query_scaled)
    probabilities = model.predict_proba(query_scaled)
    
    # Print prediction details
    print("Raw prediction:", prediction[0])
    print("Probabilities:", probabilities[0])
    
    # Prepare the response
    response = {
        'prediction': str(prediction[0]),
        'probabilities': {
            'Beginner': probabilities[0][0] * 100,
            'Intermediate': probabilities[0][1] * 100,
            'Professional': probabilities[0][2] * 100
        }
    }
    return jsonify(response)

# Player vs Player comparison route
@app.route('/compare', methods=['POST'])
def compare():
    data = request.get_json(force=True)
    player1 = data.get('player1', {})
    player2 = data.get('player2', {})
    print("Received player1:", player1)
    print("Received player2:", player2)

    # Prepare DataFrames for both players
    df1 = pd.DataFrame([player1]).reindex(columns=model_columns, fill_value=0)
    df2 = pd.DataFrame([player2]).reindex(columns=model_columns, fill_value=0)

    # Scale both
    scaled1 = scaler.transform(df1)
    scaled2 = scaler.transform(df2)

    # Predict both
    pred1 = model.predict(scaled1)[0]
    prob1 = model.predict_proba(scaled1)[0]
    pred2 = model.predict(scaled2)[0]
    prob2 = model.predict_proba(scaled2)[0]

    response = {
        'player1': {
            'prediction': str(pred1),
            'probabilities': {
                'Beginner': prob1[0] * 100,
                'Intermediate': prob1[1] * 100,
                'Professional': prob1[2] * 100
            }
        },
        'player2': {
            'prediction': str(pred2),
            'probabilities': {
                'Beginner': prob2[0] * 100,
                'Intermediate': prob2[1] * 100,
                'Professional': prob2[2] * 100
            }
        }
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)