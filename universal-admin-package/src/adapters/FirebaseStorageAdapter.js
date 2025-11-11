import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { StorageAdapter } from './StorageAdapter.js';

/**
 * Firebase Storage адаптер для загрузки файлов
 */
export class FirebaseStorageAdapter extends StorageAdapter {
  constructor(firebaseApp) {
    super();
    this.storage = getStorage(firebaseApp);
  }

  /**
   * Загрузить файл в Firebase Storage
   * @param {File} file - Файл для загрузки
   * @param {Object} options - Опции (folder)
   * @returns {Promise<string>} - URL загруженного файла
   */
  async upload(file, options = {}) {
    try {
      const folder = options.folder || 'uploads';
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `${folder}/${fileName}`;
      
      const storageRef = ref(this.storage, filePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ Файл загружен в Firebase Storage:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('❌ Ошибка загрузки в Firebase Storage:', error);
      throw error;
    }
  }

  /**
   * Удалить файл из Firebase Storage
   * @param {string} url - URL файла
   * @returns {Promise<void>}
   */
  async delete(url) {
    try {
      // Извлекаем путь из URL
      const path = this.extractPathFromUrl(url);
      if (!path) {
        console.warn('Не удалось извлечь путь из URL:', url);
        return;
      }
      
      const fileRef = ref(this.storage, path);
      await deleteObject(fileRef);
      console.log('✅ Файл удален из Firebase Storage');
    } catch (error) {
      console.error('❌ Ошибка удаления из Firebase Storage:', error);
      throw error;
    }
  }

  /**
   * Извлечь путь файла из Firebase Storage URL
   * @param {string} url - URL файла
   * @returns {string|null} - Путь к файлу
   */
  extractPathFromUrl(url) {
    try {
      // Firebase Storage URL формат:
      // https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Ffile.jpg?alt=media&token=...
      const match = url.match(/\/o\/(.+?)\?/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
      return null;
    } catch (error) {
      console.error('Ошибка извлечения пути:', error);
      return null;
    }
  }
}
