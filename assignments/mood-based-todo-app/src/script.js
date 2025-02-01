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
document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.querySelector('.btn-add-task');
    const body = document.body;

    if (!addTaskBtn) {
        console.error('Button .btn-add-task not found');
        return;
    }

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

                // Close modal
                modalContainer.remove();
            });
        } catch (error) {
            console.error(error.message);
        }
    });
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === taskFormModal) {
        taskFormModal.style.display = 'none';
    }
});

// Function to handle task actions
function handleTaskActions(taskCard) {
    const editButton = taskCard.querySelector('.btn-action.edit');
    const completeButton = taskCard.querySelector('.btn-action.complete');
    const deleteButton = taskCard.querySelector('.btn-action.delete');

    // Edit task
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

            // Pre-fill form with current task details
            const taskForm = modalContainer.querySelector('.task-form');
            taskForm.querySelector('input[placeholder="Task name"]').value = taskCard.querySelector('.task-title').textContent;
            const durationText = taskCard.querySelector('.task-description').textContent.split(' ');
            taskForm.querySelector('#duration-input').value = durationText[1];
            taskForm.querySelector('#datepicker').value = taskCard.querySelector('.due-date').textContent.split(': ')[1];

            // Handle form submission
            taskForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const taskName = taskForm.querySelector('input[placeholder="Task name"]').value;
                const taskDuration = taskForm.querySelector('#duration-input').value;
                const taskDate = taskForm.querySelector('#datepicker').value;

                taskCard.querySelector('.task-title').textContent = taskName;
                taskCard.querySelector('.task-description').textContent = `Duration: ${taskDuration} ${durationText[2]}`;
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

    // Complete task
    completeButton.addEventListener('click', () => {
        completedTasks.push(taskCard);
        taskCard.remove();
        renderTasks(completedTasks, document.querySelector('.tasks-section .task-cards'));
    });

    // Delete task
    deleteButton.addEventListener('click', () => {
        taskCard.remove();
    });
}

// Initialize task actions for existing tasks
document.querySelectorAll('.task-card').forEach(handleTaskActions);