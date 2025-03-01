/**
 * @file addTaskButton.js
 * @version 1.0.0
 * @author Terra Infinity
 * @description This module manages the add task button's functionality, including displaying the add task modal and handling task creation.
 * 
 * - Manages the interaction of clicking the add task button to show the task modal.
 * 
 * Workflow:
 * - When user clicks the add task button, this file triggers the modal display.
 * - After modal display, control is passed to taskForm.js for user input.
 * 
 * @module addTaskButton
 */

// =============================================================================
// =============================== Imports =====================================
// =============================================================================
import { showTaskFormModal } from '/javascripts/task-components/form/taskForm.js';

// =============================================================================
// =============================== Initialization ==============================
// =============================================================================
/**
 * Initializes the add task button and sets up the click event listener.
 * 
 * This function ensures that the DOM is fully loaded before accessing elements. (see main.js for Dom listener)
 * It also logs the add task button for debugging purposes and checks for its existence.
 * 
 * If the button is clicked, the add task modal is displayed.
 * 
 * @function initializeAddTaskButton
 * @returns {void} - This function does not return a value.
 */
export function initializeAddTaskButton() {
    // Ensure the DOM is fully loaded before accessing elements
    console.info('%c <↓↓↓| initializeAddTaskButton() starting |↓↓↓>', 'color: wheat');

    const addTaskButton = document.getElementById('add-task-btn');

    // Log the add task button for debugging purposes
    //console.debug('%c Add Task Button:', 'color: lightblue', addTaskButton);

    // Check if the add task button exists
    if (!addTaskButton) {
        console.error('%c Add task button not found', 'color: red');
        return; // Exit if the button is not found
    }

    // Add click event listener to the add task button
    addTaskButton.addEventListener('click', () => {
        console.info('%c *** addTaskButton.addEventListener() clicked ***', 'color: aqua');
        // Show the add task modal (calls taskForm.js openTaskFormModal function)
        showTaskFormModal();
    });





    const loginButton = document.getElementById('login-btn');



    console.info('%c <↑↑↑| initializeAddTaskButton() complete |↑↑↑>', 'color: lime'); // Add this line
}

// =============================================================================
// =============================== UI Updates ==================================
// =============================================================================
/**
 * Updates the UI of the login button based on the user's login status.
 * 
 * @param {boolean} isLoggedIn - Indicates whether the user is logged in or not.
 * Default is true, meaning the user is logged in.
 * 
 * If the user is logged in, the button text is set to 'Login'.
 * If the user is logged out, the button text is set to 'Logout'.
 */
export function updateUI(isLoggedIn = true) { // Called by auth.js during login/logout
    const loginButton = document.getElementById('login-btn');

    // Check if the login button exists before updating UI
    if (!loginButton) {
        console.error('%c Login button not found for UI update', 'color: red');
        return; // Exit if the button is not found
    }

    // Update button text based on login status
    if (isLoggedIn === true) {
        loginButton.textContent = 'Login'; // Set text for logged in state
    } else {
        loginButton.textContent = 'Logout'; // Set text for logged out state
    }
}