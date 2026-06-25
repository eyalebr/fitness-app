// פונקציה 1: שליפת סטטיסטיקות של האימונים
async function fetchWorkoutStats() {
    try {
        const response = await fetch('http://localhost:3000/api/workouts/stats/summary');
        
        if (!response.ok) {
            throw new Error('Failed to fetch stats');
        }

        const stats = await response.json();

        document.getElementById('total-workouts').textContent = stats.totalWorkouts || 0;
        document.getElementById('total-calories').textContent = stats.totalCalories || 0;
        document.getElementById('total-time').innerHTML = `${stats.totalDuration || 0} <span class="unit">min</span>`;

    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// פונקציה 2: שליפת מסלולי הליכה מה-API החיצוני
async function fetchTrails() {
    try {
        const response = await fetch('http://localhost:3000/api/explore/trails');
        const data = await response.json();
        
        const container = document.getElementById('trails-container');
        container.innerHTML = ''; // מנקה את המילה "Loading..."
        
        // עובר על כל מסלול שחזר מהשרת ומייצר לו שורה ב-HTML
        data.suggestions.forEach(trail => {
            container.innerHTML += `
                <div class="progress-row" style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                    <div style="display: flex; flex-direction: column;">
                        <span class="row-value" style="font-size: 15px;">${trail.name}</span>
                        <span class="row-label" style="font-size: 12px; margin-top: 3px; color: #888;">${trail.address}</span>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error fetching trails:', error);
        document.getElementById('trails-container').innerHTML = '<p style="text-align: center; color: #d9534f;">Could not load trails.</p>';
    }
}

// ברגע שהדף מסיים להיטען, מפעילים את שתי הפונקציות ביחד
document.addEventListener('DOMContentLoaded', () => {
    fetchWorkoutStats();
    fetchTrails();
});