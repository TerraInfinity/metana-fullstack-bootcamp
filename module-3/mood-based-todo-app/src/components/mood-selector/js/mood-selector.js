// # Mood selector component logic
// mood-selector.js

//Imports
import { MoodTaskService } from './mood-task-service.js'; 
import { systemTaskManager } from '/src/script/main.js';
import { currentWeather } from '/src/components/weather/js/weather.js';


let moodSelector = null; // Start as null since it's not in the DOM initially

export default function toggleMoodSelector() {
    console.log("toggleMoodSelector called"); // Debug: Function call check
    if (!moodSelector) {
        console.log("Fetching mood selector..."); // Debug: Fetching mood selector
        fetchMoodSelector();
    } else {
        console.log("Toggling mood selector visibility..."); // Debug: Toggling visibility
        moodSelector.classList.toggle('hidden');
    }
}

async function fetchMoodSelector() {
    try {
        console.log("Starting fetch for mood selector..."); // Debug: Fetch start
        const response = await fetch('./src/components/mood-selector/html/mood-selector.html');
        if (!response.ok) {
            console.error('Failed to load mood selector'); // Debug: Fetch failed
            throw new Error('Failed to load mood selector');
        }
        
        const moodHtml = await response.text();
        console.log("Mood HTML fetched:", moodHtml); // Debug: Log fetched HTML

        // Parse the HTML to get the mood-selector element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = moodHtml;
        moodSelector = tempDiv.querySelector('#mood-selector');

        if (!moodSelector) {
            console.error('Mood selector element not found in fetched HTML'); // Debug: Element not found
            throw new Error('Mood selector element not found');
        }

        console.log("Mood selector found:", moodSelector); // Debug: Element found

        // Insert into the DOM
        const mainContainer = document.querySelector('main.container');
        if (mainContainer) {
            mainContainer.insertBefore(moodSelector, mainContainer.querySelector('.dashboard-grid'));
            console.log("Mood selector inserted into DOM"); // Debug: Insertion confirmation
        } else {
            console.error('Main container not found'); // Debug: Container not found
        }

        // Remove 'hidden' class to show the selector immediately
        moodSelector.classList.remove('hidden');
        console.log("Mood selector now visible"); // Debug: Visibility change

        // Add event listener to the close button
        const closeButton = moodSelector.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', toggleMoodSelector);
            console.log("Close button listener added"); // Debug: Event listener added
        } else {
            console.error('Close button not found'); // Debug: Button not found
        }

        // Add the mouseup event listener here
        const debouncedUpdate = debounce(updateSuggestedTasks, 300); // Pass the function reference, not the call
        document.addEventListener('mouseup', (event) => {
            if (event.target.id === 'mood-range') {
                MoodTaskService.currentMood = parseInt(event.target.value);
                debouncedUpdate(); // Call the debounced function
            }
        });

    } catch (error) {
        console.error("Error in fetchMoodSelector:", error.message); // Debug: Catch errors
    }
}

// Assuming updateSuggestedTasks is defined somewhere in your code
export async function updateSuggestedTasks() {
    systemTaskManager.yourActiveSuggestedTasks = await MoodTaskService.getFilteredTasks(MoodTaskService.currentMood, currentWeather);
    systemTaskManager.updateSuggestedTasksView();
}

// Debounce function
function debounce(fn, delay) {
    let debounceTimer;
    return function (...args) {
        clearTimeout(debounceTimer); // Clear the previous timer
        debounceTimer = setTimeout(() => fn.apply(this, args), delay); // Set a new timer
    };
}