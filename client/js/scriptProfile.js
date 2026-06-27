document.addEventListener('DOMContentLoaded', () => {
    // 1. שאיבת נתוני המשתמש מ-localStorage
    const userDataString = localStorage.getItem('user');
    
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        const user = userData.user ? userData.user : userData;
        
        if (user.fullName && user.email) {
            document.getElementById('displayName').textContent = user.fullName;
            document.getElementById('detailName').textContent = user.fullName;
            document.getElementById('displayEmail').textContent = user.email;
            document.getElementById('detailEmail').textContent = user.email;
        }
    } else {
        window.location.href = 'index.html';
    }

    // 2. מעבר למסך עריכת פרופיל
    document.getElementById('btnGoToEdit').addEventListener('click', () => {
        document.getElementById('main-profile-view').style.display = 'none';
        document.getElementById('edit-profile-view').style.display = 'block';
    });

    // מעבר חזרה מפרופיל העריכה למסך הראשי
    document.getElementById('btnBackToProfile').addEventListener('click', () => {
        document.getElementById('edit-profile-view').style.display = 'none';
        document.getElementById('main-profile-view').style.display = 'block';
    });

    // --- התוספת שלנו: מעבר לעמוד Goals ---
    document.getElementById('btnGoals').addEventListener('click', () => {
        window.location.href = 'goals.html';
    });

    // --- התוספת שלנו: מעבר לעמוד Settings ---
    document.getElementById('btnSettings').addEventListener('click', () => {
        window.location.href = 'settings.html';
    });

    // 3. פעולת התנתקות (Logout)
    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});