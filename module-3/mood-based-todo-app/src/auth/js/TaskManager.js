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
    isAuthenticated, // Checks if the user is currently authenticated
    getCurrentUserEmail, // Retrieves the current user's email
    loadCurrentUserTasks // Loads tasks for the current user

} from '/src/auth/js/auth.js';
import { TaskCard } from '/src/components/task-component/js/taskCard.js';
import { Task } from '/src/auth/js/task.js';
import { dbManager } from '/src/auth/js/indexedDBManager.js'; // Updated import statement

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
    async loadTasks() {
      console.info('%c ↓ loadTasks() Starting ↓', 'color: lightgray');
        try {
            const userEmail = getCurrentUserEmail(); // Get the current user's email
            const data = await loadCurrentUserTasks(userEmail); // Load tasks for the user
            console.debug('%c loadTasks() data before hydrateTasks()', 'color: aqua', data);
            
            if (data) {
                // Convert raw objects to Task instances
                this.yourActiveTasks = await this.hydrateTasks(data.yourActiveTasks);
                this.yourCompleteTasks = await this.hydrateTasks(data.yourCompleteTasks);
                this.yourActiveSuggestedTasks = await this.hydrateTasks(data.yourActiveSuggestedTasks);
            }
            console.debug('%c loadTasks() data after hydrateTasks()', 'color: aqua', this);
        } catch (error) {
            console.error('Error loading tasks:', error); // Log any errors that occur during loading
        }
        console.info('%c ↑ loadTasks() Complete ↑', 'color: darkgray');
    }
  
    /**
     * Save the current task state to the appropriate storage.
     * This method checks if the user is authenticated or a guest and saves the task data accordingly.
     * 
     * @returns {void} - This method does not return a value.
     */
    async saveTasks() {
      console.info('%c ↓ saveTasks() Starting ↓', 'color: lightgray');
        try {
            const taskData = {
                yourActiveTasks: this.yourActiveTasks.map(task => task.serialize()), // Serialize active tasks
                yourCompleteTasks: this.yourCompleteTasks.map(task => task.serialize()), // Serialize completed tasks
                yourActiveSuggestedTasks: this.yourActiveSuggestedTasks.map(task => task.serialize()), // Serialize suggested tasks
                currentTaskView: this.currentTaskView // Save current task view
            };

            const userEmail = getCurrentUserEmail(); // Get the current user's email
            await dbManager.saveTasks(userEmail, taskData); // Save tasks to IndexedDB
            
            
        } catch (error) {
            console.error('Error saving tasks:', error); // Log any errors that occur during saving
        } 
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
      console.info('%c ↓ getTask() Starting ↓', 'color: lightgray');
        // Search in active tasks
        let task = this.yourActiveTasks.find(task => task.id === taskId);
        if (task) return task;

        // Search in completed tasks
        task = this.yourCompleteTasks.find(task => task.id === taskId);
        if (task) return task;

        // Search in suggested tasks
        task = this.yourActiveSuggestedTasks.find(task => task.id === taskId);
        console.info('%c ↑ getTask() Complete ↑', 'color: darkgray');
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
      console.debug('%c renderTaskCards() systemTaskManager', 'color: aqua', systemTaskManager);

     try {
        // Check if the container is a valid DOM element
        if (!(container instanceof HTMLElement)) {
          throw new Error('Invalid container element provided.'); // Handle invalid container
        }
        console.debug('%c renderTaskCards() Valid container element provided.', 'color: aqua');

        // Clear the container's current content
        container.innerHTML = '';
        console.debug('%c renderTaskCards() container.innerHTML cleared.', 'color: aqua');

         // Iterate over the tasks array and create a card for each task
        tasks.forEach(task => {
          console.debug('%c renderTaskCards() attempting to append task into container:', 'color: aqua', task);
          
          if (!task.taskCard || !(task.taskCard.taskCardElement instanceof HTMLElement) || 
              Object.keys(task.taskCard.taskCardElement).length === 0) {

            console.debug('%c renderTaskCards() task.taskCard:', 'color: aqua', task.taskCard);        
            if (!task.taskCard || !(task.taskCard instanceof TaskCard)) {
              task.taskCard = new TaskCard(task, task.type); // Create a new instance of TaskCard
            }
          }
          if (task.taskCard.taskCardElement instanceof HTMLElement) {
            console.debug('%c renderTaskCards() taskCardElement is a valid DOM element:', 'color: green', task.taskCard.taskCardElement);
          } else {
            console.error('%c renderTaskCards() taskCardElement is not a valid DOM element:', 'color: red', task.taskCard.taskCardElement);
          }
          // Validate the taskCardElement after initialization
          if (!(task.taskCard.taskCardElement instanceof HTMLElement) || 
              !(task.taskCard.taskCardElement.tagName === 'ARTICLE' && 
                task.taskCard.taskCardElement.classList.contains('task-card'))) {
            console.error('%c renderTaskCards() task.taskCard.taskCardElement is not a valid DOM element or does not match the required structure:', 'color: red', task.taskCard.taskCardElement);
            return; // Exit the method if the task card element is not a valid DOM element or does not match the required structure
          }
          console.debug('%c renderTaskCards() Appending task.taskCard.taskCardElement to container:', 'color: aqua', task.taskCard.taskCardElement);
          
          const taskNameElement = task.taskCard.taskCardElement.querySelector('.task-name');
          const taskDescriptionElement = task.taskCard.taskCardElement.querySelector('.task-description');
          const taskDueDateElement = task.taskCard.taskCardElement.querySelector('.task-due-date');
          const taskDurationElement = task.taskCard.taskCardElement.querySelector('.task-duration');
          const taskPriorityElement = task.taskCard.taskCardElement.querySelector('.task-priority');
          const taskTypeElement = task.taskCard.taskCardElement.querySelector('.task-type');
          taskNameElement.textContent = task.name;
          taskNameElement.title= task.name;
          taskDescriptionElement.textContent = task.description;
          taskDescriptionElement.title = task.description;
          taskDueDateElement.textContent = task.dueDate;
          taskDurationElement.textContent = task.duration;
          taskPriorityElement.textContent = task.priority;
          taskTypeElement.textContent = task.type;
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
      console.debug('%c switchTaskView() Task View Set to:', 'color: aqua', viewType);
      // Validate the provided viewType
      if (!['active', 'completed'].includes(viewType)) {
        throw new Error('Invalid view type'); // Handle invalid view type
      }
      
      this.currentTaskView = viewType; // Update the current task view

      // Update the header text based on the current view type
      const headerElement = document.getElementById('task-section-header');
      if (headerElement) {
          headerElement.textContent = viewType === 'completed' ? 'Completed Tasks' : 'Your Tasks';
      }

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
        this.saveTasks()
            .then(() => {
                this.updateMainTaskView(); // Refresh the main task view
                this.updateSuggestedTasksView(); // Refresh the suggested tasks view
                this.updateTaskCount(); // Update the active task count display
            })
            .catch(error => console.error('Error during task save and update:', error)); // Handle any errors
      } catch (error) {
        console.error('%c Error refreshing task views:', 'color: red', error); // Log any errors that occur during the refresh
      }
      console.info('%c ↑ refreshAllTaskViews() Complete ↑', 'color: darkgray');
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
    moveTask(task, newType = 'active', refreshTaskView = true) {
      console.info('%c ↓ moveTask() Starting ↓', 'color: lightgray');
        // Validate the task object
        if (!task || typeof task.id !== 'string' || !['active', 'completed', 'suggested'].includes(task.type)) {
            throw new Error('Invalid task object provided.'); // Handle invalid task object
        }

        // Check if the current task type is the same as the new type
        if (task.type === newType) {
            console.log(`Task is already of type '${newType}'. No move needed, removing task.`); // Log message for no action
            this.removeTask(task, refreshTaskView);            
            return; // Exit the method if the types are the same
        }
        
        // Remove the task from its current array based on its type
        this.removeTask(task, false); // refreshTaskView is set to false to avoid refreshing the task views after the move
        
        // Update the task's type to the new type
        task.type = newType; // Change the task type to the new type

        // Add the task to the new array based on the new type
        task.taskCard.initializeHTMLButtons(task);
        this.addTask(newType, task, refreshTaskView); // refreshTaskView is set to true to refresh the task views after the move
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
    editTask(task, data, refreshTaskView = true) {
      console.info('%c ↓ editTask() Starting ↓', 'color: lightgray');

      // If the task is a taskID(string), get the task object using the task ID. Otherwise, use the task object provided.
      if (typeof task === 'string') {
          const taskId = task; 
          task = this.getTask(taskId); 
      }
        // Update the task details
        task.name = data.name; // Update the task name
        task.description = data.description; // Update the task description
        task.duration = data.duration; // Update the task duration
        task.dueDate = data.dueDate; // Update the task due date

        if (refreshTaskView) {
            this.refreshAllTaskViews(); // Refresh the UI to reflect the updated task details
        }
        console.info('%c ↑ editTask() Complete ↑', 'color: darkgray');
    }
    
    async hydrateTasks(tasks) {
      console.info('%c ↓ hydrateTasks() Starting ↓', 'color: lightgray');
        return Promise.all(tasks.map(async (taskData) => {
            return Task.create(
                taskData.name,
                taskData.description,
                taskData.duration,
                taskData.dueDate,
                taskData.type,
                taskData.id
            );
        }));
        console.info('%c ↑ hydrateTasks() Complete ↑', 'color: darkgray');
    }

    /**
     * completeAllTasks()
     * If the current view is 'active', it moves all active tasks to completed.
     * If the current view is 'completed', it removes all completed tasks.
     * 
     * @returns {void} - This method does not return a value.
     */
    completeAllTasks() {
      console.info('%c ↓ completeAllTasks() Starting ↓', 'color: lightgray');
        try {
            if (this.currentTaskView === 'active') {
                // Move all active tasks to completed
                this.yourActiveTasks.forEach(task => {
                    this.moveTask(task, 'completed', true); // Move to completed with refreshing view
                });
            } else if (this.currentTaskView === 'completed') {
                // Remove all completed tasks
                this.yourCompleteTasks.forEach(task => {
                    this.removeTask(task, true); // Remove with refreshing view
                });
            }
        } catch (error) {
            console.error('%c Error managing tasks based on view:', 'color: red', error); // Log any errors that occur during management
        }
        console.info('%c ↑ completeAllTasks() Complete ↑', 'color: darkgray');
    }
}
