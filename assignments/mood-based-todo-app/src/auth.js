// auth.js
export let currentUser = null;

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
    const loginBtn = document.querySelector('.nav-link.btn-secondary');
    
    userIcon.addEventListener('click', showAuthModal);
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (SessionService.getSession()) {
            handleLogout();
        } else {
            showAuthModal();
        }
    });
    
    // Initialize auth state
    currentUser = SessionService.getSession();
    updateAuthUI();
}

export function handleLogout() {
    saveCurrentUserData();
    SessionService.clearSession();
    updateAuthUI();
    location.reload();
}

export function showAuthModal() {
    fetch('login.html')
        .then(response => response.text())
        .then(html => {
            const modal = document.createElement('div');
            modal.className = 'auth-modal';
            modal.innerHTML = html;
            document.body.appendChild(modal);

            const form = modal.querySelector('#auth-form');
            const toggleLink = modal.querySelector('#toggle-form');
            const isLogin = form.querySelector('#form-title').textContent.includes('Welcome Back');

            form.addEventListener('submit', handleAuthSubmit);
            toggleLink.addEventListener('click', (e) => {
                e.preventDefault();
                toggleAuthForm(form, isLogin);
            });
        });
}

function toggleAuthForm(form, isLogin) {
    const title = form.querySelector('#form-title');
    const submitBtn = form.querySelector('#submit-btn');
    const toggleLink = form.querySelector('#toggle-form');
    
    if (isLogin) {
        title.textContent = 'Create Account';
        submitBtn.textContent = 'Sign Up';
        toggleLink.innerHTML = 'Already have an account? <a href="#">Login</a>';
    } else {
        title.textContent = 'Welcome Back';
        submitBtn.textContent = 'Login';
        toggleLink.innerHTML = 'Don\'t have an account? <a href="#">Sign up</a>';
    }
}

export function handleAuthSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
    const isLogin = form.querySelector('#submit-btn').textContent === 'Login';

    if (isLogin) {
        const user = UserService.validateUser(email, password);
        if (user) {
            SessionService.setSession(user);
            form.closest('.auth-modal').remove();
            updateAuthUI();
        } else {
            alert('Invalid credentials');
        }
    } else {
        const newUser = { email, password, tasks: [] };
        if (UserService.saveUser(newUser)) {
            SessionService.setSession(newUser);
            form.closest('.auth-modal').remove();
            updateAuthUI();
        } else {
            alert('User already exists');
        }
    }
}

export function saveCurrentUserData() {
    if (!currentUser) return;
    
    const users = UserService.getUsers();
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    // You'll need to import your task arrays from script.js
    // This might require some refactoring to properly separate concerns
    users[userIndex].tasks = [
        ...yourTasks.map(t => ({ ...t, completed: false })),
        ...completedTasks.map(t => ({ ...t, completed: true }))
    ];
    
    localStorage.setItem('users', JSON.stringify(users));
}