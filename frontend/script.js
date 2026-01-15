


const API_BASE_URL = 'http://localhost:5000/api/v1';


const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginContainer = document.getElementById('login-form');
const registerContainer = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const messageDiv = document.getElementById('message');




function showMessage(text, type = 'error') {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove('hidden');


    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}


function storeAuthData(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
}


function clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}


function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}


function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }
}


async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'An error occurred');
        }

        return data;
    } catch (error) {
        throw error;
    }
}




async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        showMessage('Login successful! Redirecting...', 'success');
        storeAuthData(response.data);


        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        showMessage(error.message, 'error');
    }
}


async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    try {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, role }),
        });

        showMessage('Registration successful! Redirecting...', 'success');
        storeAuthData(response.data);


        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        showMessage(error.message, 'error');
    }
}


function toggleForms(form) {
    if (form === 'register') {
        loginContainer.classList.add('hidden');
        registerContainer.classList.remove('hidden');
    } else {
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    }

    messageDiv.classList.add('hidden');
}




document.addEventListener('DOMContentLoaded', () => {
    redirectIfAuthenticated();
});


loginForm.addEventListener('submit', handleLogin);


registerForm.addEventListener('submit', handleRegister);


showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleForms('register');
});


showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleForms('login');
});


document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const input = document.getElementById(targetId);

        if (input.type === 'password') {
            input.type = 'text';
            button.textContent = 'Hide';
        } else {
            input.type = 'password';
            button.textContent = 'Show';
        }
    });
});
