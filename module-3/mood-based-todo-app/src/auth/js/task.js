/**
 * @file task.js
 * @version 1.0.0
 * @author Terra Infinity
 * @description Represents a task in the task management system, encapsulating properties and methods related to tasks.
 * @module task
 */
//task.js - Represents a task in the task management system

// =============================================================================
// =============================== Imports =====================================
// =============================================================================
import { TaskCard } from '/src/components/task-component/js/taskCard.js';
import { systemTaskManager } from '/src/script/main.js';  
import { getCurrentUserData } from '/src/auth/js/auth.js';

// =============================================================================
// =============================== Task Class ==================================
// =============================================================================
/**
 * @class Task
 * Represents a task in the task management system.
 * 
 * This class encapsulates the properties and methods related to a task, including:
 * - name, description, duration, due date, and type (active, completed, suggested).
 * - Methods for updating task details.
 * 
 * Interactions:
 * - This class is utilized by the TaskManager class in task-management.js to create and manage task instances.
 * - Each Task instance is associated with a TaskCard instance from taskCard.js, which handles the UI representation
 *   of the task, including rendering and user interactions.
 * - The TaskManager coordinates the overall task management, ensuring that tasks are created, updated, and displayed
 *   correctly in the UI through TaskCard.
 * - The Task class interacts with the auth.js module through the TaskManager class to manage user-specific tasks, ensuring that tasks are correctly
 *   associated with the authenticated user or guest user. This interaction allows for proper loading and saving of tasks
 *   based on the current user's session state.
 *   The systemTaskManager is the main TaskManager instance that coordinates the overall task management, 
 *   and is instantiated in main.js.
 * 
 */
export class Task {
    // =============================================================================
    // =============================== Constructor =================================
    // =============================================================================
    /**
     * Constructor - Creates an instance of the Task class.
     * 
     * @param {string} name - The name of the task.
     * @param {string} description - The description of the task.
     * @param {string} duration - The duration of the task.
     * @param {string} dueDate - The due date of the task.
     * @param {string} [type='active'] - The type of the task (active, completed, suggested).
     */
    constructor(name, description, duration, dueDate, type='active', id=Date.now().toString()) {
        this.id = id; // Using timestamp for unique ID
        this.name = name; // name of the task
        this.description = description; // Description of the task
        this.duration = duration; // Duration of the task
        this.dueDate = dueDate; // Due date of the task
        this.type = type; // Type of the task: 'active', 'completed', or 'suggested'
        // Only create new TaskCard if none exists
        if (!this.taskCard) {
            this.taskCard = new TaskCard(this); // Create a TaskCard instance associated with this Task
        }
        //systemTaskManager.addTask(type, this, false);
        console.info('%c *** constructor() New Task() Object constructed successfully ***', 'color: aqua', this); // Log success message
    }


    // =============================================================================
    // ======================== Static Create Factory Method =======================
    // =============================================================================
    /**
     * Creates and initializes a new Task instance.
     * 
     * This method should be used instead of directly using the constructor,
     * as it ensures that the TaskCard is properly initialized along with the Task.
     * 
     * @static
     * @async
     * @param {string} name - The name of the task.
     * @param {string} description - The description of the task.
     * @param {string} duration - The duration of the task.
     * @param {string} dueDate - The due date of the task.
     * @param {string} [type='active'] - The type of the task (active, completed, suggested).
     * @returns {Promise<Task>} A promise that resolves to the initialized Task instance.
     * @throws {Error} Throws an error if task initialization fails.
     */
    static async create(name, description, duration, dueDate, type = 'active', id = Date.now().toString()) {
        console.info('%c ↓ create() starting task object creation: ↓', 'color: wheat', name);
        try {
            // Handle both new and hydrated tasks
            const isHydration = typeof name === 'object';
            const data = isHydration ? name : {
                name, description, duration, dueDate, type, id
            };

            const task = new Task(
                data.name,
                data.description,
                data.duration,
                data.dueDate,
                data.type,
                data.id
            );

            // Preserve existing taskCard if hydrating
            if (!data.taskCard) {
                await task.taskCard.initializeTaskCard(task);
            } else {
                task.taskCard = data.taskCard;
            }

            console.info('%c ↑ create() finished task object creation: ↑', 'color: lightgreen', task);
            return task;
        } catch (error) {
            console.error('Error creating Task:', error);
            throw error;
        }
    }


    // =============================================================================
    // =============================== Update Methods ==============================
    // =============================================================================
    /**
     * Updates the task details with new values.
     * 
     * @param {string} name - The new name of the task.
     * @param {string} description - The new description of the task.
     * @param {string} duration - The new duration of the task.
     * @param {string} dueDate - The new due date of the task.
     */
    update(name, description, duration, dueDate) {
        this.name = name; // Update the name
        this.description = description; // Update the description
        this.duration = duration; // Update the duration
        this.dueDate = dueDate; // Update the due date
    }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            duration: this.duration,
            dueDate: this.dueDate,
            type: this.type,
            // Exclude taskCardElement as it will be recreated
        };
    }
}