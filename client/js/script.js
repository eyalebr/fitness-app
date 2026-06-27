document.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('rememberMe').checked = true; // מסמן את ה-V אוטומטית
    }
});

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const serverMessage = document.getElementById('loginMessage');

    emailError.textContent = '';
    passwordError.textContent = '';
    serverMessage.textContent = '';
    serverMessage.className = 'server-message';

    let isValid = true;
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === '') {
        emailError.textContent = 'Email address is required.';
        isValid = false;
    } else if (!emailRegex.test(emailValue)) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    const passwordValue = passwordInput.value.trim();
    if (passwordValue === '') {
        passwordError.textContent = 'Password is required.';
        isValid = false;
    } else if (passwordValue.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters long.';
        isValid = false;
    }

    if (isValid) {
        try {
            const submitBtn = document.querySelector('#loginForm .primary-btn');
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;

            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailValue, password: passwordValue })
            });

            const data = await response.json();

            if (response.ok) {
                serverMessage.textContent = 'Login successful! Welcome back.';
                serverMessage.classList.add('success');
                
                // הוסף את זה ממש לפני ה- setTimeout
                const rememberMeChecked = document.getElementById('rememberMe').checked;
                if (rememberMeChecked) {
                    localStorage.setItem('rememberedEmail', emailValue);
                } else {
                        localStorage.removeItem('rememberedEmail');
                }
                
                // שמירת פרטי המשתמש בדפדפן כדי לדעת מי מחובר בשאר המסכים
                localStorage.setItem('user', JSON.stringify(data));

                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1000);
            } else {
                serverMessage.textContent = data.message || 'Invalid email or password.';
                serverMessage.classList.add('error');
                submitBtn.textContent = 'Login';
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error during login:', error);
            serverMessage.textContent = 'Server error. Please check your connection.';
            serverMessage.classList.add('error');
            
            const submitBtn = document.querySelector('#loginForm .primary-btn');
            submitBtn.textContent = 'Login';
            submitBtn.disabled = false;
        }
    }
});