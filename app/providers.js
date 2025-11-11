'use client';

import { useEffect } from 'react';
import { AdminProvider } from '../universal-admin-package/src/index.js';
import { firebaseAdapter, cloudinaryAdapter } from '../lib/admin-adapters.js';
import { siteConfig } from '../site.config.js';
import { siteData } from '../database.example.js';
import { CrudManager } from '../universal-admin-package/src/core/CrudManager.js';
import { ConfigManager } from '../universal-admin-package/src/utils/configManager.js';

export function Providers({ children }) {
  useEffect(() => {
    const performAutoImport = async () => {
      // Проверяем, нужен ли автоимпорт
      const autoImportCompleted = localStorage.getItem('auto_import_completed');
      
      if (!autoImportCompleted && siteData) {
        console.log('🚀 Первый запуск - выполняем автоматический импорт данных...');
        
        try {
          const crudManager = new CrudManager({
            database: firebaseAdapter,
            storage: cloudinaryAdapter
          });
          
          const configManager = new ConfigManager(siteConfig);
          
          // Импортируем данные из database.example.js
          for (const [pageName, pageData] of Object.entries(siteData)) {
            console.log(`  📄 Импорт страницы: ${pageName}`);
            
            // Добавляем страницу в конфиг
            configManager.addPage(pageName);
            
            // Сохраняем данные в Firebase
            await crudManager.update('pages', pageName, pageData);
          }
          
          // Сохраняем список страниц
          const pages = Object.keys(siteData);
          await crudManager.update('_metadata', 'pages_list', { pages });
          
          // Сохраняем обновлённый конфиг
          const newConfig = configManager.getConfig();
          await crudManager.update('_metadata', 'site_config', newConfig);
          
          // Отмечаем что импорт выполнен
          localStorage.setItem('auto_import_completed', 'true');
          
          console.log('✅ Автоимпорт завершён успешно!');
          console.log('📊 Импортировано страниц:', pages.length);
          
          // Перезагружаем страницу чтобы применить изменения
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          
        } catch (error) {
          console.error('❌ Ошибка при автоимпорте:', error);
        }
      }
    };
    
    performAutoImport();
  }, []);
  
  return (
    <AdminProvider 
      config={siteConfig}
      database={firebaseAdapter}
      storage={cloudinaryAdapter}
    >
      {children}
    </AdminProvider>
  );
}
