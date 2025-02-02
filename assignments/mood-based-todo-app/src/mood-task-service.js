export class MoodTaskService {
    static async loadTasks() {
      try {
        const response = await fetch('data/suggested-tasks-pool.json');
        if (!response.ok) throw new Error('Failed to load tasks');
        return await response.json();
      } catch (error) {
        console.error('Error loading tasks:', error);
        return { tasks: [] }; // Fallback empty array
      }
    }
  
    static async getFilteredTasks(moodValue, weather) {
      const { tasks } = await this.loadTasks();
      return tasks.filter(task => 
        this.matchesMood(task, moodValue) && 
        this.matchesWeather(task, weather)
      );
    }
  
    static matchesMood(task, currentMood) {
      return currentMood >= task.moodRange.min && 
             currentMood <= task.moodRange.max;
    }
  
    static matchesWeather(task, currentWeather) {
      return task.weatherConditions.includes('any') || 
             task.weatherConditions.includes(currentWeather);
    }
  }