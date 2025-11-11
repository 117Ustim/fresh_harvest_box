'use client'
import { useState, useEffect } from 'react';
import { useAdminContext } from '../context/AdminContext.jsx';
import { getAdminInstance, isAdminInitialized } from '../utils/initAdmin.js';

/**
 * Универсальный хук для получения контента из админ-панели
 * 
 * @param {string} path - Путь к контенту (например: 'pages.home.hero.title')
 * @param {Object} options - Опции
 * @param {string} options.type - Тип поля ('text', 'image', etc.)
 * @param {any} options.defaultValue - Значение по умолчанию
 * @param {boolean} options.subscribe - Подписаться на изменения (default: true)
 * 
 * @returns {any} - Значение контента
 * 
 * @example
 * // Получить всю секцию
 * const hero = useContent('pages.home.hero');
 * 
 * @example
 * // Получить одно поле
 * const title = useContent('pages.home.hero.title', {
 *   type: 'text',
 *   defaultValue: 'Заголовок по умолчанию'
 * });
 * 
 * @example
 * // Без подписки на изменения (статичные данные)
 * const title = useContent('pages.home.hero.title', {
 *   subscribe: false
 * });
 */
export function useContent(path, options = {}) {
  const {
    type,
    defaultValue = null,
    subscribe = true
  } = options;

  /**
   * Пытаемся получить контекст из AdminProvider
   * Если нет - используем глобальный экземпляр (для совместимости)
   */
  let adminContext;
  try {
    adminContext = useAdminContext();
  } catch (error) {
    // Контекст не найден, используем глобальный экземпляр
    if (isAdminInitialized()) {
      const instance = getAdminInstance();
      // Создаём совместимый интерфейс
      adminContext = {
        isInitialized: true,
        mode: instance.mode,
        getContent: async (path, opts) => {
          const parts = path.split('.');
          const collection = parts[0];
          const documentId = parts[1];
          const fieldPath = parts.slice(2);

          const data = await instance.crudManager.get(collection, documentId);
          if (!data) return opts.defaultValue || null;

          let value = data;
          for (const key of fieldPath) {
            value = value?.[key];
          }
          return value !== undefined ? value : opts.defaultValue || null;
        },
        subscribeToContent: (path, callback) => {
          const parts = path.split('.');
          const collection = parts[0];
          const documentId = parts[1];
          const fieldPath = parts.slice(2);

          return instance.crudManager.subscribe(collection, documentId, (data) => {
            if (!data) {
              callback(null);
              return;
            }

            let value = data;
            for (const key of fieldPath) {
              value = value?.[key];
            }
            callback(value);
          });
        }
      };
    } else {
      throw new Error('useContent: AdminProvider not found and initAdmin() not called');
    }
  }

  const {
    isInitialized,
    getContent,
    subscribeToContent,
    mode
  } = adminContext;

  const [content, setContent] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    let unsubscribe;

    const loadContent = async () => {
      try {
        if (subscribe) {
          // Подписываемся на изменения (реактивность через Firebase onSnapshot)
          // При любом изменении в Firebase компонент автоматически обновится
          unsubscribe = subscribeToContent(path, (value) => {
            setContent(value !== null ? value : defaultValue);
            setLoading(false);
          });
        } else {
          // Загружаем один раз (без подписки) - для статичных данных
          const value = await getContent(path, { type, defaultValue });
          setContent(value);
          setLoading(false);
        }
      } catch (err) {
        console.error(`❌ Error loading content for path: ${path}`, err);
        setError(err);
        setContent(defaultValue);
        setLoading(false);
      }
    };

    loadContent();

    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [path, isInitialized, subscribe]);

  // В режиме разработки показываем предупреждения
  useEffect(() => {
    if (mode === 'development' && content === null && !loading) {
      console.warn(`⚠️ useContent: No content found for path "${path}"`);
      if (defaultValue) {
        console.log(`   Using default value:`, defaultValue);
      }
    }
  }, [content, loading, path, defaultValue, mode]);

  return content;
}

/**
 * Хук для получения нескольких полей сразу
 * 
 * @param {Object} paths - Объект с путями
 * @returns {Object} - Объект с контентом
 * 
 * @example
 * const { title, subtitle, photo } = useMultipleContent({
 *   title: 'pages.home.hero.title',
 *   subtitle: 'pages.home.hero.subtitle',
 *   photo: 'pages.home.hero.photo'
 * });
 */
export function useMultipleContent(paths) {
  const results = {};

  Object.keys(paths).forEach(key => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results[key] = useContent(paths[key]);
  });

  return results;
}
