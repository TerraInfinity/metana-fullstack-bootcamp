import { systemTaskManager } from '/src/script/main.js';
import { Task } from '/src/auth/js/task.js';


let taskForm;
let formTitle;
let durationInput;
let durationToggleButton;
let submitButton;


export function initializeTaskFormModal() {
    console.info('%c <↓↓↓| initializeTaskFormModal() starting |↓↓↓>', 'color: wheat');

    const modalContainer = document.getElementById('addTaskModalContainer'); // Get the modalContainer from index.html
    if (!modalContainer) {
        console.error('%c initializeTaskFormModal() Modal container not found in the document.', 'color: red');
        return; // Exit if modalContainer is not found
    }

    fetch('/src/components/task-form/html/taskForm.html') // Load the task form from taskForm.html
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); // Throw error for non-OK responses
            }
            return response.text(); // Return the response text if OK
        })
        .then(html => {
            modalContainer.innerHTML = html; // Insert the loaded HTML into the container
            setupTaskFormModal(); // Set up modal functionality after loading HTML
            console.info('%c initializeTaskFormModal() Task form loaded successfully', 'color: lightgreen');
        })
        .catch(error => {
            console.error('%c initializeTaskFormModal() Error loading task form:', 'color: red', error); // Log any errors encountered
        });
    
    console.info('%c <↑↑↑| initializeTaskFormModal() complete |↑↑↑>', 'color: lime');
}



function setupTaskFormModal() {
    const modal = document.getElementById('addTaskModal'); // Get the task form modal element
    if (!modal) {
        console.error('%c setupTaskFormModal() Task form modal not found for setup.', 'color: red'); // Log error if modal is not found
        return; // Exit if modal is not found
    }

    // Close button functionality
    const span = document.getElementById("close-task-form-modal"); // Get the close button element
    if (span) {
        span.onclick = () => {
            closeTaskFormModal(); // Close modal on button click
        };
    } else {
        console.warn('%c setupTaskFormModal() Close button not found in the modal.', 'color: yellow'); // Log warning if close button is not found
    }

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target === modal) closeTaskFormModal(); // Close modal if clicked outside
    };
}




export function showTaskFormModal(task = null) {
    console.info('%c <↓↓↓| showTaskFormModal() starting |↓↓↓>', 'color: wheat');

    const modal = document.getElementById("addTaskModal"); // Get the login modal element
    if (!modal) {
        console.error('%c showTaskFormModal() Login modal not found in the document. Modal:', 'color: red', modal);
        return; // Exit if modal is not found
    }
    // Initialize common elements
    taskForm = document.getElementById('task-form'); // Get the task form element
    console.debug('%c showTaskFormModal() taskForm', 'color: aqua', taskForm);

    formTitle = document.getElementById("task-form-title"); // Get the form title element
    durationInput = document.getElementById('duration-input'); // This is the number input for the duration
    durationToggleButton = document.getElementById('duration-toggle'); // This is the button to toggle the duration units
    submitButton = document.getElementById("submit-task-form-btn"); // Get the submit button element

    // If a task is provided, populate the form with its details
    if (task) {
        formTitle.textContent = "Edit Task"; // Change title for editing
        submitButton.textContent = "Update Task";
        taskForm.querySelector('#task-name').value = task.name || ''; // Set task name
        taskForm.querySelector('#task-description').value = task.description || ''; // Set task description
        taskForm.querySelector('#datepicker').value = task.dueDate || new Date().toISOString().split('T')[0]; // Set due date to today's date if not provided
        durationInput.value = task.duration || ''; // Set duration
    } else {
        formTitle.textContent = "Add New Task"; // Default title for adding a new task
        submitButton.textContent = "Create Task";
        taskForm.querySelector('#task-name').value = ''; // Set task name
        taskForm.querySelector('#task-description').value = ''; // Set task description
        taskForm.querySelector('#datepicker').value = new Date().toISOString().split('T')[0] || ''; // Set due date to today's date if not provided
        durationInput.value = ''; // Set duration

    }

    const durationUnits = ['Minutes', 'Hours', 'Days']; // This is the array of duration units
    let currentUnitIndex = 0; // Initialize current unit index to 0

    durationToggleButton.addEventListener('click', () => {
        currentUnitIndex = (currentUnitIndex + 1) % durationUnits.length; // Cycle through the units
        durationToggleButton.textContent = durationUnits[currentUnitIndex]; // Update toggle text
        durationInput.placeholder = `Duration (${durationUnits[currentUnitIndex]})`; // Update placeholder
    });

    const datepickerEl = modal.querySelector('#datepicker');
    $(datepickerEl).datepicker({
        minDate: 0,
        dateFormat: 'yy-mm-dd',
        defaultDate: new Date()
    });

    // Make datepicker readonly to prevent manual input
    datepickerEl.setAttribute('readonly', true);

    clearTaskFormErrors(); // Clear any existing error messages
    modal.style.display = "flex"; // Show the modal
    console.info('%c showTaskFormModal() Task form modal displayed', 'color: lightgreen');

    // Setup form submission
    if (taskForm) {
        taskForm.onsubmit = async (event) => {
            event.preventDefault();
            if (validateTaskForm()) {
                await handleTaskFormSubmit(event, task);
            }
        };
    } else {
        console.error('%c showTaskFormModal() Task form not found', 'color: red'); // Log error if form is not found
    }
    console.info('%c <↑↑↑| showTaskFormModal() complete |↑↑↑>', 'color: lime');
}




async function handleTaskFormSubmit(event, task = null) {
    event.preventDefault(); // Prevent default form submission behavior
    console.info('%c <↓↓↓| handleTaskFormSubmit() starting |↓↓↓>', 'color: wheat');

    var isEditing = !!task; // true if task is provided, false otherwise
    
    console.debug('%c handleTaskFormSubmit() Current taskForm:', 'color: aqua', taskForm); // Debugging line
    const formData = new FormData(taskForm); // Collect form data
    console.debug('%c handleTaskFormSubmit() Collected formData:', 'color: aqua', Array.from(formData.entries())); // Debugging line to show form data

    const taskDetails = {
        name: formData.get('task-name').trim(), // Get task name from form
        description: formData.get('task-description').trim(), // Get description from form
        dueDate: formData.get('datepicker').trim(), // Get date from form
        duration: formData.get('duration-input').trim(), // Get duration from form
        type: 'active' // Set completed status as needed
    };

    console.debug('%c handleTaskFormSubmit() creating task. Details:', 'color: aqua', taskDetails);

    if (isEditing) {
        // If editing, update the existing task
        try {
            
            systemTaskManager.editTask(task.id, taskDetails, true); // Edit the existing task

            console.info('%c *** handleTaskFormSubmit() Task edited successfully ***', 'color: lightgreen', taskDetails); // Log success message
        } catch (error) {
            console.error('%c handleTaskFormSubmit() An error occurred during editing:', 'color: red', error); // Log any errors encountered
        }
    } else {
        // If creating a new task
        try {
            const newTask = await Task.create(taskDetails.name, taskDetails.description, taskDetails.duration, taskDetails.dueDate, taskDetails.type);
            systemTaskManager.addTask(newTask.type, newTask, true); // Add the new task to the system task manager
            systemTaskManager.switchTaskView('active');
            console.info('%c *** handleTaskFormSubmit() Task created successfully ***', 'color: lightgreen', newTask); // Log success message
        } catch (error) {
            console.error('%c handleTaskFormSubmit() An error occurred during operation:', 'color: red', error); // Log any errors encountered
        }
    }
    closeTaskFormModal();
    console.info('%c <↑↑↑| handleTaskFormSubmit() complete |↑↑↑>', 'color: lime');
}



/**
 * Closes the task form modal.
 * 
 * This function hides the task form modal from the view, effectively closing it.
 * It also clears all error messages to ensure a clean state for future interactions.
 * 
 * @function closeTaskFormModal
 * @returns {void} This function does not return a value.
 * 
 * @throws {Error} Throws an error if the modal element is not found.
 * 
 * Workflow:
 * - Checks if the task form modal exists in the document.
 * - Hides the modal by setting its display style to 'none'.
 * - Clears all error messages to ensure a clean state for future interactions.
 * - Logs a message indicating that the modal has been closed.
 */
function closeTaskFormModal() {
    const modal = document.getElementById('addTaskModal'); // Get the login modal element
    if (modal) {
        modal.style.display = 'none'; // Hide the modal if it exists
        clearTaskFormErrors(); // Clear error messages upon closing
        console.info('%c *** closeModal() *** Task form modal closed', 'color: lightgreen'); // Log closure action
    } else {
        console.error('%c closeTaskFormModal() Task form modal not found when attempting to close.', 'color: red'); // Log error if modal is not found
    }
}




function validateTaskForm() {
    let isValid = true;
    const taskName = document.getElementById('task-name');
    const duration = document.getElementById('duration-input');
    const datepicker = document.getElementById('datepicker');

    // Clear previous error messages
    clearTaskFormErrors();

    // Validate task name
    if (!taskName.value.trim()) {
        document.getElementById('task-name-error').innerHTML = '⚠️ Task name is required';
        isValid = false;
    }

    // Validate duration
    if (!duration.value.trim()) {
        document.getElementById('task-duration-error').innerHTML = '⚠️ Duration is required';
        isValid = false;
    } else if (isNaN(duration.value.trim())) {
        document.getElementById('task-duration-error').innerHTML = '⚠️ Duration must be a number';
        isValid = false;
    }

    // Validate date
    if (!datepicker.value.trim()) {
        document.getElementById('task-datepicker-error').innerHTML = '⚠️ Please select a date';
        isValid = false;
    }

    return isValid;
}

/**
 * Clears all error messages in the task form.
 * 
 * @function clearTaskFormErrors
 * @returns {void}
 */
function clearTaskFormErrors() {
    const errorElements = [
        'task-name-error',
        'task-duration-error',
        'task-datepicker-error'
    ];

    errorElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '';
        }
    });
}






