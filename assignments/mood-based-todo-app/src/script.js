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

document.getElementById('complete-all').addEventListener('click', function() {
    // Select all task cards within the "Your Tasks" section
    const yourTasksSection = document.querySelector('.tasks-section .task-cards');
    if (yourTasksSection) {
        yourTasksSection.innerHTML = ''; // Clear only the "Your Tasks" section
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
                const taskDuration = taskForm.querySelector('input[placeholder="Duration (in minutes)"]').value;
                const taskDate = taskForm.querySelector('input[type="date"]').value;

                // Create temporary container to parse component HTML
                const template = document.createElement('template');
                template.innerHTML = componentHtml;
                const newTask = template.content.querySelector('.task-card');

                // Update task component with form data
                newTask.querySelector('.task-title').textContent = taskName;
                newTask.querySelector('.task-description').textContent = `Duration: ${taskDuration} minutes`;
                newTask.querySelector('.due-date').textContent = `Due: ${taskDate}`;
                
                // Add to tasks section
                const yourTasksSection = document.querySelector('.tasks-section .task-cards');
                yourTasksSection.appendChild(newTask);

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