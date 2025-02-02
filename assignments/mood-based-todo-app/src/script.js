const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

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
let yourTasks = Array.from(document.querySelector('.tasks-section .task-cards').children);
let completedTasks = [];
let suggestedTasks = Array.from(document.querySelector('#suggested-tasks-section .task-cards').children);

// Function to render tasks
function renderTasks(tasks, container) {
    container.innerHTML = ''; // Clear the container
    tasks.forEach(task => {
        container.appendChild(task); // Append each task to the container
    });
}

// Function to handle task actions
function handleTaskActions(taskCard) {
    const isSuggested = taskCard.classList.contains('suggested');
    const addButton = taskCard.querySelector('.btn-action.add');
    const deleteButton = taskCard.querySelector('.btn-action.delete');
    const editButton = taskCard.querySelector('.btn-action.edit');
    const completeButton = taskCard.querySelector('.btn-action.complete');

    // Add Button (for suggested tasks)
    if (addButton && isSuggested) {
        addButton.addEventListener('click', () => {
            // Move task from suggestedTasks to yourTasks
            suggestedTasks = suggestedTasks.filter(task => task !== taskCard);
            yourTasks.push(taskCard);

            // Update the task card to include edit, complete, and delete buttons
            taskCard.classList.remove('suggested'); // Remove the suggested class
            taskCard.querySelector('.btn-action.add').classList.add('hidden'); // Hide the add button
            taskCard.querySelector('.btn-action.edit').classList.remove('hidden'); // Show the edit button
            taskCard.querySelector('.btn-action.complete').classList.remove('hidden'); // Show the complete button

            // Re-render both sections
            const suggestedTasksSection = document.querySelector('#suggested-tasks-section .task-cards');
            const yourTasksSection = document.querySelector('.tasks-section .task-cards');
            renderTasks(suggestedTasks, suggestedTasksSection);
            renderTasks(yourTasks, yourTasksSection);

            // Switch to "Your Tasks" display if currently showing "Completed Tasks"
            const isShowingCompleted = document.getElementById('show-completed').textContent.includes('Hide');
            if (isShowingCompleted) {
                // Update the button text and section header
                document.getElementById('show-completed').textContent = 'Show Completed';
                document.querySelector('.tasks-section .section-header h2').textContent = 'Your Tasks';

                // Render "Your Tasks" section
                renderTasks(yourTasks, yourTasksSection);
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
                if (isShowingCompleted) {
                    completedTasks = completedTasks.filter(task => task !== taskCard);
                } else {
                    yourTasks = yourTasks.filter(task => task !== taskCard);
                }
                const yourTasksSection = document.querySelector('.tasks-section .task-cards');
                renderTasks(isShowingCompleted ? completedTasks : yourTasks, yourTasksSection);
            }
            taskCard.remove(); // Remove the task from the DOM
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

                    taskCard.querySelector('.task-title').textContent = taskName;
                    taskCard.querySelector('.task-description').textContent = `Duration: ${taskDuration} ${durationUnits[currentUnitIndex]}`;
                    taskCard.querySelector('.due-date').textContent = `Due: ${taskDate}`;

                    modalContainer.remove();
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
                // Move task from "Your Tasks" to "Completed Tasks"
                yourTasks = yourTasks.filter(task => task !== taskCard);
                completedTasks.push(taskCard);
            } else {
                // Remove task from "Completed Tasks"
                completedTasks = completedTasks.filter(task => task !== taskCard);
                taskCard.remove(); // Remove the task from the DOM
            }

            // Re-render the appropriate section
            const yourTasksSection = document.querySelector('.tasks-section .task-cards');
            renderTasks(isShowingCompleted ? completedTasks : yourTasks, yourTasksSection);
        });
    }
}

// Initialize task actions on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.task-card').forEach(handleTaskActions);

    yourTasks = Array.from(document.querySelector('.tasks-section .task-cards').children);
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
            console.log('All tasks removed from completedTasks array');
        } else {
            // Move all tasks to completedTasks
            yourTasks.forEach(task => completedTasks.push(task));
            yourTasks = [];
            console.log('All tasks moved to completedTasks array');
        }

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
            taskForm.addEventListener('submit', (event) => {
                event.preventDefault();
                
                // Get task details
                const taskName = taskForm.querySelector('input[placeholder="Task name"]').value;
                const taskDuration = taskForm.querySelector('#duration-input').value;
                const taskDate = taskForm.querySelector('#datepicker').value;

                // Get the current duration unit
                const durationUnit = durationToggle.textContent;

                // Create temporary container to parse component HTML
                const template = document.createElement('template');
                template.innerHTML = componentHtml;
                const newTask = template.content.querySelector('.task-card');

                // Update task component with form data
                newTask.querySelector('.task-title').textContent = taskName;
                newTask.querySelector('.task-description').textContent = `Duration: ${taskDuration} ${durationUnit}`;
                newTask.querySelector('.due-date').textContent = `Due: ${taskDate}`;
                
                // Add to tasks section
                const yourTasksSection = document.querySelector('.tasks-section .task-cards');
                yourTasks.push(newTask); // Add to your tasks array
                yourTasksSection.appendChild(newTask);

                // Initialize actions for the new task
                handleTaskActions(newTask);

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
        }
    });

    // Weather icon click effect
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.addEventListener('click', () => {
        // Fetch and display current weather information
        // Placeholder: Display alert with weather info
        alert('Current weather: Mostly Cloudy, 22°C');
    });

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
        console.log(`Mood value changed to: ${moodValue}`); // Debug: Log mood value change
    }
});

    // User icon click event
    const userIcon = document.getElementById('user-icon');
    userIcon.addEventListener('click', () => {
        // Open login form (placeholder)
        
        alert('Open login form');
    });
});