/**
 * @file main.js
 * @version 1.0.0
 * @author Terra Infinity
 * @description The entry point for the application, handling initialization, authentication, and coordinating UI interactions.
 * @module MoodBasedTodoApp
 * 
 * Primary application entry point:
 * - Manages initial setup and state of the application.
 * - Initializes authentication components, UI elements, and event listeners.
 * - Handles user authentication status on page load.
 * - Coordinates UI updates based on user mood, theme, and tasks.
 * 
 * Workflow:
 * - On page load, checks user authentication and sets up necessary components.
 * - Manages theme toggling, mood selection, and task rendering.
 * - Integrates with other modules for task management and user interface interactions.
 *
 * Note:
 * - Authentication logic might evolve as we further integrate with auth.js.
 * - Task management and rendering are basic; expect enhancements in task handling.
 */

// =============================================================================
// =============================== Imports =====================================
// =============================================================================

import toggleMoodSelector from '/src/components/mood-selector/js/mood-selector.js';
import { TaskManager } from '/src/auth/js/taskManager.js';
import { initializeLoginButton } from '/src/auth/js/loginButton.js';
import { initializeAuthForm } from '/src/auth/js/loginAuthForm.js';
import { initializeAuth } from '/src/auth/js/auth.js';
import { initializeAddTaskButton } from '/src/components/task-form/js/addTaskButton.js';
import { initializeTaskFormModal } from '/src/components/task-form/js/taskForm.js';
import { initializeCompleteAllButton } from '/src/components/task-component/js/completeAllButton.js';
import { updateSuggestedTasks } from '/src/components/mood-selector/js/mood-selector.js';
import { getCurrentUserEmail } from '/src/auth/js/auth.js';
import { initializeWeather } from '/src/components/weather/js/weather.js';
// =============================================================================
// =============================== Variables ===================================
// =============================================================================

// Create a single instance of TaskManager
/** 
 * @type {TaskManager} 
 * @description An instance of the TaskManager class used for managing tasks in the application.
 */
export let systemTaskManager;

/** 
 * @type {HTMLElement} 
 * @description The HTML element representing the mood icon, which users can click to select their mood.
 */
const moodIcon = document.getElementById('mood-icon');

/** 
 * @type {HTMLElement} 
 * @description The HTML element for the theme toggle button, allowing users to switch between dark and light modes.
 */
const themeToggle = document.getElementById('theme-toggle');

/** 
 * @type {HTMLBodyElement} 
 * @description The body element of the document, used to apply theme-related attributes.
 */
const body = document.body;


// Load saved theme
/** 
 * @type {string} 
 * @description The saved theme from local storage, defaults to 'dark' if not found.
 */
const savedTheme = localStorage.getItem('theme') || 'dark';

// =============================================================================
// ========================== Misc Setup/Assignments ==========================
// =============================================================================

body.setAttribute('data-theme', savedTheme);


// =============================================================================
// =============================== Event Listeners ============================
// =============================================================================

// Single DOMContentLoaded event listener
/**
 * @event DOMContentLoaded
 * @description This event listener is triggered when the initial HTML document has been completely loaded and parsed.
 * It handles the initial initialization of the application, including setting up authentication, loading tasks,
 * and making the TaskManager functions accessible globally.
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.info('%c ***↓↓↓*** DOM fully loaded and parsed ***↓↓↓***', 'color: purple'); 
    try {
        // Initialize systemTaskManager
        systemTaskManager = new TaskManager();
        // Initialize authentication and set up the login button
        try {
            await initializeAuthForm();
        } catch (error) {
            console.error('Error initializing auth form:', error);
        }
        // Initialize login button
        initializeLoginButton();
        // Initialize authentication
        try {
            await initializeAuth();
        } catch (error) {
            console.error('Error during authentication initialization:', error);
        }
        // Initialize task form modal
        initializeTaskFormModal();
        // Initialize add task button
        initializeAddTaskButton();
        // Initialize weather
        initializeWeather();
        // Initialize complete all button
        initializeCompleteAllButton();
        // Load tasks
        try {
            //alert('DOMContentLoaded - systemTaskManager.loadTasks() + ' + getCurrentUserEmail());
            await systemTaskManager.loadTasks();
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
        
        // Initialize suggested tasks
        try {
            await updateSuggestedTasks();
        } catch (error) {
            console.error('Error initializing suggested tasks:', error);
        }
        
        console.debug('%c DOMContentLoaded - systemTaskManager after loadTasks()', 'color: lightgreen', systemTaskManager);
        systemTaskManager.refreshAllTaskViews();
        
        // Check if TaskManager is available before using it
        // Ensure the function is accessible globally.
        //window.populateTasks = systemTaskManager.populateTasks;
    } catch (error) {
        console.error('Error during initialization:', error);
    }

    
    console.info('%c ***↑↑↑*** DOMContentLoaded Listener Complete ***↑↑↑***', 'color: deeppink'); 
});

let showCompleted = false; // Track the current view state

document.getElementById('show-completed').addEventListener('click', () => {
    const showCompleted = systemTaskManager.currentTaskView;
    if (showCompleted === 'active') {
        systemTaskManager.switchTaskView('completed');
    } else {
        systemTaskManager.switchTaskView('active');
    }
});

/**
 * @event click Event listener for the mood icon click.
 * @description This listener triggers the mood selector when the mood icon is clicked,
 * allowing users to select their current mood.
 */
moodIcon.addEventListener('click', toggleMoodSelector);

/**
 * @event input Event listener for mood range input changes.
 * @description This listener is triggered when the mood range slider value changes.
 * It logs the new mood value to the console, allowing for real-time feedback on mood selection.
 */
document.addEventListener('input', (event) => {
    if (event.target.id === 'mood-range') {
        const moodValue = event.target.value;
        console.log(`Mood value changed to: ${moodValue}`);
    }
});

/**
 * @event click Event listener for theme toggle clicks.
 * @description This listener toggles the theme between dark and light modes.
 * It updates the body element's data-theme attribute and local storage accordingly.
 */
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    console.log(`Switching theme to: ${newTheme}`);
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '🌓' : '🌞';
});


