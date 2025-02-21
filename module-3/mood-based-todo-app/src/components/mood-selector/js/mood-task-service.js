/**
 * @file mood-task-service.js
 * @module moodTaskService
 * @version 1.0.0
 * @author Terra Infinity
 * @description This module provides the MoodTaskService class for managing mood-based task suggestions.
 * It includes methods for loading tasks, filtering them based on mood and weather, and utility functions.
 */


import { Task } from '/src/auth/js/task.js';

// =============================================================================
// =============================== Task Class ==================================
// =============================================================================

/**
 * @class MoodTaskService
 * Provides methods for loading and filtering tasks based on mood and weather conditions.
 * 
 * This class handles the current mood state and interacts with external data sources to fetch tasks.
 */
export class MoodTaskService {
    /**
     * @property {number} currentMood - Represents the current mood value, ranging from 0 to 100.
     */
    static currentMood = 50; // Added currentMood property



    // =============================================================================
    // =============================== Load Tasks ==================================
    // =============================================================================

  
    /**
     * Loads tasks from a JSON file based on the current mood and weather conditions.
     * 
     * @returns {Promise<Object>} A promise that resolves to an object containing an array of tasks.
     * @throws {Error} Throws an error if the tasks cannot be loaded.
     */
    static async loadTasks() {

      try {
        // Construct the URL for fetching tasks
        const relativeUrl = '../public/data/suggested-tasks-pool.json';
        const url = new URL(relativeUrl, window.location.origin).href; // Construct full URL
        console.debug('%c Attempting to fetch from:', 'color: aqua', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load tasks'); // Throw error if response is not OK
        return await response.json(); // Return the parsed JSON data
      } catch (error) {
        // Log the error details for debugging
        console.error('%c Failed to find response url', 'color: red', url);
        console.error('%c Error loading tasks from URL:', 'color: red', url); // Print the full URL
        console.error('%c Error loading tasks:', 'color: red', error); // Log the error message
        return { tasks: [] }; // Fallback to an empty array if an error occurs
      }
    }
  
    // =============================================================================
    // =============================== Task Filtering ==============================
    // =============================================================================
  
    /**
     * Retrieves and filters tasks based on the current mood and weather conditions.
     * 
     * @param {number} moodValue - The mood value to filter tasks by.
     * @param {string} weather - The current weather condition to filter tasks by.
     * @returns {Promise<Array>} A promise that resolves to an array of filtered tasks.
     * @throws {Error} Throws an error if tasks cannot be loaded or filtered.
     */
    static async getFilteredTasks(moodValue, weather) {
      console.group("%c ↓↓↓ getFilteredTasks() ↓↓↓", 'color: lightgray');
      this.currentMood = moodValue; // Update currentMood when filtering tasks
      let tasks; // Declare tasks variable to hold loaded tasks

      try {
        const response = await this.loadTasks(); // Load tasks from the JSON file
        tasks = response.tasks; // Extract tasks from the response
        console.debug(`%c Loaded ${tasks.length} tasks from the JSON file.`, 'color: aqua'); // Log number of tasks loaded
      } catch (error) {
        console.error('%c Error loading tasks:', 'color: red', error); // Log error if loading fails
        throw new Error('Unable to load tasks for filtering.'); // Rethrow error with a user-friendly message
      }

      // Log current mood and weather before filtering
      console.debug(`%c Current Mood: ${moodValue}, Current Weather: ${weather}`, 'color: aqua');

      // Filter tasks based on mood and weather conditions
      const filteredTasks = tasks.filter(task => 
        this.matchesMood(task, moodValue) && 
        this.matchesWeather(task, weather)
      );

      console.debug(`%c Filtered down to ${filteredTasks.length} tasks based on mood and weather.`, 'color: aqua'); // Log number of filtered tasks

      // Ensure we only transform the selected tasks into proper task objects
      const transformedTasks = await Promise.all(filteredTasks.slice(0, 4).map(task => this.transformToTask(task)));


      // Log details of each transformed task
      console.debug("%c Transformed Tasks:", 'color: aqua', transformedTasks);

      // Log tasks that match the criteria
      console.debug("%c Tasks matching criteria:", 'color: aqua', transformedTasks.map(task => task.name));

      // Shuffle and pick 4 (if you want to shuffle the filtered tasks before selecting)
      const shuffled = this.shuffleArray(transformedTasks);
      const selectedTasks = shuffled.slice(0, 4);
  
      console.info("%c ⬆⬆⬆ getFilteredTasks() ⬆⬆⬆ ", 'color: darkgray');
      console.groupEnd();
      return selectedTasks;
    }
  
    /**
     * Checks if the current mood falls within the task's defined mood range.
     * 
     * @param {Object} task - The task object containing mood range information.
     * @param {number} currentMood - The current mood value to check against the task's mood range.
     * @returns {boolean} True if the current mood is within the task's mood range; otherwise, false.
     * @throws {Error} Throws an error if the task does not have a valid moodRange property.
     */
    static matchesMood(task, currentMood) {
      // Validate that the task has a moodRange property
      if (!task.moodRange || typeof task.moodRange.min !== 'number' || typeof task.moodRange.max !== 'number') {
        throw new Error('Invalid task: moodRange is missing or not properly defined.');
      }

      // Check if the current mood is within the defined range
      return currentMood >= task.moodRange.min && 
             currentMood <= task.moodRange.max;
    }
  
    /**
     * Checks if the current weather matches the task's defined weather conditions.
     * 
     * @param {Object} task - The task object containing weather conditions information.
     * @param {string} currentWeather - The current weather condition to check against the task's weather conditions.
     * @returns {boolean} True if the current weather matches the task's conditions; otherwise, false.
     * @throws {Error} Throws an error if the task does not have a valid weatherConditions property.
     */
    static matchesWeather(task, currentWeather) {
      // Validate that the task has a weatherConditions property
      if (!task.weatherConditions || !Array.isArray(task.weatherConditions)) {
        throw new Error('Invalid task: weatherConditions is missing or not properly defined.');
      }

      // Check if the current weather is included in the task's weather conditions
      return task.weatherConditions.includes('any') || 
             task.weatherConditions.includes(currentWeather);
    }
  
    // =============================================================================
    // =============================== Task Management =============================
    // =============================================================================
  
    /**
     * Transforms a raw task object from JSON into a proper task object.
     * 
     * @param {Object} rawSuggestedJSONTask - The raw task object from JSON.
     * @returns {Promise<Object>} A promise that resolves to a properly formatted task object.
     */
    static async transformToTask(rawSuggestedJSONTask) {
        return await Task.create(
          rawSuggestedJSONTask.name || 'Untitled Task', // Use 'name' if available, fallback to 'Untitled Task'
          rawSuggestedJSONTask.description || '', // Default description if not provided
          rawSuggestedJSONTask.duration || '', // Use 'duration' if available
          rawSuggestedJSONTask.dueDate || new Date().toISOString().split('T')[0], // Use 'dueDate' if available, otherwise use today's date
          'suggested' 
        );
    }
  
    /**
     * Shuffles an array using the Fisher-Yates algorithm.
     * 
     * @param {Array} array - The array to shuffle.
     * @returns {Array} The shuffled array.
     * @throws {Error} Throws an error if the input is not an array.
     */
    static shuffleArray(array) {
      // Validate that the input is an array
      if (!Array.isArray(array)) {
        throw new Error('Invalid input: expected an array.');
      }

      // Fisher-Yates shuffle algorithm
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
      return array; // Return the shuffled array
    }
  
    // =============================================================================
    // =============================== Utility Functions ============================
    // =============================================================================
  
    /**
     * Creates a debounced version of a function that delays its execution until after a specified delay.
     * 
     * @param {Function} fn - The function to debounce.
     * @param {number} delay - The number of milliseconds to delay; must be a positive number.
     * @returns {Function} A debounced version of the provided function.
     * @throws {Error} Throws an error if the delay is not a positive number.
     */
    static debounce(fn, delay) {
        // Validate that the delay is a positive number
        if (typeof delay !== 'number' || delay <= 0) {
            throw new Error('Invalid delay: must be a positive number.');
        }

        let debounceTimer; // Timer variable to hold the timeout reference
        return function (...args) {
            clearTimeout(debounceTimer); // Clear the previous timer
            debounceTimer = setTimeout(() => fn.apply(this, args), delay); // Set a new timer
        };
    }
}