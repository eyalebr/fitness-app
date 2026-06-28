// משתנים גלובליים לשמירת היעדים (ברירת מחדל: 10,000 ו-600)
let currentStepGoal = 10000;
let currentCalGoal = 600;

// פונקציה חדשה שרצה מיד ודואגת רק ליעדים!
function updateGoalsDisplay() {
    const savedGoals = JSON.parse(localStorage.getItem('userGoals'));
    
    if (savedGoals) {
        if (savedGoals.steps) currentStepGoal = savedGoals.steps;
        if (savedGoals.calories) currentCalGoal = savedGoals.calories;
    }

    // מעדכן את הטקסט במסך
    const stepsGoalElement = document.getElementById('homeStepsGoal');
    if (stepsGoalElement) {
        stepsGoalElement.textContent = `Goal: ${Number(currentStepGoal).toLocaleString()}`;
    }
    
    const caloriesGoalElement = document.getElementById('homeCaloriesGoal');
    if (caloriesGoalElement) {
        caloriesGoalElement.textContent = `Goal: ${Number(currentCalGoal).toLocaleString()}`;
    }
}

// פונקציה לשליפת הנתונים מהשרת (לא עוצרת את טעינת היעדים יותר)
// פונקציה לשליפת הנתונים מהשרת עם סינון לפי userId
async function fetchWorkoutStats() {
    try {
        // 1. קבלת ה-ID מה-localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData ? (userData.user ? userData.user._id : userData._id) : null;

        if (!userId) {
            console.log("User not logged in, skipping stats fetch.");
            return;
        }

        // 2. הוספת ה-userId לכתובת ה-API
        const response = await fetch(`/api/workouts/stats/summary?userId=${userId}`, {
            headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();

        // 3. עדכון הנתונים (אותו קוד שלך)
        if (data.daily) {
            const steps = data.daily.steps || 0;
            const calories = data.daily.calories || 0;
            const duration = data.daily.duration || 0;

            document.getElementById('daily-steps').textContent = steps.toLocaleString();
            document.getElementById('daily-calories').textContent = calories;
            document.getElementById('daily-time').innerHTML = `${duration} <span class="unit">min</span>`;
            
            document.getElementById('progress-steps').style.width = `${Math.min((steps / currentStepGoal) * 100, 100)}%`;
            document.getElementById('progress-calories').style.width = `${Math.min((calories / currentCalGoal) * 100, 100)}%`;
            document.getElementById('progress-time').style.width = `${Math.min((duration / 60) * 100, 100)}%`;
        }

        if (data.weekly) {
            document.getElementById('weekly-workouts').textContent = data.weekly.totalWorkouts || 0;
            document.getElementById('weekly-distance').textContent = `${(data.weekly.totalDistance || 0).toFixed(1)} km`;
            document.getElementById('weekly-calories').textContent = `${data.weekly.totalCalories || 0} kcal`;
        }
    } catch (error) {
        console.log('Stats sync error:', error);
    }
}

// פונקציית המפה
function initMap() {
    let startPoint = [32.0823, 34.8107]; 
    const map = L.map('map').setView(startPoint, 13);
    let currentRouteLine = null;
    let endMarker = null;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '© OpenStreetMap'
    }).addTo(map);

    // --- הוספת המיקום שלך ---
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                startPoint = [position.coords.latitude, position.coords.longitude];
                map.setView(startPoint, 14);
                L.marker(startPoint).addTo(map).bindPopup("You are here!").openPopup();
            },
            (error) => { console.error("Error getting location: ", error); }
        );
    }

    // לוגיקת המפה והפונקציונליות
    const mapDiv = document.getElementById('map');
    const mapWrapper = document.getElementById('map-wrapper');
    const expandBtn = document.getElementById('expandMapBtn');
    const closeBtn = document.getElementById('closeMapBtn');
    const randomBtn = document.getElementById('randomRouteBtn');

    expandBtn.addEventListener('click', () => {
        mapDiv.classList.add('map-fullscreen');
        mapWrapper.style.position = 'static'; 
        closeBtn.style.display = 'block';
        randomBtn.style.display = 'block';
        expandBtn.style.display = 'none';
        setTimeout(() => { map.invalidateSize(); }, 300);
    });

    closeBtn.addEventListener('click', () => {
        mapDiv.classList.remove('map-fullscreen');
        mapWrapper.style.position = 'relative'; 
        closeBtn.style.display = 'none';
        randomBtn.style.display = 'none';
        expandBtn.style.display = 'block';
        setTimeout(() => { map.invalidateSize(); map.setView(startPoint, 14); }, 300);
    });

    randomBtn.addEventListener('click', () => {
        const latOffset = (Math.random() - 0.5) * 0.04;
        const lngOffset = (Math.random() - 0.5) * 0.04;
        const randomCoords = [startPoint[0] + latOffset, startPoint[1] + lngOffset];
        map.setView(randomCoords, 14);
        map.fire('click', { latlng: { lat: randomCoords[0], lng: randomCoords[1] } });
    });

    map.on('click', function(e) {
        if (!mapDiv.classList.contains('map-fullscreen')) return;
        if (currentRouteLine) map.removeLayer(currentRouteLine); 
        if (endMarker) map.removeLayer(endMarker); 

        const endPoint = [e.latlng.lat, e.latlng.lng];
        endMarker = L.marker(endPoint).addTo(map);
        const distanceKM = (L.latLng(startPoint).distanceTo(e.latlng) / 1000).toFixed(2);

        currentRouteLine = L.polyline([startPoint, endPoint], {
            color: '#2196F3', weight: 5, opacity: 0.7, dashArray: '10, 10'
        }).addTo(map);

        endMarker.bindPopup(`
    <div style="text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 14px;">Distance: <b>${distanceKM} km</b></p>
        <button class="lets-go-btn" onclick="window.location.href='workouts.html?targetLat=${endPoint[0]}&targetLng=${endPoint[1]}'">
            Let's Go!
        </button>
    </div>
`).openPopup();
    });
}

// אתחול הכל בטעינת הדף
document.addEventListener('DOMContentLoaded', () => {
    
    const savedGoals = JSON.parse(localStorage.getItem('userGoals'));
    // עדכון תאריך אוטומטי
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // 1. קודם כל נטען את היעדים שלנו!
    updateGoalsDisplay();
    
    // 2. נמשוך נתונים מהשרת
    fetchWorkoutStats();
    
    // 3. נטען את המפה
    initMap();
    
    refreshHomeData();

    // רענון אוטומטי כל 30 שניות
    setInterval(fetchWorkoutStats, 30000);
});

// פונקציה חדשה שמרעננת את הנתונים מהשרת
async function refreshHomeData() {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) return;

    const userId = userData.user ? userData.user._id : userData._id;

    try {
        // משיכה מעודכנת של האימונים מהשרת
        const response = await fetch(`/api/workouts?userId=${userId}`);
        const workouts = await response.json();

        // חישוב מחדש של הצעדים/קלוריות מהנתונים העדכניים ביותר
        const totalSteps = workouts.reduce((sum, w) => sum + (w.steps || 0), 0);
        
        // עדכון ה-UI בנתונים העדכניים
        const stepsElement = document.getElementById('daily-steps');
        if (stepsElement) {
            stepsElement.textContent = totalSteps.toLocaleString();
        }
    } catch (error) {
        console.error("Error refreshing home data:", error);
    }
}