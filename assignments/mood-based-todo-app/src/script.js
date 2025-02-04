//Script.js
// // Add at the top with other imports
import { MoodTaskService } from './mood-task-service.js';
import { 
    currentUser,
    UserService,
    SessionService,
    updateAuthUI,
    initializeAuth,
    loadUserTasks,
    yourTasks,
    completedTasks,
    loadGuestTasks,
    saveGuestTasks,
    saveCurrentUserData
} from './auth.js';

// Log types of yourTasks and completedTasks
console.log('yourTasks type:', typeof yourTasks);
console.log('completedTasks type:', typeof completedTasks);

// Move the generateRandomWeather function to the top
function generateRandomWeather() {
    const conditions = ['clear', 'clouds', 'rain', 'snow', 'thunderstorm', 'mist'];
    const icons = {
        'clear': '01d', // Clear sky
        'clouds': '02d', // Few clouds
        'rain': '10d', // Rain
        'snow': '13d', // Snow
        'thunderstorm': '11d', // Thunderstorm
        'mist': '50d' // Mist
    };

    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const icon = icons[condition];

    return {
        condition: condition,
        temperature: Math.floor(Math.random() * 35) - 5, // Range from -5°C to 30°C
        humidity: Math.floor(Math.random() * 100),
        wind: (Math.random() * 15).toFixed(1),
        icon: icon
    };
}

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

// Initialize task arrays
let suggestedTasks = []; // Instead of initializing with existing DOM elements

console.log("Before update:", suggestedTasks.length);
async function updateSuggestedTasks() {
    try {
        if (!currentWeather || !currentWeather.condition) {
            console.warn("Weather condition not set. Using 'clear' as default.");
            currentWeather = generateRandomWeather(); // or set to default like 'clear'
        }
        const condition = currentWeather.condition.toLowerCase();
        
        console.log(`Updating suggested tasks with condition: ${condition}`);
        
        const filteredTasks = await MoodTaskService.getFilteredTasks(
            currentMood, 
            condition
        );
        
        suggestedTasks = filteredTasks; // Store data objects, not DOM elements
        
        // Create DOM elements for each task
        const taskCards = await Promise.all(suggestedTasks.map(async (task) => {
            const taskCard = await createTaskCard(task, true); // Assuming createTaskCard returns a DOM node
            return taskCard;
        }));

        const suggestedTasksSection = document.querySelector('#suggested-tasks-section .task-cards');
        suggestedTasksSection.innerHTML = ''; // Clear existing tasks
        taskCards.forEach(taskCard => suggestedTasksSection.appendChild(taskCard)); // Append new task cards

        // Process each task card with handleTaskActions
        taskCards.forEach(taskCard => {
            console.log('Processing task card:', taskCard);
            handleTaskActions(taskCard); // This should be a DOM element
        });

        // Remove the incorrect usage of handleTaskActions with data objects
        // Comment out or remove the following block:
        /*
        suggestedTasks.forEach(task => {
            console.log('Task being processed:', task);
            console.log('Task type:', typeof task);
            if (task && typeof task === 'object') {
                handleTaskActions(task); // This line was causing the invalid taskCard error
            } else {
                console.error('Invalid task encountered:', task);
            }
        });
        */

        saveTasksToLocalStorage(); // Save after updating suggested tasks
        console.log('Suggested tasks have been updated based on your current mood and weather!');
    } catch (error) {
        console.error('Error updating suggestions:', error);
        console.log('There was an error updating the suggested tasks. Please try again later.');
    }
}
console.log("After update:", suggestedTasks.length);

// Function to render tasks
async function renderTasks(tasks, container, isSuggested = false) {
    container.innerHTML = ''; // Clear the container
    for (const task of tasks) {
        const taskCard = await createTaskCard(task, isSuggested);
        container.appendChild(taskCard);
    }
}

// New function to create a task card from task data
async function createTaskCard(task, isSuggested) {
    try {
        const componentResponse = await fetch('src/components/task-component.html');
        if (!componentResponse.ok) {
            throw new Error('Failed to load task component HTML');
        }
        const componentHtml = await componentResponse.text();
        const template = document.createElement('template');
        template.innerHTML = componentHtml;
        const taskCard = template.content.querySelector('.task-card').cloneNode(true);
        
        // Ensure task properties are assigned from the data object
        taskCard.querySelector('.task-title').textContent = task.title;
        taskCard.querySelector('.task-description').textContent = task.description;
        taskCard.querySelector('.due-date').textContent = `Due: ${task.dueDate}`;

        if (isSuggested) {
            taskCard.classList.add('suggested');
            // Add suggested task buttons
            const addButton = document.createElement('button');
            addButton.className = 'btn-action add';
            addButton.innerHTML = '➕';
            addButton.addEventListener('click', () => {
                // Add functionality already implemented
            });

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn-action delete';
            deleteButton.innerHTML = '🗑️';
            deleteButton.addEventListener('click', () => {
                // Delete functionality
            });

            // Append only add and delete buttons
            taskCard.querySelector('.task-actions').innerHTML = '';
            taskCard.querySelector('.task-actions').appendChild(addButton);
            taskCard.querySelector('.task-actions').appendChild(deleteButton);
        } else {
            // Add regular task buttons
            const taskActions = taskCard.querySelector('.task-actions') || document.createElement('div');
            taskActions.className = 'task-actions';
            taskActions.innerHTML = ''; // Clear any existing buttons

            // Create action buttons for non-suggested tasks
            const editButton = document.createElement('button');
            editButton.className = 'btn-action edit';
            editButton.innerHTML = '✏️';
            editButton.addEventListener('click', () => {
                // Implement edit functionality here
            });

            const completeButton = document.createElement('button');
            completeButton.className = 'btn-action complete';
            completeButton.innerHTML = '✅';
            completeButton.addEventListener('click', () => {
                // Implement complete functionality here
            });

            taskActions.append(editButton, completeButton);
            taskCard.appendChild(taskActions);
        }

        handleTaskActions(taskCard); // Attach actions to the task card
        return taskCard; // Ensure this returns a DOM element
    } catch (error) {
        console.error('Error in createTaskCard:', error.message);
        console.log('Error loading task component. Please refresh the page or try again later.');
        // Return an empty div as a fallback
        return document.createElement('div');
    }
}

// Function to handle task actions
function handleTaskActions(taskCard) {
    // Ensure taskCard is defined and is a valid DOM node
    if (!taskCard || !(taskCard instanceof Node)) {
        console.error('Invalid taskCard:', taskCard);
        return; // Exit if taskCard is not a valid DOM element
    }

    // Check if taskCard is a DOM element before proceeding
    if (taskCard.nodeType !== Node.ELEMENT_NODE) {
        console.error('taskCard is not a DOM element:', taskCard);
        return; // Exit if taskCard is not a DOM element
    }

    const isSuggested = taskCard.classList.contains('suggested');
    const addButton = taskCard.querySelector('.btn-action.add');
    const deleteButton = taskCard.querySelector('.btn-action.delete');
    const editButton = taskCard.querySelector('.btn-action.edit');
    const completeButton = taskCard.querySelector('.btn-action.complete');

    // Add Button (for suggested tasks)
    if (addButton && isSuggested) {
        addButton.addEventListener('click', async () => {
            try {
                taskCard.remove(); // Remove the task from the DOM
                
                console.log("Removing task from suggestedTasks array");
                const taskTitle = taskCard.querySelector('.task-title').textContent;
                suggestedTasks = suggestedTasks.filter(t => t.title !== taskTitle);
                console.log("Suggested tasks after removal:", suggestedTasks);

                console.log("Adding task to yourTasks array");
                yourTasks.push({
                    title: taskTitle,
                    description: taskCard.querySelector('.task-description').textContent,
                    dueDate: taskCard.querySelector('.due-date').textContent.split(': ')[1],
                    completed: false
                });
                console.log("Your tasks after adding:", yourTasks);

                console.log("Rendering new task in yourTasksSection");
                const yourTasksSection = document.querySelector('.tasks-section .task-cards');
                const newTaskCard = await createTaskCard(yourTasks[yourTasks.length - 1], false);
                yourTasksSection.appendChild(newTaskCard);
                handleTaskActions(newTaskCard);

                console.log("Updating UI for suggested tasks");
                const suggestedTasksSection = document.querySelector('#suggested-tasks-section .task-cards');
                renderTasks(suggestedTasks, suggestedTasksSection); // Ensure we pass 'true' for isSuggested

                console.log("Saving tasks to localStorage");
                saveTasksToLocalStorage();

                console.log("Updating task count");
                updateTaskCount();

            } catch (error) {
                console.error('Error when adding a suggested task:', error);
                // Optionally, you can revert the changes or notify the user
                console.log('An error occurred while adding the task. The action was not completed.');
            }
        });
    }

    // Delete Button
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            if (isSuggested) {
                // Remove task from suggestedTasks
                suggestedTasks = suggestedTasks.filter(task => task !== taskCard);
                const suggestedTasksSection = document.querySelector('#suggested-tasks-section .task-cards');
                renderTasks(suggestedTasks, suggestedTasksSection);
            } else {
                const isShowingCompleted = document.getElementById('show-completed').textContent.includes('Hide');
                // Update data structure before removing from DOM
                if (isShowingCompleted) {
                    completedTasks = completedTasks.filter(task => task.title !== taskCard.querySelector('.task-title').textContent);
                } else {
                    yourTasks = yourTasks.filter(task => task.title !== taskCard.querySelector('.task-title').textContent);
                }
                // Now remove from DOM and update UI
                taskCard.remove();
                const yourTasksSection = document.querySelector('.tasks-section .task-cards');
                renderTasks(isShowingCompleted ? completedTasks : yourTasks, yourTasksSection);
                saveTasksToLocalStorage(); // Save after deletion
            }
            // Update task count
            updateTaskCount();
        });
    }

    // Edit Button
    if (editButton && !isSuggested) {
        editButton.addEventListener('click', async () => {
            try {
                const formResponse = await fetch('src/components/task-form.html');
                if (!formResponse.ok) throw new Error('Failed to load form');

                const formHtml = await formResponse.text();

                const modalContainer = document.createElement('div');
                modalContainer.id = 'taskFormModal';
                modalContainer.classList.add('modal');
                modalContainer.innerHTML = `
                    <div class="modal-content">
                        <button class="close-modal">✖</button>
                        ${formHtml}
                    </div>
                `;
                document.body.appendChild(modalContainer);

                const taskForm = modalContainer.querySelector('.task-form');
                taskForm.querySelector('input[placeholder="Task name"]').value = taskCard.querySelector('.task-title').textContent;

                const durationText = taskCard.querySelector('.task-description').textContent.split(' ');
                taskForm.querySelector('#duration-input').value = durationText[1];
                taskForm.querySelector('#datepicker').value = taskCard.querySelector('.due-date').textContent.split(': ')[1];

                const datepickerEl = modalContainer.querySelector('#datepicker');
                $(datepickerEl).datepicker({
                    minDate: 0,
                    dateFormat: 'yy-mm-dd',
                    defaultDate: new Date()
                });

                const durationInput = modalContainer.querySelector('#duration-input');
                const durationToggle = modalContainer.querySelector('#duration-toggle');
                const durationUnits = ['Minutes', 'Hours', 'Days'];
                let currentUnitIndex = durationUnits.indexOf(durationText[2]);

                durationToggle.addEventListener('click', () => {
                    currentUnitIndex = (currentUnitIndex + 1) % durationUnits.length;
                    durationToggle.textContent = durationUnits[currentUnitIndex];
                    durationInput.placeholder = `Duration (${durationUnits[currentUnitIndex]})`;
                });

                durationToggle.textContent = durationUnits[currentUnitIndex];

                taskForm.addEventListener('submit', (event) => {
                    event.preventDefault();

                    const taskName = taskForm.querySelector('input[placeholder="Task name"]').value;
                    const taskDuration = taskForm.querySelector('#duration-input').value;
                    const taskDate = taskForm.querySelector('#datepicker').value;

                    // Update the task in the data structure
                    const taskIndex = yourTasks.findIndex(t => t.title === taskCard.querySelector('.task-title').textContent);
                    if (taskIndex !== -1) {
                        yourTasks[taskIndex] = {
                            ...yourTasks[taskIndex],
                            title: taskName,
                            description: `Duration: ${taskDuration} ${durationUnits[currentUnitIndex]}`,
                            dueDate: taskDate
                        };
                    }

                    // Update DOM
                    taskCard.querySelector('.task-title').textContent = taskName;
                    taskCard.querySelector('.task-description').textContent = `Duration: ${taskDuration} ${durationUnits[currentUnitIndex]}`;
                    taskCard.querySelector('.due-date').textContent = `Due: ${taskDate}`;

                    modalContainer.remove();
                    saveTasksToLocalStorage(); // Save after editing
                });

                modalContainer.querySelector('.close-modal').addEventListener('click', () => {
                    modalContainer.remove();
                });
            } catch (error) {
                console.error(error.message);
            }
        });
    }

    // Complete Button
    if (completeButton && !isSuggested) {
        completeButton.addEventListener('click', () => {
            const isShowingCompleted = document.getElementById('show-completed').textContent.includes('Hide');

            if (!isShowingCompleted) {
                // Find and move the task data
                const taskIndex = yourTasks.findIndex(t => t.title === taskCard.querySelector('.task-title').textContent);
                if (taskIndex !== -1) {
                    const completedTask = { ...yourTasks[taskIndex], completed: true };
                    yourTasks.splice(taskIndex, 1);
                    completedTasks.push(completedTask);
                    console.log('Task moved to completedTasks (See Completed Tasks):', completedTasks);
                    console.log('Updated yourTasks (See Your Tasks):', yourTasks);
                }
            } else {
                // Remove from completed tasks in data
                const taskIndex = completedTasks.findIndex(t => t.title === taskCard.querySelector('.task-title').textContent);
                if (taskIndex !== -1) {
                    completedTasks.splice(taskIndex, 1);
                }
                taskCard.remove(); // Remove from DOM
            }

            // Re-render the appropriate section
            const yourTasksSection = document.querySelector('.tasks-section .task-cards');
            renderTasks(isShowingCompleted ? completedTasks : yourTasks, yourTasksSection);

            // Update task count
            updateTaskCount();
            saveTasksToLocalStorage(); // Save after completing a task
        });
    }
}

// Single DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    
    if (currentUser) {
        loadUserData();
    }
    
    // Log initial weather for debugging
    console.log('Initial weather:', currentWeather);
    
    // Ensure this is the first time currentWeather is set
    currentWeather = generateRandomWeather(); 
    
    // Log after initialization for debugging
    console.log('After initialization weather:', currentWeather);
    
    updateWeatherIcon(currentWeather); // This is now after weatherIcon is defined
    updateSuggestedTasks(); // Now currentWeather should be set

    document.querySelectorAll('.task-card').forEach(handleTaskActions);

    suggestedTasks = Array.from(document.querySelector('#suggested-tasks-section .task-cards').children);

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
    document.getElementById('complete-all').addEventListener('click', function() {
        const yourTasksSection = document.querySelector('.tasks-section .task-cards');
        const isShowingCompleted = document.getElementById('show-completed').textContent.includes('Hide');
        
        if (isShowingCompleted) {
            // Remove all tasks from completedTasks
            completedTasks = [];
            console.log('All tasks removed from completedTasks'); // Log when all tasks are removed
        } else {
            // Move all tasks to completedTasks
            yourTasks.forEach(task => completedTasks.push(task));
            yourTasks = [];
            console.log('All tasks moved to completedTasks: (see completed tasks)', completedTasks); // Log the updated completed tasks
            console.log('yourTasks cleared:', yourTasks); // Log that yourTasks is now empty
        }
        // Update task count
        updateTaskCount();
        // Refresh the UI based on the current view
        renderTasks(isShowingCompleted ? completedTasks : yourTasks, yourTasksSection);
    });

    // Select the Add Task button and the modal
    const addTaskBtn = document.querySelector('.btn-add-task');
    const taskFormModal = document.querySelector('#task-form-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const taskForm = document.getElementById('task-form');

    // Open modal
    addTaskBtn.addEventListener('click', async () => {
        try {
            // Fetch both the task form and task component HTML
            const [formResponse, componentResponse] = await Promise.all([
                fetch('src/components/task-form.html'),
                fetch('src/components/task-component.html')
            ]);
            
            if (!formResponse.ok || !componentResponse.ok) 
                throw new Error('Failed to load resources');
            
            const [formHtml, componentHtml] = await Promise.all([
                formResponse.text(),
                componentResponse.text()
            ]);

            // Create and append modal
            const modalContainer = document.createElement('div');
            modalContainer.id = 'taskFormModal';
            modalContainer.classList.add('modal');
            modalContainer.innerHTML = `
                <div class="modal-content">
                    <button class="close-modal">✖</button>
                    ${formHtml}
                </div>
            `;
            
            body.appendChild(modalContainer);

            // Initialize Datepicker with restrictions
            const datepickerEl = modalContainer.querySelector('#datepicker');
            $(datepickerEl).datepicker({
                minDate: 0,          // Disable past dates
                dateFormat: 'yy-mm-dd', // Format: YYYY-MM-DD
                defaultDate: new Date() // Set default to today
            });

            // Initialize duration toggle
            const durationInput = modalContainer.querySelector('#duration-input');
            const durationToggle = modalContainer.querySelector('#duration-toggle');
            const durationUnits = ['Minutes', 'Hours', 'Days'];
            let currentUnitIndex = 0;

            durationToggle.addEventListener('click', () => {
                currentUnitIndex = (currentUnitIndex + 1) % durationUnits.length;
                durationToggle.textContent = durationUnits[currentUnitIndex];
                durationInput.placeholder = `Duration (${durationUnits[currentUnitIndex]})`;
            });

            // Close modal handler
            document.querySelector('.close-modal').addEventListener('click', () => {
                modalContainer.remove();
            });

            // Form submission handler
            const taskForm = modalContainer.querySelector('.task-form');
            taskForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                // Get task details
                const taskName = taskForm.querySelector('input[placeholder="Task name"]').value;
                const taskDuration = taskForm.querySelector('#duration-input').value;
                const taskDate = taskForm.querySelector('#datepicker').value;

                // Get the current duration unit
                const durationUnit = durationToggle.textContent;

                // Ensure you're adding to the data structure before creating the DOM element
                yourTasks.push({
                    title: taskName,
                    description: `Duration: ${taskDuration} ${durationUnit}`,
                    dueDate: taskDate,
                    completed: false
                });
                // Then create DOM element
                const newTaskCard = await createTaskCard(yourTasks[yourTasks.length - 1], false);
                const yourTasksSection = document.querySelector('.tasks-section .task-cards');
                yourTasksSection.appendChild(newTaskCard);

                // Initialize actions for the new task
                handleTaskActions(newTaskCard);

                // Check if currently showing completed tasks and switch to "Your Tasks"
                const showCompletedButton = document.getElementById('show-completed');
                const isShowingCompleted = showCompletedButton.textContent.includes('Hide');
                if (isShowingCompleted) {
                    renderTasks(yourTasks, yourTasksSection);
                    document.querySelector('.tasks-section .section-header h2').textContent = 'Your Tasks';
                    showCompletedButton.textContent = 'Show Completed';
                }

                // Close modal
                modalContainer.remove();

                // Update task count
                updateTaskCount();
                saveTasksToLocalStorage(); // Save after adding a task
            });

            // Define taskFormModal after creating the modal
            const taskFormModal = document.getElementById('taskFormModal');

            // Close modal when clicking outside of it
            window.addEventListener('click', (e) => {
                if (e.target === taskFormModal) {
                    taskFormModal.style.display = 'none';
                }
            });
        } catch (error) {
            console.error(error.message);
            console.log('There was an error loading the task form. Please try again later.');
        }
    });

    // Initialize weather on app load
    updateWeatherIcon(currentWeather); // Update icon with random weather

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
        updateWeatherIcon(currentWeather);
        updateSuggestedTasks(); // Make sure this is called after updating currentWeather
    });

    // Function to update weather icon display
    function updateWeatherIcon(weatherData) {
        if (!weatherIcon) {
            console.warn("Weather icon element not found.");
            return;
        }
        currentWeather = weatherData; // Store weather state
        const iconMap = {
            '01': '☀️', // Clear sky
            '02': '⛅', // Few clouds
            '03': '☁️', // Scattered clouds
            '04': '☁️', // Broken clouds
            '09': '🌧️', // Shower rain
            '10': '🌦️', // Rain
            '11': '⛈️', // Thunderstorm
            '13': '❄️', // Snow
            '50': '🌫️'  // Mist
        };

        const iconCode = weatherData.icon.slice(0, 2);
        weatherIcon.textContent = iconMap[iconCode] || '🌍'; // Set the icon based on the weather data
        weatherIcon.title = `Current weather: ${weatherData.condition}, ${weatherData.temperature}°C`;
    }

    // Mood icon toggle
    const moodIcon = document.getElementById('mood-icon');
    let moodSelector = null; // Start as null since it's not in the DOM initially

    console.log("Mood icon element:", moodIcon); // Debug: Check if moodIcon exists

    moodIcon.addEventListener('click', toggleMoodSelector);

    function toggleMoodSelector() {
        console.log("toggleMoodSelector called"); // Debug: Function call check
        if (!moodSelector) {
            console.log("Fetching mood selector..."); // Debug: Fetching mood selector
            fetchMoodSelector();
        } else {
            console.log("Toggling mood selector visibility..."); // Debug: Toggling visibility
            moodSelector.classList.toggle('hidden');
        }
    }
    async function fetchMoodSelector() {
        try {
            console.log("Starting fetch for mood selector..."); // Debug: Fetch start
            const response = await fetch('src/components/mood-selector.html');
            if (!response.ok) {
                console.error('Failed to load mood selector'); // Debug: Fetch failed
                throw new Error('Failed to load mood selector');
            }

            const moodHtml = await response.text();
            console.log("Mood HTML fetched:", moodHtml); // Debug: Log fetched HTML

            // Parse the HTML to get the mood-selector element
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = moodHtml;
            moodSelector = tempDiv.querySelector('#mood-selector');

            if (!moodSelector) {
                console.error('Mood selector element not found in fetched HTML'); // Debug: Element not found
                throw new Error('Mood selector element not found');
            }

            console.log("Mood selector found:", moodSelector); // Debug: Element found

            // Insert into the DOM
            const mainContainer = document.querySelector('main.container');
            if (mainContainer) {
                mainContainer.insertBefore(moodSelector, mainContainer.querySelector('.dashboard-grid'));
                console.log("Mood selector inserted into DOM"); // Debug: Insertion confirmation
            } else {
                console.error('Main container not found'); // Debug: Container not found
            }

            // Remove 'hidden' class to show the selector immediately
            moodSelector.classList.remove('hidden');
            console.log("Mood selector now visible"); // Debug: Visibility change

            // Add event listener to the close button
            const closeButton = moodSelector.querySelector('.close-button');
            if (closeButton) {
                closeButton.addEventListener('click', toggleMoodSelector);
                console.log("Close button listener added"); // Debug: Event listener added
            } else {
                console.error('Close button not found'); // Debug: Button not found
            }
        } catch (error) {
            console.error("Error in fetchMoodSelector:", error.message); // Debug: Catch errors
        }
    }

    // Slider event listener remains the same with added debug
    document.addEventListener('input', (event) => {
        if (event.target.id === 'mood-range') {
            const moodValue = event.target.value;
            console.log(`Mood value changed to: ${moodValue}`);
        }
    });

    // Optional: Implement Debounce (if needed for further optimization)
    function debounce(fn, delay) {
        let debounceTimer;
        return function (...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // Modify the 'mouseup' event listener
    const debouncedUpdate = debounce(updateSuggestedTasks, 300);

    document.addEventListener('mouseup', (event) => {
        if (event.target.id === 'mood-range') {
            currentMood = parseInt(event.target.value);
            debouncedUpdate();
        }
    });

    // Add modal functionality
    const loginBtn = document.getElementById('login-btn');
    const userIcon = document.getElementById('user-icon');

    console.log('Initial yourTasks:', yourTasks); // Log the initial state of yourTasks
    console.log('Initial completedTasks:', completedTasks); // Log the initial state of completedTasks
});

// Function to update the task count display
function updateTaskCount() {
    const taskCountElement = document.getElementById('task-count-number');
    taskCountElement.textContent = yourTasks.length; // Update with the current number of tasks
    saveTasksToLocalStorage();
}

async function loadUserData() {
    console.log("Current user before loading tasks:", currentUser); // Log currentUser
    if (currentUser) {
        await loadUserTasks(currentUser); // Await if loadUserTasks is async
        console.log(`Loaded tasks for ${currentUser.email}:`, { yourTasks, completedTasks }); // Log the loaded tasks
        
        // After loading tasks from localStorage, update the UI
        const yourTasksSection = document.querySelector('.tasks-section .task-cards');
        renderTasks(yourTasks, yourTasksSection); // Render your tasks
        
        // Ensure completed tasks are also rendered if the user wants to see them
        const isShowingCompleted = document.getElementById('show-completed').textContent.includes('Hide');
        if (isShowingCompleted) {
            renderTasks(completedTasks, yourTasksSection); // Render completed tasks if needed
        }
    } else {
        console.log("No user logged in to load tasks for");
    }
    
    // Update task count or any other UI elements that depend on task lists
    updateTaskCount();
    
    // Handle task actions for both yourTasks and completedTasks if they are in the DOM
    try {
        [...yourTasks, ...completedTasks].forEach(task => {
            console.log('Task type:', typeof task, 'Task node type:', task.nodeType);
            if (task.nodeType === Node.ELEMENT_NODE && document.body.contains(task)) {
                handleTaskActions(task);
            }
        });
    } catch (error) {
        console.error('Error in task handling:', error);
    }
}

// Function to save tasks to localStorage
function saveTasksToLocalStorage() {
    if (currentUser) {
        console.log('Saving for logged-in user with email:', currentUser.email); // Added logging
        saveCurrentUserData().then(() => {
            console.log('Tasks saved to localStorage for user:', UserService.getUsers().find(u => u.email === currentUser.email).tasks);
            console.log('Your tasks have been successfully saved!');
        }).catch(error => {
            console.error('Error in saving tasks:', error);
            console.log('Sorry, there was an error saving your tasks. Please try again later.');
        });
    } else {
        console.log('Saving for guest user'); // Added logging
        saveGuestTasks().then(() => {
            console.log('Guest tasks saved to localStorage');
            console.log('Your tasks have been successfully saved!');
        }).catch(error => {
            console.error('Error in saving guest tasks:', error);
            console.log('Sorry, there was an error saving your tasks. Please try again later.');
        });
    }
}

// Call this function before or instead of loadUserData if no user is logged in
if (!currentUser) {
    import('./auth.js').then(({ loadGuestTasks }) => {
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
