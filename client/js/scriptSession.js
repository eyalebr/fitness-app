// משתני מערכת לטיימר ולחישובים
let timerInterval;
let seconds = 0;
let isPaused = false;
let currentCalories = 0;
let currentDistance = 0; 
let currentBpm = 75;
let currentWorkoutType = "Running"; 

// משתני יעד (נמשכים מה-URL)
let targetLat = null;
let targetLng = null;

// משתני מפה ומעקב GPS
let sessionMap = null;
let routePolyline = null;
let userMarker = null;
let routeCoords = [];
let geoWatchId = null;
let lastLatLng = null;
let routingControl = null; 
let destinationMarker = null;

const timerDisplay = document.getElementById('live-timer');
const caloriesDisplay = document.getElementById('live-calories');
const distanceDisplay = document.getElementById('live-distance');
const bpmDisplay = document.getElementById('live-bpm');

function formatTime(totalSeconds) {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// פונקציה חכמה לציור מסלול ניווט אל היעד (שומרת על קוד נקי)
function drawRouteToTarget(destLatLng) {
    if (!lastLatLng) return; // חייב GPS קודם

    if (routingControl) sessionMap.removeControl(routingControl);
    if (destinationMarker) sessionMap.removeLayer(destinationMarker);

    destinationMarker = L.marker(destLatLng).addTo(sessionMap).bindPopup("<b>Target Destination</b>").openPopup();

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(lastLatLng.lat, lastLatLng.lng), // מהמיקום שלך
            destLatLng // אל היעד
        ],
        router: L.Routing.osrmv1({ language: 'en', profile: 'foot' }),
        lineOptions: { styles: [{color: '#2196F3', opacity: 0.8, weight: 6}] },
        createMarker: function() { return null; },
        show: false, addWaypoints: false, routeWhileDragging: false, fitSelectedRoutes: true
    }).addTo(sessionMap);
}

function initLiveMap() {
    sessionMap = L.map('session-map').setView([32.0823, 34.8107], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '© OpenStreetMap'
    }).addTo(sessionMap);

    // הקו האדום של ההתקדמות האמיתית שלך
    routePolyline = L.polyline([], { color: '#d90429', weight: 6 }).addTo(sessionMap);

    const mapDiv = document.getElementById('session-map');
    const mapWrapper = document.getElementById('session-map-wrapper');
    const expandBtn = document.getElementById('expandSessionMapBtn');
    const closeBtn = document.getElementById('closeSessionMapBtn');

    expandBtn.addEventListener('click', () => {
        mapDiv.classList.add('map-fullscreen');
        mapWrapper.style.position = 'static';
        closeBtn.style.display = 'block';
        expandBtn.style.display = 'none';
        setTimeout(() => { sessionMap.invalidateSize(); }, 300);
    });

    closeBtn.addEventListener('click', () => {
        mapDiv.classList.remove('map-fullscreen');
        mapWrapper.style.position = 'relative';
        closeBtn.style.display = 'none';
        expandBtn.style.display = 'block';
        setTimeout(() => { sessionMap.invalidateSize(); }, 300);
    });

    // אפשרות לשנות מסלול באמצע האימון בלחיצה על המפה
    sessionMap.on('click', function(e) {
        if (!mapDiv.classList.contains('map-fullscreen')) return;
        if (!lastLatLng) { alert("Waiting for GPS lock..."); return; }
        drawRouteToTarget(e.latlng);
    });
}

function startLiveTracking() {
    if ("geolocation" in navigator) {
        geoWatchId = navigator.geolocation.watchPosition(
            (position) => {
                if (isPaused) return;

                const currentLatLng = L.latLng(position.coords.latitude, position.coords.longitude);

                if (!userMarker) {
                    userMarker = L.marker(currentLatLng).addTo(sessionMap).bindPopup("<b>You are here</b>");
                    sessionMap.setView(currentLatLng, 16);
                } else {
                    userMarker.setLatLng(currentLatLng);
                    sessionMap.panTo(currentLatLng);
                }

                routeCoords.push(currentLatLng);
                routePolyline.setLatLngs(routeCoords);

                if (lastLatLng) {
                    const distMeters = lastLatLng.distanceTo(currentLatLng);
                    if (distMeters > 2) { 
                        currentDistance += (distMeters / 1000); 
                        distanceDisplay.textContent = currentDistance.toFixed(2);
                    }
                }
                
                // רגע הקסם: אם זה הדיגום הראשון של ה-GPS ויש לנו יעד שנבחר בדף הקודם, צייר אליו מסלול!
                if (!lastLatLng && targetLat && targetLng) {
                    lastLatLng = currentLatLng; 
                    drawRouteToTarget(L.latLng(targetLat, targetLng));
                }

                lastLatLng = currentLatLng; 
            },
            (error) => { 
                console.error("GPS error:", error); 
                // מיקום זמני במקרה שאין אישור GPS למחשב שלך בבדיקות
                if (!lastLatLng) {
                    lastLatLng = L.latLng(32.0823, 34.8107);
                    userMarker = L.marker(lastLatLng).addTo(sessionMap).bindPopup("<b>Demo Location</b>").openPopup();
                    sessionMap.setView(lastLatLng, 15);
                    if (targetLat && targetLng) drawRouteToTarget(L.latLng(targetLat, targetLng));
                }
            },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 5000 }
        );
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (!isPaused) {
            seconds++;
            timerDisplay.textContent = formatTime(seconds);
            if (seconds % 5 === 0) currentCalories += 1; 
            currentBpm = Math.floor(Math.random() * (150 - 130 + 1)) + 130; 
            caloriesDisplay.textContent = currentCalories;
            bpmDisplay.textContent = currentBpm;
        }
    }, 1000);
}

document.getElementById('pauseBtn').addEventListener('click', function() {
    isPaused = !isPaused;
    this.textContent = isPaused ? "▶ Resume" : "⏸ Pause";
});

document.getElementById('stopBtn').addEventListener('click', function() {
    clearInterval(timerInterval); 
    if (geoWatchId) navigator.geolocation.clearWatch(geoWatchId); 
    
    document.getElementById('sum-duration').textContent = formatTime(seconds);
    document.getElementById('sum-distance').textContent = currentDistance.toFixed(2) + " km";
    document.getElementById('sum-calories').textContent = currentCalories + " kcal";
    document.getElementById('sum-bpm').textContent = currentBpm + " bpm";

    document.getElementById('active-workout-view').style.display = 'none';
    document.getElementById('summary-view').style.display = 'block';
});

document.getElementById('doneBtn').addEventListener('click', async function() {
    // 1. שאיבת ה-ID מה-localStorage של המשתמש המחובר
    const userData = JSON.parse(localStorage.getItem('user'));
    // תיקון: תמיכה גם בפורמט userData.user וגם ב-userData ישיר
    const userId = userData.user ? userData.user._id : userData._id;

    if (!userId) {
        alert("Error: User not logged in.");
        return;
    }

    const calculatedSteps = Math.floor(currentDistance * 1000);

    const workoutData = {
        userId: userId, // כאן התיקון הקריטי
        activityType: currentWorkoutType,
        title: `${currentWorkoutType} Session`,
        description: "Outdoor workout session",
        duration: Math.floor(seconds / 60),
        calories: currentCalories,
        distance: parseFloat(currentDistance.toFixed(2)), // הוספנו גם מרחק כי זה חשוב לסטטיסטיקה
        steps: calculatedSteps
    };

    try {
        // 2. הוספת הפורט הנכון (3000) כדי לתקשר עם השרת
        const response = await fetch('/api/workouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(workoutData)
        });

        if (response.ok) {
            window.location.href = 'home.html';
        } else {
            alert('Failed to save workout. Server responded with error.');
        }
    } catch (error) {
        console.error('Error saving workout:', error);
        alert('Error connecting to server.');
    }
});


// אתחול העמוד
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // קריאת סוג האימון
    const workoutType = urlParams.get('type'); 
    if (workoutType) {
        currentWorkoutType = workoutType;
        const titleElement = document.querySelector('.workout-header h2');
        if (titleElement) titleElement.textContent = `${workoutType} Workout`;
    }

    // קריאת היעד (אם נבחר כזה)
    targetLat = urlParams.get('targetLat');
    targetLng = urlParams.get('targetLng');

    initLiveMap();
    startLiveTracking();
    startTimer();
});