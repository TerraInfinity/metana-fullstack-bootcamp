export class MoodTaskService {
    static async loadTasks() {
      try {
        const response = await fetch('/public/data/suggested-tasks-pool.json');
        if (!response.ok) throw new Error('Failed to load tasks');
        return await response.json();
      } catch (error) {
        console.error('Error loading tasks:', error);
        return { tasks: [] }; // Fallback empty array
      }
    }
  
    static async getFilteredTasks(moodValue, weather) {
      const { tasks } = await this.loadTasks();
      const filtered = tasks.filter(task => 
        this.matchesMood(task, moodValue) && 
        this.matchesWeather(task, weather)
      );

      // Log tasks that match the criteria
      console.log("Tasks matching criteria:", filtered.map(task => task.name));

      // Shuffle and pick 4
      const shuffled = this.shuffleArray(filtered);
      const selectedTasks = shuffled.slice(0, 4);

      // Log selected tasks with reasoning
      console.group("Selected Tasks");
      selectedTasks.forEach(task => {
        console.log(`Task: ${task.name}, Mood Range: ${task.moodRange.min}-${task.moodRange.max}, Weather: ${task.weatherConditions.join(', ')}`);
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
  
    static async renderSuggestedTasks(tasks, containerSelector) {
      const container = document.querySelector(containerSelector);
      container.innerHTML = '';
      
      // Only process first 4 tasks
      const limitedTasks = tasks.slice(0, 4);
      
      try {
        const componentResponse = await fetch('src/components/task-component.html');
        const componentHtml = await componentResponse.text();

        limitedTasks.forEach(task => {
          const template = document.createElement('template');
          template.innerHTML = componentHtml;
          const newTask = template.content.querySelector('.task-card').cloneNode(true);
          
          // Clear existing buttons
          const taskActions = newTask.querySelector('.task-actions');
          taskActions.innerHTML = '';

          // Add buttons
          const addButton = document.createElement('button');
          addButton.className = 'btn-action add';
          addButton.innerHTML = '➕';

          const deleteButton = document.createElement('button');
          deleteButton.className = 'btn-action delete';
          deleteButton.innerHTML = '🗑️';

          taskActions.append(addButton, deleteButton);

          newTask.querySelector('.task-title').textContent = task.name;
          newTask.querySelector('.task-description').textContent = `Duration: ${task.duration}`;
          newTask.querySelector('.due-date').textContent = `Due: ${new Date().toLocaleTimeString()}`;
          newTask.classList.add('suggested');
          
          container.appendChild(newTask);
        });
        
        return Array.from(container.children);
      } catch (error) {
        console.error('Error rendering tasks:', error);
        return [];
      }
    }
  }