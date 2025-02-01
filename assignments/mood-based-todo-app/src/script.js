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
addTaskBtn.addEventListener('click', () => {
    taskFormModal.style.display = 'block';
});

// Close modal
closeModalBtn.addEventListener('click', () => {
    taskFormModal.style.display = 'none';
});

// Handle form submission
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const taskDuration = document.getElementById('task-duration').value;

    // Create a new task card
    const newTaskCard = document.createElement('article');
    newTaskCard.classList.add('task-card');

    newTaskCard.innerHTML = `
        <div class="task-content">
            <div class="task-header">
                <h3>${taskName}</h3>
                <span class="task-time">${taskDuration} mins</span>
            </div>
            <button class="btn-complete">✓</button>
        </div>
    `;

    // Append the new task card to the task list
    const taskCardsContainer = document.querySelector('.tasks-section .task-cards');
    taskCardsContainer.appendChild(newTaskCard);

    // Close modal after submission
    taskFormModal.style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === taskFormModal) {
        taskFormModal.style.display = 'none';
    }
});