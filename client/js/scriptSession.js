// משתני מערכת לטיימר ולחישובים
let timerInterval;
let seconds = 0;
let isPaused = false;
let currentCalories = 0;
let currentDistance = 0;
let currentBpm = 75;

// אלמנטים במסך
const timerDisplay = document.getElementById('live-timer');
const caloriesDisplay = document.getElementById('live-calories');
const distanceDisplay = document.getElementById('live-distance');
const bpmDisplay = document.getElementById('live-bpm');

// עיצוב זמן בצורת HH:MM:SS
function formatTime(totalSeconds) {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// הפעלת הטיימר
function startTimer() {
    timerInterval = setInterval(() => {
        if (!isPaused) {
            seconds++;
            timerDisplay.textContent = formatTime(seconds);
            
            // הדמיה של שריפת קלוריות ומרחק (לצורך הפרויקט)
            if (seconds % 5 === 0) currentCalories += 1; // קלוריה כל 5 שניות
            if (seconds % 10 === 0) currentDistance += 0.02; // התקדמות במרחק
            
            // הדמיה של דופק משתנה
            currentBpm = Math.floor(Math.random() * (150 - 130 + 1)) + 130; 

            caloriesDisplay.textContent = currentCalories;
            distanceDisplay.textContent = currentDistance.toFixed(2);
            bpmDisplay.textContent = currentBpm;
        }
    }, 1000);
}

// כפתור השהייה
document.getElementById('pauseBtn').addEventListener('click', function() {
    isPaused = !isPaused;
    this.textContent = isPaused ? "▶ Resume" : "⏸ Pause";
});

// כפתור עצירה - עובר למסך סיכום
document.getElementById('stopBtn').addEventListener('click', function() {
    clearInterval(timerInterval); // עוצר את הטיימר
    
    // העברת נתונים למסך הסיכום
    document.getElementById('sum-duration').textContent = formatTime(seconds);
    document.getElementById('sum-distance').textContent = currentDistance.toFixed(2) + " km";
    document.getElementById('sum-calories').textContent = currentCalories + " kcal";
    document.getElementById('sum-bpm').textContent = currentBpm + " bpm";

    // החלפת מסכים
    document.getElementById('active-workout-view').style.display = 'none';
    document.getElementById('summary-view').style.display = 'block';
});

// כפתור Done - שולח POST לשרת המקומי (MongoDB)
document.getElementById('doneBtn').addEventListener('click', async function() {
    const workoutData = {
        activityType: 'Running', // אפשר לשנות בהתאם לבחירה הקודמת
        duration: Math.floor(seconds / 60), // השרת שלנו מצפה לדקות
        calories: currentCalories
    };

    try {
        const response = await fetch('http://localhost:3000/api/workouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(workoutData)
        });

        if (response.ok) {
            // הנתונים נשמרו בשרת בהצלחה! חוזרים לעמוד הבית
            window.location.href = 'index.html';
        } else {
            alert('Failed to save workout. Please try again.');
        }
    } catch (error) {
        console.error('Error saving workout:', error);
        alert('Server error. Could not save workout.');
    }
});

// הפעלה אוטומטית כשהדף נטען
document.addEventListener('DOMContentLoaded', startTimer);