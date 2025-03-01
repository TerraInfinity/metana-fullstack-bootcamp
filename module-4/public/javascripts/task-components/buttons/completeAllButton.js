import { systemTaskManager } from '/javascripts/main.js';

export function initializeCompleteAllButton() {
    // Get the button element
    const completeAllButton = document.getElementById('complete-all');

    // Check if the button exists
    if (completeAllButton) {
        // Add click event listener to the button
        completeAllButton.addEventListener('click', () => {
            // Call the completeAllTasks function when the button is clicked
            systemTaskManager.completeAllTasks();
        });
    } else {
        console.warn('Complete All button not found.'); // Log a warning if the button is not found
    }
}