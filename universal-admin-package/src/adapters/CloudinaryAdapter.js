import { StorageAdapter } from './StorageAdapter.js';

/**
 * Cloudinary адаптер для загрузки изображений
 */
export class CloudinaryAdapter extends StorageAdapter {
  constructor(config) {
    super();
    this.cloudName = config.cloudName;
    this.uploadPreset = config.uploadPreset;
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
  }

  async upload(file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    
    // Добавляем дополнительные опции если есть
    if (options.folder) {
      formData.append('folder', options.folder);
    }

    try {
      const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Cloudinary error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  async delete(url) {
    // Извлекаем public_id из URL
    const publicId = this.extractPublicId(url);
    
    if (!this.apiKey || !this.apiSecret) {
      console.warn('API key and secret required for deletion');
      return;
    }

    // Для удаления нужен signed request
    // Это обычно делается на бэкенде
    console.warn('Delete operation should be performed on backend for security');
  }

  extractPublicId(url) {
    // Извлекаем public_id из Cloudinary URL
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  }
}
