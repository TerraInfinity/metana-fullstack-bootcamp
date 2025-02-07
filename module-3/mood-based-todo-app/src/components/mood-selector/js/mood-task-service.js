// mood-task-service.js
export class MoodTaskService {
    static async loadTasks() {
      try {
        
        // Construct the URL
        const relativeUrl = '../public/data/suggested-tasks-pool.json';
        const url = new URL(relativeUrl, window.location.origin).href; // Construct full URL
        console.log('Attempting to fetch from:', url);

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load tasks');
        return await response.json();
      } catch (error) {
        console.log('Failed to find response url', url);
        console.error('Error loading tasks from URL:', url); // Updated to print the full URL
        console.error('Error loading tasks:', error);
        return { tasks: [] }; // Fallback empty array
      }


    }
  
    static async getFilteredTasks(moodValue, weather) {
      const { tasks } = await this.loadTasks();

      // Log current mood and weather before filtering
      console.log(`Current Mood: ${moodValue}, Current Weather: ${weather}`);
      
      const filteredTasks = tasks.filter(task => 
        this.matchesMood(task, moodValue) && 
        this.matchesWeather(task, weather)
      );

      // Ensure all tasks have a title, even if it was missing or null in the JSON
      const filtered = filteredTasks.map(task => ({
        ...task,
        title: task.name || task.title || 'Untitled Task', // Use 'name' (json uses name) if available, fallback to 'title' or default
        description: task.description || '', // Default description if not provided
        dueDate: task.dueDate || task.duration || 'No Due Date' // Use 'dueDate' if available, otherwise use 'duration' (JSON mostly uses duration)
      }));


      // Log tasks that match the criteria
      console.log("Tasks matching criteria:", filtered.map(task => task.title));

      // Shuffle and pick 4
      const shuffled = this.shuffleArray(filtered);
      const selectedTasks = shuffled.slice(0, 4);

      // Log selected tasks with reasoning
      console.group("Selected Tasks");
      selectedTasks.forEach(task => {
        console.log(`Task: ${task.title}, Mood Range: ${task.moodRange.min}-${task.moodRange.max}, Weather: ${task.weatherConditions.join(', ')}`);
      });
      console.groupEnd();

      return selectedTasks;
    }
  
    static matchesMood(task, currentMood) {
      return currentMood >= task.moodRange.min && 
             currentMood <= task.moodRange.max;
    }
  
    static matchesWeather(task, currentWeather) {
      return task.weatherConditions.includes('any') || 
             task.weatherConditions.includes(currentWeather);
    }
  
    static shuffleArray(array) {
      // Fisher-Yates shuffle algorithm
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  


    static debounce(fn, delay) {
        let debounceTimer;
        return function (...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => fn.apply(this, args), delay);
        };
    }


}