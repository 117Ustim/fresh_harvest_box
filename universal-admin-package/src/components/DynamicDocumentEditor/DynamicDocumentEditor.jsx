'use client'
import React, { useState, useEffect } from 'react';
import './DynamicDocumentEditor.css';
import { FieldRenderer } from '../fields/FieldRenderer.jsx';

/**
 * Динамический редактор документа с возможностью добавления/удаления полей
 */
export function DynamicDocumentEditor({
  crudManager,
  configParser,
  collection,
  documentId,
  onBack,
  theme,
  onUpdateConfig,
  configManager
}) {
  const [data, setData] = useState({});
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showFieldMenu, setShowFieldMenu] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Загружаем данные и структуру полей
  useEffect(() => {
    const fieldConfig = configParser.getFields(collection, documentId);

    // Преобразуем конфиг в массив полей для drag-and-drop
    const fieldArray = Object.entries(fieldConfig).map(([name, config]) => ({
      id: name,
      name,
      config
    }));

    setFields(fieldArray);

    const unsub = crudManager.subscribe(collection, documentId, (newData) => {
      if (newData) {
        // Преобразуем вложенную структуру в плоскую для редактора
        const flatData = flattenData(newData);
        setData(flatData);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [collection, documentId]);

  /**
   * Преобразовать вложенную структуру в плоскую для редактирования
   * 
   * Вход:  { hero: { title: "..." } }
   * Выход: { "hero.title": "..." }
   * 
   * Это нужно для удобного редактирования полей в UI
   */
  const flattenData = (obj, prefix = '') => {
    const result = {};
    
    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Рекурсивно обрабатываем вложенные объекты
        Object.assign(result, flattenData(value, newKey));
      } else {
        // Сохраняем значение (примитив или массив)
        result[newKey] = value;
      }
    }
    
    return result;
  };

  /**
   * Преобразовать плоскую структуру обратно во вложенную для сохранения
   * 
   * Вход:  { "hero.title": "..." }
   * Выход: { hero: { title: "..." } }
   * 
   * Это нужно для сохранения в Firebase в правильном формате
   */
  const unflattenData = (flatData) => {
    const result = {};
    
    for (const key in flatData) {
      const parts = key.split('.');
      let current = result;
      
      // Создаём вложенную структуру
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      
      // Устанавливаем значение
      current[parts[parts.length - 1]] = flatData[key];
    }
    
    return result;
  };

  /**
   * Сохранение изменений в Firebase
   * Преобразует плоскую структуру обратно во вложенную и сохраняет
   */
  const handleSave = async () => {
    setSaving(true);
    try {
      // Преобразуем плоскую структуру обратно во вложенную для Firebase
      const nestedData = unflattenData(data);
      
      console.log('💾 Сохранение данных...');
      console.log('💾 Плоские данные:', data);
      console.log('💾 Вложенные данные для Firebase:', nestedData);
      
      // Проверяем что документ существует, если нет - создаём
      const existingDoc = await crudManager.get(collection, documentId);

      if (existingDoc) {
        await crudManager.update(collection, documentId, nestedData);
        console.log('✅ Данные обновлены в Firebase');
      } else {
        await crudManager.create(collection, documentId, nestedData);
        console.log('✅ Данные созданы в Firebase');
      }

      // Показываем уведомление в консоли вместо alert
      console.log('✅ Сохранено успешно!');
    } catch (error) {
      console.error('❌ Ошибка сохранения:', error);
      alert('❌ Ошибка сохранения: ' + error.message + '\n\nПроверьте правила Firestore (firestore.rules)');
    } finally {
      setSaving(false);
    }
  };

  // Обновление поля
  const handleFieldChange = (fieldName, value) => {
    setData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Добавление нового поля
  const handleAddField = (fieldType) => {
    // Определяем следующий номер для этого типа
    const existingFields = fields.filter(f => f.name.startsWith(fieldType));
    const nextNumber = existingFields.length + 1;
    const newFieldName = `${fieldType}${nextNumber}`;

    // Конфигурация по умолчанию для разных типов
    const defaultConfigs = {
      title: { type: 'text', label: `Заголовок #${nextNumber}` },
      description: { type: 'textarea', label: `Описание #${nextNumber}`, rows: 5 },
      image: { type: 'image', label: `Фото #${nextNumber}` },
      carousel: { type: 'image-array', label: `Карусель #${nextNumber}`, max: 10 },
      imageWithDescription: {
        type: 'image-with-description',
        label: `Фото с описанием #${nextNumber}`
      },
      imageGalleryWithDescription: {
        type: 'repeater',
        label: `Галерея с описаниями #${nextNumber}`,
        fields: {
          image: { type: 'image', label: 'Изображение' },
          description: { type: 'textarea', label: 'Описание', rows: 3 }
        }
      }
    };

    const newField = {
      id: newFieldName,
      name: newFieldName,
      config: defaultConfigs[fieldType] || { type: 'text', label: `Поле #${nextNumber}` }
    };

    // Инициализируем значение по умолчанию в зависимости от типа
    const defaultValues = {
      text: '',
      textarea: '',
      image: '',
      'image-array': [],
      'image-with-description': { image: '', description: '' },
      repeater: []
    };

    const defaultValue = defaultValues[newField.config.type] || '';

    // Обновляем данные с новым полем
    setData(prev => ({
      ...prev,
      [newFieldName]: defaultValue
    }));

    setFields([...fields, newField]);
    setShowFieldMenu(false);

    // Обновляем конфиг
    if (onUpdateConfig) {
      const updatedFields = {};
      [...fields, newField].forEach(f => {
        updatedFields[f.name] = f.config;
      });
      onUpdateConfig(collection, documentId, updatedFields);
    }
    
    // Сохраняем структуру полей в Firebase
    if (configManager) {
      const updatedFields = {};
      [...fields, newField].forEach(f => {
        updatedFields[f.name] = f.config;
      });
      configManager.updatePageFields(documentId, updatedFields);
    }

    // Показываем уведомление
    console.log(`✅ Поле "${newField.config.label}" добавлено и готово к редактированию`);
  };

  // Удаление поля
  const handleDeleteField = (fieldName) => {
    const updatedFields = fields.filter(f => f.name !== fieldName);
    setFields(updatedFields);

    // Удаляем данные поля
    const newData = { ...data };
    delete newData[fieldName];
    setData(newData);

    setDeleteConfirm(null);

    // Обновляем конфиг
    if (onUpdateConfig) {
      const updatedFieldsConfig = {};
      updatedFields.forEach(f => {
        updatedFieldsConfig[f.name] = f.config;
      });
      onUpdateConfig(collection, documentId, updatedFieldsConfig);
    }
    
    // Сохраняем структуру полей в Firebase
    if (configManager) {
      const updatedFieldsConfig = {};
      updatedFields.forEach(f => {
        updatedFieldsConfig[f.name] = f.config;
      });
      configManager.updatePageFields(documentId, updatedFieldsConfig);
    }
  };

  // Перемещение поля вверх
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const items = Array.from(fields);
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    setFields(items);

    // Обновляем конфиг
    if (onUpdateConfig) {
      const updatedFieldsConfig = {};
      items.forEach(f => {
        updatedFieldsConfig[f.name] = f.config;
      });
      onUpdateConfig(collection, documentId, updatedFieldsConfig);
    }
    
    // Сохраняем структуру полей в Firebase
    if (configManager) {
      const updatedFieldsConfig = {};
      items.forEach(f => {
        updatedFieldsConfig[f.name] = f.config;
      });
      configManager.updatePageFields(documentId, updatedFieldsConfig);
    }
  };

  // Перемещение поля вниз
  const handleMoveDown = (index) => {
    if (index === fields.length - 1) return;
    const items = Array.from(fields);
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    setFields(items);

    // Обновляем конфиг
    if (onUpdateConfig) {
      const updatedFieldsConfig = {};
      items.forEach(f => {
        updatedFieldsConfig[f.name] = f.config;
      });
      onUpdateConfig(collection, documentId, updatedFieldsConfig);
    }
    
    // Сохраняем структуру полей в Firebase
    if (configManager) {
      const updatedFieldsConfig = {};
      items.forEach(f => {
        updatedFieldsConfig[f.name] = f.config;
      });
      configManager.updatePageFields(documentId, updatedFieldsConfig);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Загрузка...</div>;
  }

  const fieldTypes = [
    { id: 'title', label: '📝 Заголовок', icon: '📝' },
    { id: 'description', label: '📄 Описание', icon: '📄' },
    { id: 'image', label: '🖼️ Фото', icon: '🖼️' },
    { id: 'carousel', label: '🎠 Карусель', icon: '🎠' },
    { id: 'imageWithDescription', label: '🖼️📝 Фото с описанием (одно)', icon: '🖼️' },
    { id: 'imageGalleryWithDescription', label: '🖼️📝 Галерея с описаниями', icon: '🎨' }
  ];

  return (
    <div>
      {/* Шапка */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <button
            onClick={onBack}
            style={{
              padding: '10px 20px',
              background: 'rgba(100, 116, 139, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(100, 116, 139, 0.3)',
              color: '#64748b',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '12px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            ← Назад
          </button>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
            Редактирование: {collection} / {documentId}
          </h3>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '14px 32px',
            background: 'rgba(99, 102, 241, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#6366f1',
            borderRadius: '10px',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            opacity: saving ? 0.6 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          {saving ? 'Сохранение...' : '💾 Сохранить'}
        </button>
      </div>

      {/* Кнопка добавления поля */}
      <div style={{ marginBottom: '24px', position: 'relative' }}>
        <button
          onClick={() => setShowFieldMenu(!showFieldMenu)}
          style={{
            padding: '12px 24px',
            background: 'rgba(16, 185, 129, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          + Добавить поле ▼
        </button>

        {/* Выпадающее меню */}
        {showFieldMenu && (
          <div style={{
            position: 'absolute',
            top: '50px',
            left: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minWidth: '250px'
          }}>
            {fieldTypes.map(type => (
              <div
                key={type.id}
                onClick={() => handleAddField(type.id)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                {type.icon} {type.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Поля */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '16px',
              position: 'relative'
            }}
          >
            {/* Заголовок поля с кнопками */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                {field.config.label || field.name}
              </label>

              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Кнопки перемещения */}
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  style={{
                    padding: '6px 10px',
                    background: index === 0 ? 'rgba(100, 116, 139, 0.1)' : 'rgba(100, 116, 139, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(100, 116, 139, 0.2)',
                    color: index === 0 ? '#cbd5e1' : '#64748b',
                    borderRadius: '4px',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '16px'
                  }}
                  title="Переместить вверх"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === fields.length - 1}
                  style={{
                    padding: '6px 10px',
                    background: index === fields.length - 1 ? 'rgba(100, 116, 139, 0.1)' : 'rgba(100, 116, 139, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(100, 116, 139, 0.2)',
                    color: index === fields.length - 1 ? '#cbd5e1' : '#64748b',
                    borderRadius: '4px',
                    cursor: index === fields.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: '16px'
                  }}
                  title="Переместить вниз"
                >
                  ↓
                </button>
                <button
                  onClick={() => setDeleteConfirm(field.name)}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>

            {/* Поле */}
            <FieldRenderer
              type={field.config.type}
              value={data[field.name]}
              onChange={(value) => handleFieldChange(field.name, value)}
              config={field.config}
              crudManager={crudManager}
            />
          </div>
        ))}
      </div>

      {/* Модальное окно подтверждения удаления */}
      {deleteConfirm && (
        <div style={{
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
        }} onClick={() => setDeleteConfirm(null)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '400px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Удалить поле?</h3>
            <p style={{ marginBottom: '24px', color: '#666' }}>
              Вы уверены, что хотите удалить поле "{fields.find(f => f.name === deleteConfirm)?.config.label}"?
              Все данные этого поля будут потеряны.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(100, 116, 139, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(100, 116, 139, 0.3)',
                  color: '#64748b',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Отмена
              </button>
              <button
                onClick={() => handleDeleteField(deleteConfirm)}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
