let progressChart;

// פונקציה לטעינת נתונים לפי סוג (שבועי/חודשי)
async function switchView(view) {
    // עדכון כפתורים
    document.getElementById('weeklyBtn').classList.toggle('active', view === 'weekly');
    document.getElementById('monthlyBtn').classList.toggle('active', view === 'monthly');

    // משיכת נתונים לפי סוג
    const chartUrl = view === 'weekly' ? '/api/workouts/weekly-chart' : '/api/workouts/monthly-chart';
    const res = await fetch(chartUrl);
    const data = await res.json();

    // עדכון הגרף
    if (progressChart) {
        progressChart.data.labels = view === 'weekly' 
            ? ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'] 
            : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        
        progressChart.data.datasets[0].data = data.map(item => item.totalCalories);
        progressChart.update();
    }
}

async function loadData() {
    try {
        const [workoutsRes, chartRes, statsRes] = await Promise.all([
            fetch('/api/workouts'),
            fetch('/api/workouts/weekly-chart'),
            fetch('/api/workouts/stats/summary')
        ]);

        const workouts = await workoutsRes.json();
        const chartData = await chartRes.json();
        const stats = await statsRes.json();

        // עדכון היסטוריה
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        const activityIcons = { 'Running': '🏃', 'Walking': '🚶', 'Cycling': '🚴', 'Custom': '⚡' };

        workouts.forEach(w => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <div class="history-left">
                    <span class="history-icon">${activityIcons[w.activityType] || '⚡'}</span>
                    <div class="history-text">
                        <h3>${w.activityType}</h3>
                        <p>📅 ${new Date(w.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="history-details">
                    <strong>${w.duration} min</strong>
                    <p>${w.distance || 0} km</p>
                </div>
            `;
            historyList.appendChild(item);
        });

        // עדכון סטטיסטיקות
        document.getElementById('totalWorkouts').textContent = stats.weekly.totalWorkouts || 0;
        document.getElementById('caloriesBurned').textContent = stats.weekly.totalCalories || 0;
        document.getElementById('avgDuration').textContent = (stats.weekly.avgDuration || 0) + ' min';
        
        // אתחול גרף ראשוני
        if (progressChart) {
            progressChart.data.datasets[0].data = chartData.map(item => item.totalCalories);
            progressChart.update();
        }

    } catch (err) { console.error("Error:", err); }
}

document.addEventListener('DOMContentLoaded', () => {
    // מאזינים לכפתורים
    document.getElementById('weeklyBtn').addEventListener('click', () => switchView('weekly'));
    document.getElementById('monthlyBtn').addEventListener('click', () => switchView('monthly'));

    const ctx = document.getElementById('progressChart').getContext('2d');
    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{ data: [], borderColor: '#6a9c78', borderWidth: 2, tension: 0.35 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    loadData();
});