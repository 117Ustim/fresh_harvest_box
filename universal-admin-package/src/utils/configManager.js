/**
 * Менеджер для работы с конфигурацией админ-панели
 * Загружает структуру полей из Firebase и сохраняет изменения
 */

const CONFIG_STORAGE_KEY = 'admin_panel_config';

export class ConfigManager {
  constructor(initialConfig, crudManager = null) {
    this.crudManager = crudManager;
    this.config = initialConfig;
    this.isLoadingFromFirebase = false;
    
    // Загружаем сохранённый конфиг из localStorage (для обратной совместимости)
    const savedConfig = this.loadConfig();
    
    if (savedConfig) {
      // Объединяем сохранённый конфиг с начальным
      this.config = this.mergeConfigs(initialConfig, savedConfig);
      console.log('✅ Загружен конфиг из localStorage');
    } else {
      // Если нет сохранённого - используем начальный
      this.saveConfig(); // Сохраняем начальный конфиг
      console.log('✅ Инициализирован новый конфиг');
    }
  }
  
  /**
   * Загрузить структуру полей из Firebase
   * Вызывается после инициализации когда crudManager доступен
   */
  async loadFromFirebase() {
    if (!this.crudManager || this.isLoadingFromFirebase) {
      return;
    }
    
    this.isLoadingFromFirebase = true;
    
    try {
      // Загружаем конфигурацию полей из Firebase
      const firebaseConfig = await this.crudManager.get('_metadata', 'fields_config');
      
      if (firebaseConfig?.collections?.pages) {
        console.log('📄 Загружена структура полей из Firebase');
        
        // Объединяем с текущим конфигом
        if (!this.config.collections) this.config.collections = {};
        if (!this.config.collections.pages) this.config.collections.pages = {};
        
        // Обновляем структуру полей для каждой страницы
        Object.keys(firebaseConfig.collections.pages).forEach(pageName => {
          this.config.collections.pages[pageName] = firebaseConfig.collections.pages[pageName];
          console.log(`  ✅ Загружены поля для страницы: ${pageName}`);
        });
        
        // Сохраняем в localStorage для кэша
        this.saveConfig();
      }
    } catch (error) {
      console.log('ℹ️ Структура полей в Firebase не найдена (будет создана при первом сохранении)');
    } finally {
      this.isLoadingFromFirebase = false;
    }
  }
  
  /**
   * Сохранить структуру полей в Firebase
   */
  async saveToFirebase() {
    if (!this.crudManager) {
      console.warn('⚠️ CrudManager не доступен, сохранение в Firebase пропущено');
      return false;
    }
    
    try {
      // Сохраняем только структуру полей (без данных)
      const fieldsConfig = {
        collections: {
          pages: this.config.collections?.pages || {}
        }
      };
      
      await this.crudManager.update('_metadata', 'fields_config', fieldsConfig);
      console.log('✅ Структура полей сохранена в Firebase');
      return true;
    } catch (error) {
      // Если документ не существует - создаём
      try {
        const fieldsConfig = {
          collections: {
            pages: this.config.collections?.pages || {}
          }
        };
        await this.crudManager.create('_metadata', 'fields_config', fieldsConfig);
        console.log('✅ Структура полей создана в Firebase');
        return true;
      } catch (createError) {
        console.error('❌ Ошибка сохранения структуры полей в Firebase:', createError);
        return false;
      }
    }
  }
  
  /**
   * Установить crudManager после инициализации
   */
  setCrudManager(crudManager) {
    this.crudManager = crudManager;
  }

  // Загрузить конфиг из localStorage
  loadConfig() {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading config:', error);
      return null;
    }
  }

  // Объединить конфиги (сохранённый имеет приоритет)
  mergeConfigs(initialConfig, savedConfig) {
    const merged = JSON.parse(JSON.stringify(initialConfig)); // Глубокая копия
    
    if (!merged.collections) merged.collections = {};
    if (!merged.collections.pages) merged.collections.pages = {};
    
    // Объединяем страницы из savedConfig
    if (savedConfig.collections?.pages) {
      Object.keys(savedConfig.collections.pages).forEach(pageName => {
        merged.collections.pages[pageName] = savedConfig.collections.pages[pageName];
      });
    }
    
    // Также проверяем список страниц из отдельного хранилища
    const pagesList = this.loadPagesList();
    if (pagesList.length > 0) {
      console.log('📄 Восстановление страниц из списка:', pagesList);
      
      pagesList.forEach(pageName => {
        // Если страницы нет в merged - добавляем с базовыми полями
        if (!merged.collections.pages[pageName]) {
          merged.collections.pages[pageName] = {
            title1: { type: 'text', label: 'Заголовок #1' },
            description1: { type: 'textarea', label: 'Описание #1', rows: 5 }
          };
          console.log(`  ✅ Восстановлена страница: ${pageName}`);
        }
      });
    }
    
    return merged;
  }

  // Сохранить конфиг в localStorage
  saveConfig() {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.config));
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  }

  // Получить текущий конфиг
  getConfig() {
    return this.config;
  }

  // Добавить новую страницу
  async addPage(pageName) {
    if (!this.config.collections) {
      this.config.collections = {};
    }
    if (!this.config.collections.pages) {
      this.config.collections.pages = {};
    }

    // Создаём страницу с базовыми полями
    this.config.collections.pages[pageName] = {
      title1: { type: 'text', label: 'Заголовок #1' },
      description1: { type: 'textarea', label: 'Описание #1', rows: 5 }
    };

    this.saveConfig();
    
    // Также сохраняем список страниц в отдельный ключ для надёжности
    this.savePagesList();
    
    // Сохраняем в Firebase
    await this.saveToFirebase();
    
    return true;
  }

  // Сохранить список страниц отдельно
  savePagesList() {
    try {
      const pages = this.getPages();
      localStorage.setItem('admin_panel_pages_list', JSON.stringify(pages));
      console.log('✅ Список страниц сохранён:', pages);
    } catch (error) {
      console.error('Error saving pages list:', error);
    }
  }

  // Загрузить список страниц
  loadPagesList() {
    try {
      const saved = localStorage.getItem('admin_panel_pages_list');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading pages list:', error);
      return [];
    }
  }

  // Удалить страницу
  async deletePage(pageName) {
    if (this.config.collections?.pages?.[pageName]) {
      delete this.config.collections.pages[pageName];
      this.saveConfig();
      this.savePagesList(); // Обновляем список страниц
      
      // Сохраняем в Firebase
      await this.saveToFirebase();
      
      return true;
    }
    return false;
  }

  // Alias для deletePage
  removePage(pageName) {
    return this.deletePage(pageName);
  }

  // Обновить поля страницы
  async updatePageFields(pageName, fields) {
    if (!this.config.collections?.pages) {
      return false;
    }

    this.config.collections.pages[pageName] = fields;
    this.saveConfig();
    
    // Сохраняем в Firebase
    await this.saveToFirebase();
    
    return true;
  }

  // Получить поля страницы
  getPageFields(pageName) {
    return this.config.collections?.pages?.[pageName] || {};
  }

  // Получить список всех страниц
  getPages() {
    return Object.keys(this.config.collections?.pages || {});
  }

  // Генерировать код для admin.config.js
  generateConfigCode() {
    const configStr = JSON.stringify(this.config, null, 2);
    return `export const adminConfig = ${configStr};`;
  }

  // Показать инструкцию по обновлению конфига (опционально)
  showUpdateInstructions() {
    const code = this.generateConfigCode();
    
    console.log('%c📝 Конфигурация обновлена', 'font-size: 14px; font-weight: bold; color: #4CAF50;');
    console.log('%cНовые поля доступны для редактирования', 'font-size: 12px; color: #666;');
    console.log('%c💡 Чтобы сохранить конфигурацию постоянно, скопируйте код ниже в admin.config.js:', 'font-size: 12px; color: #999;');
    console.log('%c' + code, 'background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 11px;');
    
    return code;
  }

  // Скачать конфиг как файл
  downloadConfig() {
    const code = this.generateConfigCode();
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admin.config.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Показать все страницы в консоли (для отладки)
  debugShowPages() {
    const pages = this.getPages();
    console.log('%c📄 Список всех страниц:', 'font-size: 14px; font-weight: bold; color: #1976D2;');
    pages.forEach(pageName => {
      const fields = this.getPageFields(pageName);
      const fieldCount = Object.keys(fields).length;
      console.log(`  • ${pageName} (${fieldCount} полей)`);
    });
    console.log(`\nВсего страниц: ${pages.length}`);
  }

  // Очистить localStorage (для отладки)
  clearStorage() {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
    console.log('🗑️ localStorage очищен');
  }
}
