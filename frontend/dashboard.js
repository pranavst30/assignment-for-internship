/**
 * REST API Frontend - Dashboard Script
 * Handles task CRUD operations and authentication state
 */

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';

// State
let currentUser = null;
let currentPage = 1;
let totalPages = 1;
let currentFilter = '';
let editingTaskId = null;

// DOM Elements
const userInfoElement = document.getElementById('user-info');
const logoutBtn = document.getElementById('logout-btn');
const adminSection = document.getElementById('admin-section');
const taskForm = document.getElementById('taskForm');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const tasksContainer = document.getElementById('tasks-container');
const paginationDiv = document.getElementById('pagination');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfoSpan = document.getElementById('page-info');
const statusFilter = document.getElementById('status-filter');
const messageDiv = document.getElementById('message');

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Display message to user
 */
function showMessage(text, type = 'error') {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove('hidden');

    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

/**
 * Get auth token from localStorage
 */
function getToken() {
    return localStorage.getItem('token');
}

/**
 * Get user from localStorage
 */
function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

/**
 * Check if user is admin
 */
function isAdmin() {
    return currentUser && currentUser.role === 'ADMIN';
}

/**
 * Redirect to login if not authenticated
 */
function requireAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (response.status === 401) {
            // Token expired or invalid
            showMessage('Session expired. Please login again.', 'warning');
            setTimeout(() => logout(), 2000);
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            throw new Error(data.message || 'An error occurred');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Get badge class for status
 */
function getStatusBadgeClass(status) {
    const classes = {
        'PENDING': 'badge-pending',
        'IN_PROGRESS': 'badge-in-progress',
        'COMPLETED': 'badge-completed',
    };
    return classes[status] || 'badge-pending';
}

/**
 * Get badge class for priority
 */
function getPriorityBadgeClass(priority) {
    const classes = {
        'LOW': 'badge-low',
        'MEDIUM': 'badge-medium',
        'HIGH': 'badge-high',
    };
    return classes[priority] || 'badge-medium';
}

// ===========================================
// TASK FUNCTIONS
// ===========================================

/**
 * Load tasks from API
 */
async function loadTasks() {
    tasksContainer.innerHTML = '<p class="loading">Loading tasks...</p>';

    try {
        let endpoint = `/tasks?page=${currentPage}&limit=10`;
        if (currentFilter) {
            endpoint += `&status=${currentFilter}`;
        }

        const response = await apiRequest(endpoint);
        const { tasks, pagination } = response.data;

        totalPages = pagination.totalPages;

        renderTasks(tasks);
        updatePagination(pagination);

    } catch (error) {
        tasksContainer.innerHTML = `<p class="empty-state">Error loading tasks: ${error.message}</p>`;
    }
}

/**
 * Render tasks to DOM
 */
function renderTasks(tasks) {
    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<p class="empty-state">No tasks found. Create your first task!</p>';
        return;
    }

    const html = tasks.map(task => `
        <div class="task-card" data-id="${task._id}">
            <div class="task-header">
                <span class="task-title">${escapeHtml(task.title)}</span>
                ${isAdmin() ? `
                    <div class="task-actions">
                        <button class="btn btn-small btn-secondary" onclick="editTask('${task._id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="deleteTask('${task._id}')">Delete</button>
                    </div>
                ` : ''}
            </div>
            ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
            <div class="task-meta">
                <span class="task-badge ${getStatusBadgeClass(task.status)}">${task.status.replace('_', ' ')}</span>
                <span class="task-badge ${getPriorityBadgeClass(task.priority)}">${task.priority} Priority</span>
                <span>Created: ${formatDate(task.createdAt)}</span>
                ${task.createdBy ? `<span>By: ${escapeHtml(task.createdBy.name || 'Unknown')}</span>` : ''}
            </div>
        </div>
    `).join('');

    tasksContainer.innerHTML = html;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Update pagination controls
 */
function updatePagination(pagination) {
    if (pagination.totalPages <= 1) {
        paginationDiv.classList.add('hidden');
        return;
    }

    paginationDiv.classList.remove('hidden');
    pageInfoSpan.textContent = `Page ${pagination.currentPage} of ${pagination.totalPages}`;
    prevPageBtn.disabled = !pagination.hasPrevPage;
    nextPageBtn.disabled = !pagination.hasNextPage;
}

/**
 * Create or update task
 */
async function handleTaskSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const status = document.getElementById('task-status').value;
    const priority = document.getElementById('task-priority').value;

    const taskData = { title, description, status, priority };

    try {
        if (editingTaskId) {
            // Update existing task
            await apiRequest(`/tasks/${editingTaskId}`, {
                method: 'PUT',
                body: JSON.stringify(taskData),
            });
            showMessage('Task updated successfully!', 'success');
        } else {
            // Create new task
            await apiRequest('/tasks', {
                method: 'POST',
                body: JSON.stringify(taskData),
            });
            showMessage('Task created successfully!', 'success');
        }

        resetForm();
        loadTasks();

    } catch (error) {
        showMessage(error.message, 'error');
    }
}

/**
 * Edit task - populate form
 */
async function editTask(taskId) {
    try {
        const response = await apiRequest(`/tasks/${taskId}`);
        const task = response.data.task;

        editingTaskId = task._id;
        document.getElementById('task-id').value = task._id;
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description || '';
        document.getElementById('task-status').value = task.status;
        document.getElementById('task-priority').value = task.priority;

        formTitle.textContent = 'Edit Task';
        submitBtn.textContent = 'Update Task';
        cancelBtn.classList.remove('hidden');

        // Scroll to form
        adminSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        showMessage(error.message, 'error');
    }
}

/**
 * Delete task
 */
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        await apiRequest(`/tasks/${taskId}`, {
            method: 'DELETE',
        });
        showMessage('Task deleted successfully!', 'success');
        loadTasks();

    } catch (error) {
        showMessage(error.message, 'error');
    }
}

/**
 * Reset task form
 */
function resetForm() {
    editingTaskId = null;
    taskForm.reset();
    document.getElementById('task-id').value = '';
    formTitle.textContent = 'Create New Task';
    submitBtn.textContent = 'Create Task';
    cancelBtn.classList.add('hidden');
}

// ===========================================
// INITIALIZATION
// ===========================================

/**
 * Initialize dashboard
 */
function init() {
    // Check authentication
    if (!requireAuth()) return;

    // Load user data
    currentUser = getUser();

    if (currentUser) {
        userInfoElement.textContent = `Welcome, ${currentUser.name} (${currentUser.role})`;
    }

    // Show admin section if user is admin
    if (isAdmin()) {
        adminSection.classList.remove('hidden');
    }

    // Load tasks
    loadTasks();
}

// ===========================================
// EVENT LISTENERS
// ===========================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

// Logout
logoutBtn.addEventListener('click', logout);

// Task form submission
taskForm.addEventListener('submit', handleTaskSubmit);

// Cancel edit
cancelBtn.addEventListener('click', resetForm);

// Status filter
statusFilter.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    currentPage = 1;
    loadTasks();
});

// Pagination
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadTasks();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadTasks();
    }
});
