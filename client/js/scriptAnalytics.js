// הגדרת משתנה הגרף באופן גלובלי
let progressChart;

// פונקציה לטעינת נתונים מהשרת
async function loadData() {
    try {
        // משיכת נתונים מהשרת במקביל לביצועים מהירים
        const [workoutsRes, chartRes, statsRes] = await Promise.all([
            fetch('http://localhost:3000/api/workouts'),
            fetch('http://localhost:3000/api/workouts/weekly-chart'),
            fetch('http://localhost:3000/api/workouts/stats/summary')
        ]);

        const workouts = await workoutsRes.json();
        const chartData = await chartRes.json();
        const stats = await statsRes.json();

        // 1. עדכון רשימת האימונים עם האייקונים והתאריך
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        const activityIcons = {
            'Running': '🏃',
            'Walking': '🚶',
            'Cycling': '🚴',
            'Custom': '⚡'
        };

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

        // 2. עדכון סטטיסטיקות
        document.getElementById('totalWorkouts').textContent = stats.weekly.totalWorkouts || 0;
        document.getElementById('caloriesBurned').textContent = stats.weekly.totalCalories || 0;

        // 3. עדכון גרף
        if (progressChart) {
            progressChart.data.datasets[0].data = chartData.map(item => item.totalCalories);
            progressChart.update();
        }

    } catch (err) { 
        console.error("Error loading data:", err); 
    }
}

// 4. אתחול הגרף ברגע שהדף נטען
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('progressChart').getContext('2d');
    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{ 
                data: [], 
                borderColor: '#6a9c78', 
                borderWidth: 2, 
                tension: 0.35 
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { legend: { display: false } } 
        }
    });

    loadData();
});