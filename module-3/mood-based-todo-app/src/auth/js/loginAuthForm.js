// loginAuthForm.js - Manages authentication form interactions with enhanced validation
/**
 * @file Manages authentication form interactions.
 * @version 1.0.0
 * @author Terra Infinity
 * @description This module handles user authentication through a modal form, allowing users to log in or register.
 * It manages the display of the modal, form submission, and communicates with the authentication service.
 * 
 * @module loginAuthForm
 * 
 * Workflow:
 * - Collects user credentials when the form is submitted.
 * - Calls the appropriate authentication function (login or register) based on user action.
 * - If successful, hides the modal, resets the form, and signals the main application to update the UI.
 * - Provides error handling for failed submissions and loading issues.
 */

import { login, register, isAuthenticated } from '/src/auth/js/auth.js';
import { updateLoginButtonUI } from '/src/auth/js/loginButton.js';
// Common elements reference
let authForm, toggleForm, submitButton, formTitle;

// =============================================================================
// ========================= Initialization Functions ===========================
// =============================================================================

/**
 * Initializes the authentication form by loading the HTML template and setting up the modal.
 * 
 * This function fetches the login form HTML, injects it into the modal container, and sets up the modal
 * for user interaction. It logs the initialization process for debugging purposes.
 * 
 * @function initializeAuthForm
 * @returns {void} This function does not return a value.
 * 
 * @throws {Error} Throws an error if the network response is not ok.
 * 
 * Workflow:
 * - Fetches the login form HTML from the server.
 * - Checks if the modal container exists in the document.
 * - Injects the fetched HTML into the modal container.
 * - Sets up the modal functionality after loading the HTML.
 * - Logs success or error messages to the console for debugging.
 */
export function initializeAuthForm() {
    console.info('%c <↓↓↓| initializeAuthForm() starting |↓↓↓>', 'color: wheat');

    const modalContainer = document.getElementById('authModalContainer'); // Get the authModalContainer from index.html
    if (!modalContainer) {
        console.error('%c Modal container not found in the document.', 'color: red');
        return; // Exit if modalContainer is not found
    }

    fetch('/src/auth/html/login.html') // Load the login form from login.html
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); // Throw error for non-OK responses
            }
            return response.text(); // Return the response text if OK
        })
        .then(html => {
            modalContainer.innerHTML = html; // Insert the loaded HTML into the container
            setupAuthModal(); // Set up modal functionality after loading HTML
            console.info('%c Login form loaded successfully', 'color: lightgreen');
        })
        .catch(error => {
            console.error('%c Error loading login form:', 'color: red', error); // Log any errors encountered
        });
    
    console.info('%c <↑↑↑| initializeAuthForm() complete |↑↑↑>', 'color: lime');
}

/**
 * Sets up the modal's close functionality.
 * 
 * This function initializes the close button and sets up an event listener to close the modal
 * when clicking outside of it. It ensures a smooth user experience when interacting with the modal.
 * 
 * @function setupModal
 * @returns {void} This function does not return a value.
 * 
 * @throws {Error} Throws an error if the modal element is not found.
 * 
 * Workflow:
 * - Checks if the login modal exists in the document.
 * - Initializes the close button functionality to close the modal when clicked.
 * - Sets up an event listener to close the modal when clicking outside of it.
 */
function setupAuthModal() {
    const modal = document.getElementById('loginModal'); // Get the login modal element
    if (!modal) {
        console.error('%c Login modal not found for setup.', 'color: red'); // Log error if modal is not found
        return; // Exit if modal is not found
    }

    // Close button functionality
    const span = document.getElementById("close-auth-form-modal"); // Get the close button element
    if (span) {
        span.onclick = () => {
            closeAuthModal(); // Close modal on button click
        };
    } else {
        console.warn('%c Close button not found in the modal.', 'color: orange'); // Log warning if close button is not found
    }

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target === modal) closeAuthModal(); // Close modal if clicked outside
    };
}

// =============================================================================
// ========================= Show/Hide Modal Functions =========================
// =============================================================================

/**
 * Displays the login modal and initializes event handlers.
 * 
 * This function makes the login modal visible and sets up the necessary event handlers for form submission
 * and toggling between login and registration modes. It also initializes the UI elements for user interaction.
 * 
 * @function showLoginModal
 * @returns {void} This function does not return a value.
 * 
 * @throws {Error} Throws an error if the modal or required UI elements are not found.
 * 
 * Workflow:
 * - Checks if the login modal exists in the document.
 * - Initializes common UI elements for the authentication form.
 * - Resets the form to its default state (login mode).
 * - Displays the modal to the user.
 * - Sets up event handlers for form submission and toggling between modes.
 */
export function showLoginModal() {
    console.info('%c <↓↓↓| showLoginModal() starting |↓↓↓>', 'color: wheat');

    const modal = document.getElementById("loginModal"); // Get the login modal element
    if (!modal) {
        console.error('%c Login modal not found in the document.', 'color: red');
        return; // Exit if modal is not found
    }

    // Initialize common elements
    authForm = document.getElementById('auth-form'); // Get the authentication form element
    toggleForm = document.getElementById("toggle-auth-form"); // Get the toggle form element
    submitButton = document.getElementById("submit-auth-form-btn"); // Get the submit button element
    formTitle = document.getElementById("auth-form-title"); // Get the form title element

    // Reset the form to its default state
    updateFormState(true); // Default to login mode
    clearAuthFormErrors(); // Clear any existing error messages
    modal.style.display = "flex"; // Show the modal
    console.info('%c Login modal displayed', 'color: lightgreen');

    // Setup form submission
    if (authForm) {
        authForm.onsubmit = async (event) => {
            event.preventDefault();
            if (validateLoginForm()) {
                await handleAuthFormSubmit(event, true);
            }
        };
        setupAuthToggleHandler(); // Set up toggle functionality
    } else {
        console.error('%c Authentication form not found', 'color: red'); // Log error if form is not found
    }
    console.info('%c <↑↑↑| showLoginModal() complete |↑↑↑>', 'color: lime');
}

/**
 * Closes the login modal.
 * 
 * This function hides the login modal from the view, effectively closing it.
 * It also logs the closure action for debugging purposes.
 * 
 * @function closeAuthModal
 * @returns {void} This function does not return a value.
 * 
 * @throws {Error} Throws an error if the modal element is not found.
 * 
 * Workflow:
 * - Checks if the login modal exists in the document.
 * - Hides the modal by setting its display style to 'none'.
 * - Logs a message indicating that the modal has been closed.
 */
function closeAuthModal() {
    const modal = document.getElementById('loginModal'); // Get the login modal element
    if (modal) {
        modal.style.display = 'none'; // Hide the modal if it exists
        clearAuthFormErrors(); // Clear error messages upon closing
        console.info('%c Login modal closed', 'color: lightgreen'); // Log closure action
    } else {
        console.error('%c Login modal not found when attempting to close.', 'color: red'); // Log error if modal is not found
    }
}


// =============================================================================
// ========================= Form Handling Functions ===========================
// =============================================================================

/**
 * Updates the form UI state based on the current mode (login/register).
 * 
 * This function updates the UI elements to reflect the current mode, changing text and button labels accordingly.
 * It modifies the toggle link, submit button text, and form title based on whether the user is in login or registration mode.
 * 
 * @function updateFormState
 * @param {boolean} isLoginState - Determines if the form is in login mode (true) or registration mode (false)
 * @returns {void} This function does not return a value.
 * 
 * Workflow:
 * - Updates the toggle form link text based on the current mode.
 * - Changes the submit button text based on the current mode.
 * - Updates the form title based on the current mode.
 * - Toggle name field visibility
 */
function updateFormState(isLoginState = true) {
    toggleForm.innerHTML = isLoginState 
        ? "Don't have an account? <a href='#'>Sign up</a>"
        : 'Already have an account? <a href="#">Log in</a>';

    submitButton.innerText = isLoginState ? "Login" : "Register";
    formTitle.innerText = isLoginState ? "Welcome Back" : "Registration";
    
    // Toggle name field visibility
    const nameField = document.getElementById('name-container');
    if (nameField) {
        nameField.style.display = isLoginState ? 'none' : 'block';
    }
}

/**
 * Handles form submission for both login and registration.
 * 
 * This function prevents the default form submission, collects user credentials, and calls the appropriate
 * authentication function based on the mode (login or registration). It handles success and error responses,
 * providing feedback to the user through console logs and UI updates.
 * 
 * @function handleAuthFormSubmit
 * @param {Event} event - The form submission event.
 * @param {boolean} isLogin - Determines if the submission is for login (true) or registration (false).
 * @returns {Promise<void>} This function does not return a value.
 * 
 * @throws {Error} Throws an error if an issue occurs during the authentication process.
 * 
 * Workflow:
 * - Prevents the default form submission behavior.
 * - Collects form data using FormData API.
 * - Constructs a credentials object with username and password.
 * - Calls the appropriate authentication function based on the mode.
 * - Handles the response, closing the modal on success or logging an error on failure.
 */
async function handleAuthFormSubmit(event, isLogin = true) {
    event.preventDefault(); // Prevent default form submission behavior
    
    // Validate the form first; this call now checks all fields (including duplicate email in registration mode).
    if (!validateLoginForm(isLogin)) {
        // If there are any validation errors, abort submission.
        return;
    }
    
    const formData = new FormData(authForm); // Collect form data
    const credentials = {
        username: formData.get('email').trim(),
        password: formData.get('password').trim(),
        name: formData.get('name') ? formData.get('name').trim() : ''
    };

    try {
        if (!isLogin) {
            // Registration mode
            const response = await register(credentials.username, credentials.password, credentials.name);
            if (response.success) {
                closeAuthModal();
                updateLoginButtonUI(isAuthenticated());
                console.info('%c Registration successful', 'color: lightgreen');
            } else if (response.message === 'Email already in use') {
                // Show inline error for email already in use.
                document.getElementById('login-email-error').innerHTML = '⚠️ Email already in use';
            } else {
                // Display any other registration error inline.
                document.getElementById('login-email-error').innerHTML = `⚠️ ${response.message}`;
            }
        } else {
            // Login mode
            const response = await login(credentials.username, credentials.password);
            if (response.success) {
                closeAuthModal();
                updateLoginButtonUI(isAuthenticated());
                console.info('%c Authentication successful', 'color: lightgreen');
            } else {
                document.getElementById('login-password-error').innerHTML = '⚠️ Invalid credentials';
                console.error('%c Login failed:', 'color: red', response.message);
            }
        }
    } catch (error) {
        console.error('%c An error occurred during operation:', 'color: red', error); // Log any errors encountered
    }
}

/**
 * Sets up the toggle handler to switch between login and registration forms.
 * 
 * This function updates the form state and event handlers when the user toggles between login and registration.
 * It ensures that the correct submission function is called based on the current mode.
 * 
 * @function setupToggleHandler
 * @returns {void} This function does not return a value.
 * 
 * Workflow:
 * - Sets an onclick event handler for the toggle form element.
 * - Determines the current mode (login or registration) based on the toggle form's text.
 * - Updates the UI to reflect the new mode.
 * - Updates the form submission handler to call the appropriate function based on the current mode.
 */
function setupAuthToggleHandler() {
    toggleForm.onclick = () => {
        const isLogin = !toggleForm.innerText.includes("Don't have an account?"); // Determine current mode
        updateFormState(isLogin); // Update UI to reflect new mode
        clearAuthFormErrors(); // Clear errors when toggling forms
        authForm.onsubmit = async (event) => handleAuthFormSubmit(event, isLogin); // Update submission handler
    };
}

/**
 * Validates the login or registration form.
 * 
 * @param {boolean} isLogin - True if in login mode, false if in registration mode.
 * @returns {boolean} - Returns true if the form is valid, false otherwise.
 */
function validateLoginForm(isLogin = true) {
    let isValid = true;
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const nameInput = document.getElementById('name');

    // Clear any previous error messages.
    clearAuthFormErrors();

    // If we're in registration mode, validate the name.
    if (!isLogin) {
        if (!nameInput.value.trim()) {
            document.getElementById('login-name-error').innerHTML = '⚠️ Name is required';
            isValid = false;
        }
    }

    // Validate the email field.
    if (!emailInput.value.trim()) {
        document.getElementById('login-email-error').innerHTML = '⚠️ Email is required';
        isValid = false;
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            document.getElementById('login-email-error').innerHTML = '⚠️ Please enter a valid email address';
            isValid = false;
        }
        // In registration mode, also check if the email is already in use.
        if (!isLogin) {
            const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
            if (allUsers.some(u => u.email === emailInput.value.trim())) {
                document.getElementById('login-email-error').innerHTML = '⚠️ Email already in use';
                isValid = false;
            }
        }
    }

    // Validate the password field.
    if (passwordInput.value.length < 8) {
        document.getElementById('login-password-error').innerHTML = '⚠️ Password must be at least 8 characters long';
        isValid = false;
    }

    return isValid;
}

/**
 * Clears all error messages in the authentication form.
 * 
 * @function clearAuthFormErrors
 * @returns {void}
 */
function clearAuthFormErrors() {
    const errorElements = [
        'login-name-error',
        'login-email-error',
        'login-password-error'
    ];

    errorElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '';
        }
    });
}