/**
 * @file loginButton.js
 * @version 1.0.0
 * @author Terra Infinity
 * @description This module manages the login button's functionality, including displaying the login modal and handling user authentication.
 * 
 * - Manages the interaction of clicking the login button to show the auth modal.
 * 
 * Workflow:
 * - When user clicks the login button, this file triggers the modal display.
 * - After modal display, control is passed to loginAuthForm.js for user input.
 * 
 * @module loginButton
 */

// =============================================================================
// =============================== Imports =====================================
// =============================================================================
import { showLoginModal } from '/src/auth/js/loginAuthForm.js';
import { logout, isAuthenticated } from '/src/auth/js/auth.js';

// =============================================================================
// =============================== Initialization ==============================
// =============================================================================
/**
 * Initializes the login button and sets up the click event listener.
 * 
 * This function ensures that the DOM is fully loaded before accessing elements. (see main.js for Dom listener)
 * It also logs the login button for debugging purposes and checks for its existence.
 * 
 * If the button is clicked and its text content is 'Login', the login modal is displayed.
 * If the text content is 'Logout', the user is logged out.
 * 
 * @function initializeLoginButton
 * @returns {void} - This function does not return a value.
 */
export function initializeLoginButton() {
  // Ensure the DOM is fully loaded before accessing elements
  console.info('%c <↓↓↓| initializeLoginButton() starting |↓↓↓>', 'color: wheat');

  const loginButton = document.getElementById('login-btn');

  // Log the login button for debugging purposes
  //console.debug('%c Login Button:', 'color: lightblue', loginButton);

  // Check if the login button exists
  if (!loginButton) {
      console.error('%c Login button not found', 'color: red');
      return; // Exit if the button is not found
  }
  updateUI(isAuthenticated());
  // Add click event listener to the login button
  loginButton.addEventListener('click', () => {
      // Check the current text content of the button
      if (loginButton.textContent === 'Login') {
          showLoginModal(); // Show the login modal (calls loginAuthForm.js showLoginModal function)
      } else if (loginButton.textContent === 'Logout') {
        console.log('%c Logging out...', 'color: lightblue'); // Log the logout action
        logout(); // Log the user out (calls auth.js logout function)   
        updateUI(isAuthenticated());
      } else {
        console.warn('%c Unexpected button text: ' + loginButton.textContent, 'color: red'); // Warn for unexpected text
      }
  });

  console.info('%c <↑↑↑| initializeLoginButton() complete |↑↑↑>', 'color: lime'); // Add this line
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
      loginButton.textContent = 'Logout'; // Set text for logged in state
  } else {
      loginButton.textContent = 'Login'; // Set text for logged out state
  }
}
