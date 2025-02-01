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
            // Fetch the task form HTML
            const response = await fetch('src/components/task-form.html');
            if (!response.ok) throw new Error('Failed to load form');
            
            // Insert form into a modal-like container
            const formHtml = await response.text();
            const modalContainer = document.createElement('div');
            modalContainer.id = 'taskFormModal';
            modalContainer.classList.add('modal');
            modalContainer.innerHTML = `
                <div class="modal-content">
                    <button class="close-modal">✖</button>
                    ${formHtml}
                </div>
            `;
            
            // Append modal to body
            body.appendChild(modalContainer);

            // Close modal on button click
            document.querySelector('.close-modal').addEventListener('click', () => {
                modalContainer.remove();
            });

            // Prevent form submission from refreshing the page
            const taskForm = modalContainer.querySelector('.task-form');
            taskForm.addEventListener('submit', (event) => {
                event.preventDefault();
                
                // Get task details
                const taskName = taskForm.querySelector('input[placeholder="Task name"]').value;
                const taskDuration = taskForm.querySelector('input[placeholder="Duration (in minutes)"]').value;

                // Add task to the "Your Tasks" section
                const yourTasksSection = document.querySelector('.tasks-section .task-cards');
                const newTask = document.createElement('article');
                newTask.classList.add('task-card');
                newTask.innerHTML = `
                    <div class="task-content">
                        <div class="task-header">
                            <h3>${taskName}</h3>
                            <span class="task-time">${taskDuration} mins</span>
                        </div>
                        <button class="btn-complete">✓</button>
                    </div>
                `;
                yourTasksSection.appendChild(newTask);

                // Close the modal
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