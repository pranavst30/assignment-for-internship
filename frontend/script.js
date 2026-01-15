/**
 * REST API Frontend - Authentication Script
 * Handles login and registration functionality
 */

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginContainer = document.getElementById('login-form');
const registerContainer = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const messageDiv = document.getElementById('message');

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Display message to user
 * @param {string} text - Message text
 * @param {string} type - Message type (success, error, warning)
 */
function showMessage(text, type = 'error') {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove('hidden');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

/**
 * Store authentication data in localStorage
 * @param {Object} data - Auth data containing token and user info
 */
function storeAuthData(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
}

/**
 * Clear authentication data from localStorage
 */
function clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

/**
 * Redirect to dashboard if authenticated
 */
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }
}

/**
 * Make API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Response data
 */
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

// ===========================================
// EVENT HANDLERS
// ===========================================

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
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

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        showMessage(error.message, 'error');
    }
}

/**
 * Handle registration form submission
 * @param {Event} e - Form submit event
 */
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

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        showMessage(error.message, 'error');
    }
}

/**
 * Toggle between login and register forms
 * @param {string} form - Form to show ('login' or 'register')
 */
function toggleForms(form) {
    if (form === 'register') {
        loginContainer.classList.add('hidden');
        registerContainer.classList.remove('hidden');
    } else {
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    }
    // Clear any messages
    messageDiv.classList.add('hidden');
}

// ===========================================
// EVENT LISTENERS
// ===========================================

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    redirectIfAuthenticated();
});

// Login form submission
loginForm.addEventListener('submit', handleLogin);

// Register form submission
registerForm.addEventListener('submit', handleRegister);

// Toggle to register form
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleForms('register');
});

// Toggle to login form
showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleForms('login');
});

// Password visibility toggle
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
