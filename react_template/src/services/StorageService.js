// src/services/StorageService.js
class StorageService {
  constructor() {
    this.db = null;
    this.stores = ['recipes', 'ingredients', 'steps', 'videos', 'categories', 'tags', 'shoppingLists', 'shoppingItems'];
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('RecipeBox', 1);
      
      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        this.stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
            console.log(`Object store ${storeName} created`);
          }
        });
      };
    });
  }

  async set(storeName, value) {
    if (!this.stores.includes(storeName)) {
      throw new Error(`Invalid store name: ${storeName}`);
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(value);
      
      request.onsuccess = () => resolve(value);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, key) {
    if (!this.stores.includes(storeName)) {
      throw new Error(`Invalid store name: ${storeName}`);
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    if (!this.stores.includes(storeName)) {
      throw new Error(`Invalid store name: ${storeName}`);
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async remove(storeName, key) {
    if (!this.stores.includes(storeName)) {
      throw new Error(`Invalid store name: ${storeName}`);
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName) {
    if (!this.stores.includes(storeName)) {
      throw new Error(`Invalid store name: ${storeName}`);
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async query(storeName, predicate) {
    const allItems = await this.getAll(storeName);
    return allItems.filter(predicate);
  }
}

export default new StorageService();