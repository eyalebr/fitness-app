const workoutsData = [
    {
        id: 1,
        title: "Running",
        description: "Outdoor or treadmill<br>running", 
        bgClass: "bg-running",
        // קוד שמייצר ציור של נעליים
        iconElement: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="13" cy="4" r="2"/>
            <path d="M13 6l-2 6"/>
            <path d="M11 12l-4 3-3-1"/>
            <path d="M11 12l3 4-1 5"/>
            <path d="M12 8l4 1 2-3"/>
            <path d="M12 8l-3 2-2-2"/>
        </svg>`    
    },
    {
        id: 2,
        title: "Walking",
        description: "Casual or brisk walking",
        bgClass: "bg-walking",
        // קוד שמייצר ציור של איש הולך
        iconElement: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 12 6-2 6 2"/><path d="M12 14v-4"/></svg>`
    },
    {
        id: 3,
        title: "Cycling",
        description: "Indoor or outdoor<br>cycling",
        bgClass: "bg-cycling",
        // קוד שמייצר ציור של אופניים
        iconElement: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>`
    },
    {
        id: 4,
        title: "Custom",
        description: "Custom workout activity",
        bgClass: "bg-custom",
        // קוד שמייצר ציור של קו דופק
        iconElement: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`
    }
];

function renderWorkouts() {
    const container = document.getElementById('workouts-container');
    container.innerHTML = '';

    // אייקון המשולש (Play) עבור הכפתור
    const playIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;

    workoutsData.forEach(workout => {
        const cardHTML = `
            <div class="workout-card">
                <div class="workout-info-wrapper">
                    <div class="workout-icon ${workout.bgClass}">
                        ${workout.iconElement}
                    </div>
                    <div class="workout-text">
                        <h3>${workout.title}</h3>
                        <p>${workout.description}</p>
                    </div>
                </div>
                <button class="start-btn">
                    ${playIcon} Start
                </button>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

document.addEventListener('DOMContentLoaded', renderWorkouts);