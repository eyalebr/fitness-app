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

    // --- לוגיקת שינוי סיסמה (התוספת שביקשת) ---
    document.getElementById('btnConfirmChange').addEventListener('click', async () => {
        const newPassword = document.getElementById('newPassword').value;
        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData.user ? userData.user._id : userData._id;

        try {
            const response = await fetch('/api/users/update-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, newPassword })
            });

            if (response.ok) {
                alert("Password updated successfully!");
                document.getElementById('newPassword').value = ''; // איפוס השדה
                document.getElementById('edit-profile-view').style.display = 'none';
                document.getElementById('main-profile-view').style.display = 'block';
            } else {
                alert("Failed to update password.");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Server error. Please try again.");
        }
    });

    // 3. שאר הלוגיקה הקיימת
    document.getElementById('btnGoals').addEventListener('click', () => {
        window.location.href = 'goals.html';
    });

    document.getElementById('btnSettings').addEventListener('click', () => {
        window.location.href = 'settings.html';
    });

    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});