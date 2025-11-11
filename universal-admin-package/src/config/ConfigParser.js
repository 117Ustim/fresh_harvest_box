/**
 * Парсер конфигурации админ-панели
 * Валидирует и нормализует конфиг
 */
export class ConfigParser {
  constructor(config) {
    this.config = config;
    this.validate();
  }

  validate() {
    if (!this.config.collections) {
      throw new Error('Config must have "collections" property');
    }

    // Валидация каждой коллекции
    Object.entries(this.config.collections).forEach(([collectionName, collectionData]) => {
      this.validateCollection(collectionName, collectionData);
    });
  }

  validateCollection(name, data) {
    if (typeof data !== 'object') {
      throw new Error(`Collection "${name}" must be an object`);
    }

    // Проверяем структуру полей
    Object.entries(data).forEach(([docId, docData]) => {
      if (typeof docData !== 'object') {
        throw new Error(`Document "${docId}" in collection "${name}" must be an object`);
      }
    });
  }

  /**
   * Получить все коллекции
   */
  getCollections() {
    return Object.keys(this.config.collections);
  }

  /**
   * Получить структуру коллекции
   */
  getCollection(name) {
    return this.config.collections[name];
  }

  /**
   * Получить структуру документа
   */
  getDocument(collection, docId) {
    return this.config.collections[collection]?.[docId];
  }

  /**
   * Получить все поля документа
   */
  getFields(collection, docId) {
    return this.config.collections[collection]?.[docId] || {};
  }

  /**
   * Получить тип поля
   */
  getFieldType(collection, docId, fieldName) {
    const fields = this.getFields(collection, docId);
    return fields[fieldName]?.type || 'text';
  }

  /**
   * Получить метаданные поля
   */
  getFieldMeta(collection, docId, fieldName) {
    const fields = this.getFields(collection, docId);
    return fields[fieldName] || {};
  }
}
