document.addEventListener('DOMContentLoaded', () => {
    
    // --- Get all the important HTML elements ---
    const form = document.getElementById('prediction-form');
    const playerTypeSelect = document.getElementById('player-type');
    const battingStats = document.getElementById('batting-stats');
    const bowlingStats = document.getElementById('bowling-stats');
    const fieldingStats = document.getElementById('fielding-stats');
    
    // --- Elements for our slider feature ---
    const strikeRateSlider = document.getElementById('Strike_Rate_slider');
    const strikeRateInput = document.getElementById('Strike_Rate_input');

    // --- Logic to connect the slider and the number box ---
    strikeRateSlider.addEventListener('input', () => {
        strikeRateInput.value = strikeRateSlider.value;
    });
    strikeRateInput.addEventListener('input', () => {
        strikeRateSlider.value = strikeRateInput.value;
    });


    // --- Logic for our dynamic form ---
    playerTypeSelect.addEventListener('change', () => {
        const selectedType = playerTypeSelect.value;
        // First, hide everything
        battingStats.classList.add('hidden');
        bowlingStats.classList.add('hidden');
        fieldingStats.classList.add('hidden');

        // Now, show the correct groups based on the user's choice
        if (selectedType === 'Batsman' || selectedType === 'Fielder') {
            battingStats.classList.remove('hidden');
            fieldingStats.classList.remove('hidden');
        } else if (selectedType === 'Bowler') {
            bowlingStats.classList.remove('hidden');
            fieldingStats.classList.remove('hidden');
        } else if (selectedType === 'All-Rounder') {
            battingStats.classList.remove('hidden');
            bowlingStats.classList.remove('hidden');
            fieldingStats.classList.remove('hidden');
        }
    });

    // --- Logic for Form Submission ---
    // This is different from our old project!
    // Instead of predicting here, we will send the data to our new results page.
    form.addEventListener('submit', (event) => {
        // This stops the form from submitting in the default way
        event.preventDefault();

        // Create a new FormData object to easily get all the input values
        const formData = new FormData(form);
        // Convert the form data into a URL query string (like ?Matches=100&Runs_Scored=5000...)
        const params = new URLSearchParams(formData).toString();

        // ...existing code...
        window.location.href = `result?${params}`;
    });
});