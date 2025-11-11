/**
 * Базовый класс для всех storage адаптеров
 */
export class StorageAdapter {
  /**
   * Загрузить файл
   * @param {File} file - Файл для загрузки
   * @param {Object} options - Дополнительные опции
   * @returns {Promise<string>} - URL загруженного файла
   */
  async upload(file, options = {}) {
    throw new Error('Method upload() must be implemented');
  }

  /**
   * Удалить файл
   * @param {string} url - URL файла для удаления
   * @returns {Promise<void>}
   */
  async delete(url) {
    throw new Error('Method delete() must be implemented');
  }
}
