/**
 * CRUD Manager - центральный API для работы с данными
 * Использует адаптеры для работы с разными источниками данных
 */
export class CrudManager {
  constructor(options) {
    this.databaseAdapter = options.database;
    this.storageAdapter = options.storage;
    
    if (!this.databaseAdapter) {
      throw new Error('Database adapter is required');
    }
  }

  /**
   * Получить данные
   */
  async get(collection, id) {
    return await this.databaseAdapter.get(collection, id);
  }

  /**
   * Обновить данные
   */
  async update(collection, id, data) {
    return await this.databaseAdapter.update(collection, id, data);
  }

  /**
   * Создать документ
   */
  async create(collection, id, data) {
    return await this.databaseAdapter.create(collection, id, data);
  }

  /**
   * Удалить документ
   */
  async delete(collection, id) {
    return await this.databaseAdapter.delete(collection, id);
  }

  /**
   * Получить все документы
   */
  async getAll(collection) {
    return await this.databaseAdapter.getAll(collection);
  }

  /**
   * Подписаться на изменения
   */
  subscribe(collection, id, callback) {
    return this.databaseAdapter.subscribe(collection, id, callback);
  }

  /**
   * Загрузить файл
   */
  async uploadFile(file, options = {}) {
    if (!this.storageAdapter) {
      throw new Error('Storage adapter is not configured');
    }
    return await this.storageAdapter.upload(file, options);
  }

  /**
   * Удалить файл
   */
  async deleteFile(url) {
    if (!this.storageAdapter) {
      throw new Error('Storage adapter is not configured');
    }
    return await this.storageAdapter.delete(url);
  }

  /**
   * Мигрировать данные из старого формата в новый (с секциями)
   * Старый: pages/home: { title, subtitle, description, carousel }
   * Новый: pages/home: { hero: {...}, gallery: {...} }
   */
  async migrateToSections(collection, documentId) {
    try {
      // Получаем текущие данные
      const data = await this.get(collection, documentId);
      
      if (!data) {
        console.log('⚠️ Нет данных для миграции');
        return { success: false, message: 'Нет данных для миграции' };
      }

      // Проверяем, уже ли в новом формате
      if (data.hero || data.gallery) {
        console.log('✅ Данные уже в новом формате');
        return { success: true, message: 'Данные уже в новом формате', alreadyMigrated: true };
      }

      // Создаём новую структуру с секциями
      const newData = {
        hero: {
          title: data.title || 'Добро пожаловать!',
          subtitle: data.subtitle || 'Это ваш сайт',
          description: data.description || 'Редактируйте через админ-панель'
        },
        gallery: {
          images: data.carousel || []
        }
      };

      // Сохраняем новую структуру
      await this.update(collection, documentId, newData);

      console.log('✅ Миграция завершена успешно');
      return { 
        success: true, 
        message: 'Миграция завершена! Данные обновлены.',
        migrated: true 
      };

    } catch (error) {
      console.error('❌ Ошибка миграции:', error);
      return { 
        success: false, 
        message: 'Ошибка миграции: ' + error.message 
      };
    }
  }
}
