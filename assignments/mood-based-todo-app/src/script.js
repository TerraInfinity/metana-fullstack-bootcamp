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

// Array to store completed tasks
let completedTasks = [];
let yourTasks = []; // Ensure this is initialized

// Function to render tasks
function renderTasks(tasks, container) {
    container.innerHTML = '';
    tasks.forEach(task => {
        container.appendChild(task);
    });
}

// Initialize tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    const yourTasksSection = document.querySelector('.tasks-section .task-cards');

    // Add default tasks to yourTasks array
    yourTasks = Array.from(yourTasksSection.children);

    // Render initial tasks
    renderTasks(yourTasks, yourTasksSection);

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
            // Clear completed tasks
            completedTasks = [];
            renderTasks(completedTasks, yourTasksSection); // Refresh the UI
        } else {
            // Move all tasks to completed
            completedTasks = Array.from(yourTasksSection.children);
            yourTasksSection.innerHTML = '';
        }
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

    // Weather icon hover effect
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.addEventListener('mouseenter', () => {
        // Fetch and display current weather information
        // Placeholder: Display alert with weather info
        alert('Current weather: Mostly Cloudy, 22°C');
    });

    // Mood icon toggle
    const moodIcon = document.getElementById('mood-icon');
    const moodSelector = document.getElementById('mood-selector');

    moodIcon.addEventListener('click', () => {
        if (moodSelector) {
            moodSelector.classList.toggle('hidden');
        }
    });

    // Optional: Add event listener to update mood based on slider value
    const moodRange = document.getElementById('mood-range');
    moodRange.addEventListener('input', (event) => {
        const moodValue = event.target.value;
        console.log(`Mood value: ${moodValue}`); // You can use this value to update the UI or perform other actions
    });

    // User icon click event
    const userIcon = document.getElementById('user-icon');
    userIcon.addEventListener('click', () => {
        // Open login form (placeholder)
        alert('Open login form');
    });
});

// Function to handle task actions
function handleTaskActions(taskCard) {
    const editButton = taskCard.querySelector('.btn-action.edit');
    const completeButton = taskCard.querySelector('.btn-action.complete');
    const deleteButton = taskCard.querySelector('.btn-action.delete');

    if (editButton) {
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

                // Update form title and button text for editing
                const taskForm = modalContainer.querySelector('.task-form');
                taskForm.querySelector('h2').textContent = 'Edit Task';
                taskForm.querySelector('.btn-create').textContent = 'Save';

                // Pre-fill form with current task details
                taskForm.querySelector('input[placeholder="Task name"]').value = taskCard.querySelector('.task-title').textContent;
                const durationText = taskCard.querySelector('.task-description').textContent.split(' ');
                taskForm.querySelector('#duration-input').value = durationText[1];
                taskForm.querySelector('#datepicker').value = taskCard.querySelector('.due-date').textContent.split(': ')[1];

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
                let currentUnitIndex = durationUnits.indexOf(durationText[2]);

                durationToggle.addEventListener('click', () => {
                    currentUnitIndex = (currentUnitIndex + 1) % durationUnits.length;
                    durationToggle.textContent = durationUnits[currentUnitIndex];
                    durationInput.placeholder = `Duration (${durationUnits[currentUnitIndex]})`;
                });

                // Set initial duration unit
                durationToggle.textContent = durationUnits[currentUnitIndex];

                // Handle form submission
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

                // Close modal handler
                modalContainer.querySelector('.close-modal').addEventListener('click', () => {
                    modalContainer.remove();
                });
            } catch (error) {
                console.error(error.message);
            }
        });
    }

    if (completeButton) {
        completeButton.addEventListener('click', () => {
            const isShowingCompleted = document.getElementById('show-completed').textContent.includes('Hide');

            if (!isShowingCompleted) {
                // If in your tasks view, move task to completedTasks
                yourTasks = yourTasks.filter(task => task !== taskCard);
                completedTasks.push(taskCard);

                // Refresh the UI to show updated "Your Tasks"
                const yourTasksSection = document.querySelector('.tasks-section .task-cards');
                renderTasks(yourTasks, yourTasksSection);
                //print log
                console.log('task removed from yourTasks array');
            } else {
                // Remove the task from completedTasks array
                completedTasks = completedTasks.filter(task => task !== taskCard);
                // Refresh the UI to show updated "Completed Tasks"
                const yourTasksSection = document.querySelector('.tasks-section .task-cards');
                renderTasks(completedTasks, yourTasksSection);
                //print log
                console.log('task removed from completedTasks array');
            }

            // No action needed if in completed tasks view
        });
    }

    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            const isShowingCompleted = document.getElementById('show-completed').textContent.includes('Hide');

            if (isShowingCompleted) {
                // Remove the task from completedTasks array
                completedTasks = completedTasks.filter(task => task !== taskCard);
            } else {
                // Remove the task from yourTasks array
                yourTasks = yourTasks.filter(task => task !== taskCard);
            }

            // Refresh the UI based on the current view
            const yourTasksSection = document.querySelector('.tasks-section .task-cards');
            renderTasks(isShowingCompleted ? completedTasks : yourTasks, yourTasksSection);
        });
    }
}

// Initialize task actions for existing tasks
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.task-card').forEach(handleTaskActions);
});