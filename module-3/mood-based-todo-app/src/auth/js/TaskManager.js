/**
 * @file task-management.js
 * @version 1.0.0
 * @author Terra Infinity
 * @description Manages task objects and their interactions, including loading, saving, and manipulating tasks for both authenticated users and guests.
 * @module taskManagement
 */

//task-management.js - Manages task objects and their interactions
/**
 * 
 * This module handles task objects for both authenticated users and guests:
 * - Manages arrays for user tasks (yourTasks, completedTasks, suggestedTasks).
 * - Provides functionalities to load, save, and manipulate tasks.
 * - Integrates with mood and weather conditions to suggest tasks.
 * - Updates and renders tasks in the UI, including task count and view switching.
 * 
 * Note: 
 * - Saving and loading tasks for authenticated users might be adjusted to reference 
 *   auth.js for direct integration with local storage and user data updates.
 * - Current functionality includes basic saving to localStorage for both guests and users,
 *   but this might change in future updates.
 * 
 * Interactions:
 * - This module utilizes the Task class from task.js to create and manage task objects.
 * - Each task object is associated with a TaskCard instance from taskCard.js, which handles
 *   the UI representation of the task, including rendering and user interactions.
 * - The TaskManager class coordinates the loading, saving, and manipulation of tasks,
 *   ensuring that changes are reflected in both the task data and the UI through TaskCard.
 * - This module interacts with auth.js to manage user-specific tasks, providing user data
 *   for loading and saving tasks associated with authenticated users or guest users.
 *   It ensures that the task management system reflects the current user's session state.
 * - The main System Task Manager is instantiated in main.js
 * 
 */

// =============================================================================
// =============================== Imports =====================================
// =============================================================================  

 // TaskManager.js - Enhanced with auth integration
import { systemTaskManager } from '/src/script/main.js';
import { 
    getCurrentUserData, // Retrieves the current user's data from sessionStorage
    saveCurrentUserData, // Saves the current user's data to sessionStorage
    migrateGuestDataToUser, // Migrates guest user data to an authenticated user
    isAuthenticated // Checks if the user is currently authenticated
} from '/src/auth/js/auth.js';
import { TaskCard } from '/src/components/task-component/js/taskCard.js';
import { Task } from '/src/auth/js/task.js';

// =============================================================================
// =============================== Task Manager Class ==========================
// =============================================================================

/**
 * Class representing a task manager.
 * 
 * The TaskManager class is responsible for managing task objects and their interactions,
 * including loading, saving, and manipulating tasks for both authenticated users and guests.
 * It provides methods to add, remove, and update tasks, as well as to manage task views
 * and user-specific task data.
 * 
 * @class TaskManager
 */
export class TaskManager {
    /**
     * Creates an instance of TaskManager.
     * 
     * The main System Task Manager is instantiated in main.js.
     * Initializes task arrays for active, completed, and suggested tasks,
     * as well as the view state tracking for the current task view.
     * 
     * @constructor
     * @memberof TaskManager
     */
    constructor() {
      // Task arrays with more descriptive names
      this.yourActiveTasks = []; // Array to hold active tasks
      this.yourCompleteTasks = []; // Array to hold completed tasks
      this.yourActiveSuggestedTasks = []; // Array to hold suggested tasks
      // View state tracking
      this.currentTaskView = 'active'; // 'active' or 'completed'
    }
  
    // ===========================================================================
    // ========================= Data Management Methods ========================
    // ===========================================================================
  
    /**
     * Load tasks for the current user (authenticated or guest).
     * This method retrieves the user's task data and populates the active and completed task arrays.
     * If no user data is found, the task arrays remain empty.
     * 
     * @returns {void} - This method does not return a value.
     */
    loadTasks(taskManager = systemTaskManager) {
      console.info('%c ↓ loadTasks() Starting ↓', 'color: lightgray');

      try {
        // Retrieve current user data or guest user data
        const userData = getCurrentUserData();
        console.debug('%c loadTasks() getCurrentUserData() user data found.', 'color: aqua', userData); 

        // Check if userData is null or undefined
        if (!userData) {
          console.error('%c loadTasks() No user data found. Task arrays will remain empty.', 'color: error'); // Log a warning if no user data is found
          return; // Exit the method if no user data is available
        }
        // Update the properties of taskManager (which is referencing systemTaskManager)
        console.debug('%c loadTasks() Old user data details of taskManager:', 'color: orange', userData.taskManager);
        Object.assign(taskManager, TaskManager.fromObject(userData.taskManager));
        console.debug('%c loadTasks() New user data details of taskManager:', 'color: orange', taskManager);
       
      } catch (error) {
        console.error('%c loadTasks() Error loading tasks:', 'color: red', error); // Log any errors that occur during loading
      }
      console.info('%c ↑ loadTasks() Complete ↑', 'color: darkgray');
    }
  


    /**
     * Save the current task state to the appropriate storage.
     * This method checks if the user is authenticated or a guest and saves the task data accordingly.
     * 
     * @returns {void} - This method does not return a value.
     */
    saveTasks() {
      console.info('%c ↓ saveTasks() Starting ↓', 'color: lightgray');
      console.debug('%c saveTasks() this TaskManager instance:', 'color: aqua', this);
      try {
        // Prepare the task data object containing active and completed tasks
        const taskData = this // Current state of the TaskManager instance

        saveCurrentUserData(taskData); // Save for authenticated user
        console.debug('%c saveTasks() User data saved for authenticated user:', 'color: aqua', taskData); // Debugging: log saved data
        
      } catch (error) {
        console.error('%c Error saving tasks:', 'color: red', error); // Log any errors that occur during saving
      }
      //console.debug('%c saveTasks() this systemTaskManager instance:', 'color: aqua', systemTaskManager);
      //console.debug('%c saveTasks() this getCurrentUserData() instance:', 'color: aqua', getCurrentUserData());

      console.info('%c ↑ saveTasks() Complete ↑', 'color: darkgray');
    }
  
    // ===========================================================================
    // ========================= Task Manipulation Methods ======================
    // ===========================================================================
  
    /**
     * Add a new task to the specified task array.
     * This method determines the type of task and adds it to the corresponding array.
     * It also saves the current task state and optionally refreshes the task views.
     * 
     * @param {string} type - Task type ('active', 'completed', 'suggested').
     * @param {Object} task - Task object to add.
     * @param {boolean} [refreshTaskView=true] - Whether to refresh the task views after adding the task.
     * @throws {Error} Throws an error if the provided task type is invalid.
     * @returns {void} - This method does not return a value.
     */
    addTask(type, task, refreshTaskView = true) {
      console.info('%c ↓ addTask() Starting ↓', 'color: lightgray');
        try {
            // Determine the task type and add the task to the corresponding array
            switch(type) {
                case 'active':
                    this.yourActiveTasks.push(task); // Add to active tasks
                    break;
                case 'completed':
                    this.yourCompleteTasks.push(task); // Add to completed tasks
                    break;
                case 'suggested':
                    this.yourActiveSuggestedTasks.push(task); // Add to suggested tasks
                    break;
                default:
                    throw new Error('Invalid task type'); // Handle invalid task type
            }
            if (refreshTaskView) {
                this.refreshAllTaskViews(); // Refresh task views if required
            }
        } catch (error) {
            console.error('%c Error adding task:', 'color: red', error); // Log any errors that occur during adding
        }
        console.info('%c ↑ addTask() Complete ↑', 'color: darkgray');
    }

    // ===========================================================================
    // ======================== Helper Functions =================================
    // ===========================================================================


    /**
     * Fetch a task from any of the task arrays based on its ID.
     * This method searches through active, completed, and suggested tasks
     * to find and return the task with the specified ID.
     * 
     * @param {string} taskId - The unique identifier of the task to fetch.
     * @returns {Object|null} - The found task object or null if not found.
     */
    getTask(taskId) {
        // Search in active tasks
        let task = this.yourActiveTasks.find(task => task.id === taskId);
        if (task) return task;

        // Search in completed tasks
        task = this.yourCompleteTasks.find(task => task.id === taskId);
        if (task) return task;

        // Search in suggested tasks
        task = this.yourActiveSuggestedTasks.find(task => task.id === taskId);
        return task || null; // Return null if not found in any array
    }

    /**
     * Get the task arrays.
     * 
     * @returns {Array} The task arrays.
     */
    getArrays() {
      return ['yourActiveTasks', 'yourCompleteTasks', 'yourActiveSuggestedTasks'];
    }
  


    // ===========================================================================
    // ========================= UI Update Methods ===============================
    // ===========================================================================
  
    /**
     * Update task cards in the specified container.
     * This method clears the container's current content and populates it with new task cards.
     * 
     * @param {HTMLElement} container - DOM element to populate with task cards.
     * @param {Array} tasks - Array of tasks to display as cards.
     * @throws {Error} Throws an error if the container is not a valid DOM element.
     * @returns {void} - This method does not return a value.
     */
    renderTaskCards(container, tasks) {
      console.info('%c ↓ renderTaskCards() Starting ↓', 'color: lightgray');
      console.warn('%c renderTaskCards() systemTaskManager', 'color: purple', systemTaskManager);
      console.warn('%c renderTaskCards() systemTaskManager.yourActiveTasks', 'color: purple', systemTaskManager.yourActiveTasks);
      console.warn('%c renderTaskCards() systemTaskManager.yourActiveTasks[0]', 'color: purple', systemTaskManager.yourActiveTasks[0]);
      try {
        // Check if the container is a valid DOM element
        if (!(container instanceof HTMLElement)) {
          throw new Error('Invalid container element provided.'); // Handle invalid container
        }
        console.debug('%c renderTaskCards() Valid container element provided.', 'color: aqua');
        
        // Clear the container's current content
        container.innerHTML = '';
        console.debug('%c renderTaskCards() container.innerHTML cleared.', 'color: aqua');


        //console.log("%c renderTaskCards() JSON.stringify(tasks, null, 2)", 'color: orange', JSON.stringify(tasks, null, 2)); // This will give a structured view of tasks


        //console.debug('%c renderTaskCards() tasks.hasOwnProperty(0)', 'color: purple', tasks.hasOwnProperty(0)); // This should return true if there's an object at index 0

        console.debug('%c renderTaskCards() tasks', 'color: aqua', tasks);
        console.debug('%c renderTaskCards() tasks[0]', 'color: aqua', tasks[0]);
         // Iterate over the tasks array and create a card for each task
        tasks.forEach(task => {
          console.debug('%c renderTaskCards() attempting to append task into container:', 'color: aqua', task);
          
          // Check if taskCard exists and is properly instantiated
          if (!task.taskCard || !(task.taskCard.taskCardElement instanceof HTMLElement) || 
              Object.keys(task.taskCard.taskCardElement).length === 0) {
            console.warn('%c renderTaskCards() taskCard is not properly instantiated. Initializing...', 'color: aqua');
            console.debug('%c renderTaskCards() task.taskCard:', 'color: aqua', task.taskCard);
          
            // Ensure taskCard is defined and properly instantiated
            if (!task.taskCard || !(task.taskCard instanceof TaskCard)) {
                task.taskCard = new TaskCard(task, task.type); // Create a new instance of TaskCard
            }
            console.debug('%c renderTaskCards() Type of task.taskCard:', 'color: aqua', typeof task.taskCard);
            console.debug('%c renderTaskCards() Is task.taskCard an instance of TaskCard?', 'color: aqua', task.taskCard instanceof TaskCard);

          }
          if (task.taskCard.taskCardElement instanceof HTMLElement) {
            console.debug('%c renderTaskCards() taskCardElement is a valid DOM element:', 'color: green', task.taskCard.taskCardElement);
          } else {
            console.error('%c renderTaskCards() taskCardElement is not a valid DOM element:', 'color: red', task.taskCard.taskCardElement);
          }

          // Validate the taskCardElement after initialization
          if (!(task.taskCard.taskCardElement instanceof HTMLElement) || 
              !(task.taskCard.taskCardElement.tagName === 'ARTICLE' && 
                task.taskCard.taskCardElement.classList.contains('task-card') && 
                task.taskCard.taskCardElement.classList.contains('active'))) {
            console.error('%c renderTaskCards() task.taskCard.taskCardElement is not a valid DOM element or does not match the required structure:', 'color: red', task.taskCard.taskCardElement);
            return; // Exit the method if the task card element is not a valid DOM element or does not match the required structure
          }
          console.debug('%c renderTaskCards() Appending task.taskCard.taskCardElement to container:', 'color: aqua', task.taskCard.taskCardElement);
          container.appendChild(task.taskCard.taskCardElement); //TaskCard should already exist in the task object during its construction
          console.debug('%c renderTaskCards() card appended to container.', 'color: aqua');


        });
      } catch (error) {
        console.error('%c Error rendering task cards:', 'color: red', error); // Log any errors that occur during rendering
      }
      console.info('%c ↑ renderTaskCards() Complete ↑', 'color: darkgray');
    }
  
    /**
     * Update the main task view based on the current view state.
     * This method determines which task array to display (active or completed)
     * and renders the corresponding task cards in the UI.
     * 
     * @returns {void} - This method does not return a value.
     * @throws {Error} Throws an error if the container element is not found.
     */
    updateMainTaskView() {
      console.info('%c ↓ updateMainTaskView() Starting ↓', 'color: lightgray');
      try {
        // Select the container element where task cards will be rendered
        const container = document.querySelector('.tasks-section .task-cards');
        
        // Check if the container exists
        if (!container) {
          throw new Error('Task cards container not found.'); // Handle missing container
        }

        // Determine the tasks to display based on the current view state
        
        const tasks = this.currentTaskView === 'active' 
          ? this.yourActiveTasks // Use active tasks if the current view is 'active'
          : this.yourCompleteTasks; // Use completed tasks otherwise
        
        this.renderTaskCards(container, tasks); // Render the determined tasks in the container
      } catch (error) {
        console.error('%c Error updating main task view:', 'color: red', error); // Log any errors that occur during the update
      }
      console.info('%c ↑ updateMainTaskView() Complete ↑', 'color: darkgray');
    }
  
    /**
     * Update the suggested tasks view.
     * This method renders the suggested tasks in the designated section of the UI.
     * 
     * @returns {void} - This method does not return a value.
     * @throws {Error} Throws an error if the container element is not found.
     */
    updateSuggestedTasksView() {
      console.info('%c ↓ updateSuggestedTasksView() Starting ↓', 'color: lightgray');
      try {
        // Select the container element where suggested task cards will be rendered
        const container = document.querySelector('#suggested-tasks-section .task-cards');
        
        // Check if the container exists
        if (!container) {
          throw new Error('Suggested tasks container not found.'); // Handle missing container
        }

        // Render the suggested tasks in the container
        this.renderTaskCards(container, this.yourActiveSuggestedTasks);
      } catch (error) {
        console.error('%c Error updating suggested tasks view:', 'color: red', error); // Log any errors that occur during the update
      }
      console.info('%c ↑ updateSuggestedTasksView() Complete ↑', 'color: darkgray');
    }
  
    /**
     * Update the display of the active task count.
     * This method updates the text content of the task count element
     * to reflect the current number of active tasks.
     * 
     * @returns {void} - This method does not return a value.
     * @throws {Error} Throws an error if the task count element is not found.
     */
    updateTaskCount() {
      console.info('%c ↓ updateTaskCount() Starting ↓', 'color: lightgray');
      try {
        // Select the element that displays the task count
        const countElement = document.getElementById('task-count-number');
        
        // Check if the count element exists
        if (!countElement) {
          throw new Error('Task count element not found.'); // Handle missing element
        }

        // Update the text content to show the current number of active tasks
        countElement.textContent = this.yourActiveTasks.length;
      } catch (error) {
        console.error('%c Error updating task count:', 'color: red', error); // Log any errors that occur during the update
      }
      console.info('%c ↑ updateTaskCount() Complete ↑', 'color: darkgray');
    }
  
    // ===========================================================================
    // ========================= View State Methods ==============================
    // ===========================================================================
  
    /**
     * Switch between active and completed task views.
     * This method updates the current task view state and refreshes the main task view.
     * 
     * @param {string} viewType - The type of view to switch to ('active' or 'completed').
     * @throws {Error} Throws an error if the provided viewType is invalid.
     * @returns {void} - This method does not return a value.
     */
    switchTaskView(viewType) {
      console.info('%c ↓ switchTaskView() Starting ↓', 'color: lightgray');
      console.warn('%c switchTaskView() Task View Set to:', 'color: yellow', viewType);
      // Validate the provided viewType
      if (!['active', 'completed'].includes(viewType)) {
        throw new Error('Invalid view type'); // Handle invalid view type
      }
      
      this.currentTaskView = viewType; // Update the current task view
      this.updateMainTaskView(); // Refresh the main task view
      console.info('%c ↑ switchTaskView() Complete ↑', 'color: darkgray');
    }
  
    /**
     * Get the current task view state.
     * This method returns the type of the current task view, which can be either 'active' or 'completed'.
     * 
     * @returns {string} Current view type ('active' or 'completed').
     */
    getTaskView() {
      return this.currentTaskView; // Return the current task view state
    }
  
    // ===========================================================================
    // ========================= Comprehensive Refresh ==========================
    // ===========================================================================
  
    /**
     * Refresh all task views and counts.
     * This method updates the main task view, the suggested tasks view, 
     * and the active task count display to ensure the UI reflects the current state.
     * 
     * @returns {void} - This method does not return a value.
     */
    refreshAllTaskViews() {
      console.info('%c ↓ refreshAllTaskViews() Starting ↓', 'color: lightgray');
      try {
        this.updateMainTaskView(); // Refresh the main task view
        this.updateSuggestedTasksView(); // Refresh the suggested tasks view
        this.updateTaskCount(); // Update the active task count display 
        
      } catch (error) {
        console.error('%c Error refreshing task views:', 'color: red', error); // Log any errors that occur during the refresh
      }
      console.info('%c ↑ refreshAllTaskViews() Complete ↑', 'color: darkgray');
    }
  
    // ===========================================================================
    // ========================= Migration Methods ===============================
    // ===========================================================================
  
    /**
     * Migrate guest tasks to an authenticated user.
     * This method transfers the tasks from a guest user to an authenticated user
     * based on the provided email address. It reloads the tasks and refreshes
     * the task views after migration.
     * 
     * @param {string} email - User email to migrate tasks to.
     * @throws {Error} Throws an error if the email is invalid or migration fails.
     * @returns {void} - This method does not return a value.
     */
    migrateGuestTasks(email) {
      console.info('%c ↓ migrateGuestTasks() Starting ↓', 'color: lightgray');
      try {
        if (typeof email !== 'string' || !email.includes('@')) {
          throw new Error('Invalid email address provided.'); // Validate the email format
        }
        
        migrateGuestDataToUser(email); // Migrate guest data to the authenticated user
        this.loadTasks(); // Reload tasks after migration
        this.refreshAllTaskViews(); // Refresh the UI to reflect the updated task state
      } catch (error) {
        console.error('%c Error migrating guest tasks:', 'color: red', error); // Log any errors that occur during migration
      }
      console.info('%c ↑ migrateGuestTasks() Complete ↑', 'color: darkgray');
    }

    /**
     * Removes a task from the corresponding array based on its type.
     * This method checks the type of the provided task and removes it from the appropriate
     * task array (active, completed, or suggested). It uses the task's unique identifier
     * to ensure the correct task is removed.
     * 
     * @param {Object} task - The task object to be removed. It should contain:
     * @param {string} task.type - The type of the task (e.g., 'active', 'completed', 'suggested').
     * @param {string} task.id - The unique identifier of the task to be removed.
     * @param {boolean} [refreshTaskView=true] - Whether to refresh the task views after removal.
     * 
     * @returns {void} This method does not return a value.
     * @throws {Error} Throws an error if the task object is invalid or missing required properties.
     */
    removeTask(task, refreshTaskView = true) {
      console.info('%c ↓ removeTask() Starting ↓', 'color: lightgray');
        // Validate the task object
        if (!task || typeof task.id !== 'string' || !['active', 'completed', 'suggested'].includes(task.type)) {
            throw new Error('Invalid task object provided.'); // Handle invalid task object
        }

        // Check if the task type is 'active' and remove it from the active tasks array
        if (task.type === 'active') {
            this.yourActiveTasks = this.yourActiveTasks.filter(t => t.id !== task.id); // Remove active task
        } 
        // Check if the task type is 'completed' and remove it from the completed tasks array
        else if (task.type === 'completed') {
            this.yourCompleteTasks = this.yourCompleteTasks.filter(t => t.id !== task.id); // Remove completed task
        } 
        // Check if the task type is 'suggested' and remove it from the suggested tasks array
        else if (task.type === 'suggested') {
            this.yourActiveSuggestedTasks = this.yourActiveSuggestedTasks.filter(t => t.id !== task.id); // Remove suggested task
        }

        // Refresh the task views if required
        if (refreshTaskView) {
            this.refreshAllTaskViews(); // Update the UI to reflect the changes
        }
        console.info('%c ↑ removeTask() Complete ↑', 'color: darkgray');
    }

    /**
     * Move a task from one array to another based on its type.
     * This method checks the type of the provided task and moves it to the appropriate
     * task array (active, completed, or suggested). It uses the task's unique identifier
     * to ensure the correct task is moved.
     * 
     * @param {Object} task - The task object to be moved. It should contain:
     * @param {string} task.type - The current type of the task (e.g., 'active', 'completed', 'suggested').
     * @param {string} task.id - The unique identifier of the task to be moved.
     * @param {string} newType - The new type to which the task will be moved (e.g., 'active', 'completed', 'suggested'). Defaults to 'active'.
     * @throws {Error} Throws an error if the task object is invalid or missing required properties.
     * @returns {void} - This method does not return a value.
     */
    moveTask(task, newType = 'active') {
        console.info('%c ↓ moveTask() Starting ↓', 'color: lightgray');
        // Validate the task object
        if (!task || typeof task.id !== 'string' || !['active', 'completed', 'suggested'].includes(task.type)) {
            throw new Error('Invalid task object provided.'); // Handle invalid task object
        }

        // Check if the current task type is the same as the new type
        if (task.type === newType) {
            console.log(`Task is already of type '${newType}'. No move needed.`); // Log message for no action
            return; // Exit the method if the types are the same
        }
        
        // Remove the task from its current array based on its type
        this.removeTask(task, false); // refreshTaskView is set to false to avoid refreshing the task views after the move
        
        // Update the task's type to the new type
        task.type = newType; // Change the task type to the new type

        // Add the task to the new array based on the new type
        this.addTask(newType, task, true); // refreshTaskView is set to true to refresh the task views after the move
        console.info('%c ↑ moveTask() Complete ↑', 'color: darkgray');
    }

    /**
     * Edit an existing task's details.
     * This method updates the title, description, duration, and due date of the specified task.
     * After editing, it refreshes all task views to reflect the changes in the UI.
     * 
     * @param {Object} task - The task object to be edited. It should contain:
     * @param {string} task.title - The current title of the task.
     * @param {string} task.description - The current description of the task.
     * @param {number} task.duration - The current duration of the task.
     * @param {string} task.dueDate - The current due date of the task.
     * @param {string} newTitle - The new title for the task.
     * @param {string} newDescription - The new description for the task.
     * @param {number} newDuration - The new duration for the task.
     * @param {string} newDueDate - The new due date for the task.
     * @throws {Error} Throws an error if the task object is invalid or missing required properties.
     * @returns {void} - This method does not return a value.
     */
    editTask(task, newTitle, newDescription, newDuration, newDueDate) {
        console.info('%c ↓ editTask() Starting ↓', 'color: lightgray');
        // Validate the task object
        if (!task || typeof task.id !== 'string') {
            throw new Error('Invalid task object provided.'); // Handle invalid task object
        }

        // Update the task details
        task.title = newTitle; // Update the task title
        task.description = newDescription; // Update the task description
        task.duration = newDuration; // Update the task duration
        task.dueDate = newDueDate; // Update the task due date
        
        this.refreshAllTaskViews(); // Refresh the UI to reflect the updated task details
        console.info('%c ↑ editTask() Complete ↑', 'color: darkgray');
    }
    

    /**
     * Hydrate the task manager with the old task manager data object, which is likely uninstantiated (just a plain object) after being loaded from sessionStorage/localStorage.
     * This method is crucial for rebuilding the task manager when user data is first loaded, especially if the task manager object has been corrupted due to JSON serialization/deserialization issues.
     * 
     * During the initialization process in auth.js, this method is called with the extracted task manager object to manually reconstruct the task manager.
     * It recreates the tasks and their associated task cards, ensuring that the system task manager (instantiated in main.js) is updated with the correct task data.
     * 
     * @param {Object} originalTaskManager - The old task manager object containing task data.
     * @returns {Promise<void>} - This method returns a promise that resolves when the hydration is complete.
     */
    static async hydrateTaskManager(originalTaskManager) {
      console.info('%c ↓ hydrateTaskManager() Starting ↓', 'color: lightgray');

      // Log the original task manager data for debugging purposes
      console.debug('%c initializeAuth() originalTaskManager', 'color: aqua', originalTaskManager);
    
      // Filter out unwanted items (e.g., Promises) from the task arrays.
      // These unwanted items can arise due to JSON serialization/deserialization of session and local storage.
      const cleanActiveTasks = originalTaskManager.yourActiveTasks.filter(task => {
        // Exclude Promises or invalid tasks to ensure only valid task objects are processed
        return !(task instanceof Promise); // Adjust this condition as needed
      });
    
      // Filter out unwanted items from completedTasks
      const cleanYourCompleteTasks = originalTaskManager.yourCompleteTasks.filter(task => {
        // Exclude Promises or invalid tasks
        return !(task instanceof Promise); // Adjust this condition as needed
      });
    
      // Filter out unwanted items from suggestedTasks
      const cleanYourActiveSuggestedTasks = originalTaskManager.yourActiveSuggestedTasks.filter(task => {
        // Exclude Promises or invalid tasks
        return !(task instanceof Promise); // Adjust this condition as needed
      });
    
      // Log the cleaned task arrays for debugging purposes
      console.debug('%c hydrateTaskManager() cleanActiveTasks', 'color: aqua', cleanActiveTasks);
      console.debug('%c hydrateTaskManager() cleanYourCompleteTasks', 'color: aqua', cleanYourCompleteTasks);
      console.debug('%c hydrateTaskManager() cleanYourActiveSuggestedTasks', 'color: aqua', cleanYourActiveSuggestedTasks);
    
      // Create a new instance of TaskManager to hold the cleaned task data
      const cleanedTaskManager = new TaskManager();
      // Manual clone the object arrays into the new task manager instance
      cleanedTaskManager.yourActiveTasks = cleanActiveTasks; // Assign cleaned active tasks
      cleanedTaskManager.yourCompleteTasks = cleanYourCompleteTasks; // Add cleaned completed tasks
      cleanedTaskManager.yourActiveSuggestedTasks = cleanYourActiveSuggestedTasks; // Add cleaned suggested tasks
      
      // Log the state of the cleaned task manager for debugging purposes
      console.debug('%c hydrateTaskManager() cleanedTaskManager', 'color: aqua', cleanedTaskManager);
      console.debug('%c hydrateTaskManager() cleanedTaskManager.yourActiveTasks', 'color: aqua', cleanedTaskManager.yourActiveTasks);
      console.debug('%c hydrateTaskManager() cleanedTaskManager.yourCompleteTasks', 'color: aqua', cleanedTaskManager.yourCompleteTasks);
      console.debug('%c hydrateTaskManager() cleanedTaskManager.yourActiveSuggestedTasks', 'color: aqua', cleanedTaskManager.yourActiveSuggestedTasks);

      // Iterate over each array name returned by getArrays() to process tasks
      cleanedTaskManager.getArrays().forEach(arrayName => {
          const tasks = cleanedTaskManager[arrayName]; // Access the tasks using the array name
          tasks.forEach(async task => {
            // Log each task being processed for debugging purposes
            console.debug('%c hydrateTaskManager() task:', 'color: aqua', task);
            console.debug('%c hydrateTaskManager() systemTaskManager before task.create()', 'color: aqua', systemTaskManager);
            
            // Create a new Task instance from the task data
            const newTask = await Task.create(task.name, task.description, task.duration, task.dueDate, task.type, task.id);
            console.debug('%c hydrateTaskManager() newTask', 'color: aqua', newTask);
            
            // Add the newly created task to the system task manager
            systemTaskManager.addTask(newTask.type, newTask, false); // Add the new task to the system task manager
          });
      });
      console.debug('%c hydrateTaskManager() systemTaskManager after task.create()', 'color: aqua', systemTaskManager);
      console.info('%c ↑ hydrateTaskManager() Complete ↑', 'color: darkgray');
    }

    // Static method to create an instance from a plain object
    static fromObject(obj) {
      const taskManager = new TaskManager();
      console.debug('%c TaskManager.fromObject() obj', 'color: aqua', obj);
      console.debug('%c TaskManager.fromObject() obj.yourActiveTasks', 'color: aqua', obj.yourActiveTasks);
      try {
        // Assuming 'yourActiveTasks' is an array of task objects
        if (Array.isArray(obj.yourActiveTasks)) {
          taskManager.yourActiveTasks = obj.yourActiveTasks; // Populate tasks
        }
        // Assuming 'yourCompleteTasks' is an array of task objects
        if (Array.isArray(obj.yourCompleteTasks)) {
          taskManager.yourCompleteTasks = obj.yourCompleteTasks; // Populate tasks
        }
        // Assuming 'yourActiveSuggestedTasks' is an array of task objects
        if (Array.isArray(obj.yourActiveSuggestedTasks)) {
          taskManager.yourActiveSuggestedTasks = obj.yourActiveSuggestedTasks; // Populate tasks
        }
        // Populate other properties if needed
      } catch (error) {
        console.error('%c Error creating TaskManager from object:', 'color: red', error); // Log the error
        return false; // Return false in case of an error
      }
      return taskManager;
    }
}
