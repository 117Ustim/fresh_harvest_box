/**
 * Автоматический импорт из database.js при первом запуске
 */

import { parseDatabaseToConfig, parseDatabaseToFirebase } from './databaseParser.js';

/**
 * Проверить нужен ли автоимпорт
 */
export function needsAutoImport() {
  // Проверяем флаг в localStorage
  const imported = localStorage.getItem('auto_import_completed');
  return !imported;
}

/**
 * Отметить что автоимпорт выполнен
 */
export function markAutoImportCompleted() {
  localStorage.setItem('auto_import_completed', 'true');
  localStorage.setItem('auto_import_date', new Date().toISOString());
}

/**
 * Сбросить флаг автоимпорта (для повторного импорта)
 */
export function resetAutoImport() {
  localStorage.removeItem('auto_import_completed');
  localStorage.removeItem('auto_import_date');
}

/**
 * Выполнить автоматический импорт из database.js
 * 
 * Процесс:
 * 1. Парсинг database.js -> создание конфигурации
 * 2. Подготовка данных для Firebase
 * 3. Обновление конфига в памяти
 * 4. Сохранение данных в Firebase
 * 5. Сохранение списка страниц
 * 6. Вывод кода site.config.js в консоль
 * 7. Обновление UI
 * 8. Установка флага завершения
 */
export async function performAutoImport(databaseData, crudManager, configManager, onConfigUpdate) {
  try {
    console.log('🔄 Автоматический импорт из database.js...');

    // 1. Создаём конфиг с автоопределением типов полей
    const config = parseDatabaseToConfig(databaseData);
    console.log('✅ Конфиг создан');

    // 2. Создаём данные для Firebase (копируем структуру как есть)
    const firebaseData = parseDatabaseToFirebase(databaseData);
    console.log('✅ Данные подготовлены');

    // 3. Обновляем конфиг в памяти (для работы админки)
    Object.keys(config.collections.pages).forEach(pageName => {
      configManager.addPage(pageName);
      const pageConfig = config.collections.pages[pageName];
      
      // Добавляем поля из конфига (пропускаем служебные поля с _)
      const fields = {};
      Object.keys(pageConfig).forEach(sectionName => {
        const section = pageConfig[sectionName];
        Object.keys(section).forEach(fieldName => {
          if (!fieldName.startsWith('_')) {
            fields[`${sectionName}.${fieldName}`] = section[fieldName];
          }
        });
      });
      
      configManager.updatePageFields(pageName, fields);
    });
    console.log('✅ Конфиг обновлён в памяти');

    // 4. Сохраняем данные в Firebase
    for (const pageName of Object.keys(firebaseData)) {
      try {
        await crudManager.create('pages', pageName, firebaseData[pageName]);
        console.log(`✅ Страница "${pageName}" создана в Firebase`);
      } catch (error) {
        // Если страница уже существует - обновляем её
        if (error.message.includes('already exists')) {
          await crudManager.update('pages', pageName, firebaseData[pageName]);
          console.log(`✅ Страница "${pageName}" обновлена в Firebase`);
        } else {
          throw error;
        }
      }
    }

    // 5. Сохраняем список страниц в метаданных
    const pagesList = configManager.getPages();
    try {
      await crudManager.update('_metadata', 'pages_list', {
        pages: pagesList,
        updatedAt: new Date().toISOString()
      });
    } catch {
      await crudManager.create('_metadata', 'pages_list', {
        pages: pagesList,
        updatedAt: new Date().toISOString()
      });
    }
    console.log('✅ Список страниц сохранён');

    // 6. Выводим код site.config.js в консоль (для копирования)
    console.log('%c📝 Код для site.config.js:', 'font-size: 16px; font-weight: bold; color: #1976D2;');
    console.log('%c' + '='.repeat(80), 'color: #1976D2;');
    const configCode = `export const siteConfig = ${JSON.stringify(config, null, 2)};`;
    console.log(configCode);
    console.log('%c' + '='.repeat(80), 'color: #1976D2;');

    // 7. Обновляем UI (если передан callback)
    if (onConfigUpdate) {
      onConfigUpdate();
    }

    // 8. Отмечаем что импорт выполнен (сохраняем в localStorage)
    markAutoImportCompleted();

    console.log('✅ Автоматический импорт завершён успешно!');
    return { success: true };

  } catch (error) {
    console.error('❌ Ошибка автоматического импорта:', error);
    return { success: false, error: error.message };
  }
}
