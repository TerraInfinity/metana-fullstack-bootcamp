# MoodTodo – A Mood and Weather-Based Task Manager

[View Live Site](https://mood-based-todo-app.netlify.app/)

MoodTodo is an innovative task management web application that adapts to your emotional state and local weather conditions to suggest context-aware activities. Built with vanilla JavaScript and modern CSS, this application provides a rich user experience with user authentication, dynamic task suggestions, responsive design, and interactive components.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Module & File Details](#module--file-details)
  - [HTML Files](#html-files)
  - [JavaScript Files](#javascript-files)
    - [src/script/main.js](#srcscriptmainjs)
    - [src/auth/js/TaskManager.js](#srcauthjstaskmanagerjs)
    - [src/auth/js/auth.js](#srcauthjsauthjs)
    - [src/components/mood-selector/js/mood-task-service.js](#srccomponentsmood-selectorjsmood-task-servicejs)
    - [src/components/mood-selector/js/mood-selector.js](#srccomponentsmood-selectorjsmood-selectorjs)
    - [src/components/weather/js/weather.js](#srccomponentsweatherjsweatherjs)
  - [CSS Files](#css-files)
  - [Data Files](#data-files)
- [Usage](#usage)
- [Security Notice](#security-notice)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Overview

MoodTodo blends task management with personal wellness by adapting to both your mood and the local weather. Whether you log in as an authenticated user or use guest mode, the application allows you to:

- **Add Tasks:** Quickly capture new tasks.
- **Select Your Mood:** Use an intuitive mood selector (with a slider and emoji icons) to indicate how you're feeling.
- **Get Suggested Tasks:** Receive suggestions that match your current mood and weather conditions.
- **Toggle Theme:** Switch between dark and light modes based on your preference.
- **View Weather:** Refresh the current weather conditions to update suggested tasks dynamically.

The application is entirely client-side and leverages the browser's local and session storage, plus IndexedDB for tasks persistence (for authenticated users).

---

## Key Features

- **Responsive Design:** Optimized for desktops, tablets, and mobile devices.
- **Dynamic Mood Selector:** Change your mood on-the-fly using a slider and icons.
- **Task Management:** Create, view, and update tasks. Tasks are organized into active, completed, and mood-based suggested tasks.
- **User Authentication:** Register or log in using email/password. A guest mode is also available.
- **Weather Integration:** Displays the current weather conditions to adjust task suggestions.
- **Theme Toggling:** Easily switch between dark and light themes with a single click.
- **Modular Architecture:** Clean separation of concerns across authentication, task management, mood selection, weather, and UI components.

---

## Project Structure

Below is an overview of the file and folder organization in the project:
![image](https://github.com/user-attachments/assets/166dd5ea-ff5a-4970-8df1-482d11490478)

---

## Module & File Details

### HTML Files

- **index.html**  
  The application's main HTML file which:
  - Loads CSS stylesheets (global and component-specific).
  - Imports essential JavaScript modules such as `auth.js` and `main.js` via ES modules.
  - Includes external libraries: jQuery and jQuery UI.
  - Contains the site navigation (with theme toggle and login buttons), dashboard header (greeting, icons) and the tasks section (active, completed, and suggested tasks).
  
- **login.html**  
  Provides the layout for the authentication modal/view. It works in tandem with the authentication modules in the `src/auth/js/` directory.

- **mood-selector.html:**  
  Located under `src/components/mood-selector/html/`, this file defines the mood selection UI. It includes a header with a close button, a range input for mood values, and mood-indicative icons. The HTML template is dynamically fetched and inserted into the DOM by its corresponding JavaScript module.

### JavaScript Files

#### src/script/main.js

This file is the primary entry point of the application. It is responsible for:

- **Initialization:**  
  On `DOMContentLoaded`, it:
  - Sets the saved theme (from local storage) on the document.
  - Instantiates the global `systemTaskManager` (an instance of `TaskManager` from `src/auth/js/TaskManager.js`).
  - Initializes authentication (via `initializeAuthForm`, `initializeAuth`, and `initializeLoginButton`), the profile form, and task modules (task form modal and add task button).
  - Configures weather functionality (using `initializeWeather`) and the "Complete All" button.
  - Loads and refreshes tasks (both manually saved and suggested) by calling `systemTaskManager.loadTasks()` and `updateSuggestedTasks()`.
  
- **Event Handling:**  
  Sets up event listeners:
  - **Theme Toggle:** Changes the theme between dark and light.
  - **Mood Icon:** Opens the mood selector via `toggleMoodSelector`.
  - **Task View Toggle:** Allows switching between active and completed tasks.
  - **Input Events:** Monitors mood slider changes.
  
- **Workflow Coordination:**  
  Coordinates updates between authentication, task management, weather updates, and mood-based task suggestions.

#### src/auth/js/TaskManager.js

This module manages tasks for both authenticated users and guests. Key aspects include:

- **Task Arrays:**  
  - `yourActiveTasks`: Active tasks.
  - `yourCompleteTasks`: Completed tasks.
  - `yourActiveSuggestedTasks`: Dynamically suggested tasks based on mood and weather.

- **View Management:**  
  Maintains the current view state (`active` or `completed`) and provides methods to refresh and update the UI accordingly (for example, via `refreshAllTaskViews()` and `updateSuggestedTasksView()`).

- **Integration with Authentication:**  
  - Leverages functions imported from `auth.js` (like `getCurrentUserData` and `loadCurrentUserTasks`) to load and save user-specific tasks.
  - Uses the `Task` class (from `task.js`) to instantiate individual task objects.
  - Interacts with `TaskCard` components for UI rendering.

#### src/auth/js/auth.js

This module contains the core authentication logic including:

- **Session Management:**  
  - Maintains user sessions using local storage.
  - Provides functions to register, login, and logout users.
  
- **Integration with Task Management:**  
  - Supplies user data necessary for task loading and saving in `TaskManager.js`.
  - Uses a default profile photo (`/public/images/glaum 1.png`) for new or guest users.
  
- **Supporting UI Updates:**  
  - Calls helper functions (such as `updateLoginButtonUI`) to change the UI based on authentication status.

#### src/components/mood-selector/js/mood-task-service.js

This module defines the `MoodTaskService` class, which is responsible for:

- **Mood State Management:**  
  - Maintains a static `currentMood` property (with a default value of 50).
  
- **Task Suggestion Logic:**  
  - Contains functions like `initializeSuggestedTasks()` and `getFilteredTasks()` that:
    - Load tasks from an external JSON file.
    - Filter tasks based on the current mood value and current weather conditions.
    - Utilize helper functions (for instance, `matchesMood` and `matchesWeather`, though not fully shown here) to determine which tasks fit the criteria.
  
- **Workflow Integration:**  
  The filtered task list is later used by the mood selector (see below) and then passed to the task manager to update the UI.

#### src/components/mood-selector/js/mood-selector.js

This file handles the mood selector component and includes:

- **Visibility Toggling:**  
  - Implements the `toggleMoodSelector()` function to fetch (if not already present) and toggle the mood selector's visibility.
  
- **Suggested Tasks Update:**  
  - Exports an `updateSuggestedTasks()` function that calls `MoodTaskService.getFilteredTasks()` (using the current mood and weather) and then updates the active suggested tasks in `systemTaskManager` by calling its `updateSuggestedTasksView()` method.

- **Inter-Module Communication:**  
  - Imports `MoodTaskService` and `systemTaskManager` so that changes in mood immediately trigger UI updates and task suggestions.

- **src/components/mood-selector/js/mood-task-service.js:**  
  Contains methods to:
  - **Load Suggested Tasks:** Fetch tasks for suggestion from the JSON file.
  - **Filter Tasks:** Filter tasks based on the current mood (0-100) and weather conditions.
  
- **src/components/mood-selector/js/mood-selector.js:**  
  Manages the mood selector component:
  - **Template Fetching:** Loads and inserts the mood selector HTML template.
  - **Event Handling:** Adds listeners for mood selection and close functionality.
  
- **src/components/task-form/js/addTaskButton.js & taskForm.js:**  
  Enable the task creation process:
  - **Display Modal:** Shows the task creation form/modal when the user clicks the "Add Task" button.
  - **Handle Form Interactions:** Process user input to add new tasks.
  
- **src/components/task-component/js/completeAllButton.js:**  
  Sets up the "Complete All" button, allowing users to mark all tasks in the current view as completed.
  
- **src/components/weather/js/weather.js:**  
  Handles weather-related functionality:
  - **Weather Updates:** Fetches and displays current weather conditions.
  - **Trigger Task Suggestions:** Updates suggested tasks based on weather conditions.

### CSS Files

- **src/css/styles.css:**  
  Global styles including typography, layout, and responsive breakpoints to ensure the application is visually appealing across all devices.

- **src/css/components.css:**  
  Styles for individual UI components such as:
  - **Mood Selector:** Styling for mood selection elements.
  - **Task Form:** Styles for the task input modal.
  - **Weather & Icons:** Styles that support weather displays and other iconographic elements.

### Data Files

- **public/data/suggested-tasks-pool.json:**  
  Contains an array of pre-defined task templates. Each task includes:
  - **Name, Due Date**
  - **Mood Range:** Suitable mood range (min and max values).
  - **Weather Conditions:** Conditions under which a task is suggested.
  - **Duration & Category**
  - **Description:** Brief explanation of the task.
  - **Theme:** Indicates the theme associated with the task (e.g., dark or light).
  
  This file is accessed by the MoodTaskService to load and filter tasks based on the user's mood and current weather.

---

## Usage

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/TerraInfinity/metana-fullstack-bootcamp.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd metana-fullstack-bootcamp/module-3/mood-based-todo-app
   ```

3. **Start the Application:**

   - Open `index.html` in a modern web browser or use a local development server such as Live Server.
   - Alternatively, deploy using Netlify with the provided `netlify.toml` configuration.

4. **Interact with the Application:**

   - **Add Tasks:** Click the floating "+" Add" button to open the task form modal.
   - **Select Mood:** Click the smiley mood icon ("😊") to reveal the mood selector and adjust the slider.
   - **Update Weather:** Click the weather icon (⛅) to refresh and update the current weather conditions.
   - **Toggle Theme:** Click the theme toggle button (moon/sun icon) to switch between dark and light modes.
   - **User Accounts:** Use the login interface to register/sign in. A guest mode is also available via local storage.

---

## Security Notice

> **Warning:** In this implementation, user passwords are stored in plain text. For production applications, it is highly recommended to integrate secure password hashing and implement additional security measures (e.g., rate limiting, account lockouts).

---

## Future Enhancements

- **Enhanced Authentication:** Implement secure methods (e.g., OAuth, JWT) and server-side validation.
- **Real-time Task Sync:** Improve task persistence and synchronization between sessions.
- **Advanced Weather Integration:** Integrate real-time weather APIs for richer, localized suggestions.
- **Improved Task Management:** Refine task management and UI rendering techniques.
- **Accessibility Enhancements:** Incorporate features to provide better accessibility and compatibility with various devices.

---

## License

Distributed under the MIT License. See the [LICENSE](./LICENSE) file for more information.

---

*Revision Notes:*  
This README is a living document and will be continually updated as new features are added and the application evolves. Please feel free to contribute updates or provide feedback regarding the documentation.