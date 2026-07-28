// This code runs as soon as the results page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Read the player stats from the URL ---
    const params = new URLSearchParams(window.location.search);
    const formData = {};
    
    // Convert parameters to numbers and handle missing values
    for (const [key, value] of params.entries()) {
        formData[key] = parseFloat(value) || 0;
    }
    
    // Map form fields to model column names (fix for backend compatibility)
    const fieldMapping = {
        'Matches': 'Mat_x',
        'Batting_Innings': 'Inns_x',
        'Not_Outs': 'NO',
        'Runs_Scored': 'Runs_x',
        'Batting_Average': 'Ave_x',
        'Strike_Rate': 'SR_x',
        '100': '100',
        '50': '50',
        '0': '0',
        'Catches': 'Ct',
        'Stumpings': 'St',
        'Wickets_Taken': 'Wkts',
        'Bowling_Average': 'Ave_y',
        'Economy': 'Econ',
        'Balls_Bowled': 'Balls',
        'Runs_Conceded': 'Runs_y',
        'Bowling_Strike_Rate': 'SR_y',
        'Four_Wickets': '4',
        'Five_Wickets': '5',
        'Dismissals': 'Dis',
        'Wicketkeeping_Catches': 'Ct_Wk',
        'Fielding_Catches': 'Ct_Fi'
    };

    // Apply the mapping
    for (const [formField, modelField] of Object.entries(fieldMapping)) {
        if (formData[formField] !== undefined) {
            formData[modelField] = formData[formField];
            delete formData[formField];
        }
    }
    
    // Add derived statistics that might help prediction
    if (formData.Runs_x && formData.Mat_x) {
        formData.Runs_Per_Match = formData.Runs_x / formData.Mat_x;
    }
    
    if (formData.Wkts && formData.Mat_x) {
        formData.Wickets_Per_Match = formData.Wkts / formData.Mat_x;
    }
    
    // Ensure all required fields exist with correct names
    // Add any missing fields with 0 values
    const requiredFields = ['Mat_x', 'Inns_x', 'NO', 'Runs_x', 'Ave_x', 'SR_x', 'BF', '100', '50', '0',
        'Balls', 'Runs_y', 'Wkts', 'Ave_y', 'Econ', 'SR_y', '4', '5',  // Bowling stats
        'Dis', 'Ct', 'St', 'Ct_Wk', 'Ct_Fi', 'Mat_y', 'Mat'];  // Fielding stats

    requiredFields.forEach(field => {
        if (!(field in formData)) {
            formData[field] = 0;
        }
    });
    
    for (const field of requiredFields) {
        if (!(field in formData)) {
            formData[field] = 0;
        }
    }
    
    // Log data for debugging
    console.log('Data being sent to prediction:', formData);
// ...existing code...

    // --- 2. Get references to our HTML elements ---
    const categoryElement = document.getElementById('prediction-category');
    const chartCanvas = document.getElementById('probabilitiesChart').getContext('2d');

    // --- 3. Send the stats to our Flask server to get a prediction ---
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // --- 4. Display the prediction result ---
        let icon = '';
        if (data.prediction === 'Professional') { icon = '🏆'; } 
        else if (data.prediction === 'Intermediate') { icon = '🥈'; } 
        else { icon = '🏏'; }
        
        categoryElement.innerHTML = `Predicted Category: <strong>${data.prediction} ${icon}</strong>`;

        // --- 5. Draw the beautiful probabilities chart ---
        const probabilities = data.probabilities;
        new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: ['Beginner', 'Intermediate', 'Professional'],
                datasets: [{
                    label: 'AI Confidence',
                    data: [
                        probabilities.Beginner,
                        probabilities.Intermediate,
                        probabilities.Professional
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(75, 192, 192, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y', // Makes the bar chart horizontal
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100, // The maximum value is 100%
                        ticks: {
                            callback: function(value) {
                                return value + '%' // Add a '%' sign to the labels
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // Hide the legend as it's not needed
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
        categoryElement.textContent = 'Error: Could not get a prediction.';
    });
});