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




export function showTaskFormModal() {
    console.info('%c <↓↓↓| showTaskFormModal() starting |↓↓↓>', 'color: wheat');

    const modal = document.getElementById("addTaskModal"); // Get the login modal element
    if (!modal) {
        console.error('%c showTaskFormModal() Login modal not found in the document. Modal:', 'color: red', modal);
        return; // Exit if modal is not found
    }
    // Initialize common elements
    taskForm = document.getElementById('task-form'); // Get the task form element
    console.debug('%c showTaskFormModal() taskForm', 'color: aqua', taskForm);
    //const toggleForm = taskForm.getElementById("duration-toggle"); // Get the duration toggle form element

    formTitle = document.getElementById("task-form-title"); // Get the form title element
    //const taskDescription = taskForm.querySelector('#task-description'); // Get the task description element
    durationInput = document.getElementById('duration-input'); // This is the number input for the duration
    durationToggleButton = document.getElementById('duration-toggle'); // This is the button to toggle the duration units
    submitButton = document.getElementById("submit-task-form-btn"); // Get the submit button element

    
    const durationUnits = ['Minutes', 'Hours', 'Days']; // This is the array of duration units
    let currentUnitIndex = 0; // Initialize current unit index to 0

    durationToggleButton.addEventListener('click', () => {
        currentUnitIndex = (currentUnitIndex + 1) % durationUnits.length; // Cycle through the units
        durationToggleButton.textContent = durationUnits[currentUnitIndex]; // Update toggle text
        durationInput.placeholder = `Duration (${durationUnits[currentUnitIndex]})`; // Update placeholder
    });


    //taskForm.querySelector('#datepicker').value = taskForm.querySelector('.due-date').textContent.split(': ')[1];

    const datepickerEl = modal.querySelector('#datepicker');
    $(datepickerEl).datepicker({
        minDate: 0,
        dateFormat: 'yy-mm-dd',
        defaultDate: new Date()
    });

    


    

    // Reset the form to its default state
    ///updateFormState(true); // Default to login mode
    modal.style.display = "flex"; // Show the modal
    console.info('%c showTaskFormModal() Task form modal displayed', 'color: lightgreen');
    
    // Setup form submission
    if (taskForm) {
        taskForm.onsubmit = async (event) => handleTaskFormSubmit(event); // Pass the form object to handleTaskFormSubmit
    } else {
        console.error('%c showTaskFormModal() Task form not found', 'color: red'); // Log error if form is not found
    }
    console.info('%c <↑↑↑| showTaskFormModal() complete |↑↑↑>', 'color: lime');
}




async function handleTaskFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior
    console.info('%c <↓↓↓| handleTaskFormSubmit() starting |↓↓↓>', 'color: wheat');
    
    console.debug('%c handleTaskFormSubmit() Current taskForm:', 'color: aqua', taskForm); // Debugging line
    const formData = new FormData(taskForm); // Collect form data
    console.debug('%c handleTaskFormSubmit() Collected formData:', 'color: aqua', Array.from(formData.entries())); // Debugging line to show form data

    const taskDetails = {
        name: formData.get('task-name'), // Get task name from form
        description: formData.get('task-description'), // Get description from form
        dueDate: formData.get('datepicker'), // Get date from form
        duration: formData.get('duration-input'), // Get duration from form
        type: 'active' // Set completed status as needed
    };

    console.debug('%c handleTaskFormSubmit() creating task. Details:', 'color: aqua', taskDetails);
    (async () => {
        try {
            const task = await Task.create(taskDetails.name, taskDetails.description, taskDetails.duration, taskDetails.dueDate, taskDetails.type);
            // Add the newly created task to the system task manager
            systemTaskManager.addTask(task.type, task, true); // Add the new task to the system task manager
            systemTaskManager.saveTasks(); 
            console.info('%c *** handleTaskFormSubmit() Task created successfully ***', 'color: lightgreen', task); // Log success message
        } catch (error) {
            console.error('%c handleTaskFormSubmit() An error occurred during operation:', 'color: red', error); // Log any errors encountered
        }
    })();
    console.info('%c <↑↑↑| handleTaskFormSubmit() complete |↑↑↑>', 'color: lime');
}


function updateFormState(state = 0) {
    /*// Update the toggle form link text based on the current mode
    toggleForm.innerHTML = isLoginState 
        ? "Don't have an account? <a href='#'>Sign up</a>" // Text for login mode
        : 'Already have an account? <a href="#">Log in</a>'; // Text for registration mode

    // Change the submit button text based on the current mode
    submitButton.innerText = isLoginState ? "Login" : "Register"; // Set button text

    // Update the form title based on the current mode
    formTitle.innerText = isLoginState ? "Welcome Back" : "Registration"; // Set form title
    */
   console.info('%c <↓↓↓| updateFormState() starting |↓↓↓>', 'color: wheat');
   console.info('%c <↑↑↑| updateFormState() complete |↑↑↑>', 'color: lime');
}


/**
 * Closes the task form modal.
 * 
 * This function hides the task form modal from the view, effectively closing it.
 * It also logs the closure action for debugging purposes.
 * 
 * @function closeModal
 * @returns {void} This function does not return a value.
 * 
 * @throws {Error} Throws an error if the modal element is not found.
 * 
 * Workflow:
 * - Checks if the task form modal exists in the document.
 * - Hides the modal by setting its display style to 'none'.
 * - Logs a message indicating that the modal has been closed.
 */
function closeTaskFormModal() {
    const modal = document.getElementById('addTaskModal'); // Get the login modal element
    if (modal) {
        modal.style.display = 'none'; // Hide the modal if it exists
        console.info('%c *** closeModal() *** Task form modal closed', 'color: lightgreen'); // Log closure action
    } else {
        console.error('%c closeTaskFormModal() Task form modal not found when attempting to close.', 'color: red'); // Log error if modal is not found
    }
}






