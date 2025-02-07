//main.js
// Slider event listener remains the same with added debug

//Imports
import { 
    currentUser,
    UserService,
    SessionService,
    updateAuthUI,
    initializeAuth,
    loadUserTasks,
    yourTasks,
    completedTasks,
    suggestedTasks,
    loadGuestTasks,
    saveGuestTasks,
    saveCurrentUserData,
    fetchSuggestedTasks,
    updateSuggestedTasks,
    initializeCurrentUser,
    init
} from '../auth/js/auth.js';
import toggleMoodSelector from '../components/mood-selector/js/mood-selector.js';
import {updateTaskCount, saveTasksToLocalStorage, loadUserData, populateTasks} from '../auth/js/task-management.js';

import { createTaskCard, handleTaskActions } from '../components/task-component/js/task-component.js';
import { openTaskFormModal } from '../components/task-form/js/task-form.js';
import { generateRandomWeather } from '../components/weather/js/weather.js';
import { updateWeatherIcon } from '../components/weather/js/weather.js';

// Initialize currentUser before using it
initializeCurrentUser(); // Ensure this is called first

// Now you can safely use currentUser
console.log(currentUser); // This should not throw an error now

const moodIcon = document.getElementById('mood-icon');
moodIcon.addEventListener('click', toggleMoodSelector);


    
//listeners
document.addEventListener('input', (event) => {
    if (event.target.id === 'mood-range') {
        const moodValue = event.target.value;
        console.log(`Mood value changed to: ${moodValue}`);
    }
});

// Optional: Implement Debounce (if needed for further optimization)
// The debounce function limits the rate at which the provided function (fn) can be called.
// It ensures that the function is only executed after a specified delay (in milliseconds)
// has passed since the last time it was invoked. This is useful for optimizing performance
// in scenarios where an event can trigger multiple times in quick succession, such as
// user input or mouse movements.
function debounce(fn, delay) {
    let debounceTimer;
    return function (...args) {
        clearTimeout(debounceTimer); // Clear the previous timer
        debounceTimer = setTimeout(() => fn.apply(this, args), delay); // Set a new timer
    };
}

// Modify the 'mouseup' event listener
const debouncedUpdate = debounce(updateSuggestedTasks, 300); // Create a debounced version of updateSuggestedTasks
document.addEventListener('mouseup', (event) => {
    if (event.target.id === 'mood-range') {
        currentMood = parseInt(event.target.value);
        debouncedUpdate(); // Call the debounced function, which will only execute after 300ms of inactivity
    }
});






// Log types of yourTasks and completedTasks
//console.log('yourTasks type:', typeof yourTasks);
//console.log('completedTasks type:', typeof completedTasks);


const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
let currentMood = 50; // Default mood value
let currentWeather = generateRandomWeather(); // Initialize with random weather data
const weatherIcon = document.getElementById('weather-icon'); // Move this here

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    console.log(`Switching theme to: ${newTheme}`);
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '🌓' : '🌞';
});

/*
console.log("Before update:", suggestedTasks.length);
async function updateSuggestedTasks() {
    try {
        if (!currentWeather || !currentWeather.condition) {
            console.warn("Weather condition not set. Using 'clear' as default.");
            currentWeather = generateRandomWeather(); // Ensure generateRandomWeather is imported
        }
        const condition = currentWeather.condition.toLowerCase();
        console.log(`Updating suggested tasks with condition: ${condition}`);
        
        const tasks = await fetchSuggestedTasks(currentMood, condition); // Fetching tasks moved to auth.js
        
        // Render the tasks in the UI
        await renderSuggestedTasks(tasks); // Rendering logic moved to auth.js

        saveTasksToLocalStorage(); // This call remains, but the implementation is in auth.js
        console.log('Suggested tasks have been updated based on your current mood and weather!');
    } catch (error) {
        console.error('Error updating suggestions:', error);
        console.log('There was an error updating the suggested tasks. Please try again later.');
    }
}
console.log("After update:", suggestedTasks.length);
*/
// Function to render tasks
export async function renderTasks(tasks, container, isSuggested = false) {
    container.innerHTML = ''; // Clear the container
    if (tasks && tasks.length > 0) {
        console.log('Rendering tasks:', tasks);
        for (const task of tasks) {
            console.log('Rendering task:', task);
            const taskCard = await createTaskCard(task, isSuggested);
            container.appendChild(taskCard);
        }
    } else {
        console.log('No tasks to render');
    }
}

// Single DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async () => {
    await init();  // Call init to ensure SessionService is available
    console.log('Current user after initialization:', currentUser); // Now you can safely use currentUser

    if (currentUser) {
        loadUserData();
    }
    
    // Log initial weather for debugging
    console.log('Initial weather:', currentWeather);
    
    // Ensure this is the first time currentWeather is set
    currentWeather = generateRandomWeather(); 
    
    // Log after initialization for debugging
    console.log('After initialization weather:', currentWeather);
    
    currentWeather = generateRandomWeather(); // Update before using in updateWeatherIcon
    updateWeatherIcon(currentWeather, weatherIcon); // This is now after weatherIcon is defined
    updateSuggestedTasks(); // Now currentWeather should be set

    //document.querySelectorAll('.task-card').forEach(handleTaskActions);

    //suggestedTasks = Array.from(document.querySelector('#suggested-tasks-section .task-cards').children);
    

    // Toggle between "Your Tasks" and "Completed Tasks"
    document.getElementById('show-completed').addEventListener('click', function() {
        const yourTasksSection = document.querySelector('.tasks-section .task-cards');
        const sectionHeader = document.querySelector('.tasks-section .section-header h2');
        const isShowingCompleted = this.textContent.includes('Hide');
        
        if (isShowingCompleted) {
            // Show "Your Tasks"
            renderTasks(yourTasks, yourTasksSection);
            sectionHeader.textContent = 'Your Tasks';
            this.textContent = 'Show Completed';
        } else {
            // Show "Completed Tasks"
            renderTasks(completedTasks, yourTasksSection);
            sectionHeader.textContent = 'Completed Tasks';
            this.textContent = 'Hide Completed';
        }
    });

    // Complete all tasks in the current view
    document.getElementById('complete-all').addEventListener('click', function () {
        const yourTasksSection = document.querySelector('.tasks-section .task-cards');
        const isShowingCompleted = document.getElementById('show-completed').textContent.includes('Hide');

        if (isShowingCompleted) {
            // If showing completed tasks, clear the completedTasks array
            completedTasks.length = 0; // Clear the array without reassigning
            console.log('All tasks removed from completedTasks');
        } else {
            // If showing your tasks, move all tasks to completedTasks
            completedTasks.push(...yourTasks); // Add all tasks to completedTasks
            yourTasks.length = 0; // Clear yourTasks without reassigning
            console.log('All tasks moved to completedTasks:', completedTasks);
            console.log('yourTasks cleared:', yourTasks);
        }

        // Update the UI
        renderTasks(isShowingCompleted ? completedTasks : yourTasks, yourTasksSection);

        // Update task count
        updateTaskCount();

        // Save changes to localStorage
        saveTasksToLocalStorage();
    });

    // Select the Add Task button and the modal
    const addTaskBtn = document.querySelector('.btn-add-task');
    const taskFormModal = document.querySelector('#task-form-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const taskForm = document.getElementById('task-form');

    // Open modal
    addTaskBtn.addEventListener('click', async () => {
        openTaskFormModal()
    });

    // Initialize weather on app load
    currentWeather = generateRandomWeather(); 
    updateWeatherIcon(currentWeather, weatherIcon); // Updated to pass currentWeather

    // Update weather icon click handler
    weatherIcon.addEventListener('click', () => {
        currentWeather = generateRandomWeather();
        console.log('Weather updated to:', currentWeather); // For debugging
        const weatherInfo = `Current Weather:
            - Condition: ${currentWeather.condition}
            - Temperature: ${currentWeather.temperature}°C
            - Humidity: ${currentWeather.humidity}%
            - Wind: ${currentWeather.wind} m/s`;
        
        console.log(weatherInfo);
        updateWeatherIcon(currentWeather, weatherIcon); // Update icon with new weather data
        updateSuggestedTasks(); // Update tasks after weather change
    });

    

    // Mood icon toggle
    const moodIcon = document.getElementById('mood-icon');

    console.log("Mood icon element:", moodIcon); // Debug: Check if moodIcon exists

    moodIcon.addEventListener('click', toggleMoodSelector);


    // Optional: Implement Debounce (if needed for further optimization)
    function debounce(fn, delay) {
        let debounceTimer;
        return function (...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // Add modal functionality
    const loginBtn = document.getElementById('login-btn');
    const userIcon = document.getElementById('user-icon');

    //console.log('Initial yourTasks:', yourTasks); // Log the initial state of yourTasks
    //console.log('Initial completedTasks:', completedTasks); // Log the initial state of completedTasks

});

// Call this function before or instead of loadUserData if no user is logged in
if (!currentUser) {
    import('../auth/js/auth.js').then(({ loadGuestTasks }) => {
        loadGuestTasks();
        
        // Instead of direct reassignment, create new arrays:
        const newYourTasks = yourTasks.map(createTaskElement);
        const newCompletedTasks = completedTasks.map(createTaskElement);

        // Clear current arrays and push new elements
        yourTasks.length = 0; // Clear existing yourTasks
        completedTasks.length = 0; // Clear existing completedTasks
        yourTasks.push(...newYourTasks); // Add new elements to yourTasks
        completedTasks.push(...newCompletedTasks); // Add new elements to completedTasks

        // Update UI here
        const yourTasksSection = document.querySelector('.tasks-section .task-cards');
        renderTasks(yourTasks, yourTasksSection);

        const isShowingCompleted = document.getElementById('show-completed').textContent.includes('Hide');
        if (isShowingCompleted) {
            renderTasks(completedTasks, yourTasksSection);
        }
        
        // Initialize task actions for loaded tasks
        [...yourTasks, ...completedTasks].forEach(task => handleTaskActions(task));
        
        // Update task count
        updateTaskCount();
    });
}

// Helper function to convert data to DOM element
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-card';
    taskElement.innerHTML = `
        <h3 class="task-title">${task.title}</h3>
        <p class="task-description">${task.description}</p>
        <p class="due-date">Due: ${task.dueDate}</p>
    `;
    handleTaskActions(taskElement); // Attach actions to the task element
    return taskElement;
}

 
// Ensure the function is accessible globally.
window.populateTasks = populateTasks;

// Function to render suggested tasks
async function renderSuggestedTasks(tasks) {
    const suggestedTasksSection = document.querySelector('#suggested-tasks-section .task-cards');
    suggestedTasksSection.innerHTML = ''; // Clear existing tasks
    const taskCards = await Promise.all(tasks.map(async (task) => createTaskCard(task, true)));
    taskCards.forEach(taskCard => {
        suggestedTasksSection.appendChild(taskCard);
        handleTaskActions(taskCard);
    });
}

