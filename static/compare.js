document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('compareForm');
    const resultDiv = document.getElementById('comparisonResult');
    const player1Div = document.getElementById('player1Result');
    const player2Div = document.getElementById('player2Result');
    const chartCanvas = document.getElementById('compareChart').getContext('2d');
    let chartInstance = null;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Gather player 1 stats from visible fields
        const p1 = { 'PlayerType': form.PlayerType1.value };
        document.querySelectorAll('#Player1Fields input').forEach(input => {
            p1[input.name.replace('1', '')] = parseFloat(input.value) || 0;
        });
        // Gather player 2 stats from visible fields
        const p2 = { 'PlayerType': form.PlayerType2.value };
        document.querySelectorAll('#Player2Fields input').forEach(input => {
            p2[input.name.replace('2', '')] = parseFloat(input.value) || 0;
        });
        // Send to backend
        fetch('/compare', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player1: p1, player2: p2 })
        })
        .then(res => res.json())
        .then(data => {
            resultDiv.style.display = 'block';
            // Summary Table
            const summaryTable = document.getElementById('summaryTable');
            const statNames = [
                'PlayerType', 'Matches', 'Batting_Innings', 'Not_Outs', 'Runs_Scored', 'Batting_Average', 'Strike_Rate', '100', '50', 'Catches', 'Stumpings', 'Wickets_Taken', 'Bowling_Average', 'Economy'
            ];
            let tableHtml = '<tr><th>Stat</th><th>Player 1</th><th>Player 2</th></tr>';
            statNames.forEach(stat => {
                tableHtml += `<tr><td>${stat.replace('_', ' ')}</td><td>${p1[stat] !== undefined ? p1[stat] : '-'}</td><td>${p2[stat] !== undefined ? p2[stat] : '-'}</td></tr>`;
            });
            summaryTable.innerHTML = tableHtml;

            // Dynamic result cards
            const categories = ['Beginner', 'Intermediate', 'Professional'];
            const p1Cat = data.player1.prediction;
            const p2Cat = data.player2.prediction;
            let winner = '';
            if (categories.indexOf(p1Cat) > categories.indexOf(p2Cat)) winner = 'Player 1';
            else if (categories.indexOf(p2Cat) > categories.indexOf(p1Cat)) winner = 'Player 2';
            else winner = 'Tie';

            player1Div.className = 'player-card' + (winner === 'Player 1' ? ' winner' : winner === 'Tie' ? ' tie' : '');
            player2Div.className = 'player-card' + (winner === 'Player 2' ? ' winner' : winner === 'Tie' ? ' tie' : '');

            player1Div.innerHTML = `
                <div style="font-size:1.2em;font-weight:bold;">Player 1 ${winner==='Player 1' ? '🏆' : ''}</div>
                <div><b>Type:</b> ${p1.PlayerType}</div>
                <div><b>Predicted Category:</b> <span style="color:#1a237e">${p1Cat}</span></div>
                <div style="margin-top:8px;">Probabilities:</div>
                <div style="margin-bottom:8px;">
                    <span style="color:#1976d2">Beginner:</span> ${data.player1.probabilities.Beginner.toFixed(1)}%<br>
                    <span style="color:#ffa726">Intermediate:</span> ${data.player1.probabilities.Intermediate.toFixed(1)}%<br>
                    <span style="color:#43a047">Professional:</span> ${data.player1.probabilities.Professional.toFixed(1)}%
                </div>
            `;
            player2Div.innerHTML = `
                <div style="font-size:1.2em;font-weight:bold;">Player 2 ${winner==='Player 2' ? '🏆' : ''}</div>
                <div><b>Type:</b> ${p2.PlayerType}</div>
                <div><b>Predicted Category:</b> <span style="color:#1a237e">${p2Cat}</span></div>
                <div style="margin-top:8px;">Probabilities:</div>
                <div style="margin-bottom:8px;">
                    <span style="color:#1976d2">Beginner:</span> ${data.player2.probabilities.Beginner.toFixed(1)}%<br>
                    <span style="color:#ffa726">Intermediate:</span> ${data.player2.probabilities.Intermediate.toFixed(1)}%<br>
                    <span style="color:#43a047">Professional:</span> ${data.player2.probabilities.Professional.toFixed(1)}%
                </div>
            `;
            // Winner banner
            const winnerBanner = document.getElementById('winnerBanner');
            if (winner === 'Tie') {
                winnerBanner.style.display = 'block';
                winnerBanner.textContent = 'It\'s a Tie!';
            } else {
                winnerBanner.style.display = 'block';
                winnerBanner.textContent = `${winner} is the Winner!`;
            }

            // Draw chart with animation
            if (chartInstance) chartInstance.destroy();
            chartInstance = new Chart(chartCanvas, {
                type: 'bar',
                data: {
                    labels: ['Beginner', 'Intermediate', 'Professional'],
                    datasets: [
                        {
                            label: 'Player 1',
                            data: [data.player1.probabilities.Beginner, data.player1.probabilities.Intermediate, data.player1.probabilities.Professional],
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: '#1976d2',
                            borderWidth: 2
                        },
                        {
                            label: 'Player 2',
                            data: [data.player2.probabilities.Beginner, data.player2.probabilities.Intermediate, data.player2.probabilities.Professional],
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: '#ffa726',
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: false,
                    animation: {
                        duration: 1200,
                        easing: 'easeOutBounce'
                    },
                    scales: {
                        y: { beginAtZero: true, max: 100 }
                    }
                }
            });
        });
    });
});
