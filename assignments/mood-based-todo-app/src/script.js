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

const addTaskBtn = document.getElementById('add-task-btn');
const taskFormModal = document.getElementById('task-form-modal');
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

    // Add task logic here
    console.log(`Task Added: ${taskName}, Duration: ${taskDuration} mins`);

    // Close modal after submission
    taskFormModal.style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === taskFormModal) {
        taskFormModal.style.display = 'none';
    }
});