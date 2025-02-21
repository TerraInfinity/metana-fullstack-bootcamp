// =============================================================================
// ========================= Constants =========================================
// =============================================================================
const DB_NAME = 'TaskManagerDB'; // Added database name
const DB_VERSION = 1; // Added database version
const STORE_NAME = 'tasks'; // Added store name


// IndexedDBManager class for managing IndexedDB operations
class IndexedDBManager {
  constructor() {
    this.db = null;
    this.initialized = false; // Added initialization flag
  }

  async initialize() { // Added initialization method
    if (!this.initialized) {
      await this.connect();
      this.initialized = true;
    }
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'email' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (event) => reject(event.target.error);
    });
  }

  async saveTasks(email, taskData) {
    await this.connect();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ 
        email: email,
        ...taskData,
        lastUpdated: new Date().toISOString() // Added lastUpdated timestamp
      });
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async loadTasks(email) {
    await this.connect();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(email);

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }
}

export const dbManager = new IndexedDBManager(); // Exporting the instance
