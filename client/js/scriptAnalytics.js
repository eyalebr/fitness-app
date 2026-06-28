let progressChart;

// פונקציה לטעינת נתונים לפי סוג (שבועי/חודשי)
async function switchView(view) {
    // עדכון כפתורים
    document.getElementById('weeklyBtn').classList.toggle('active', view === 'weekly');
    document.getElementById('monthlyBtn').classList.toggle('active', view === 'monthly');

    // משיכת נתונים לפי סוג
    const chartUrl = view === 'weekly' ? '/api/workouts/weekly-chart' : '/api/workouts/monthly-chart';
    const userData = JSON.parse(localStorage.getItem('user'));
    const userId = userData.user ? userData.user._id : userData._id;
    const res = await fetch(`${chartUrl}?userId=${userId}`);
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
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) return;
        const userId = userData.user ? userData.user._id : userData._id;

        // 1. משיכת רשימת האימונים העדכנית ביותר מהשרת
        const response = await fetch(`/api/workouts?userId=${userId}`);
        const workouts = await response.json(); 

        // 2. עדכון רשימת ההיסטוריה ב-DOM
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = ''; // ניקוי הרשימה הישנה כדי למנוע כפילויות

        workouts.forEach(w => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <div class="history-left">
                    <div class="history-icon">🏃‍♂️</div>
                    <div class="history-text">
                        <h3>${w.title}</h3>
                        <p>${new Date(w.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="history-details">
                    <strong>${w.calories} kcal</strong>
                    <p>${w.distance || 0} km</p>
                </div>
            `;
            historyList.appendChild(item);
        });

        // 3. עדכון הסטטיסטיקות (חישוב מהנתונים החדשים שחזרו מהשרת)
        document.getElementById('totalWorkouts').textContent = workouts.length;
        
        // עדכון גרף במידת הצורך
        if (progressChart) {
             // כאן נכנסת הלוגיקה שלך לעדכון הגרף לפי workouts
             progressChart.update();
        }

    } catch (err) { 
        console.error("Error loading analytics data:", err); 
    }
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