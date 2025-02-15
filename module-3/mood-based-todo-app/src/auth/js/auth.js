/**
 * @file auth.js
 * @version 1.0.0
 * @author Terra Infinity
 * @description Core authentication logic for managing user sessions, including registration, login, and logout processes.
 * @module auth
 */

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
import { TaskManager } from '/src/auth/js/task-management.js';
import { updateUI as updateLoginButtonUI } from '/src/auth/js/loginButton.js';
import { systemTaskManager } from '/src/script/main.js';
import { TaskCard } from '/src/components/task-component/js/taskCard.js';

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
  console.info('%c <↓↓↓| initializeAuth() starting |↓↓↓>', 'color: wheat');
  //console.debug('%c initializeAuth() sessionStorage.getItem(CURRENT_USER_SESSION_KEY)', 'color: aqua', JSON.parse(JSON.stringify(sessionStorage.getItem(CURRENT_USER_SESSION_KEY))));

 

  // Deep clone the object
  //const clonedObject = JSON.parse(JSON.stringify(loadedSessionDataParsed));
  //console.debug('%c initializeAuth() clonedObject', 'color: aqua', clonedObject);

  //const loadedSessionData = JSON.parse(JSON.stringify(sessionStorage.getItem(CURRENT_USER_SESSION_KEY)));
  //console.debug('%c initializeAuth() loadedSessionData', 'color: aqua', loadedSessionData);

  //const loadedSessionDataParsed = JSON.parse(loadedSessionData);

  //const currentTaskManager = JSON.parse(JSON.stringify(loadedSessionDataParsed)).taskManager;
  //console.debug('%c initializeAuth() currentTaskManager', 'color: aqua', currentTaskManager);
  //console.debug('%c initializeAuth() loadedSessionDataParsed', 'color: aqua', loadedSessionDataParsed);

  // Set the taskManager from currentUserData to currentTaskManager
  //let newObject = {}
  //Object.assign(newObject, loadedSessionDataParsed); // merge the taskManager from currentUserData into currentTaskManager
  //currentTaskManager = loadedSessionDataParsed.taskManager; // Update currentTaskManager with taskManager from currentUserData
  //console.debug('%c initializeAuth() newObject', 'color: aqua', newObject);
  //console.debug('%c initializeAuth() newObject.taskManager', 'color: aqua', newObject.taskManager);
  //var currentTaskManager = newObject.taskManager;
  //const currentTaskManager = new TaskManager();
  //Object.assign(currentTaskManager, newObject.taskManager);
  //console.debug('%c initializeAuth() currentTaskManager', 'color: aqua', currentTaskManager);

  // Retrieve and parse data
  if (!(sessionStorage.getItem(CURRENT_USER_SESSION_KEY))) {
    console.warn('%c initializeAuth() sessionStorage.getItem(CURRENT_USER_SESSION_KEY) is null', 'color: aqua');
    const localStorageData = localStorage.getItem(CURRENT_USER_SESSION_KEY);
    if (!localStorageData) {
      console.warn('%c initializeAuth() localStorage.getItem(CURRENT_USER_SESSION_KEY) is null', 'color: aqua');
      const defaultGuestData = {
        email: 'Guest',
        password: null
      };
        sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify({
        email: defaultGuestData.email,
        password: null,
        taskManager:  new TaskManager()
      }));
      
    } else {
      sessionStorage.setItem(CURRENT_USER_SESSION_KEY, localStorageData);
    }
  }
  const loadedSessionData = (JSON.parse(sessionStorage.getItem(CURRENT_USER_SESSION_KEY))).taskManager;
  // Hydrate the task manager with the old task manager data object, which is likely uninstantiated (just a plain object) after being loaded from sessionStorage/localStorage.     * This method hydrates the task manager with the old task manager.  
  await TaskManager.hydrateTaskManager(loadedSessionData);  
  //systemTaskManager.refreshAllTaskViews();
  //systemTaskManager.loadTasks();

  //console.debug('%c initializeAuth() systemTaskManager.yourActiveTasks[0].taskCard', 'color: yellow', systemTaskManager.yourActiveTasks[0].taskCard);
  //console.debug('%c initializeAuth() systemTaskManager.yourActiveTasks[0].taskCard.taskCardElement', 'color: yellow', systemTaskManager.yourActiveTasks[0].taskCard.taskCardElement);


  //console.debug('%c initializeAuth() currentUserData', 'color: green', clonedTaskManager);

 
  // Check if current user session exists
  /*if (currentUserData) {
      console.debug('%c User Found in initializeAuth()', 'color: lightgreen', currentUserData.email);
      updateUI(); // Call updateUI for logged-in user
  } else {
      console.error('%c initializeAuth() currentUserSession not found', 'color: red');
      throw new Error('Current user session not found');
  }*/

  console.info('%c <↑↑↑| initializeAuth() complete |↑↑↑>', 'color: lime');
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
export function login(email, password) {
  console.info('%c ↓ Starting login() ↓', 'color: lightgray', email);
  const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY)) || [];
  const user = users.find(u => u.email === email && u.password === password);
  const verifiedUser = verifyDataFormat(user);

  if (verifiedUser) {
      // Save the current user to sessionStorage
      console.debug('%c login() user', 'color: aqua', user);
      console.debug('%c login() verifiedUser', 'color: aqua', verifiedUser);

      sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(verifiedUser));
      console.debug('%c login() current user now set in sessionStorage', 'color: aqua', sessionStorage.getItem(CURRENT_USER_SESSION_KEY));
      console.info('%c login() Login successful for user:', 'color: lightgreen', email); // Log success

      updateUI(); // Call updateUI for logged-in user
      console.debug('%c login() userData Object:', 'color: aqua', verifiedUser);
      console.info('%c ↑ login() complete ↑', 'color: darkgray');
      return { success: true, message: 'Login successful' }; // Return success message
  } else {
      console.warn('%c login() Login failed for user:', 'color: red', email); // Log failure
      return { success: false, message: 'Invalid email or password' }; // Return error message
  }
}



/**
 * Registers a new user in the system.
 * 
 * This function checks if a user with the provided email already exists. 
 * If not, it creates a new user with the given email and password, 
 * and saves the updated user list to localStorage.
 * 
 * Automatically logs in the user after successful registration.
 * 
 * @param {string} email - The email address of the user to register.
 * @param {string} password - The password for the new user account.
 * @returns {Object} - An object indicating the success of the registration:
 *                     - {boolean} success - True if registration is successful.
 *                     - {string} message - A message providing additional information.
 */
export function register(email, password) {
  console.info('%c ↓ Starting register() ↓', 'color: lightgray', email);
  const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY)) || [];
  console.debug('%c register() Current users in localStorage before registration in auth.js:', 'color: aqua', users); // Log current users

  try {
    // Check if the user already exists in the users array
    if (users.some(u => u.email === email)) {
        console.warn('%c register() User already exists:', 'color: aqua', email); // Warn if the user already exists
        return { success: false, message: 'User already exists' }; // Return an object indicating failure
    }

    // Add the new user to the users array
    users.push({ email, password });
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users)); // Save updated users list to localStorage
    console.debug('%c register() User registered successfully: ', 'color: lightgreen', email); // Log successful registration
    
    console.debug('%c register() Attempting automatic login after registration: ', 'color: aqua', email); // Log successful registration
    // Automatically log in the user after successful registration
    const loginResult = login(email, password); // Log the user in
    if (!loginResult.success) {
        console.warn('%c register() Registration succeeded, but login failed:', 'color: aqua', loginResult.message); // Log if login fails
    }else {
      console.info('%c register() Registration successful, login successful:', 'color: lightgreen', email); // Log if login succeeds
    }

    console.info('%c ↑ register() complete ↑', 'color: darkgray');
    return { success: true, message: 'Registration successful' }; // Return an object indicating success

  } catch (error) {
    console.error('%c register() Error registering user in auth.js:', 'color: red', error); // Log any errors that occur during registration
    return { success: false, message: 'Registration failed due to an error' }; // Return an object indicating failure
  }
  
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
export function logout() {
  console.info('%c ↓ logout() Starting ↓', 'color: lightgray');
  
  try {
    saveCurrentUserData(); // Save current user data.
    sessionStorage.removeItem(CURRENT_USER_SESSION_KEY); // Remove current user session
    updateUI(); // Update UI to reflect logged-out state
    console.info('%c ↑ logout() complete ↑', 'color: darkgray');
  } catch (error) {
    console.error('%c Error during logout process:', 'color: red', error); // Log any errors that occur during logout
  }
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
  try {
    const currentUserEmail = getCurrentUserEmail();
    const guestUserEmail = getGuestUserEmail();

    // Check if user is not a guest and guest data does not exist
    if (currentUserEmail !== guestUserEmail) {
        console.debug('%c isAuthenticated() currentUserEmail', 'color: aqua', currentUserEmail); 
        return true; // User is authenticated
    } else {
        console.debug('%c isAuthenticated() guestUserEmail', 'color: aqua', guestUserEmail); 
        return false; // User is not authenticated
    }
  } catch (error) {
    console.error('%c Error checking authentication status:', 'color: red', error); // Log any errors that occur during the check
    return false; // Return false in case of an error
  }
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
export function getAllUsers() {
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
export function getCurrentUserData() {
  try {
    const currentUserData = JSON.parse(sessionStorage.getItem(CURRENT_USER_SESSION_KEY)) || null; // Retrieve current user data
    if ((!currentUserData) || (currentUserData.email == null)) {
      console.debug('%c getCurrentUserData() Current user data not found, defaulting to guest user data.', 'color: aqua'); // Log message when switching to guest user data
      const guestUserData = getGuestUserData();
      console.debug('%c getCurrentUserData() Returning guestUserData', 'color: aqua', guestUserData);
      return guestUserData; // Use guest user data if current user data is null
    }

    console.debug('%c getCurrentUserData() found', 'color: aqua', currentUserData);
    return currentUserData; // Use guest user data if current user data is null
  } catch (error) {
    console.error('%c getCurrentUserData() Error retrieving current user data:', 'color: red', error); // Log any errors that occur during retrieval
    return null; // Return null in case of an error
  }
}

/**
 * Retrieves guest user data from localStorage. If no data exists, initializes it with default values.
 * This function ensures that even after serialization/de-serialization, the TaskManager remains an instance.
 * 
 * @returns {Object|null} - The guest user data object if successfully retrieved or initialized, otherwise null.
 */
export function getGuestUserData() {  
  console.debug('%c ↓ getGuestUserData() Starting ↓', 'color: lightgray');
  try {
    // Attempt to get the guest user data from sessionStorage
    const currentUserData = JSON.parse(sessionStorage.getItem(CURRENT_USER_SESSION_KEY));

    console.debug('%c getGuestUserData() current user Data:', 'color: aqua', currentUserData);

    // Handle condition if guestUser hasn't been defined in the sessionStorage yet.
    if (currentUserData === null || currentUserData.email === null) {
      // If no data is found, log this and initialize with defaults
      console.debug('%c getGuestUserData() No guest user data found. Initializing guest user data for first time.', 'color: aqua');
      
      // Create default guest data; taskManager is instantiated as a TaskManager object
      const defaultGuestData = {
        email: 'Guest',
        password: null,
        taskManager: new TaskManager()
      };

      // Store data in sessionStorage with metadata for class reconstruction
      sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify({
        email: defaultGuestData.email,
        password: null,
        taskManager: {
          __class: 'TaskManager', // Marker to identify the class type for later instance recreation
          ...defaultGuestData.taskManager // Spread the TaskManager's properties into the object for storage
        }
      }));
      console.debug('%c getGuestUserData() sessionStorage Set. It looks like:', 'color: lightgreen', sessionStorage.getItem(CURRENT_USER_SESSION_KEY));
      
      console.debug('%c ↑ getGuestUserData() Returning defaultGuestData ↑', 'color: darkgray');
      return defaultGuestData; // Return the default data
    } else{
      console.debug('%c getGuestUserData() currentUser is either a guest or a registered user', 'color: aqua', currentUserData);
      if (currentUserData.email.toLowerCase() == 'guest'){
        console.debug('%c getGuestUserData() currentUser is a guest', 'color: aqua');
        return currentUserData;
      } else {
        console.debug('%c getGuestUserData() currentUser is a registered user', 'color: aqua');

        const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY)) || [];
        const guestUser = users.find(user => user.email === 'Guest');
        if (guestUser) {
          console.debug('%c getGuestUserData() Guest user found in users', 'color: lightgreen', guestUser);
          console.debug('%c ↑ getGuestUserData() Returning guestData ↑', 'color: darkgray');
          return guestUser;
        } else {
          console.error('%c getGuestUserData() No guest user found in users', 'color: red');
          return null;
        }
      }
    }
  } catch (error) {
    // If there's an error during JSON parsing or data retrieval, log it and return null
    console.error('%c getGuestUserData() Error retrieving guest user data:', 'color: red', error);
    return null;
  }
}

// =============================================================================
// ====================== Get User/Guest Email Functions =======================
// =============================================================================

/**
 * Retrieves the email of the current user from localStorage.
 * If the current user email is not found, it retrieves the guest user email instead.
 * 
 * @returns {string|null} - Returns the current user email if found, otherwise the guest user email or null.
 */
export function getCurrentUserEmail() {
  try {
    const currentUserSessionEmail = getCurrentUserData().email;
    return currentUserSessionEmail; // Return the current user email
  } catch (error) {
    console.error('%c getCurrentUserEmail() Error retrieving current user email:', 'color: red', error); // Log any errors that occur during retrieval
    return null; // Return null in case of an error
  }
}

/**
 * Retrieves the email of the guest user from localStorage.
 * If no guest user email is found, it initializes it with the value 'guest'.
 * 
 * @returns {string} - Returns the guest user email if found, otherwise 'Guest'.
 * @throws {Error} Throws an error if there is an issue retrieving the guest user email.
 */
export function getGuestUserEmail() { 
  try {
    const guestEmail = getGuestUserData().email;
    return guestEmail; // Return the guest user email
  } catch (error) {
    console.error('%c getGuestUserEmail() Error retrieving guest user email:', 'color: red', error); // Log any errors that occur during retrieval
    throw new Error('Failed to retrieve guest user email'); // Throw an error if retrieval fails
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
export function saveCurrentUserData(data) {
  console.info('%c ↓ saveCurrentUserData() Starting ↓', 'color: lightgray');

  console.debug('%c saveCurrentUserData() data', 'color: aqua', data);
  const verifiedData = verifyDataFormat(data); // Data is User Data with Task Manager Instance
  console.debug('%c saveCurrentUserData() verifiedData', 'color: aqua', verifiedData);
  try {
    sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(verifiedData)); // Save current user data
    console.debug('%c saveCurrentUserData() saved into sessionStorage:', 'color: aqua', sessionStorage.getItem(CURRENT_USER_SESSION_KEY));

    localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(verifiedData)); // Save current user data
    console.debug('%c saveCurrentUserData() saved into localStorage:', 'color: aqua', localStorage.getItem(CURRENT_USER_SESSION_KEY));

    const checkingdata = JSON.parse(sessionStorage.getItem(CURRENT_USER_SESSION_KEY)); // Convert stringified JSON to object
    
    console.debug('%c saveCurrentUserData() checkingdata', 'color: green', checkingdata);
    console.debug('%c saveCurrentUserData() getCurrentUserData()', 'color: aqua', getCurrentUserData());
  } catch (error) {
    console.error('%c saveCurrentUserData() Error saving current user data:', 'color: red', error); // Log any errors that occur during saving
    throw new Error('Failed to save current user data'); // Throw an error if saving fails
  }
  console.info('%c ↑ saveCurrentUserData() ↑ Complete ', 'color: darkgray');
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
export function saveUserData(email, data) {
  // Verify the format of the provided data
  const verifiedData = verifyDataFormat(data, false); // Validate data format, excluding credentials (false flag). This ensures verifiedData does not include email and password.
  try {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex > -1) {
      const specifiedUserData = users[userIndex]; // Get the specified user data
      const mergedData = { ...specifiedUserData, ...verifiedData }; // Merge verified data over specified user data. This ensure email and password of the specifiedUserData are not overwritten.
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
export function migrateGuestDataToUser(email) {
  try {
    const guestData = getGuestUserData(); // Load guest user data
    if (guestData) {
      console.log('Migrating guest data to user:', email); // Log migration process
      saveUserData(email, guestData); // Save guest data to user account
      //localStorage.removeItem(CURRENT_USER_SESSION_KEY); // Remove guest user data from localStorage
      console.log('Guest data migrated successfully.'); // Log successful migration
    } else {
      console.log('No guest data found to migrate.'); // Log if no guest data is found
    }
  } catch (error) {
    console.error('Error migrating guest data to user:', error); // Log any errors that occur during migration
    throw new Error('Failed to migrate guest data to user'); // Throw an error if migration fails
  }
}
 
// =============================================================================
// ====================== Data Verification Functions ==========================
// =============================================================================
/**
 * Verifies the format of the provided data object based on whether user credentials should be included.
 * 
 * This function checks if the provided data object is valid and contains the required properties.
 * If the data object is a TaskManager instance, it will return it as is. Otherwise, it will ensure
 * that the email and password are valid and that the taskManager is an instance of TaskManager.
 * 
 * @param {Object} data - The data object to verify. It can either be a TaskManager instance or an object containing:
 *                        - {string} email - The user's email address.
 *                        - {string} password - The user's password.
 *                        - {TaskManager} taskManager - An instance of TaskManager.
 * 
 * @returns {Object} - Returns an object containing:
 *                     - {string} email - The verified email address.
 *                     - {string} password - The verified password.
 *                     - {TaskManager} taskManager - The validated TaskManager instance.
 * 
 * @throws {Error} Throws an error if the data object is invalid or missing required properties.
 */
export function verifyDataFormat(data) {
  console.info('%c ↓ verifyDataFormat() ↓ Starting ', 'color: lightgray');  
  if (!data) {
    throw new Error('Data object is required for verification.'); // Check if data is provided
  }

  console.debug('%c verifyDataFormat() data:', 'color: aqua', data);

  // Check if data is just a TaskManager instance
  const taskManagerDataOnlyFlag = data instanceof TaskManager; // true or false 

  console.debug('%c verifyDataFormat() taskManagerDataOnlyFlag:', 'color: aqua', taskManagerDataOnlyFlag);

  if (!taskManagerDataOnlyFlag) {
    // Data is not just a TaskManager instance, check for required properties
    let { email, password, taskManager } = data;
    
    console.debug('%c verifyDataFormat() inputEmail:', 'color: aqua', email);
    console.debug('%c verifyDataFormat() inputPassword:', 'color: aqua', password);
    console.debug('%c verifyDataFormat() taskManagerInput:', 'color: aqua', taskManager);

    // Ensure taskManager is an instance of TaskManager but keep the original data
    let validatedTaskManager;

    // 1. Validate TaskManager instance
    if (taskManager) {
      if (taskManager instanceof TaskManager) {
        console.debug('%c verifyDataFormat() taskManager is an instance of TaskManager, no need to repopulate tasks', 'color: lightgreen');
        validatedTaskManager = taskManager;
      } else { // taskManager is not an instance of TaskManager, but exists as an object

        console.debug('%c verifyDataFormat() taskManager is not an instance of TaskManager, but exists as an object - need to repopulate tasks and reinstate objects', 'color: aqua');
        validatedTaskManager = new TaskManager();
        console.debug('%c verifyDataFormat() taskManager:', 'color: aqua', taskManager);
        Object.assign(validatedTaskManager, taskManager);
        console.debug('%c verifyDataFormat() validatedTaskManager:', 'color: aqua', validatedTaskManager);
        console.debug('%c verifyDataFormat() validatedTaskManager:', 'color: aqua', validatedTaskManager);


      }
    } else { // taskManager is undefined
      console.error('%c verifyDataFormat() taskManager is undefined, unexpected error...', 'color: red');
      throw new Error('TaskManager is undefined');
    }



     // 3. Handle email/password fallback
     if (!email || email.toLowerCase() === "guest") {
       const currentUserData = getCurrentUserData();
       if (currentUserData) {
         email = currentUserData.email;
         password = currentUserData.password;
       }
     }
     const result = { email, password, taskManager: validatedTaskManager };
     console.info('%c ↑ verifyDataFormat() ↑ Complete ', 'color: darkgray', result);  
     return result;
  
  } else {
    // Handle TaskManager-only input    
    const taskManager = data;

    const currentUserData = getCurrentUserData();
    return {
      email: currentUserData.email,
      password: currentUserData.password,
      taskManager: taskManager
    };
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
function updateUI() {
  // Update the greeting text to welcome the logged-in user
  document.getElementById('greeting-text').textContent = `Welcome, ${getCurrentUserEmail()}.`; // Update greeting

  // Update the login button text based on the user's login status
  if (isAuthenticated()) {
    updateLoginButtonUI(false); // Update UI to reflect logged-out status
  } else {
    updateLoginButtonUI(true); // Update UI to reflect logged-in status
  }
}
