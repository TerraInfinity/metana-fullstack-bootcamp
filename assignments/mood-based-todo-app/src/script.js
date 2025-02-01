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
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(task => task.remove());
});

document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('add-task-btn');
    const modal = document.getElementById('task-form-modal');
    const closeModal = document.getElementById('close-modal');
    const taskForm = document.getElementById('task-form');
    const taskCardsContainer = document.querySelector('.task-cards');

    // Open modal
    addTaskBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Handle form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('task-title').value;
        const desc = document.getElementById('task-desc').value;
        const date = document.getElementById('task-date').value;

        // Create a new task card
        const newTask = document.createElement('article');
        newTask.className = 'task-card new-task';
        newTask.innerHTML = `
            <div class="task-content">
                <div class="task-header">
                    <h3>${title}</h3>
                    <span class="task-time">${desc}</span>
                </div>
                <p class="task-timestamp">${date}</p>
            </div>
            <button class="btn-complete">✓</button>
        `;

        // Append the new task to the task list
        taskCardsContainer.appendChild(newTask);

        // Close the modal
        modal.style.display = 'none';

        // Reset the form
        taskForm.reset();
    });
});