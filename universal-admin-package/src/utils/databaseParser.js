/**
 * Парсер для database.js
 * Анализирует структуру данных и определяет типы полей
 */

/**
 * Определить тип поля по значению
 * Автоматически анализирует данные и возвращает подходящий тип
 * 
 * Поддерживаемые типы:
 * - text: короткий текст
 * - textarea: длинный текст (> 100 символов)
 * - image: одно изображение
 * - image-array: массив изображений
 * - image-gallery-with-description: массив объектов с изображениями и описаниями
 */
function detectFieldType(value, key = '') {
  if (value === null || value === undefined) {
    return 'text';
  }

  // Обработка массивов
  if (Array.isArray(value)) {
    if (value.length === 0) return 'image-array';
    
    const firstItem = value[0];
    
    // Массив объектов с изображениями и описаниями
    // Пример: [{ icon: "/icon.svg", title: "...", description: "..." }]
    if (typeof firstItem === 'object' && firstItem !== null) {
      if (firstItem.image || firstItem.icon) {
        return 'image-gallery-with-description';
      }
      return 'text'; // Сложный объект - пока как текст
    }
    
    // Массив строк - проверяем на изображения
    // Пример: ["/photo1.jpg", "/photo2.jpg"]
    if (typeof firstItem === 'string') {
      if (isImageUrl(firstItem)) {
        return 'image-array';
      }
      return 'text'; // Массив текста
    }
    
    return 'image-array';
  }

  // Обработка строк
  if (typeof value === 'string') {
    // Проверка на изображение по расширению или пути
    if (isImageUrl(value)) {
      return 'image';
    }
    
    // Проверка на email (можно расширить в будущем)
    if (value.includes('@') && value.includes('.')) {
      return 'text'; // Можно добавить type: 'email'
    }
    
    // Проверка на телефон (можно расширить в будущем)
    if (/^[\d\s\+\-\(\)]+$/.test(value) && value.length > 5) {
      return 'text'; // Можно добавить type: 'phone'
    }
    
    // Длинный текст -> textarea
    if (value.length > 100) {
      return 'textarea';
    }
    
    return 'text';
  }

  // Число (можно расширить в будущем)
  if (typeof value === 'number') {
    return 'text'; // Можно добавить type: 'number'
  }

  // Булево (можно расширить в будущем)
  if (typeof value === 'boolean') {
    return 'text'; // Можно добавить type: 'checkbox'
  }

  // Объект - это вложенная секция
  if (typeof value === 'object') {
    return 'section';
  }

  return 'text';
}

/**
 * Проверить является ли строка URL изображения
 * Проверяет по расширению, пути и ключевым словам
 */
function isImageUrl(str) {
  if (typeof str !== 'string') return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];
  const lowerStr = str.toLowerCase();
  
  // Проверка 1: Расширение файла
  if (imageExtensions.some(ext => lowerStr.endsWith(ext))) {
    return true;
  }
  
  // Проверка 2: Путь содержит папку с изображениями
  if (lowerStr.includes('/images/') || 
      lowerStr.includes('/img/') || 
      lowerStr.includes('/assets/') ||
      lowerStr.includes('/public/')) {
    return true;
  }
  
  // Проверка 3: Ключевые слова в пути
  if (lowerStr.includes('image') || 
      lowerStr.includes('photo') || 
      lowerStr.includes('picture') ||
      lowerStr.includes('icon') ||
      lowerStr.includes('logo') ||
      lowerStr.includes('avatar')) {
    return true;
  }
  
  return false;
}

/**
 * Создать человеческое название из ключа
 */
function humanizeKey(key) {
  // camelCase -> Title Case
  const result = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
  
  return result;
}

/**
 * Парсить database.js и создать структуру для site.config.js
 * 
 * Преобразует простую структуру данных в конфигурацию с типами полей
 * 
 * Вход:  { home: { hero: { title: "..." } } }
 * Выход: { collections: { pages: { home: { hero: { title: { type: 'text', ... } } } } } }
 */
export function parseDatabaseToConfig(databaseData) {
  const config = {
    collections: {
      pages: {}
    }
  };

  // Проходим по всем страницам (home, about, contact)
  Object.keys(databaseData).forEach(pageName => {
    const pageData = databaseData[pageName];
    
    if (typeof pageData !== 'object' || pageData === null) {
      console.warn(`⚠️ Страница "${pageName}" не является объектом, пропускаем`);
      return;
    }

    config.collections.pages[pageName] = {};

    // Проходим по секциям страницы (hero, features, gallery)
    Object.keys(pageData).forEach(sectionName => {
      const sectionData = pageData[sectionName];
      
      if (typeof sectionData !== 'object' || sectionData === null) {
        console.warn(`⚠️ Секция "${sectionName}" не является объектом, пропускаем`);
        return;
      }

      // Создаём секцию с метаданными
      const section = {
        _label: humanizeKey(sectionName),
        _description: `Секция ${humanizeKey(sectionName).toLowerCase()}`
      };

      // Проходим по полям секции (title, description, image)
      Object.keys(sectionData).forEach(fieldName => {
        const fieldValue = sectionData[fieldName];
        const fieldType = detectFieldType(fieldValue, fieldName);

        // Создаём конфигурацию поля
        section[fieldName] = {
          type: fieldType,
          label: humanizeKey(fieldName),
          defaultValue: fieldValue
        };

        // Дополнительные параметры для textarea
        if (fieldType === 'textarea') {
          section[fieldName].rows = 5;
        }

        // Дополнительные параметры для image-array
        if (fieldType === 'image-array') {
          section[fieldName].max = 20;
        }
      });

      config.collections.pages[pageName][sectionName] = section;
    });
  });

  return config;
}

/**
 * Создать данные для Firebase из database.js
 */
export function parseDatabaseToFirebase(databaseData) {
  const firebaseData = {};

  Object.keys(databaseData).forEach(pageName => {
    const pageData = databaseData[pageName];
    
    if (typeof pageData !== 'object' || pageData === null) {
      return;
    }

    firebaseData[pageName] = {};

    // Копируем структуру как есть
    Object.keys(pageData).forEach(sectionName => {
      firebaseData[pageName][sectionName] = pageData[sectionName];
    });
  });

  return firebaseData;
}

/**
 * Получить статистику по database.js
 */
export function getDatabaseStats(databaseData) {
  let pagesCount = 0;
  let sectionsCount = 0;
  let fieldsCount = 0;
  let imagesCount = 0;

  Object.keys(databaseData).forEach(pageName => {
    const pageData = databaseData[pageName];
    
    if (typeof pageData !== 'object' || pageData === null) {
      return;
    }

    pagesCount++;

    Object.keys(pageData).forEach(sectionName => {
      const sectionData = pageData[sectionName];
      
      if (typeof sectionData !== 'object' || sectionData === null) {
        return;
      }

      sectionsCount++;

      Object.keys(sectionData).forEach(fieldName => {
        const fieldValue = sectionData[fieldName];
        fieldsCount++;

        // Подсчёт изображений
        if (isImageUrl(fieldValue)) {
          imagesCount++;
        } else if (Array.isArray(fieldValue)) {
          fieldValue.forEach(item => {
            if (typeof item === 'string' && isImageUrl(item)) {
              imagesCount++;
            } else if (typeof item === 'object' && item !== null) {
              if (item.image && isImageUrl(item.image)) imagesCount++;
              if (item.icon && isImageUrl(item.icon)) imagesCount++;
            }
          });
        }
      });
    });
  });

  return {
    pagesCount,
    sectionsCount,
    fieldsCount,
    imagesCount
  };
}

/**
 * Валидация структуры database.js
 */
export function validateDatabaseStructure(databaseData) {
  const errors = [];
  const warnings = [];

  if (!databaseData || typeof databaseData !== 'object') {
    errors.push('database.js должен экспортировать объект');
    return { valid: false, errors, warnings };
  }

  if (Object.keys(databaseData).length === 0) {
    errors.push('database.js пустой - нет страниц');
    return { valid: false, errors, warnings };
  }

  // Проверка структуры
  Object.keys(databaseData).forEach(pageName => {
    const pageData = databaseData[pageName];

    if (typeof pageData !== 'object' || pageData === null) {
      warnings.push(`Страница "${pageName}" не является объектом`);
      return;
    }

    if (Object.keys(pageData).length === 0) {
      warnings.push(`Страница "${pageName}" пустая - нет секций`);
    }

    Object.keys(pageData).forEach(sectionName => {
      const sectionData = pageData[sectionName];

      if (typeof sectionData !== 'object' || sectionData === null) {
        warnings.push(`Секция "${pageName}.${sectionName}" не является объектом`);
        return;
      }

      if (Object.keys(sectionData).length === 0) {
        warnings.push(`Секция "${pageName}.${sectionName}" пустая - нет полей`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
