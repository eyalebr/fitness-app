const weeklyBtn = document.getElementById('weeklyBtn');
const monthlyBtn = document.getElementById('monthlyBtn');

const totalWorkouts = document.getElementById('totalWorkouts');
const avgDuration = document.getElementById('avgDuration');
const caloriesBurned = document.getElementById('caloriesBurned');
const caloriesLabel = document.getElementById('caloriesLabel');
const historyList = document.getElementById('historyList');

const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [320, 450, 380, 450, 500, 590, 430],
    totalWorkouts: 7,
    avgDuration: 45,
    calories: 537,
    caloriesText: 'average calories<br>burned'
};

const monthlyData = {
    labels: ['week 1', 'week 2', 'week 3', 'week 4'],
    values: [2100, 2400, 2250, 2700],
    totalWorkouts: 23,
    avgDuration: 52,
    calories: '5,618',
    caloriesText: 'Calories Burned'
};

const workoutsHistory = [
    {
        type: 'Running',
        date: 'Feb 8, 2026',
        duration: '32 min',
        details: '5.2 km • 420 kcal',
        icon: '👟'
    },
    {
        type: 'Cycling',
        date: 'Feb 7, 2026',
        duration: '45 min',
        details: '15.8 km • 580 kcal',
        icon: '🚴'
    }
];

const ctx = document.getElementById('progressChart');

const progressChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: weeklyData.labels,
        datasets: [{
            data: weeklyData.values,
            borderColor: '#6a9c78',
            backgroundColor: '#6a9c78',
            borderWidth: 2,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 5
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                min: 0,
                max: 600,
                ticks: {
                    stepSize: 150
                },
                grid: {
                    borderDash: [4, 4]
                }
            },
            x: {
                grid: {
                    borderDash: [4, 4]
                }
            }
        }
    }
});

function renderHistory() {
    historyList.innerHTML = '';

    workoutsHistory.forEach((workout) => {
        const item = document.createElement('div');
        item.classList.add('history-item');

        item.innerHTML = `
            <div class="history-left">
                <span class="history-icon">${workout.icon}</span>
                <div class="history-text">
                    <h3>${workout.type}</h3>
                    <p>${workout.date}</p>
                </div>
            </div>

            <div class="history-details">
                <strong>${workout.duration}</strong>
                <p>${workout.details}</p>
            </div>
        `;

        historyList.appendChild(item);
    });
}

function updateAnalytics(mode) {
    const selectedData = mode === 'weekly' ? weeklyData : monthlyData;

    progressChart.data.labels = selectedData.labels;
    progressChart.data.datasets[0].data = selectedData.values;

    progressChart.options.scales.y.max = mode === 'weekly' ? 600 : 2800;
    progressChart.options.scales.y.ticks.stepSize = mode === 'weekly' ? 150 : 700;

    progressChart.update();

    totalWorkouts.textContent = selectedData.totalWorkouts;
    avgDuration.textContent = selectedData.avgDuration;
    caloriesBurned.textContent = selectedData.calories;
    caloriesLabel.innerHTML = selectedData.caloriesText;

    weeklyBtn.classList.toggle('active', mode === 'weekly');
    monthlyBtn.classList.toggle('active', mode === 'monthly');
}

weeklyBtn.addEventListener('click', () => updateAnalytics('weekly'));
monthlyBtn.addEventListener('click', () => updateAnalytics('monthly'));

renderHistory();
updateAnalytics('weekly');