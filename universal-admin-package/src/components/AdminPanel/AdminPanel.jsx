'use client'
import React, { useState, useEffect } from 'react';
import '../admin-common.css';
import './AdminPanel.css';
import { CrudManager } from '../../core/CrudManager.js';
import { ConfigParser } from '../../config/ConfigParser.js';
import { ConfigManager } from '../../utils/configManager.js';
import { AdminTrigger } from '../AdminTrigger/AdminTrigger.jsx';
import { AdminDashboard } from '../AdminDashboard/AdminDashboard.jsx';
import { useAdminContext } from '../../context/AdminContext.jsx';

/**
 * Главный компонент админ-панели
 * Может работать как самостоятельно (с пропсами), так и внутри AdminProvider (из контекста)
 */
export function AdminPanel({ config: configProp, database: databaseProp, storage: storageProp, theme = {} }) {
  // Пытаемся получить из контекста (если внутри AdminProvider)
  const context = useAdminContext();
  
  // Используем либо пропсы, либо контекст
  const config = configProp || context?.config;
  const database = databaseProp || context?.database;
  const storage = storageProp || context?.storage;
  
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(config);
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  // Создаём менеджеры
  const crudManager = new CrudManager({
    database,
    storage
  });

  const [configManager] = useState(() => new ConfigManager(config));
  const [configParser, setConfigParser] = useState(() => new ConfigParser(currentConfig));

  // Автоматический импорт отключён - выполняется в AdminProvider
  // useEffect(() => {
  //   // Автоимпорт перенесён в app/providers.js
  // }, []);

  // Загружаем список страниц из Firebase при открытии админки
  useEffect(() => {
    if (isOpen && !isLoadingPages) {
      loadPagesFromFirebase();
    }
  }, [isOpen]);

  // Загрузить список страниц из Firebase
  const loadPagesFromFirebase = async () => {
    setIsLoadingPages(true);
    try {
      const metadata = await crudManager.get('_metadata', 'pages_list');
      if (metadata?.pages && Array.isArray(metadata.pages)) {
        console.log('📄 Загружен список страниц из Firebase:', metadata.pages);
        
        // Обновляем конфиг с загруженными страницами
        metadata.pages.forEach(pageName => {
          const existingPages = configManager.getPages();
          if (!existingPages.includes(pageName)) {
            // Добавляем страницу если её нет
            configManager.addPage(pageName);
            console.log(`  ✅ Добавлена страница из Firebase: ${pageName}`);
          }
        });
        
        // Обновляем UI
        const newConfig = configManager.getConfig();
        setCurrentConfig(newConfig);
      }
    } catch (error) {
      console.log('ℹ️ Список страниц в Firebase не найден (это нормально для первого запуска)');
    } finally {
      setIsLoadingPages(false);
    }
  };

  // Обновляем configParser при изменении конфига
  useEffect(() => {
    setConfigParser(new ConfigParser(currentConfig));
  }, [currentConfig]);

  // Обработчик обновления конфига
  const handleConfigUpdate = () => {
    const newConfig = configManager.getConfig();
    setCurrentConfig(newConfig);
    
    // Принудительно обновляем configParser
    setConfigParser(new ConfigParser(newConfig));
    
    // Показываем инструкцию в консоли (без скачивания файла)
    console.log('%c✅ Конфигурация обновлена!', 'font-size: 14px; font-weight: bold; color: #4CAF50;');
    console.log('%cНовые поля доступны для редактирования', 'font-size: 12px; color: #666;');
  };

  return (
    <>
      {/* Кнопка вызова админки */}
      <AdminTrigger 
        onClick={() => setIsOpen(true)}
        theme={theme}
      />

      {/* Модальное окно админки */}
      {isOpen && (
        <AdminDashboard
          crudManager={crudManager}
          configParser={configParser}
          configManager={configManager}
          theme={theme}
          onClose={() => setIsOpen(false)}
          isAuthenticated={isAuthenticated}
          onAuthenticate={() => setIsAuthenticated(true)}
          onConfigUpdate={handleConfigUpdate}
        />
      )}
    </>
  );
}
