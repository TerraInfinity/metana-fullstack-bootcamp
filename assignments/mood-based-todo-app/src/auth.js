// auth.js
import { MoodTaskService } from './mood-task-service.js'; // If needed

export let currentUser = null;

// Define yourTasks and completedTasks at a higher scope
export let yourTasks = []; // Now export for script.js to see changes
export let completedTasks = []; // Now export for script.js to see changes

// User management
export const UserService = {
    getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    },
    
    saveUser(user) {
        const users = this.getUsers();
        const existing = users.find(u => u.email === user.email);
        if (existing) return false;
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    },
    
    validateUser(email, password) {
        const users = this.getUsers();
        return users.find(u => u.email === email && u.password === password);
    }
};

// Session management
export const SessionService = {
    getSession() {
        return JSON.parse(sessionStorage.getItem('currentUser'));
    },
    
    setSession(user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    },
    
    clearSession() {
        sessionStorage.removeItem('currentUser');
    }
};

// Authentication logic
export function handleAuth(formData, isRegister) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (isRegister) {
        const user = { email, password, tasks: [] }; // Include tasks for new users
        const success = UserService.saveUser(user);
        if (success) {
            SessionService.setSession(user); // Log in user after registration
            updateAuthUI();
            alert('Registration successful! You are now logged in.');
        } else {
            alert('User already exists. Please use a different email.');
        }
    } else {
        const user = UserService.validateUser(email, password);
        if (user) {
            SessionService.setSession(user); // Ensure this runs before loadUserTasks
            currentUser = user; // Set currentUser to the logged-in user
            updateAuthUI();
            loadUserTasks(user); // Ensure user is not null here
            console.log('Login successful');
        } else {
            alert('Invalid credentials');
        }
    }
}

export function updateAuthUI() {
    const user = SessionService.getSession();
    const greeting = document.querySelector('#greeting-section h1');
    const loginBtn = document.querySelector('.nav-link.btn-secondary');
    
    if (user) {
        greeting.textContent = `Welcome, ${user.email}.`;
        loginBtn.textContent = 'Logout';
        currentUser = user;
    } else {
        greeting.textContent = 'Welcome, Guest.';
        loginBtn.textContent = 'Login';
        currentUser = null;
    }
}

// Auth event handlers
export function initializeAuth() {
    const userIcon = document.getElementById('user-icon');
    const loginBtn = document.getElementById('login-btn');
    
    userIcon.addEventListener('click', showLoginModal);
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (SessionService.getSession()) {
            handleLogout();
        } else {
            showLoginModal();
        }
    });
    
    // Initialize auth state
    currentUser = SessionService.getSession();
    updateAuthUI();
}

export function handleLogout() {
    console.log('Logging out');
    console.log('Saving current user data:', { yourTasks, completedTasks });
    saveCurrentUserData();
    SessionService.clearSession();
    updateAuthUI();
    // Clear task arrays to reset state when logging out
    yourTasks = []; // Now defined
    completedTasks = []; // Now defined
    console.log('Tasks cleared:', { yourTasks, completedTasks });
    // Reload page or update UI to reflect logged out state
    location.reload();
}

export function showAuthModal() {
    fetch('login.html')
        .then(response => response.text())
        .then(html => {
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = html;
            const modal = modalContainer.querySelector('.auth-modal');
            document.body.appendChild(modal);

            const form = modal.querySelector('.auth-form');
            const toggleLink = modal.querySelector('#toggle-form');
            let isLogin = !form.querySelector('#form-title').textContent.includes('Create Account'); // Set based on current title

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                handleAuthSubmit(e, isLogin);
            });

            toggleLink.addEventListener('click', (e) => {
                e.preventDefault();
                isLogin = !isLogin; // Toggle between login and register
                toggleAuthForm(form, isLogin);
            });

            // Add click event to close modal when clicking outside the form
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
}

function toggleAuthForm(form, isLogin) {
    const title = form.querySelector('#form-title');
    const submitBtn = form.querySelector('#submit-btn');
    const toggleLink = form.querySelector('#toggle-form');
    
    if (isLogin) {
        title.textContent = 'Welcome Back';
        submitBtn.textContent = 'Login';
        toggleLink.innerHTML = 'Don\'t have an account? <a href="#">Sign up</a>';
    } else {
        title.textContent = 'Create Account';
        submitBtn.textContent = 'Sign Up';
        toggleLink.innerHTML = 'Already have an account? <a href="#">Login</a>';
    }
}

export function handleAuthSubmit(e, isLogin) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    handleAuth(formData, !isLogin); // Use !isLogin because we toggle in the UI

    // Close the modal after successful authentication
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.remove();
    }
}

export function saveCurrentUserData() {
    if (!currentUser) return;
    
    const users = UserService.getUsers();
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
        users[userIndex].tasks = [
            ...yourTasks.map(task => ({
                title: task.querySelector('.task-title').textContent,
                description: task.querySelector('.task-description').textContent,
                dueDate: task.querySelector('.due-date').textContent,
                completed: false // Mark as incomplete
            })),
            ...completedTasks.map(task => ({
                // Convert task to a JSON-serializable format
                title: task.querySelector('.task-title').textContent,
                description: task.querySelector('.task-description').textContent,
                dueDate: task.querySelector('.due-date').textContent,
                completed: true // Mark as complete
            }))
        ];
        
        console.log(`Saving tasks for ${currentUser.email}:`, users[userIndex].tasks);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('User data saved in localStorage:', localStorage.getItem('users'));
    }
}

export async function fetchLoginForm() {
    try {
        const response = await fetch('login.html');
        if (!response.ok) throw new Error('Failed to load login form');
        return await response.text();
    } catch (error) {
        console.error('Error fetching login form:', error);
        return '<p>Error loading login form.</p>';
    }
}

export async function showLoginModal() {
    const loginContent = await fetchLoginForm();
    
    const modal = document.createElement('div');
    modal.id = 'login-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">×</span>
            ${loginContent}
        </div>
    `;

    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.className === 'close') {
            modal.remove();
        }
    });

    modal.querySelector('.modal-content').addEventListener('click', (e) => e.stopPropagation());

    const form = modal.querySelector('form');
    if (form) {
        let isLogin = !form.querySelector('#form-title').textContent.includes('Create Account');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAuthSubmit(e, isLogin);
        });

        const toggleLink = form.querySelector('#toggle-form');
        if (toggleLink) {
            toggleLink.addEventListener('click', (e) => {
                e.preventDefault();
                isLogin = !isLogin; // Toggle between login and register
                toggleAuthForm(form, isLogin);
            });
        }
    }

    document.body.appendChild(modal);
}

export function loadUserTasks(user) {
    console.log("Attempting to load tasks for user:", user); // Debugging line
    if (!user || !user.email) {
        console.error("User object or email is undefined when loading tasks"); // Error log
        return; // Exit if user is null or email is undefined
    }
    const users = UserService.getUsers();
    const foundUser = users.find(u => u.email === user.email);
    if (foundUser && foundUser.tasks) {
        // Reset yourTasks and completedTasks to ensure they're empty before populating
        yourTasks = [];
        completedTasks = [];
        
        // Populate tasks from localStorage
        foundUser.tasks.forEach(task => {
            if (task.completed) {
                completedTasks.push(task);
            } else {
                yourTasks.push(task);
            }
        });
        console.log(`Loaded tasks for ${user.email}:`, { yourTasks, completedTasks });
    } else {
        console.log(`No tasks found for ${user.email || 'unknown user'}`); // Updated log for unknown user
    }
}