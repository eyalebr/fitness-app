// תופסים את הטופס לפי ה-ID שלו
const loginForm = document.getElementById('loginForm');

// מאזינים לאירוע של שליחת הטופס (לחיצה על כפתור הלוגין)
loginForm.addEventListener('submit', function(event) {
    // מונע מהדף להתרענן אוטומטית (ברירת המחדל של טפסים)
    event.preventDefault();

    // תופסים את השדות והערכים שהמשתמש הזין
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // תופסים את המקומות שבהם נציג את השגיאות
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // מאפסים את הודעות השגיאה לפני כל בדיקה חדשה
    emailError.textContent = '';
    passwordError.textContent = '';

    let isValid = true;

    // --- בדיקת אימייל ---
    const emailValue = emailInput.value.trim();
    // תבנית בסיסית לבדיקת אימייל חוקי (חייב להכיל @ ונקודה)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === '') {
        emailError.textContent = 'Email address is required.';
        isValid = false;
    } else if (!emailRegex.test(emailValue)) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // --- בדיקת סיסמה ---
    const passwordValue = passwordInput.value.trim();

    if (passwordValue === '') {
        passwordError.textContent = 'Password is required.';
        isValid = false;
    } else if (passwordValue.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters long.';
        isValid = false;
    }

    // --- אם הכל תקין ---
    if (isValid) {
        // מציגים הודעת הצלחה (בשלב זה אין חיבור לשרת אמיתי)
        alert('Login successful! Welcome back.');
        // אפשר גם לאפס את הטופס אם רוצים
        window.location.href = 'index.html';
    }
});