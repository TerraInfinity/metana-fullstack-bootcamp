/**
 * @file auth.js
 * @version 1.0.0
 * @author Terra Infinity
 * @description Core authentication logic for managing user sessions, including registration, login, and logout processes.
 * @module auth
 */

// Define a global constant for the default profile photo
const DEFAULT_PROFILE_PHOTO = '/public/images/glaum 1.png';

// auth.js - Core authentication logic with localStorage
/**
 * @file Core authentication logic with localStorage.
 * 
 * - Manages user registration, login, logout processes.
 * - Handles session persistence using localStorage.
 * - This module manages user registration, login, and logout processes, as well as session persistence using localStorage.
 * 
 * Workflow:
 * - Receives credentials from loginAuthForm.js for authentication.
 * - Validates credentials and updates session data if login is successful.
 * - Notifies main.js indirectly via session state in localStorage for UI updates.
 * 
 * Interactions:
 * - This module interacts with the Task class in task.js to manage user-specific tasks.
 * - It provides user data to the TaskManager class in task-management.js, allowing for the loading and saving of tasks
 *   associated with the authenticated user or guest user.
 * - The TaskCard class in taskCard.js relies on user data managed by this module to display tasks correctly in the UI,
 *   ensuring that the task cards reflect the current user's session state.
 *   The systemTaskManager is the main TaskManager instance that coordinates the overall task management, 
 *   and is instantiated in main.js.
 * 
 */

// =============================================================================
// ========================= Import Functions ==================================
// =============================================================================
import {
    updateLoginButtonUI
} from '/src/auth/js/loginButton.js';
import {
    dbManager
} from '/src/auth/js/indexedDBManager.js'; // Updated import statement
import {
    systemTaskManager
} from '/src/script/main.js'; // NEW: Import systemTaskManager to refresh task views

// =============================================================================
// ============================== Variables ====================================
// =============================================================================
/**
 * The key used to store and retrieve users from localStorage.
 * @constant {string}
 */
const LOCAL_STORAGE_USERS_KEY = 'users';

/**
 * The key used to store and retrieve the current user session from localStorage.
 * @constant {string}
 */
const CURRENT_USER_SESSION_KEY = 'currentUser';

/**
 * The key used to store and retrieve the guest user session from localStorage.
 * @constant {string}
 */
const GUEST_USER_KEY = 'guestUser';


// =============================================================================
// ========================= Core Functions ====================================
// =============================================================================

/**
 * Initializes the authentication process when the page loads.
 * 
 * This function checks for an active user session in sessionStorage. 
 * If a session exists, it loads the current user data. If no session 
 * is found, it initializes a guest user session with default values.
 * 
 * Additionally, it updates the UI & greeting text to welcome the logged-in user
 * if a valid user session is found. If the user is a guest, it sets the 
 * session with default guest values.
 * 
 * @function initializeAuth
 * @returns {void} - This function does not return a value.
 */
export async function initializeAuth() {
    let currentUser = JSON.parse(sessionStorage.getItem(CURRENT_USER_SESSION_KEY));
    if (!currentUser) {
        currentUser = {
            email: 'Guest',
            password: null,
            name: 'Guest',
            profilePhoto: DEFAULT_PROFILE_PHOTO
        }; // Default guest user with default profile photo
        sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(currentUser));
    }
    return currentUser;
}


/**
 * Logs in a user with email and password.
 * 
 * This function checks the provided email and password against the stored users in localStorage.
 * If the login is successful, it saves the user to sessionStorage and updates the greeting text
 * to welcome the logged-in user. If the login fails, it returns an error message.
 * 
 * Additionally, this function does not handle cases where the user is not found or if the 
 * password is incorrect, which may lead to security concerns. It is recommended to implement 
 * measures such as rate limiting or account lockout after multiple failed attempts.
 * 
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Object} - An object containing:
 *                     - {boolean} success - True if login succeeds, false otherwise.
 *                     - {string} message - A message providing additional information.
 */
export async function login(email, password) {
    const allUsers = await getAllUsers();
    const user = allUsers.find(u => u.email === email && u.password === password);
    if (user) {
        sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(user));
        await updateUserUI(true);
        return {
            success: true,
            user
        };
    }
    return {
        success: false,
        message: 'Invalid credentials'
    };
}



/**
 * Registers a new user in the system.
 * 
 * This function checks if a user with the provided email already exists. 
 * If not, it creates a new user with the given email, password, and name, 
 * and saves the updated user list to localStorage.
 * 
 * Automatically logs in the user after successful registration.
 * 
 * @param {string} email - The email address of the user to register.
 * @param {string} password - The password for the new user account.
 * @param {string} name - The name of the user.
 * @returns {Object} - An object indicating the success of the registration:
 *                     - {boolean} success - True if registration is successful.
 *                     - {string} message - A message providing additional information.
 */
export async function register(email, password, name) {
    const allUsers = await getAllUsers();
    if (allUsers.some(u => u.email === email)) {
        return {
            success: false,
            message: 'Email already in use'
        };
    }

    // Create a new user object with the default profile photo.
    const newUser = {
        email,
        password,
        name,
        profilePhoto: DEFAULT_PROFILE_PHOTO
    };
    allUsers.push(newUser);
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(allUsers));

    // Immediately initialize an IndexedDB record for the new user.
    const initialTaskData = {
        yourActiveTasks: [],
        yourCompleteTasks: [],
        yourActiveSuggestedTasks: [],
        profilePhoto: DEFAULT_PROFILE_PHOTO
    };
    await dbManager.saveTasks(email, initialTaskData);

    return login(email, password);
}


/**
 * Logs out the current user by clearing their session data.
 * 
 * This function removes the current user session from sessionStorage 
 * and updates the UI to reflect the logged-out state. It also saves 
 * the current user data before logging out.
 * 
 * @function logout
 * @returns {void} - This function does not return a value.
 */
export async function logout() {
    console.info('%c ↓ logout() Starting ↓', 'color: lightgray');
    try {
        const currentUserData = await getCurrentUserData();
        console.debug('%c logout() currentUserData:', 'color: aqua', currentUserData);
        await saveCurrentUserData(currentUserData);
        sessionStorage.removeItem(CURRENT_USER_SESSION_KEY);
        sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify({
            email: 'Guest',
            password: null,
            name: 'Guest',
            profilePhoto: DEFAULT_PROFILE_PHOTO
        }));
        await systemTaskManager.loadTasks();
    } catch (error) {
        console.error('%c Error during logout process:', 'color: red', error);
    }
    await updateUserUI();
    console.info('%c ↑ logout() complete ↑', 'color: darkgray');
}

/**
 * Checks if a user is currently authenticated.
 * 
 * This function verifies if there is an active user session in 
 * sessionStorage. It returns true if a user is authenticated, 
 * or false if no session exists or if the user is a guest.
 * 
 * @returns {boolean} - Returns true if a user is authenticated, 
 *                      false otherwise.
 */
export function isAuthenticated() {

    const currentUser = JSON.parse(sessionStorage.getItem(CURRENT_USER_SESSION_KEY));
    return currentUser && currentUser.email !== 'Guest'; // Check if the user is not a guest
}





// =============================================================================
// ========================= User Functions ====================================
// =============================================================================

/**
 * Retrieves all users from localStorage.
 * If an error occurs during retrieval, it returns an empty array.
 * 
 * @returns {Array} - Returns an array of users if found, otherwise an empty array.
 */
export async function getAllUsers() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY)) || []; // Retrieve users from localStorage
    } catch (error) {
        console.error('%c getAllUsers() Error retrieving users from localStorage:', 'color: red', error); // Log any errors that occur during retrieval
        return []; // Return an empty array in case of an error
    }
}

// =============================================================================
// ====================== Get User Data Functions ==============================
// =============================================================================

/**
 * Retrieves the current user data from localStorage.
 * If the current user data is not found, it switches to retrieving the guest user data.
 * 
 * @returns {Object|null} - Returns the current user data if found, otherwise the guest user data or null.
 */
export async function getCurrentUserData() {
    try {
        const currentUserData = JSON.parse(sessionStorage.getItem(CURRENT_USER_SESSION_KEY)) || null;

        if (!currentUserData || currentUserData.email == null) {
            console.debug('%c getCurrentUserData() Current user data not found, defaulting to guest user data.', 'color: aqua');
            const guestUserData = await getGuestUserData();
            console.debug('%c getCurrentUserData() Returning guestUserData', 'color: aqua', guestUserData);
            return {
                email: guestUserData.email,
                password: guestUserData.password,
                name: guestUserData.name,
                profilePhoto: guestUserData.profilePhoto || DEFAULT_PROFILE_PHOTO,
                taskManager: systemTaskManager
            };
        }

        return {
            email: currentUserData.email,
            password: currentUserData.password,
            name: currentUserData.name,
            profilePhoto: currentUserData.profilePhoto || DEFAULT_PROFILE_PHOTO,
            taskManager: systemTaskManager
        };
    } catch (error) {
        console.error('%c getCurrentUserData() Error retrieving current user data:', 'color: red', error);
        return null;
    }
}

/**
 * Retrieves guest user data from localStorage. If no data exists, initializes it with default values.
 * This function ensures that even after serialization/de-serialization, the TaskManager remains an instance.
 * 
 * @returns {Object|null} - The guest user data object if successfully retrieved or initialized, otherwise null.
 */
export async function getGuestUserData() {
    let guestUser = JSON.parse(sessionStorage.getItem(GUEST_USER_KEY));
    if (!guestUser) {
        guestUser = {
            email: 'Guest',
            password: null
        };
        sessionStorage.setItem(GUEST_USER_KEY, JSON.stringify(guestUser));
    }
    return guestUser;
}

// =============================================================================
// ====================== Get User/Guest Email Functions =======================
// =============================================================================

/**
 * Retrieves the current user email.
 * If there is no authenticated user, returns 'guest'.
 *
 * @returns {string} The user's email or 'guest' if not authenticated.
 */
export async function getCurrentUserEmail() {
    const currentUserData = await getCurrentUserData();
    if (currentUserData && currentUserData.email) {
        return currentUserData.email;
    }
    return 'Guest';
}

/**
 * Retrieves the email of the guest user from localStorage.
 * If no guest user email is found, it initializes it with the value 'guest'.
 * 
 * @returns {string} - Returns the guest user email if found, otherwise 'Guest'.
 * @throws {Error} Throws an error if there is an issue retrieving the guest user email.
 */
export async function getGuestUserEmail() {
    try {
        const guestData = await getGuestUserData();
        return guestData.email;
    } catch (error) {
        console.error('%c getGuestUserEmail() Error retrieving guest user email:', 'color: red', error);
        throw new Error('Failed to retrieve guest user email');
    }
}

/**
 * Retrieves the current user's name from the user data.
 * 
 * @returns {Promise<string>} The current user's name.
 * @throws {Error} Throws an error if the user data cannot be retrieved.
 */
export async function getCurrentUserName() {
    const userData = await getCurrentUserData(); // Assuming this function retrieves user data
    if (userData && userData.name) {
        return userData.name; // Return the user's name
    } else {
        throw new Error('User name not found');
    }
}


// =============================================================================
// ========================= Save User Data Functions ==========================
// =============================================================================

/**
 * Saves the current user data to localStorage after verifying the data format.
 * If an error occurs during the saving process, it logs the error.
 * 
 * @param {Object} [data] - The data of the current user to be saved. Optional.
 * @throws {Error} Throws an error if the data cannot be saved or if the data format is invalid.
 */
export async function saveCurrentUserData(userData) {
    if (!userData) {
        userData = await getCurrentUserData();
    }
    if (!userData || !userData.email) throw new Error('Invalid user data format');

    const taskData = userData.taskManager ? {
        yourActiveTasks: userData.taskManager.yourActiveTasks.map(task => task.serialize()),
        yourCompleteTasks: userData.taskManager.yourCompleteTasks.map(task => task.serialize()),
        yourActiveSuggestedTasks: userData.taskManager.yourActiveSuggestedTasks.map(task => task.serialize())
    } : {
        yourActiveTasks: await systemTaskManager.loadTasks().then(tasks => tasks.yourActiveTasks.map(task => task.serialize())),
        yourCompleteTasks: await systemTaskManager.loadTasks().then(tasks => tasks.yourCompleteTasks.map(task => task.serialize())),
        yourActiveSuggestedTasks: await systemTaskManager.loadTasks().then(tasks => tasks.yourActiveSuggestedTasks.map(task => task.serialize()))
    };

    // Include profilePhoto in the data saved to IndexedDB.
    const dataToSave = {
        ...taskData,
        profilePhoto: userData.profilePhoto || DEFAULT_PROFILE_PHOTO
    };

    await dbManager.saveTasks(userData.email, dataToSave);
    sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        profilePhoto: userData.profilePhoto || DEFAULT_PROFILE_PHOTO
    }));
}

/**
 * Saves or updates user data in localStorage after verifying the data format.
 * This function attempts to merge new data with existing user data. If no user 
 * data exists for the given email, it should ideally add a new user, but this 
 * function assumes the user already exists in the `users` array.
 * 
 * @param {string} email - The email of the user whose data is to be saved. Must be a valid email address.
 * @param {Object} data - The data object to be saved or updated for the user. 
 *                        Should contain only key-value pairs that are valid for user data.
 * @throws {Error} Throws an error if:
 *   - The data format is invalid according to `verifyDataFormat`.
 *   - The user with the given email does not exist in localStorage.
 *   - There's an error in accessing or updating localStorage.
 * @returns {void}
 */
export async function saveUserData(email, data) {
    // Verify the format of the provided data
    //const verifiedData = verifyDataFormat(data, false); // Validate data format, excluding credentials (false flag). This ensures verifiedData does not include email and password.
    try {
        const users = await getAllUsers();
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex > -1) {
            const specifiedUserData = users[userIndex]; // Get the specified user data
            const mergedData = {
                ...specifiedUserData,
                ...data
            }; // Merge data over specified user data. This ensure email and password of the specifiedUserData are not overwritten.
            users[userIndex] = mergedData; // Update the users array with merged data
            localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users)); // Save updated users list
        }
    } catch (error) {
        console.error('Error saving user data:', error); // Log any errors that occur during saving
        throw new Error('Failed to save user data'); // Throw an error if saving fails
    }
}


// =============================================================================
// ========================= Migrate Guest Data Functions =====================
// =============================================================================

/**
 * Migrates guest user data to a registered user account.
 * This function retrieves the guest data and updates the user data
 * for the specified email. It also removes the guest user data from
 * localStorage after migration.
 * 
 * @param {string} email - The email of the user to whom the guest data will be migrated.
 * @throws {Error} Throws an error if the migration process fails.
 */
export async function migrateGuestDataToUser(email) {
    try {
        const guestData = await dbManager.fetchDBTasks('Guest');
        const userData = await dbManager.fetchDBTasks(email);

        await dbManager.transaction(async () => { // Ensure this method exists
            if (guestData) await dbManager.saveTasks(email, guestData);
            await dbManager.deleteTasks('Guest'); // Ensure this method exists
        });

    } catch (error) {
        console.error('Migration failed:', error);
        throw new Error('Data migration rolled back due to errors');
    }
}

// =============================================================================
// ========================= Update UI Functions ==============================
// =============================================================================

/**
 * Updates the UI elements based on the current user session.
 * 
 * This function updates the greeting text to welcome the logged-in user
 * and modifies the login button text based on the user's login status.
 * It retrieves the current user's email and checks if the user is authenticated.
 * 
 * @throws {Error} Throws an error if the current user email cannot be retrieved.
 */
export async function updateUserUI(alsoRefreshTaskView = false) {
    try {
        const name = await getCurrentUserName();
        document.getElementById('greeting-text').textContent = `Welcome, ${name}.`;
    } catch (error) {
        document.getElementById('greeting-text').textContent = 'Welcome, Guest.';
    }

    if (isAuthenticated()) {
        updateLoginButtonUI(true);
    } else {
        updateLoginButtonUI(false);
    }

    // Update the user icon in index.html with the new profile photo.
    const userIcon = document.getElementById('user-icon');
    if (userIcon) {
        const userData = await getCurrentUserData();
        userIcon.src = userData.profilePhoto;
    }

    if (alsoRefreshTaskView) {
        await systemTaskManager.loadTasks();
    }
}

export async function loadCurrentUserTasks(email) {
    return dbManager.fetchDBTasks(email);
}

/**
 * Updates the user's profile information.
 * 
 * This function updates the user's name, email, and optionally password and profile photo.
 * It retrieves the current user data, applies the changes, saves the updated data,
 * and refreshes the UI.
 * 
 * @param {string} newName - The new name for the user.
 * @param {string} newEmail - The new email for the user.
 * @param {string} newPassword - The new password for the user (if provided).
 * @param {File|null} newProfilePhotoFile - The profile photo file uploaded by the user (if provided).
 * @returns {Promise<Object>} A promise that resolves with the updated user data.
 * @throws {Error} Throws an error if updating fails.
 */
export async function updateProfile(newName, newEmail, newPassword, newProfilePhotoFile) {
    // Retrieve the current user from sessionStorage.
    let currentUser = JSON.parse(sessionStorage.getItem(CURRENT_USER_SESSION_KEY));
    if (!currentUser) {
        throw new Error("No current user found.");
    }

    const originalEmail = currentUser.email; // Store the original email for localStorage validation

    // Validate if the email is being changed:
    if (newEmail && newEmail !== originalEmail) {
        const allUsers = await getAllUsers();
        if (allUsers.some(user => user.email === newEmail)) {
            throw new Error("The new email is already in use by another account.");
        }
    }

    // Process new profile photo if provided.
    let updatedProfilePhoto = currentUser.profilePhoto;
    if (newProfilePhotoFile) {
        updatedProfilePhoto = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(newProfilePhotoFile);
        });
    }

    // Update password if a new one is provided and it meets the minimum length.
    if (newPassword && newPassword.length >= 8) {
        currentUser.password = newPassword;
    }

    // Update the basic profile details.
    currentUser.name = newName;
    currentUser.email = newEmail;
    currentUser.profilePhoto = updatedProfilePhoto;

    // Update sessionStorage.
    sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(currentUser));

    // Update the user record in localStorage.
    const allUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY)) || [];
    const userIndex = allUsers.findIndex(user => user.email === originalEmail);
    if (userIndex !== -1) {
        allUsers[userIndex] = {
            ...currentUser
        };
    } else {
        // Ideally this doesn't occur.
        allUsers.push({
            ...currentUser
        });
    }
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(allUsers));

    // Prepare task data to update in IndexedDB.
    // (This example assumes that your user object has an immutable "id" property which is used as the primary key in IndexedDB.
    // If you aren't already using such an id, consider adding one rather than using the email since the email may change.)
    const taskData = {
        yourActiveTasks: currentUser.taskManager ? currentUser.taskManager.yourActiveTasks.map(task => task.serialize()) : [],
        yourCompleteTasks: currentUser.taskManager ? currentUser.taskManager.yourCompleteTasks.map(task => task.serialize()) : [],
        yourActiveSuggestedTasks: currentUser.taskManager ? currentUser.taskManager.yourActiveSuggestedTasks.map(task => task.serialize()) : [],
        profilePhoto: currentUser.profilePhoto,
        // Optionally store the updated email here too.
        email: currentUser.email
    };

    // Directly update the existing record in IndexedDB using the immutable id.
    await dbManager.updateTasks(currentUser.id, taskData);

    // Call updateUserUI to refresh the UI after saving the profile.
    await updateUserUI(true); // Pass true to refresh the task view if needed.
}