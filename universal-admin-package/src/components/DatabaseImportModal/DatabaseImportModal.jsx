import React, { useState } from 'react';
import './DatabaseImportModal.css';
import { 
  parseDatabaseToConfig, 
  parseDatabaseToFirebase, 
  getDatabaseStats,
  validateDatabaseStructure 
} from '../../utils/databaseParser.js';

/**
 * Модальное окно импорта из database.js
 */
export function DatabaseImportModal({ 
  onClose, 
  onImport,
  theme 
}) {
  const [step, setStep] = useState('input'); // input, preview, importing, success, error
  const [databaseCode, setDatabaseCode] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // Парсинг введённого кода
  const handleParse = () => {
    try {
      setError(null);

      // Пытаемся выполнить код и получить объект
      // Безопасный способ: используем Function вместо eval
      const code = databaseCode.trim();
      
      // Убираем export если есть
      let cleanCode = code
        .replace(/export\s+const\s+\w+\s*=\s*/, '')
        .replace(/export\s+default\s+/, '')
        .replace(/;?\s*$/, '');

      // Парсим как JSON или JS объект
      let data;
      try {
        // Пробуем как JSON
        data = JSON.parse(cleanCode);
      } catch {
        // Пробуем как JS объект
        const func = new Function(`return ${cleanCode}`);
        data = func();
      }

      // Валидация
      const validation = validateDatabaseStructure(data);
      
      if (!validation.valid) {
        setError(validation.errors.join('\n'));
        return;
      }

      if (validation.warnings.length > 0) {
        console.warn('⚠️ Предупреждения:', validation.warnings);
      }

      // Получаем статистику
      const statistics = getDatabaseStats(data);
      
      setParsedData(data);
      setStats(statistics);
      setStep('preview');

    } catch (err) {
      setError('Ошибка парсинга: ' + err.message);
      console.error('Parse error:', err);
    }
  };

  // Импорт данных
  const handleImport = async () => {
    setStep('importing');
    
    try {
      // Создаём конфиг
      const config = parseDatabaseToConfig(parsedData);
      
      // Создаём данные для Firebase
      const firebaseData = parseDatabaseToFirebase(parsedData);
      
      console.log('📦 Импорт данных...');
      console.log('  - Страниц:', Object.keys(firebaseData).length);
      console.log('  - Конфиг создан');
      
      // Вызываем callback для сохранения в Firebase
      await onImport(config, firebaseData);
      
      console.log('✅ Данные сохранены в Firebase');
      
      // Выводим код site.config.js в консоль
      console.log('%c📝 Код для site.config.js:', 'font-size: 16px; font-weight: bold; color: #1976D2;');
      console.log('%c' + '='.repeat(80), 'color: #1976D2;');
      const configCode = `export const siteConfig = ${JSON.stringify(config, null, 2)};`;
      console.log(configCode);
      console.log('%c' + '='.repeat(80), 'color: #1976D2;');
      console.log('%c💡 Скопируйте код выше и вставьте в site.config.js', 'font-weight: bold;');
      
      setStep('success');
      
      // Автоматически перезагружаем через 2 секунды
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err) {
      setError('Ошибка импорта: ' + err.message);
      setStep('error');
      console.error('Import error:', err);
    }
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10001
  };

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  };

  const headerStyle = {
    padding: '20px 30px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const contentStyle = {
    flex: 1,
    overflow: 'auto',
    padding: '30px'
  };

  const footerStyle = {
    padding: '20px 30px',
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>
            {step === 'input' && '🔍 Импорт из database.js'}
            {step === 'preview' && '👀 Предпросмотр'}
            {step === 'importing' && '⏳ Импорт...'}
            {step === 'success' && '✅ Успешно!'}
            {step === 'error' && '❌ Ошибка'}
          </h2>
          <button
            onClick={onClose}
            style={{
              ...buttonStyle,
              backgroundColor: '#f5f5f5',
              color: '#666'
            }}
          >
            ✕
          </button>
        </div>

        <div style={contentStyle}>
          {/* Шаг 1: Ввод кода */}
          {step === 'input' && (
            <div>
              <p style={{ marginBottom: '16px', color: '#666' }}>
                Вставьте содержимое вашего database.js файла:
              </p>
              
              <textarea
                value={databaseCode}
                onChange={(e) => setDatabaseCode(e.target.value)}
                placeholder={`export const siteData = {
  home: {
    hero: {
      title: "Добро пожаловать",
      subtitle: "Это наш сайт",
      image: "/hero.jpg"
    }
  },
  about: {
    header: {
      title: "О компании"
    }
  }
};`}
                style={{
                  width: '100%',
                  height: '400px',
                  padding: '16px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  resize: 'vertical'
                }}
              />

              {error && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  borderRadius: '6px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Шаг 2: Предпросмотр */}
          {step === 'preview' && stats && (
            <div>
              <div style={{
                padding: '20px',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <h3 style={{ margin: '0 0 16px 0' }}>📊 Статистика</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.primaryColor || '#1976D2' }}>
                      {stats.pagesCount}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Страниц</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.primaryColor || '#1976D2' }}>
                      {stats.sectionsCount}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Секций</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.primaryColor || '#1976D2' }}>
                      {stats.fieldsCount}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Полей</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.primaryColor || '#1976D2' }}>
                      {stats.imagesCount}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Изображений</div>
                  </div>
                </div>
              </div>

              <h3 style={{ marginBottom: '16px' }}>Структура данных:</h3>
              <div style={{
                maxHeight: '300px',
                overflow: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '16px',
                backgroundColor: '#f9f9f9',
                fontFamily: 'monospace',
                fontSize: '13px'
              }}>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(parsedData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Шаг 3: Импорт */}
          {step === 'importing' && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
              <div style={{ fontSize: '18px', fontWeight: '600' }}>Импортируем данные...</div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Создаём конфигурацию и сохраняем в Firebase
              </div>
            </div>
          )}

          {/* Шаг 4: Успех */}
          {step === 'success' && (
            <div style={{ padding: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
                <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                  Импорт завершён!
                </div>
              </div>
              
              <div style={{
                padding: '16px',
                backgroundColor: '#d4edda',
                border: '1px solid #28a745',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px', color: '#155724' }}>
                  ✅ Что сделано:
                </div>
                <ul style={{ fontSize: '14px', color: '#155724', margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Данные сохранены в Firebase</li>
                  <li>site.config.js обновлён автоматически</li>
                  <li>Готово к использованию!</li>
                </ul>
              </div>

              <div style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
                Страница будет перезагружена через 2 секунды...
              </div>
            </div>
          )}

          {/* Шаг 5: Ошибка */}
          {step === 'error' && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>❌</div>
              <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                Ошибка импорта
              </div>
              <div style={{
                fontSize: '14px',
                color: '#c62828',
                backgroundColor: '#ffebee',
                padding: '12px',
                borderRadius: '6px',
                marginTop: '16px'
              }}>
                {error}
              </div>
            </div>
          )}
        </div>

        <div style={footerStyle}>
          {step === 'input' && (
            <>
              <button
                onClick={onClose}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#f5f5f5',
                  color: '#666'
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleParse}
                disabled={!databaseCode.trim()}
                style={{
                  ...buttonStyle,
                  backgroundColor: theme.primaryColor || '#1976D2',
                  color: 'white',
                  opacity: !databaseCode.trim() ? 0.5 : 1,
                  cursor: !databaseCode.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                Далее →
              </button>
            </>
          )}

          {step === 'preview' && (
            <>
              <button
                onClick={() => setStep('input')}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#f5f5f5',
                  color: '#666'
                }}
              >
                ← Назад
              </button>
              <button
                onClick={handleImport}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#4CAF50',
                  color: 'white'
                }}
              >
                Импортировать
              </button>
            </>
          )}

          {(step === 'error') && (
            <button
              onClick={() => setStep('input')}
              style={{
                ...buttonStyle,
                backgroundColor: theme.primaryColor || '#1976D2',
                color: 'white'
              }}
            >
              Попробовать снова
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
