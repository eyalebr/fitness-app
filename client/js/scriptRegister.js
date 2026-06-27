const registerForm = document.getElementById('registerForm');

// הוספנו async כדי שנוכל להמתין לתשובת השרת
registerForm.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    const serverMessage = document.getElementById('registerMessage');
    serverMessage.textContent = '';
    serverMessage.className = 'server-message'; // איפוס מחלקות

    const fullName = document.getElementById('fullName').value.trim();
    const birthDate = document.getElementById('birthDate').value;
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let isValid = true;

    if (fullName === '' || fullName.length < 2 || fullName.toLowerCase() === 'enter your full name') {
        document.getElementById('nameError').textContent = 'Please enter a valid full name.';
        isValid = false;
    }
    if (birthDate === '') {
        document.getElementById('dateError').textContent = 'Please select your birth date.';
        isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '' || !emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        isValid = false;
    }
    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters.';
        isValid = false;
    }
    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match.';
        isValid = false;
    }

    // אם כל השדות תקינים בצד לקוח - שולחים לשרת
    if (isValid) {
        try {
            // החלף את הטקסט בכפתור למצב טעינה
            const submitBtn = document.querySelector('#registerForm .primary-btn');
            submitBtn.textContent = 'Registering...';
            submitBtn.disabled = true;

            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, birthDate, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // במקום Alert - הצגת הודעה מעוצבת במסך
                serverMessage.textContent = 'Registration successful! Redirecting...';
                serverMessage.classList.add('success');
                
                // המתנה של שנייה וחצי כדי שהמשתמש יקרא את ההודעה, ואז מעבר ללוגין
                setTimeout(() => {
                    window.location.href ='/home.html';
                }, 1500);
            } else {
                serverMessage.textContent = data.message || 'Registration failed. Try again.';
                serverMessage.classList.add('error');
                submitBtn.textContent = 'Sign Up';
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error during registration:', error);
            serverMessage.textContent = 'Server error. Please check your connection.';
            serverMessage.classList.add('error');
            
            const submitBtn = document.querySelector('#registerForm .primary-btn');
            submitBtn.textContent = 'Sign Up';
            submitBtn.disabled = false;
        }
    }
});