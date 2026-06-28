document.addEventListener('DOMContentLoaded', () => {
    // פונקציית עזר להצגת מודאל התראה מעוצב (במקום alert)
    function showCustomAlert(message, isSuccess = true) {
        const modal = document.createElement('div');
        modal.className = 'custom-popup-modal';
        modal.innerHTML = `
            <div class="popup-modal-content">
                <div class="popup-modal-icon" style="color: ${isSuccess ? '#6a9c78' : '#d90429'}">
                    ${isSuccess ? '✓' : '⚠️'}
                </div>
                <p class="popup-modal-text">${message}</p>
                <button class="popup-modal-close-btn">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.popup-modal-close-btn').addEventListener('click', () => modal.remove());
    }

    // פונקציית עזר להצגת מודאל אישור מעוצב (במקום confirm)
    function showCustomConfirm(message, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'custom-popup-modal';
        modal.innerHTML = `
            <div class="popup-modal-content">
                <div class="popup-modal-icon" style="color: #fbc02d">❓</div>
                <p class="popup-modal-text">${message}</p>
                <div class="popup-modal-actions">
                    <button class="popup-modal-btn cancel-btn">No</button>
                    <button class="popup-modal-btn confirm-btn">Yes</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
            onConfirm(false);
        });
        modal.querySelector('.confirm-btn').addEventListener('click', () => {
            modal.remove();
            onConfirm(true);
        });
    }

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
        document.getElementById('main-profile-view').classList.add('hidden-view');
        document.getElementById('edit-profile-view').classList.remove('hidden-view');
    });

    document.getElementById('btnBackToProfile').addEventListener('click', () => {
        document.getElementById('edit-profile-view').classList.add('hidden-view');
        document.getElementById('main-profile-view').classList.remove('hidden-view');
    });

    // --- לוגיקת שינוי סיסמה ---
    document.getElementById('btnConfirmChange').addEventListener('click', async () => {
        const newPassword = document.getElementById('newPassword').value;
        if (newPassword.length < 6) {
            showCustomAlert("Password must be at least 6 characters long.", false);
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
                showCustomAlert("Password updated successfully!", true);
                document.getElementById('newPassword').value = ''; 
                document.getElementById('edit-profile-view').classList.add('hidden-view');
                document.getElementById('main-profile-view').classList.remove('hidden-view');
            } else {
                showCustomAlert("Failed to update password.", false);
            }
        } catch (error) {
            console.error("Error updating password:", error);
            showCustomAlert("Server error. Please try again.", false);
        }
    });

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

    // --- לוגיקת מחיקת חשבון מתוקנת ומעוצבת ---
    document.getElementById('btnDeleteAccount').addEventListener('click', () => {
        showCustomConfirm("Are you sure you want to delete your account? This action cannot be undone.", async (isConfirmed) => {
            if (isConfirmed) {
                const userData = JSON.parse(localStorage.getItem('user'));
                const userId = userData.user ? userData.user._id : userData._id;

                try {
                    const response = await fetch(`/api/users/delete-account/${userId}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (response.ok) {
                        localStorage.removeItem('user');
                        showCustomAlert("Account deleted successfully.", true);
                        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
                    } else {
                        showCustomAlert("Failed to delete account. Please try again.", false);
                    }
                } catch (error) {
                    console.error("Error deleting account:", error);
                    showCustomAlert("Server error.", false);
                }
            }
        });
    });
});