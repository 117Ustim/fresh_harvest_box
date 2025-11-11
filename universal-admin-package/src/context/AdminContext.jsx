'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CrudManager } from '../core/CrudManager.js';
import { ConfigManager } from '../utils/configManager.js';

/**
 * Контекст для универсальной админ-панели
 */
const AdminContext = createContext(null);

/**
 * Provider для админ-панели
 * Оборачивает всё приложение и предоставляет доступ к контенту
 */
export function AdminProvider({
  children,
  config,
  database,
  storage,
  mode = process.env.NODE_ENV // 'development' или 'production'
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [crudManager, setCrudManager] = useState(null);
  const [configManager, setConfigManager] = useState(null);
  const [contentCache, setContentCache] = useState({});

  // Инициализация
  useEffect(() => {
    if (!database) {
      console.error('❌ AdminProvider: database adapter is required');
      return;
    }

    // Создаём менеджеры
    const crud = new CrudManager({ database, storage });
    const configMgr = new ConfigManager(config);

    setCrudManager(crud);
    setConfigManager(configMgr);
    setIsInitialized(true);

    console.log('✅ AdminProvider initialized');
    console.log('   Mode:', mode);
    console.log('   Config:', Object.keys(config.collections || {}).join(', '));
  }, [database, storage, config, mode]);

  /**
   * Получить контент по пути
   * Пример: getContent('pages.home.hero') вернёт объект секции hero
   */
  const getContent = async (path, options = {}) => {
    if (!isInitialized) {
      console.warn('⚠️ AdminProvider not initialized yet');
      return options.defaultValue || null;
    }

    // Проверяем кэш для оптимизации
    if (contentCache[path]) {
      return contentCache[path];
    }

    try {
      // Парсим путь: 'pages.home.hero' -> collection='pages', doc='home', field='hero'
      const parts = path.split('.');
      const collection = parts[0];      // 'pages'
      const documentId = parts[1];      // 'home'
      const fieldPath = parts.slice(2); // ['hero']

      // Получаем документ из Firebase
      const data = await crudManager.get(collection, documentId);

      if (!data) {
        // Документ не найден - используем дефолтные значения из конфига
        return getDefaultFromConfig(path);
      }

      // Получаем значение по пути (например data.hero)
      let value = data;
      for (const key of fieldPath) {
        value = value?.[key];
      }

      // Если поле не найдено - используем дефолтные значения из конфига
      if (value === undefined) {
        return getDefaultFromConfig(path);
      }

      // Кэшируем для следующих запросов
      setContentCache(prev => ({ ...prev, [path]: value }));

      return value;
    } catch (error) {
      console.error('❌ Error getting content:', error);
      return options.defaultValue || null;
    }
  };

  /**
   * Получить дефолтные значения из конфига
   * Используется когда данные ещё не загружены из Firebase
   */
  const getDefaultFromConfig = (path) => {
    try {
      const parts = path.split('.');
      const collection = parts[0];
      const documentId = parts[1];
      const fieldPath = parts.slice(2);

      // Получаем конфиг для этого пути
      let configData = config?.collections?.[collection]?.[documentId];

      if (!configData) return null;

      // Если запрашивается секция целиком (например 'pages.home.hero')
      if (fieldPath.length === 1) {
        const sectionName = fieldPath[0];
        const section = configData[sectionName];

        if (!section) return null;

        // Собираем все дефолтные значения из секции
        // Пропускаем служебные поля (начинаются с _)
        const defaults = {};
        Object.keys(section).forEach(key => {
          if (!key.startsWith('_') && section[key].defaultValue !== undefined) {
            defaults[key] = section[key].defaultValue;
          }
        });

        return Object.keys(defaults).length > 0 ? defaults : null;
      }

      // Если запрашивается конкретное поле (например 'pages.home.hero.title')
      if (fieldPath.length === 2) {
        const sectionName = fieldPath[0];
        const fieldName = fieldPath[1];
        const field = configData[sectionName]?.[fieldName];

        return field?.defaultValue || null;
      }

      return null;
    } catch (error) {
      console.error('❌ Error getting default from config:', error);
      return null;
    }
  };

  /**
   * Подписаться на изменения контента
   * Использует Firebase onSnapshot для реактивных обновлений
   */
  const subscribeToContent = (path, callback) => {
    if (!isInitialized) return () => { };

    try {
      const parts = path.split('.');
      const collection = parts[0];
      const documentId = parts[1];
      const fieldPath = parts.slice(2);

      // Подписываемся на изменения документа в Firebase
      const unsubscribe = crudManager.subscribe(collection, documentId, (data) => {
        if (!data) {
          // Нет данных - используем дефолты из конфига
          const defaultValue = getDefaultFromConfig(path);
          callback(defaultValue);
          return;
        }

        // Получаем значение по пути (например data.hero.title)
        let value = data;
        for (const key of fieldPath) {
          value = value?.[key];
        }

        // Если значение не найдено - используем дефолты
        if (value === undefined) {
          value = getDefaultFromConfig(path);
        }

        // Обновляем кэш
        setContentCache(prev => ({ ...prev, [path]: value }));

        // Вызываем callback с новым значением
        callback(value);
      });

      return unsubscribe;
    } catch (error) {
      console.error('❌ Error subscribing to content:', error);
      return () => { };
    }
  };

  // Очистить кэш
  const clearCache = (path) => {
    if (path) {
      setContentCache(prev => {
        const newCache = { ...prev };
        delete newCache[path];
        return newCache;
      });
    } else {
      setContentCache({});
    }
  };

  const value = {
    isInitialized,
    crudManager,
    configManager,
    config,
    database,
    storage,
    mode,
    getContent,
    subscribeToContent,
    clearCache
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

/**
 * Хук для доступа к контексту админ-панели
 * Возвращает null если используется вне AdminProvider (для совместимости)
 */
export function useAdminContext() {
  const context = useContext(AdminContext);
  return context; // Возвращаем null если вне Provider
}
