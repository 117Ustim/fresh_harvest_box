import React, { useState } from 'react';
import './AdminDashboard.css';
import { CollectionList } from '../CollectionList/CollectionList.jsx';
import { DynamicDocumentEditor } from '../DynamicDocumentEditor/DynamicDocumentEditor.jsx';
import { CreatePageModal } from '../CreatePageModal/CreatePageModal.jsx';
import { DatabaseImportModal } from '../DatabaseImportModal/DatabaseImportModal.jsx';

/**
 * Главная панель управления
 */
export function AdminDashboard({ 
  crudManager, 
  configParser,
  configManager,
  theme, 
  onClose,
  isAuthenticated,
  onAuthenticate,
  onConfigUpdate
}) {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [showDatabaseImport, setShowDatabaseImport] = useState(false);

  // Простая авторизация (можно расширить)
  const [password, setPassword] = useState('');
  const ADMIN_PASSWORD = '777'; // Измените на свой пароль

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      onAuthenticate();
    } else {
      alert('Неверный пароль');
    }
  };

  // Миграция данных
  const handleMigration = async () => {
    if (!confirm('Мигрировать данные страницы "home" в новый формат с секциями?\n\nСтарый формат: { title, subtitle, description, carousel }\nНовый формат: { hero: {...}, gallery: {...} }')) {
      return;
    }

    setMigrationStatus('migrating');
    
    try {
      const result = await crudManager.migrateToSections('pages', 'home');
      
      if (result.success) {
        setMigrationStatus('success');
        alert('✅ ' + result.message + '\n\nСтраница будет перезагружена.');
        
        // Перезагружаем страницу через 1 секунду
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMigrationStatus('error');
        alert('❌ ' + result.message);
        setTimeout(() => setMigrationStatus(null), 3000);
      }
    } catch (error) {
      setMigrationStatus('error');
      alert('❌ Ошибка миграции: ' + error.message);
      setTimeout(() => setMigrationStatus(null), 3000);
    }
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000
  };

  const panelStyle = {
    backgroundColor: '#f1f5f9',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '1200px',
    height: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e2e8f0'
  };

  const headerStyle = {
    padding: '24px 32px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffffff',
    borderRadius: '16px 16px 0 0'
  };

  const contentStyle = {
    flex: 1,
    overflow: 'auto',
    padding: '32px',
    background: '#f1f5f9'
  };

  const glassButtonStyle = {
    padding: '10px 20px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  // Экран авторизации
  if (!isAuthenticated) {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={{...panelStyle, maxWidth: '400px', height: 'auto'}} onClick={(e) => e.stopPropagation()}>
          <div style={{...headerStyle, justifyContent: 'center'}}>
            <h2 style={{margin: 0}}>Вход в админ-панель</h2>
          </div>
          <div style={{padding: '30px'}}>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%',
                padding: '14px 18px',
                fontSize: '15px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                marginBottom: '16px',
                background: '#ffffff',
                color: '#1e293b',
                transition: 'all 0.2s ease'
              }}
            />
            <button
              onClick={handleLogin}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              Войти
            </button>
            {/* <p style={{marginTop: '16px', fontSize: '12px', color: '#64748b', textAlign: 'center'}}>
              Пароль по умолчанию: 
            </p> */}
          </div>
        </div>
      </div>
    );
  }

  // Главная панель
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{margin: 0}}>⚙️ Админ-панель</h2>
          <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
            {!selectedCollection ? (
              <>
                <button
                  onClick={() => setShowDatabaseImport(true)}
                  style={{
                    ...glassButtonStyle,
                    background: 'rgba(156, 39, 176, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(156, 39, 176, 0.3)',
                    color: '#9C27B0'
                  }}
                  title="Импортировать данные из database.js"
                >
                  🔍 Импорт
                </button>
                <button
                  onClick={() => setShowCreatePage(true)}
                  style={{
                    ...glassButtonStyle,
                    background: 'rgba(99, 102, 241, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#6366f1'
                  }}
                >
                  + Создать страницу
                </button>
                <button 
                  onClick={onClose}
                  style={{
                    ...glassButtonStyle,
                    background: 'rgba(239, 68, 68, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444'
                  }}
                >
                  Закрыть
                </button>
              </>
            ) : null}
          </div>
        </div>
        
        <div style={contentStyle}>
          {!selectedCollection ? (
            <CollectionList
              configParser={configParser}
              onSelectCollection={(collection, docId) => {
                setSelectedCollection(collection);
                setSelectedDocument(docId);
              }}
              onDeletePage={async (collection, docId) => {
                try {
                  // 1. Удаляем из Firebase
                  await crudManager.delete(collection, docId);
                  console.log(`✅ Страница "${docId}" удалена из Firebase`);

                  // 2. Удаляем из конфига
                  configManager.removePage(docId);

                  // 3. Обновляем список страниц в Firebase
                  const pagesList = configManager.getPages();
                  try {
                    await crudManager.update('_metadata', 'pages_list', {
                      pages: pagesList,
                      updatedAt: new Date().toISOString()
                    });
                  } catch {
                    // Игнорируем если не удалось обновить метаданные
                  }

                  // 4. Обновляем UI
                  if (onConfigUpdate) {
                    onConfigUpdate();
                  }

                  console.log(`✅ Страница "${docId}" удалена успешно`);
                  alert(`Страница "${docId}" удалена`);
                } catch (error) {
                  console.error('❌ Ошибка удаления страницы:', error);
                  alert(`Ошибка удаления: ${error.message}`);
                }
              }}
            />
          ) : (
            <DynamicDocumentEditor
              crudManager={crudManager}
              configParser={configParser}
              collection={selectedCollection}
              documentId={selectedDocument}
              onBack={() => {
                setSelectedCollection(null);
                setSelectedDocument(null);
              }}
              theme={theme}
              onUpdateConfig={(collection, docId, fields) => {
                configManager.updatePageFields(docId, fields);
                if (onConfigUpdate) {
                  onConfigUpdate();
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Модальное окно импорта из database.js */}
      {showDatabaseImport && (
        <DatabaseImportModal
          onClose={() => setShowDatabaseImport(false)}
          onImport={async (config, firebaseData) => {
            // 1. Обновляем конфиг
            Object.keys(config.collections.pages).forEach(pageName => {
              configManager.addPage(pageName);
              const pageConfig = config.collections.pages[pageName];
              
              // Добавляем поля из конфига
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

            // 2. Сохраняем данные в Firebase
            for (const pageName of Object.keys(firebaseData)) {
              await crudManager.create('pages', pageName, firebaseData[pageName]);
              console.log(`✅ Страница "${pageName}" создана в Firebase`);
            }

            // 3. Сохраняем список страниц
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

            // 4. Обновляем UI
            if (onConfigUpdate) {
              onConfigUpdate();
            }

            console.log('✅ Импорт завершён успешно!');
          }}
          theme={theme}
        />
      )}

      {/* Модальное окно создания страницы */}
      {showCreatePage && (
        <CreatePageModal
          onClose={() => setShowCreatePage(false)}
          onCreatePage={async (pageName) => {
            try {
              // 1. Создаём страницу в конфиге
              configManager.addPage(pageName);
              
              // 2. Создаём документ в Firebase с базовыми данными
              const initialData = {
                title1: 'Новая страница',
                description1: 'Добавьте описание страницы',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              
              await crudManager.create('pages', pageName, initialData);
              
              // 3. Сохраняем список страниц в Firebase (для надёжности)
              try {
                const pagesList = configManager.getPages();
                await crudManager.update('_metadata', 'pages_list', {
                  pages: pagesList,
                  updatedAt: new Date().toISOString()
                });
                console.log('✅ Список страниц сохранён в Firebase:', pagesList);
              } catch (metaError) {
                // Если документ не существует - создаём
                const pagesList = configManager.getPages();
                await crudManager.create('_metadata', 'pages_list', {
                  pages: pagesList,
                  updatedAt: new Date().toISOString()
                });
                console.log('✅ Список страниц создан в Firebase:', pagesList);
              }
              
              setShowCreatePage(false);
              
              // 4. Обновляем конфиг
              if (onConfigUpdate) {
                onConfigUpdate();
              }
              
              // 5. Показываем уведомление в консоли
              console.log(`✅ Страница "${pageName}" создана!`);
              console.log('  ✓ Документ создан в Firebase');
              console.log('  ✓ Список страниц обновлён');
              console.log('  ✓ Готово к редактированию');
            } catch (error) {
              console.error('Error creating page:', error);
              alert(`❌ Ошибка создания страницы: ${error.message}\n\nПроверьте правила Firestore.`);
            }
          }}
          theme={theme}
        />
      )}
    </div>
  );
}
