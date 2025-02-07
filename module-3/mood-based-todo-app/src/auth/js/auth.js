// Authentication logic, UI updates, initialization
// auth.js
import { MoodTaskService } from '../../components/mood-selector/js/mood-task-service.js'; 



export let currentUser = null;

// Define yourTasks and completedTasks at a higher scope
export let yourTasks = []; // Use let instead of const
export let completedTasks = []; // Use let instead of const

// User management
export const UserService = {
    getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    },
    
    saveUser(user) {
        console.log('Saving user:', user); // Log user before saving
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
export async function handleAuth(formData, isRegister) {
    const email = formData.get('email');
    const password = formData.get('password');

    // Security enhancement: Warn about password storage
    console.warn('Security Note: Passwords are stored in plain text. Implement hashing for production.');

    if (isRegister) {
        if (!email || !password) {
            console.log(`Please provide both email and password for registration. Email: ${email}, Password: ${password}`);
            console.log('Form data:', { email, password }); // Log form data
            return;
        }
        const user = { email, password, tasks: [] }; // Include tasks for new users
        const success = UserService.saveUser(user);
        if (success) {
            SessionService.setSession(user); // Log in user after registration
            updateAuthUI();
            console.log('Registration successful! You are now logged in.');
        } else {
            console.log('User already exists. Please use a different email.');
        }
    } else {
        const user = UserService.validateUser(email, password);
        if (user) {
            SessionService.setSession(user); // Ensure this runs before loadUserTasks
            currentUser = user; // Set currentUser to the logged-in user
            updateAuthUI();
            await loadUserTasks(user);
            console.log('Login successful');
            
            
            // Wait for tasks to load before populating
            if (Array.isArray(yourTasks) && Array.isArray(completedTasks)) {
                console.log('Populating your tasks' + yourTasks);
                console.log('Populating completed tasks' + completedTasks);
                populateTasks(yourTasks);
            } else {
                console.warn('Tasks are not arrays or not loaded yet:', yourTasks, completedTasks);
            }
        } else {
            alert('Invalid credentials');
        }

    }
}

export function updateAuthUI() {
    const user = SessionService.getSession();
    const greeting = document.querySelector('#greeting-section h1');
    const loginBtn = document.querySelector('.nav-link.btn-secondary');
    
    if (user && user.email) {
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
    
    if (!currentUser) {
        loadGuestTasks(); // Load guest tasks if no user is logged in
    }
}

export function handleLogout() {
    console.log('Logging out');
    console.log('Saving current user data:', { yourTasks, completedTasks });
    if (currentUser) {
        saveCurrentUserData();
    } else {
        saveGuestTasks(); // Save tasks for guests
    }
    SessionService.clearSession();
    updateAuthUI();
    // Clear task arrays to reset state when logging out
    yourTasks = [];
    completedTasks = [];
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
    
    // Log form data for debugging
    console.log('Form data:', [...formData.entries()]); 
    handleAuth(formData, !isLogin);

    // Close the modal after successful authentication
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.remove();
    }
}

export function saveCurrentUserData() {
    return new Promise((resolve, reject) => {
        try {
            if (!currentUser) {
                console.log('No user logged in to save data for');
                resolve(); // Resolve if no user to save
                return;
            }
            
            const users = UserService.getUsers();
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            
            if (userIndex !== -1) {
                // Log tasks before saving
                console.log('Tasks to save:', [
                    ...yourTasks.map(task => ({
                        title: task.title,
                        description: task.description,
                        dueDate: task.dueDate,
                        completed: false // Mark as incomplete
                    })),
                    ...completedTasks.map(task => ({
                        title: task.title,
                        description: task.description,
                        dueDate: task.dueDate,
                        completed: true // Mark as complete
                    }))
                ]);

                // Save tasks to the user object
                users[userIndex].tasks = [
                    ...yourTasks.map(task => ({
                        title: task.title,
                        description: task.description,
                        dueDate: task.dueDate,
                        completed: false // Mark as incomplete
                    })),
                    ...completedTasks.map(task => ({
                        title: task.title,
                        description: task.description,
                        dueDate: task.dueDate,
                        completed: true // Mark as complete
                    }))
                ];
                
                console.log(`Saving tasks for ${currentUser.email}:`, users[userIndex].tasks);
                localStorage.setItem('users', JSON.stringify(users));
                console.log('User data saved in localStorage:', localStorage.getItem('users'));
                console.log('Current user tasks:', users[userIndex].tasks); // Log the current user's tasks
                console.log('All users:', users); // Log all users to check if the user exists
                console.log('User index:', userIndex); // Log the index of the current user
                console.log('Current user:', currentUser); // Log the current user object
            }
            resolve(); // Resolve if successful
        } catch (error) {
            reject(error); // Reject if there's an error
        }
    });
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

export async function loadUserTasks(user) {
    console.log("Attempting to load tasks for user:", user); // Debugging line
    if (!user || !user.email) {
        console.error("User object or email is undefined when loading tasks");
        return; // Exit if user is null or email is undefined
    }

    // Retrieve all users from localStorage
    const users = UserService.getUsers();
    // Find the user in the users array
    const foundUser = users.find(u => u.email === user.email);

    // Check if the user was found and if they have tasks
    if (foundUser && foundUser.tasks) {
        // Clear existing tasks to avoid duplication
        yourTasks = [];
        completedTasks = [];
        
        // Populate yourTasks and completedTasks based on the found user's tasks
        foundUser.tasks.forEach(task => {
            if (task.completed) {
                completedTasks.push(task); // Add to completedTasks if completed
            } else {
                yourTasks.push(task); // Add to yourTasks if not completed
            }
        });

        // Log the loaded tasks for debugging
        console.log(`Loaded tasks for ${user.email}:`, { yourTasks, completedTasks });
    } else {
        // Log if no tasks were found for the user
        console.log(`No tasks found for ${user.email || 'unknown user'}`);
    }
}

function isValidTask(task) {
    return task && typeof task.title === 'string' && 
           typeof task.description === 'string' && 
           typeof task.dueDate === 'string' && 
           typeof task.completed === 'boolean';
}

export function loadGuestTasks() {
    const savedTasks = localStorage.getItem('guestTasks');
    if (savedTasks) {
        try {
            const tasks = JSON.parse(savedTasks);
            yourTasks = tasks.filter(task => !task.completed && isValidTask(task));
            completedTasks = tasks.filter(task => task.completed && isValidTask(task));
            console.log('Guest tasks loaded:', { yourTasks, completedTasks });
        } catch (error) {
            console.error('Error parsing guest tasks from localStorage:', error);
            yourTasks = [];
            completedTasks = [];
        }
    } else {
        console.log('No guest tasks found');
    }
}

export function saveGuestTasks() {
    return new Promise((resolve, reject) => {
        try {
            const tasksToSave = [
                ...yourTasks.map(task => ({...task, completed: false})),
                ...completedTasks.map(task => ({...task, completed: true}))
            ];
            localStorage.setItem('guestTasks', JSON.stringify(tasksToSave));
            resolve(); // Resolve if successful
        } catch (error) {
            reject(error); // Reject if there's an error
        }
    });
}