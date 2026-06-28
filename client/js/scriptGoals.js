document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.edit-input');
    const saveBtn = document.querySelector('.confirm-btn');
    const cancelBtn = document.querySelector('.secondary-btn'); 

    if (inputs.length < 2 || !saveBtn || !cancelBtn) {
        console.error("Error: Could not find inputs, save or cancel button.");
        return;
    }

    const stepsInput = inputs[0]; 
    const caloriesInput = inputs[1];

    // טעינת נתונים
    const savedGoals = JSON.parse(localStorage.getItem('userGoals'));
    if (savedGoals) {
        if (savedGoals.steps) stepsInput.value = savedGoals.steps;
        if (savedGoals.calories) caloriesInput.value = savedGoals.calories;
    }

    // שמירה
    saveBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const newGoals = { steps: stepsInput.value, calories: caloriesInput.value };
        localStorage.setItem('userGoals', JSON.stringify(newGoals));
        window.location.href = 'home.html';
    });

    // ביטול
    cancelBtn.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'profile.html';
    });
});