import { DatabaseAdapter } from './DatabaseAdapter.js';

/**
 * REST API адаптер
 * Работает с любым REST API, следующим стандартным конвенциям
 */
export class RestApiAdapter extends DatabaseAdapter {
  constructor(config) {
    super();
    this.baseUrl = config.baseUrl;
    this.headers = config.headers || {
      'Content-Type': 'application/json'
    };
    
    // Добавляем токен авторизации если есть
    if (config.authToken) {
      this.headers['Authorization'] = `Bearer ${config.authToken}`;
    }
  }

  async get(collection, id) {
    const response = await fetch(`${this.baseUrl}/${collection}/${id}`, {
      headers: this.headers
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get ${collection}/${id}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  async update(collection, id, data) {
    const response = await fetch(`${this.baseUrl}/${collection}/${id}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update ${collection}/${id}: ${response.statusText}`);
    }
  }

  async create(collection, id, data) {
    const response = await fetch(`${this.baseUrl}/${collection}/${id}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create ${collection}/${id}: ${response.statusText}`);
    }
  }

  async delete(collection, id) {
    const response = await fetch(`${this.baseUrl}/${collection}/${id}`, {
      method: 'DELETE',
      headers: this.headers
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete ${collection}/${id}: ${response.statusText}`);
    }
  }

  async getAll(collection) {
    const response = await fetch(`${this.baseUrl}/${collection}`, {
      headers: this.headers
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get all ${collection}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  subscribe(collection, id, callback) {
    // Для REST API используем polling (опрос каждые N секунд)
    const interval = setInterval(async () => {
      try {
        const data = await this.get(collection, id);
        callback(data);
      } catch (error) {
        console.error('Subscription error:', error);
      }
    }, 3000); // Опрос каждые 3 секунды

    // Возвращаем функцию отписки
    return () => clearInterval(interval);
  }
}
