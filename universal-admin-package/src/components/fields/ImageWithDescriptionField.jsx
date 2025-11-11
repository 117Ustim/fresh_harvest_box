import React from 'react';
import { FieldRenderer } from './FieldRenderer.jsx';

/**
 * Поле "Фото с описанием" - это repeater с изображением и текстом
 * Но можно сделать упрощённую версию для одного фото
 */
export function ImageWithDescriptionField({ value, onChange, config, crudManager }) {
  const data = value || { image: '', description: '' };

  const handleChange = (field, val) => {
    onChange({
      ...data,
      [field]: val
    });
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{marginBottom: '16px'}}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#555'
        }}>
          Изображение
        </label>
        <FieldRenderer
          type="image"
          value={data.image}
          onChange={(val) => handleChange('image', val)}
          config={{}}
          crudManager={crudManager}
        />
      </div>

      <div>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#555'
        }}>
          Описание
        </label>
        <FieldRenderer
          type="textarea"
          value={data.description}
          onChange={(val) => handleChange('description', val)}
          config={{ rows: 3 }}
          crudManager={crudManager}
        />
      </div>
    </div>
  );
}
