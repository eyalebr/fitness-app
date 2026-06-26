// תוכן מלא ל-scriptWorkout.js
const workoutsData = [
    { id: 1, title: "Running", description: "Outdoor or treadmill<br>running", bgClass: "bg-running", iconElement: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="2"/><path d="M13 6l-2 6"/><path d="M11 12l-4 3-3-1"/><path d="M11 12l3 4-1 5"/><path d="M12 8l4 1 2-3"/><path d="M12 8l-3 2-2-2"/></svg>` },
    { id: 2, title: "Walking", description: "Casual or brisk walking", bgClass: "bg-walking", iconElement: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 12 6-2 6 2"/><path d="M12 14v-4"/></svg>` },
    { id: 3, title: "Cycling", description: "Indoor or outdoor<br>cycling", bgClass: "bg-cycling", iconElement: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>` },
    { id: 4, title: "Custom", description: "Custom workout activity", bgClass: "bg-custom", iconElement: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>` }
];

function renderWorkouts() {
    const container = document.getElementById('workouts-container');
    container.innerHTML = '';

    // קריאת היעד שנבחר במסך הבית מה-URL
    const urlParams = new URLSearchParams(window.location.search);
    const targetLat = urlParams.get('targetLat');
    const targetLng = urlParams.get('targetLng');
    
    // בונים מחרוזת של פרמטרים להעברה לדף הבא
    let extraParams = '';
    if (targetLat && targetLng) {
        extraParams = `&targetLat=${targetLat}&targetLng=${targetLng}`;
    }

    workoutsData.forEach(workout => {
        const cardHTML = `
            <div class="workout-card">
                <div class="workout-info-wrapper">
                    <div class="workout-icon ${workout.bgClass}">${workout.iconElement}</div>
                    <div class="workout-text">
                        <h3>${workout.title}</h3>
                        <p>${workout.description}</p>
                    </div>
                </div>
                <button class="start-btn" onclick="window.location.href='session.html?type=${workout.title}${extraParams}'">
                    Start
                </button>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

document.addEventListener('DOMContentLoaded', renderWorkouts);