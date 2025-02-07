import { 
    yourTasks,
    completedTasks,
    suggestedTasks
} from '/src/auth/js/auth.js';
import { createTaskCard, handleTaskActions } from '/src/components/task-component/js/task-component.js';
import { updateTaskCount, saveTasksToLocalStorage, switchTaskView } from '/src/auth/js/task-management.js';

// # Task form component logic

export async function openTaskFormModal() {
    try {
        // Fetch both the task form and task component HTML
        const [formResponse, componentResponse] = await Promise.all([
            fetch('src/components/task-form/html/task-form.html'),
            fetch('src/components/task-component/html/task-component.html')
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
        
        document.body.appendChild(modalContainer);

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
            const isShowingCompleted = document.getElementById('show-completed').textContent.includes('Hide');
            if (isShowingCompleted) {
                switchTaskView(); 
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
}