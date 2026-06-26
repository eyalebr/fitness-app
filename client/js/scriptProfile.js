document.addEventListener('DOMContentLoaded', () => {
    // 1. שאיבת נתוני המשתמש מ-localStorage כדי להציג מידע דינמי אמיתי!
    const userDataString = localStorage.getItem('user');
    
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        // אם הנתונים שמורים בתוך אובייקט user (כמו שעשינו בהתחברות)
        const user = userData.user ? userData.user : userData;
        
        if (user.fullName && user.email) {
            document.getElementById('displayName').textContent = user.fullName;
            document.getElementById('detailName').textContent = user.fullName;
            document.getElementById('displayEmail').textContent = user.email;
            document.getElementById('detailEmail').textContent = user.email;
        }
    } else {
        // אם אין משתמש מחובר - מעיפים אותו למסך הלוגין
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

    // 3. פעולת התנתקות (Logout) מלאה שעומדת בדרישות הפרויקט
    document.getElementById('btnLogout').addEventListener('click', () => {
        // מחיקת נתוני המשתמש מהדפדפן
        localStorage.removeItem('user');
        // העברה לעמוד ההתחברות
        window.location.href = 'index.html';
    });
});