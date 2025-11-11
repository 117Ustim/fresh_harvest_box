import { CrudManager } from '../core/CrudManager.js';
import { ConfigManager } from './configManager.js';

/**
 * Глобальное хранилище для админ-панели
 * Используется когда не хочется использовать Provider
 */
let globalAdminInstance = null;

/**
 * Инициализация админ-панели без Provider
 * Альтернативный способ для продвинутых пользователей
 * 
 * @param {Object} options - Опции инициализации
 * @param {Object} options.config - Конфигурация админки
 * @param {Object} options.database - Database adapter
 * @param {Object} options.storage - Storage adapter (опционально)
 * @param {string} options.mode - Режим ('development' или 'production')
 * 
 * @example
 * import { initAdmin, AdminPanel, useContent } from 'universal-admin-panel';
 * 
 * // Инициализация один раз
 * initAdmin({
 *   config: adminConfig,
 *   database: firebaseAdapter,
 *   storage: cloudinaryAdapter
 * });
 * 
 * // Админка где угодно
 * <AdminPanel />
 * 
 * // Контент где угодно
 * const content = useContent('pages.home');
 */
export function initAdmin(options) {
  const { config, database, storage, mode = process.env.NODE_ENV } = options;

  if (!database) {
    throw new Error('initAdmin: database adapter is required');
  }

  if (!config) {
    throw new Error('initAdmin: config is required');
  }

  // Создаём менеджеры
  const crudManager = new CrudManager({ database, storage });
  const configManager = new ConfigManager(config);

  // Сохраняем глобально
  globalAdminInstance = {
    crudManager,
    configManager,
    config,
    mode,
    isInitialized: true
  };

  console.log('✅ Universal Admin initialized (global mode)');
  console.log('   Mode:', mode);
  console.log('   Collections:', Object.keys(config.collections || {}).join(', '));

  return globalAdminInstance;
}

/**
 * Получить глобальный экземпляр админ-панели
 */
export function getAdminInstance() {
  if (!globalAdminInstance) {
    throw new Error('Admin not initialized. Call initAdmin() first or use AdminProvider.');
  }
  return globalAdminInstance;
}

/**
 * Проверить инициализирован ли админ
 */
export function isAdminInitialized() {
  return globalAdminInstance !== null;
}

/**
 * Очистить глобальный экземпляр (для тестов)
 */
export function resetAdmin() {
  globalAdminInstance = null;
}
