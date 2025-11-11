import React from 'react';
import { FieldRenderer } from './FieldRenderer.jsx';

/**
 * Повторяющееся поле (например, список преимуществ)
 */
export function RepeaterField({ value, onChange, config, crudManager }) {
  const items = value || [];

  const handleAdd = () => {
    const newItem = {};
    // Инициализируем поля значениями по умолчанию
    Object.keys(config.fields || {}).forEach(fieldName => {
      newItem[fieldName] = '';
    });
    onChange([...items, newItem]);
  };

  const handleRemove = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const handleItemChange = (index, fieldName, fieldValue) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [fieldName]: fieldValue
    };
    onChange(newItems);
  };

  const itemStyle = {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '16px',
    position: 'relative'
  };

  const removeButtonStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  };

  const addButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} style={itemStyle}>
          <button
            onClick={() => handleRemove(index)}
            style={removeButtonStyle}
          >
            🗑️ Удалить
          </button>

          <div style={{marginBottom: '8px', fontWeight: '600', color: '#666'}}>
            Элемент #{index + 1}
          </div>

          {Object.entries(config.fields || {}).map(([fieldName, fieldConfig]) => (
            <div key={fieldName} style={{marginBottom: '16px'}}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#555'
              }}>
                {fieldConfig.label || fieldName}
              </label>
              
              <FieldRenderer
                type={fieldConfig.type}
                value={item[fieldName]}
                onChange={(val) => handleItemChange(index, fieldName, val)}
                config={fieldConfig}
                crudManager={crudManager}
              />
            </div>
          ))}
        </div>
      ))}

      <button onClick={handleAdd} style={addButtonStyle}>
        ➕ Добавить элемент
      </button>
    </div>
  );
}
