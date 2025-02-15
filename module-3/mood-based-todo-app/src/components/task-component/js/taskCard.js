// taskCard.js

import { systemTaskManager } from '/src/script/main.js'; // Import the taskManager instance

/**
 * Represents a UI component for displaying and managing tasks in various states (active, completed, suggested).
 * This class handles:
 * - Creation of the DOM structure for a task card from a template.
 * - Updating the UI with task data.
 * - Managing user interactions through buttons for task management.
 *
 * Interactions:
 * - This class is instantiated by the Task class in task.js, which represents individual tasks.
 * - Each TaskCard instance is associated with a Task instance, allowing it to display and manage the task's details.
 * - The TaskCard interacts with the TaskManager class in task-management.js to update the task state in the UI,
 *   reflecting changes made to tasks (e.g., moving tasks between active and completed states).
 * - The TaskCard through the Task and TaskManager classes, relies on user data managed by the auth.js module to ensure that tasks are displayed correctly
 *   based on the current user's session state, whether authenticated or as a guest.
 * - User interactions with buttons in the TaskCard (like edit, complete, delete) trigger methods in the TaskManager
 *   to manipulate the task data accordingly.
 *   The systemTaskManager is the main TaskManager instance that coordinates the overall task management, 
 *   and is instantiated in main.js.
 * @class
 */
export class TaskCard {
    /**
     * Initializes the TaskCard instance with the provided task and type.
     * Validates the task object and type to ensure they meet the expected criteria.
     * 
     * @param {Object} task - The task object containing properties like title, description, dueDate, etc.
     * @param {string} [type='active'] - The type of the task card, defaults to 'active'.
     * @throws {Error} Throws an error if the task object is invalid or if the type is not recognized.
     */
    constructor(task, type = 'active') {
        console.info('%c *↓↓ TaskCard constructor() Starting ↓↓*', 'color: lightgray');
        try {
            if (!task || typeof task !== 'object') {
                throw new Error('Invalid task object provided.'); // Validate the task object
            }
            const validTypes = ['active', 'completed', 'suggested'];
            if (!validTypes.includes(type)) {
                throw new Error(`Invalid task type: ${type}. Valid types are: ${validTypes.join(', ')}`); // Validate the type
            }

            this.taskID = task.id; // The associated ID of the task which this card represents
            this.taskCardElement = null; // Will hold the DOM element for the card
        } catch (error) {
            // Log any errors that occur during the initialization process
            console.error('Error initializing TaskCard:', error.message);
            throw error; // Rethrow the error for further handling
        }

        console.info('%c *↑↑ TaskCard constructor() Complete ↑↑*', 'color: lightgray');
    }


    // ===========================================================================
    // ================== Initialization/Refresh UI Functions ====================
    // ===========================================================================
  
    /**
     * Updates the task card UI with the provided task data.
     * This method updates the internal task reference and modifies the task card's UI elements
     * to reflect the current state of the task, including title, description, due date, duration,
     * and type. It also reinitializes the action buttons based on the task type.
     * 
     * If an error occurs during the update process, it logs the error message to the console for debugging purposes.
     * 
     * @param {Object} task - The task object containing updated data.
     * @param {string} task.title - The title of the task.
     * @param {string} task.description - The description of the task.
     * @param {string} task.dueDate - The due date of the task.
     * @param {string} task.duration - The duration of the task.
     * @throws {Error} Throws an error if the task card cannot be updated.
     */
    async initializeTaskCard(task) {
        console.info('%c ↓ initializeTaskCard() Starting ↓', 'color: lightgray');
        try {
            if (!task) {
                throw new Error('initializeTaskCard() Task is undefined');
            }
            console.debug('%c initializeTaskCard() Now creating Task Card for Task:', 'color: aqua', task);

            // Check if the task card has not been created yet
            if (!this.taskCardElement) {
                // Attempt to create the task card using an asynchronous method
                console.debug('%c initializeTaskCard() No taskCardElement found, running createTaskCardHTMLTemplate()', 'color: aqua');
                await this.createTaskCardHTMLTemplate(); 
                console.debug('%c initializeTaskCard() taskCardElement Created via createTaskCardHTMLTemplate()', 'color: aqua', this.taskCardElement);
            } else {
                console.info('%c initializeTaskCard() this.taskCard Found', 'color: aqua', this.taskCardElement);
            }   


            console.debug('%c initializeTaskCard() Setting task.name', 'color: aqua', task.name);
            // Set the task name, using 'name' as a fallback if task.name is undefined
            this.taskCardElement.querySelector('.task-name').textContent = task.name || 'undefined';

            // Update the task description:
            // - If the task is 'suggested', clear the description
            // - Otherwise, use the task's description if available, or an empty string
            console.debug('%c initializeTaskCard() Setting task.description', 'color: aqua', task.description);
            this.taskCardElement.querySelector('.task-description').textContent = 
                task.type === 'suggested' ? '' : (task.description || '');

            // Set the due date, only if it exists
            console.debug('%c initializeTaskCard() Setting task.dueDate', 'color: aqua', task.dueDate);
            this.taskCardElement.querySelector('.due-date').textContent = 
                this.dueDate ? `Due: ${task.dueDate}` : '';

            // Set the task duration, only if it's specified
            console.debug('%c initializeTaskCard() Setting task.duration', 'color: aqua', task.duration);
            this.taskCardElement.querySelector('.task-duration').textContent = 
                this.duration ? `Duration: ${task.duration}` : '';

            // Display the type of the task
            console.debug('%c initializeTaskCard() Setting task.type', 'color: aqua', task.type);
            this.taskCardElement.querySelector('.task-type').textContent = task.type;

            // Reinitialize buttons which might depend on the task type or other attributes
            console.info('%c initializeTaskCard() Task Card Details Set', 'color: aqua', 
                `Name: ${task.name}, Description: ${task.description}, Due Date: ${task.dueDate}, Duration: ${task.duration}, Type: ${task.type}`);
            console.debug('%c initializeTaskCard() Reinitializing buttons', 'color: aqua');
            await this.initializeHTMLButtons(task); 

            systemTaskManager.refreshAllTaskViews();
        } catch (error) {
            // Log any errors that occur during the task card update process
            console.error('Error updating task card:', error.message);
            throw error; // Rethrow the error for further handling
        }
        console.info('%c ↑ initializeTaskCard() Complete ↑', 'color: lightgray');
    }

    // ===========================================================================
    // ========================= HTML Template Function ==========================
    // ===========================================================================

    /**
     * Asynchronously creates and returns a task card DOM element based on a template.
     * This method:
     * - Fetches an HTML template for the task card.
     * - Populates the template with task data (though not shown in this snippet, it's implied).
     * - Adds appropriate buttons for task interactions.

     * - Sets up event listeners for user interactions (not shown but implied).
     * 
     * If an error occurs during the fetching or processing of the template,
     * it logs the error message to the console for debugging purposes.
     * 
     * @async
     * @returns {HTMLElement} The created task card DOM element. If an error occurs, returns an empty div.
     * @throws {Error} If the HTML template cannot be fetched or processed.
     */
    async createTaskCardHTMLTemplate() {
        console.info('%c ↓ createTaskCardHTMLTemplate() Starting ↓', 'color: lightgray');
        try {
            console.debug('%c createTaskCardHTMLTemplate() Fetching Task Card HTML Template from taskCard.html', 'color: aqua');

            // Fetch the HTML template for the task card from a specified URL
            const response = await fetch('/src/components/task-component/html/taskCard.html');
            if (!response.ok) {
                throw new Error('Failed to load task card HTML');
            }
            console.debug('%c createTaskCardHTMLTemplate() Task Card HTML Template Loaded from taskCard.html', 'color: aqua');

            // Create a template element to parse the HTML string safely
            const taskCardHTMLTemplate = document.createElement('template');
            taskCardHTMLTemplate.innerHTML = await response.text();

            // Clone the task-card element from the template's content
            const taskCardHTML = taskCardHTMLTemplate.content.querySelector('.task-card').cloneNode(true);
            
            this.taskCardElement = taskCardHTML; 
            console.debug('%c createTaskCardHTMLTemplate() Task Card HTML Created & inserted into taskCardElement:', 'color: lightgreen', this.taskCardElement);

            // Here you would typically add logic to populate taskCard with data, 
            // add buttons, and set up event listeners, but it's not shown in this snippet
            console.info('%c ↑ createTaskCardHTMLTemplate() Complete ↑', 'color: lightgray');
        } catch (fetchError) {
            console.error('Error fetching task card HTML template:', fetchError.message);
            throw fetchError; // Rethrow the error for further handling
        }
    }


    // ===========================================================================
    // ======================== Button HTML UI Creation ==========================
    // ===========================================================================

    /**
     * Initializes and appends buttons to the task card based on the task's type.
     * 
     * This method performs the following actions:
     * - Checks for the existence of a container for task action buttons.
     * - Clears any existing buttons in the container to ensure a fresh UI.

     * - Adds appropriate buttons based on the task's current type: 'active', 'completed', or 'suggested'.
     * - Applies relevant CSS classes to the task card for visual distinction.
     * - Sets up event listeners for each button added to handle user interactions.
     * 
     * If an error occurs during button creation or event listener attachment,
     * it logs the error message to the console for debugging purposes.
     * 
     * @private
     * @throws {Error} Throws an error if the task card is not available or if button creation fails.
     */
    initializeHTMLButtons(task) {
        // Locate the container for task action buttons within the task card
        console.info('%c ↓ initializeHTMLButtons() Starting ↓', 'color: wheat');
        const taskActions = this.taskCardElement.querySelector('.task-actions');
        if (!taskActions) {
            console.warn("%c initializeHTMLButtons() Task actions div not found. Buttons cannot be added.", 'color: red');
            return; // Exit if the container is not found
        }
        
        // Clear any existing buttons to reset the UI
        console.info('%c initializeHTMLButtons() Clearing existing buttons', 'color: aqua');
        taskActions.innerHTML = ''; // Remove all child elements

        try {
            // Determine which buttons to add based on the task type
            if (task.type === 'active') {
                console.info('%c initializeHTMLButtons() Setting active buttons', 'color: aqua');
                // Set the class for active tasks to apply specific styles
                this.taskCardElement.classList.add('active');
                this.taskCardElement.classList.remove('suggested', 'completed');
                

                // Create buttons for editing, completing, and deleting the task
                console.info('%c initializeHTMLButtons() Creating buttons', 'color: aqua');
                const editButton = this.createButton('edit', '✏️');
                const completeButton = this.createButton('complete', '✅');
                const deleteButton = this.createButton('delete', '🗑️');
                
                // Append the created buttons to the task actions container
                console.info('%c initializeHTMLButtons() Appending buttons to HTML', 'color: aqua');
                taskActions.append(editButton, completeButton, deleteButton);
                
                // Attach event listeners to each button for handling actions
                console.info('%c initializeHTMLButtons() Attaching event listeners', 'color: aqua');
                this.setEditButtonListener();
                this.setCompleteButtonListener();
                this.setDeleteButtonListener();

            } else if (task.type === 'completed') {
                // Set the class for completed tasks to apply specific styles
                console.info('%c initializeHTMLButtons() Setting completed buttons', 'color: aqua');
                this.taskCardElement.classList.add('completed');
                this.taskCardElement.classList.remove('suggested', 'active');
                
                // Only a delete button is necessary for completed tasks
                console.info('%c initializeHTMLButtons() Creating delete button', 'color: aqua');
                const deleteButton = this.createButton('delete', '🗑️');
                taskActions.append(deleteButton); // Add the delete button
                
                // Attach event listener for the delete action
                console.info('%c initializeHTMLButtons() Attaching delete button event listener', 'color: aqua');
                this.setDeleteButtonListener();

            } else if (task.type === 'suggested') {
                // Set the class for suggested tasks to apply specific styles
                console.info('%c initializeHTMLButtons() Setting suggested buttons', 'color: aqua');
                this.taskCardElement.classList.add('suggested');
                this.taskCardElement.classList.remove('active', 'completed');
                
                // Create buttons for adding and deleting the task
                console.info('%c initializeHTMLButtons() Creating add and delete buttons', 'color: aqua');
                const addButton = this.createButton('add', '➕');
                const deleteButton = this.createButton('delete', '🗑️');
                
                // Append the created buttons to the task actions container
                console.info('%c initializeHTMLButtons() Appending add and delete buttons to HTML', 'color: aqua');
                taskActions.append(addButton, deleteButton);
                
                // Attach event listeners for add and delete actions
                console.info('%c initializeHTMLButtons() Attaching add and delete event listeners', 'color: aqua');
                this.setAddButtonListener();
                this.setDeleteButtonListener();
            }
        } catch (error) {
            // Log any errors that occur during button creation or event listener attachment
            console.error('%c initializeHTMLButtons() Error initializing buttons:', 'color: red', error.message);
        }
        console.info('%c ↑ initializeHTMLButtons() Complete ↑', 'color: wheat');
    }

    /**
     * Creates a button element with the specified action and content.
     * 
     * This method may throw an error if the action type is invalid.
     * 
     * @param {string} action - The action type for the button (e.g., 'add', 'edit', 'delete').
     * @param {string} content - The innerHTML of the button (e.g., emoji or text).
     * @returns {HTMLElement} The created button element.
     * @private
     * @throws {Error} Throws an error if the action type is invalid.
     */
    createButton(action, content) {
        console.debug('%c ↓ createButton() Starting ↓', 'color: wheat');
        // Validate the action type
        const validActions = ['add', 'edit', 'complete', 'delete'];
        if (!validActions.includes(action)) {
            throw new Error(`Invalid action type: ${action}`); // Throw an error for invalid action type
        }

        // Create a new button element
        const button = document.createElement('button');
        // Set the class name for the button based on the action type
        button.className = `btn-action ${action}`;
        // Set the inner HTML content of the button
        button.innerHTML = content;
        // Return the created button element
        console.info('%c createButton() Button Created:', 'color: lightgreen', button.innerHTML);
        console.debug('%c ↑ createButton() Complete ↑', 'color: lightgray');
        return button;
    }


    // ===========================================================================
    // ======================= Button Event Listener Functions ===================
    // ===========================================================================

    /**
     * Adds event listeners to the 'Add' button.
     * This method checks if the task card exists and then attaches a click event listener
     * to the add button. The event listener will handle the logic for adding a new task.
     * 

     * If an error occurs during the process of moving the task to active,
     * it logs the error message to the console for debugging purposes.
     * 
     * @private
     * @throws {Error} Throws an error if the task card is not available or if the task cannot be moved.
     */
    setAddButtonListener() {
        // Ensure the task card is available before proceeding
        if (!this.taskCard) return;

        // Select the add button from the task card
        const addButton = this.taskCard.querySelector('.btn-action.add');
        if (addButton && this.task.type === 'suggested') {
            // Event listener for adding a new task
            addButton.addEventListener('click', async () => {
                try {
                    systemTaskManager.moveTask(this.task, 'active'); // Move the task to 'active' type
                    // Initializing the Task Card will refresh the Task Card UI and buttons / listeners.
                    await this.initializeTaskCard(this.task); // Await the asynchronous call to initializeTaskCard
                } catch (error) {
                    // Log any errors that occur during the task addition process
                    console.error('Error moving task to active:', error.message);
                }
            });
        }
    }

    /**
     * Attaches event listeners to the 'Edit' button within the task card.
     * This method first checks if the task card is available. If it is, it selects the edit button
     * and adds a click event listener to it. When the button is clicked, it triggers the logic for
     * opening the edit modal, allowing the user to modify the task's details.
     * 
     * If an error occurs during the process of opening the modal or updating the task,
     * it logs the error message to the console and provides user feedback for troubleshooting.
     * 
     * @private
     * @throws {Error} Throws an error if the task card is not available or if the modal fails to open.
     */
    setEditButtonListener() {
        // Ensure the task card is available before proceeding to avoid errors
        if (!this.taskCard) return;

        // Select the edit button from the task card's action buttons
        const editButton = this.taskCard.querySelector('.btn-action.edit');
        // Check if the edit button exists and if the task is currently active
        if (editButton && this.task.type === 'active') {
            // Attach a click event listener to the edit button
            editButton.addEventListener('click', async () => {
                try {
                    // Open the edit modal and wait for the user to submit the form
                    const data = await this.openEditModal();
                    // Log the form data received from the modal for debugging
                    console.log(data); // Here `data` contains the updated task details
                    // Update the task in the task manager with the new values
                    systemTaskManager.editTask(this.task, data.title, data.description, data.duration, data.dueDate);
                } catch (error) {
                    // Log any errors that occur during the editing process
                    console.error('Error updating task:', error.message);
                    // Provide user feedback in the console for troubleshooting
                    console.log('Failed to update task. Please try again.');
                }
            });
        }
    }

    
    /**
     * Adds event listeners to the 'Complete' button.
     * This method checks if the task card exists and then attaches a click event listener
     * to the complete button. The event listener will handle the logic for marking the task as complete.
     * 
     * If an error occurs during the process of moving the task to completed,
     * it logs the error message to the console for debugging purposes.
     * 
     * @private
     * @throws {Error} Throws an error if the task card is not available or if the task cannot be moved.
     */
    setCompleteButtonListener() {
        // Ensure the task card is available before proceeding
        if (!this.taskCard) return;

        // Select the complete button from the task card
        const completeButton = this.taskCard.querySelector('.btn-action.complete');
        if (completeButton && this.task.type === 'active') {
            // Attach a click event listener to the complete button
            completeButton.addEventListener('click', async () => {
                try {
                    systemTaskManager.moveTask(this.task, 'completed'); // Move the task to 'completed' type
                    // Initializing the Task Card will refresh the Task Card UI and buttons / listeners.
                    await this.initializeTaskCard(this.task); // Await the asynchronous call to initializeTaskCard
                } catch (error) {
                    // Log any errors that occur during the task completion process
                    console.error('Error moving task to completed:', error.message);
                }
            });
        }
    }

    /**
     * Adds event listeners to the 'Delete' button.
     * This method checks if the task card exists and then attaches a click event listener
     * to the delete button. The event listener will handle the logic for deleting the task.
     * 
     * If an error occurs during the process of removing the task,
     * it logs the error message to the console for debugging purposes.
     * 
     * @private
     * @throws {Error} Throws an error if the task card is not available or if the task cannot be removed.
     */
    setDeleteButtonListener() {
        // Ensure the task card is available before proceeding
        if (!this.taskCard) return;

        // Select the delete button from the task card
        const deleteButton = this.taskCard.querySelector('.btn-action.delete');
        if (deleteButton) {
            // Attach a click event listener to the delete button
            deleteButton.addEventListener('click', () => {
                try {
                    systemTaskManager.removeTask(this.task); // Remove the task from the task manager
                } catch (error) {
                    // Log any errors that occur during the task deletion process
                    console.error('Error removing task:', error.message);
                }
            });
        }
    }


    // ===========================================================================
    // ====================== Edit Modal Form Function ===========================
    // ===========================================================================


    /**
     * Opens the modal for editing task details.
     * This method fetches the HTML template for the modal, populates it with the current task's data,
     * and handles user interactions for updating the task.
     * 

     * If an error occurs during the fetching of the modal template or while updating the task,
     * it logs the error message to the console for debugging purposes.
     * 
     * @private
     * @returns {Promise<Object>} A promise that resolves with an object containing the form data when the modal is closed.
     * @throws {Error} Throws an error if the modal template fails to load or if the task update fails.
     */
    async openEditModal() {
        try {
            // Fetch the HTML template for the modal from the specified path
            const response = await fetch('/src/components/task-form/html/task-form.html');
            if (!response.ok) {
                throw new Error('Failed to load modal template'); // Throw an error if the template fails to load
            }
            const modalHtml = await response.text(); // Get the text content of the fetched HTML

        // Create a modal element and set its inner HTML to the fetched template
        const modal = document.createElement('div');
        modal.id = 'editTaskModal'; // Assign an ID to the modal for identification
        modal.innerHTML = modalHtml; // Set the modal's inner HTML to the fetched template

        // Pre-fill the modal fields with the current task data
        modal.querySelector('#edit-task-title').value = this.task.title; // Set the title input
        modal.querySelector('#edit-duration').value = this.task.duration; // Set the duration input
        modal.querySelector('#edit-date').value = this.task.dueDate; // Set the due date input

        // Append the modal to the body of the document
        document.body.appendChild(modal);

        // Get the close button element within the modal
        const span = modal.getElementsByClassName("close")[0]; // Select the close button
        const form = modal.querySelector('#edit-task-form'); // Select the form element

        // Display the modal to the user
        modal.style.display = "block"; // Make the modal visible

        // Create a closure to store the form data
        let formData = {}; // Initialize an object to hold the form data

        // Close Modal functionality: when the close button is clicked
        span.onclick = function() {
            modal.style.display = "none"; // Hide the modal
            document.body.removeChild(modal); // Remove the modal from the DOM
        };

        // Close the modal when the user clicks outside of it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none"; // Hide the modal
                document.body.removeChild(modal); // Remove the modal from the DOM
            }
        };

            // Handle form submission for updating the task
            form.onsubmit = (e) => {
                e.preventDefault(); // Prevent the default form submission behavior
                // Collect form data into formData
                formData = {
                    title: document.getElementById('edit-task-title').value, // Get the title value
                    description: document.getElementById('edit-description').value, // Get the description value
                    duration: document.getElementById('edit-duration').value, // Get the duration value
                    dueDate: document.getElementById('edit-date').value // Get the due date value
                };
                
                // Update the task with the new data
                try {
                    this.task.update(formData.title, formData.description, formData.duration, formData.dueDate);
                } catch (error) {
                    console.error('Error updating task:', error.message); // Log any errors during the update
                    return; // Exit if the update fails
                }
                
                // Hide the modal after submission
                modal.style.display = "none"; // Hide the modal
                document.body.removeChild(modal); // Remove the modal from the DOM
            };

            // Return a promise that resolves with the form data when the modal is closed
            return new Promise(resolve => {
                const checkModalClosed = setInterval(() => {
                    if (modal.style.display === "none") {
                        clearInterval(checkModalClosed); // Stop checking if the modal is closed
                        resolve(formData); // Resolve the promise with the collected form data
                    }
                }, 100); // Check every 100 milliseconds if the modal is closed
            });
        } catch (error) {
            console.error('Error in openEditModal:', error.message); // Log any errors that occur
            throw error; // Rethrow the error for further handling
        }
    }

    // ===========================================================================
    // ========================= Helper Functions ==============================
    // ===========================================================================

    /**
     * Fetches a task from the task manager based on the provided task ID.  
     * 
     * @param {string} taskId - The ID of the task to fetch.
     * @returns {Object} The task object associated with the provided ID.
     */     
    getTaskFromID(taskId) {
        return systemTaskManager.getTask(taskId);
    }

}