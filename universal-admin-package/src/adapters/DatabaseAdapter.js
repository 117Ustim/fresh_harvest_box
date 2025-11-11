/**
 * Базовый класс для всех database адаптеров
 * Определяет интерфейс, который должны реализовать все адаптеры
 */
export class DatabaseAdapter {
  /**
   * Получить документ из коллекции
   * @param {string} collection - Название коллекции
   * @param {string} id - ID документа
   * @returns {Promise<Object>} - Данные документа
   */
  async get(collection, id) {
    throw new Error('Method get() must be implemented');
  }

  /**
   * Обновить документ
   * @param {string} collection - Название коллекции
   * @param {string} id - ID документа
   * @param {Object} data - Данные для обновления
   * @returns {Promise<void>}
   */
  async update(collection, id, data) {
    throw new Error('Method update() must be implemented');
  }

  /**
   * Создать новый документ
   * @param {string} collection - Название коллекции
   * @param {string} id - ID документа
   * @param {Object} data - Данные документа
   * @returns {Promise<void>}
   */
  async create(collection, id, data) {
    throw new Error('Method create() must be implemented');
  }

  /**
   * Удалить документ
   * @param {string} collection - Название коллекции
   * @param {string} id - ID документа
   * @returns {Promise<void>}
   */
  async delete(collection, id) {
    throw new Error('Method delete() must be implemented');
  }

  /**
   * Получить все документы из коллекции
   * @param {string} collection - Название коллекции
   * @returns {Promise<Array>} - Массив документов
   */
  async getAll(collection) {
    throw new Error('Method getAll() must be implemented');
  }

  /**
   * Подписаться на изменения документа (реактивность)
   * @param {string} collection - Название коллекции
   * @param {string} id - ID документа
   * @param {Function} callback - Функция обратного вызова
   * @returns {Function} - Функция отписки
   */
  subscribe(collection, id, callback) {
    throw new Error('Method subscribe() must be implemented');
  }
}
