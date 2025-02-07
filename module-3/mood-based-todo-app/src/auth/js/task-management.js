// # Task loading and saving for users and guests

//task-management.js

import { yourTasks, completedTasks, saveCurrentUserData, saveGuestTasks, currentUser, loadUserTasks } from '/src/auth/js/auth.js';
import { createTaskCard, handleTaskActions } from '/src/components/task-component/js/task-component.js';
import { renderTasks } from '/src/script/main.js';



// Function to update the task count display
export function updateTaskCount() {
    const taskCountElement = document.getElementById('task-count-number');
    taskCountElement.textContent = yourTasks.length; // Update with the current number of tasks
    saveTasksToLocalStorage();
}

export async function loadUserData() {
    console.log("Current user before loading tasks:", currentUser); // Log currentUser
    if (currentUser) {
        await loadUserTasks(currentUser); // Await if loadUserTasks is async
        console.log(`Loaded tasks for ${currentUser.email}:`, { yourTasks, completedTasks }); // Log the loaded tasks
        
        // After loading tasks from localStorage, update the UI
        const yourTasksSection = document.querySelector('.tasks-section .task-cards');
        renderTasks(yourTasks, yourTasksSection); // Render your tasks
        
        
        // Ensure completed tasks are also rendered if the user wants to see them
        const isShowingCompleted = document.getElementById('show-completed').textContent.includes('Hide');
        if (isShowingCompleted) {
            renderTasks(completedTasks, yourTasksSection); // Render completed tasks if needed
        }
    } else {
        console.log("No user logged in to load tasks for");
    }
    
    // Update task count or any other UI elements that depend on task lists
    updateTaskCount();
    
    // Handle task actions for both yourTasks and completedTasks if they are in the DOM
    try {
        [...yourTasks, ...completedTasks].forEach(task => {
            console.log('Task type:', typeof task, 'Task node type:', task.nodeType);
            if (task.nodeType === Node.ELEMENT_NODE && document.body.contains(task)) {
                handleTaskActions(task);
            }
        });
    } catch (error) {
        console.error('Error in task handling:', error);
    }
}

// Function to save tasks to localStorage
export function saveTasksToLocalStorage() {
    if (currentUser) {
        console.log('Saving for logged-in user with email:', currentUser.email); // Added logging
        saveCurrentUserData().then(() => {
            console.log('Tasks saved to localStorage for user:', UserService.getUsers().find(u => u.email === currentUser.email).tasks);
            console.log('Your tasks have been successfully saved!');
        }).catch(error => {
            console.error('Error in saving tasks:', error);
            console.log('Sorry, there was an error saving your tasks. Please try again later.');
        });
    } else {
        console.log('Saving for guest user'); // Added logging
        saveGuestTasks().then(() => {
            console.log('Guest tasks saved to localStorage');
            console.log('Your tasks have been successfully saved!');
        }).catch(error => {
            console.error('Error in saving guest tasks:', error);
            console.log('Sorry, there was an error saving your tasks. Please try again later.');
        });
    }
}


// Rename the function to reflect its purpose more clearly
export function switchTaskView() {
    console.log('Switching task view');
    const showCompletedButton = document.getElementById('show-completed');
    if (!showCompletedButton) {
        console.log('Show completed button not found');
        return;
    }

    const isShowingCompleted = showCompletedButton.textContent.includes('Hide');
    const yourTasksSection = document.querySelector('.tasks-section .task-cards');
    
    if (yourTasksSection) {
        // Switch between yourTasks and completedTasks based on the current view
        renderTasks(isShowingCompleted ? yourTasks : completedTasks, yourTasksSection);
        
        // Update the header and button text accordingly
        const header = document.querySelector('.tasks-section .section-header h2');
        if (header) {
            header.textContent = isShowingCompleted ? 'Your Tasks' : 'Completed Tasks';
        }
        showCompletedButton.textContent = isShowingCompleted ? 'Show Completed' : 'Hide Completed';
    } else {
        console.log('Your tasks section not found');
    }
}

// Function to populate tasks
export function populateTasks(tasks) {
    // Log for debugging
    console.log('Attempting to populate tasks', tasks);
    
    // Check if tasks is an array before processing
    if (Array.isArray(tasks)) {
        // Iterate over tasks if it's an array
        tasks.forEach(task => createTaskCard(task, false));
    } else {
        // Log if tasks is not an array
        console.warn('tasks is not an array:', tasks);
    }

    // Get DOM containers
    const yourTasksContainer = document.querySelector('.tasks-section .task-cards');
    if (yourTasksContainer) {
        console.log('Rendering your tasks');
        renderTasks(yourTasks, yourTasksContainer);
        updateTaskCount();
    } else {
        console.error('Task containers not found');
    }
}

// Ensure the function is accessible globally.
window.populateTasks = populateTasks;

