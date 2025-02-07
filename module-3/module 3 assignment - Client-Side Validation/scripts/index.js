// metana-fullstack-bootcamp/module-3/module 3 assignment - Client-Side Validation/scripts/index.js

/* 
FORM VALIDATION SCRIPT
Purpose: Client-side validation for user registration form
Features:
- Real-time validation feedback
- Input sanitization
- Error/success state management
- Comprehensive validation rules
- Detailed logging for troubleshooting
*/

// ======================
// DOM ELEMENT REFERENCES
// ======================
// Select form and input elements from the DOM using their IDs
// These constants provide references to the actual HTML elements
const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');


// =================
// HELPER FUNCTIONS
// =================

/**
 * Displays an error message and applies error styling to an input field
 * Process Flow:
 * 1. Find the parent container (.input-control) of the input
 * 2. Locate the error message container
 * 3. Update error message content
 * 4. Apply error styling classes
 * 5. Remove success styling if present
 * 6. Log error to console for debugging
 * @param {HTMLInputElement} input - The input element to mark as invalid
 * @param {string} message - Error message to display
 */
function setError(input, message) {
    const inputControl = input.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    
    // Add error message and styling
    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
    console.log(`Validation error on ${input.id}: ${message}`);
}

/**
 * Applies success styling to an input field
 * Process Flow:
 * 1. Find the parent container (.input-control) of the input
 * 2. Locate the error message container
 * 3. Clear any existing error messages
 * 4. Apply success styling classes
 * 5. Remove error styling if present
 * 6. Log success to console for debugging
 * @param {HTMLInputElement} input - The input element to mark as valid
 */
function setSuccess(input) {
    const inputControl = input.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    
    // Clear error message and apply success styling
    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
    console.log(`Validation success on ${input.id}`);
}

/**
 * Validates email format using regular expression
 * Regex Breakdown:
 * - Validates standard email format (user@domain.tld)
 * - Checks for allowed characters before @ symbol
 * - Validates domain structure after @ symbol
 * - Supports international domains and special characters
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email matches valid format
 */
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// ======================
// MAIN VALIDATION LOGIC
// ======================

/**
 * Central validation function that orchestrates all input checks
 * Process Flow:
 * 1. Trim all input values to remove whitespace
 * 2. Validate each field sequentially
 * 3. Update UI states based on validation results
 * 4. Maintain overall validity status
 * 5. Return final validation outcome
 * @returns {boolean} True if all validations pass, false otherwise
 */
function validateInputs() {
    console.log('Starting form validation process...');
    
    // Input sanitization: Trim whitespace from all inputs
    const usernameValue = username.value.trim(); // Remove leading/trailing spaces
    const emailValue = email.value.trim();       // Email sanitization
    const passwordValue = password.value.trim(); // Password sanitization
    const password2Value = password2.value.trim(); // Confirmation sanitization

    // Validation status flag (assume valid until proven otherwise)
    let isValid = true;

    // ====================
    // USERNAME VALIDATION
    // ====================
    if (!usernameValue) {
        // Empty username check
        setError(username, 'Username is required');
        isValid = false; // Invalidate form
    } else {
        // Valid username
        setSuccess(username);
    }

    // ================
    // EMAIL VALIDATION
    // ================
    if (!emailValue) {
        // Empty email check
        setError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(emailValue)) {
        // Format validation using regex
        setError(email, 'Please enter a valid email address');
        isValid = false;
    } else {
        // Valid email
        setSuccess(email);
    }

    // ====================
    // PASSWORD VALIDATION
    // ====================
    if (!passwordValue) {
        // Empty password check
        setError(password, 'Password is required');
        isValid = false;
    } else if (passwordValue.length < 8) {
        // Minimum length check
        setError(password, 'Password must be at least 8 characters');
        isValid = false;
    } else {
        // Valid password
        setSuccess(password);
    }

    // =============================
    // PASSWORD CONFIRMATION CHECK
    // =============================
    if (!password2Value) {
        // Empty confirmation check
        setError(password2, 'Please confirm your password');
        isValid = false;
    } else if (passwordValue !== password2Value) {
        // Match verification
        setError(password2, 'Passwords do not match');
        isValid = false;
    } else {
        // Valid confirmation
        setSuccess(password2);
    }

    // Final validation status logging
    console.log(`Form validation ${isValid ? 'PASSED' : 'FAILED'}`);
    return isValid;
}

// ======================
// EVENT HANDLERS
// ======================

/**
 * Form Submission Handler
 * Process Flow:
 * 1. Prevent default form submission
 * 2. Execute validation checks
 * 3. Only allow submission if all validations pass
 * 4. Comprehensive logging for debugging
 */
form.addEventListener('submit', function(e) {
    console.log('Form submission initiated'); // Log form submission initiation
    
    // Run validations and prevent submission if any fail
    if (!validateInputs()) {
        e.preventDefault(); // Prevent form submission
        console.warn('Form submission prevented due to validation errors'); // Log prevention reason
    } else {
        console.info('Form validation successful - submitting'); // Log successful validation
        // For enhanced security, consider adding server-side validation
        // and CSRF protection in a real-world application
    }
});

// ======================
// INITIALIZATION LOG
// ======================
console.log('Form validation script initialized successfully');
console.debug('Form elements registered:', {
    form,
    username,
    email,
    password,
    password2
});

// ======================
// ENHANCEMENT: REAL-TIME VALIDATION
// ======================
// Add input blur validation for immediate feedback
[username, email, password, password2].forEach(input => {
    input.addEventListener('blur', () => {
        console.log(`Real-time validation triggered for: ${input.id}`);
        validateInputs();
    });
});