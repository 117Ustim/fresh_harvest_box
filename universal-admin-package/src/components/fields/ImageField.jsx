import React, { useState } from 'react';

/**
 * Поле для загрузки одного изображения
 */
export function ImageField({ value, onChange, config, crudManager }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await crudManager.uploadFile(file);
      onChange(url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка загрузки: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const containerStyle = {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start'
  };

  const previewStyle = {
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid #ddd'
  };

  const uploadButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#1976D2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: uploading ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    opacity: uploading ? 0.6 : 1
  };

  return (
    <div style={containerStyle}>
      {value && (
        <img src={value} alt="Preview" style={previewStyle} />
      )}
      
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{display: 'none'}}
          id="image-upload"
        />
        <label htmlFor="image-upload" style={uploadButtonStyle}>
          {uploading ? 'Загрузка...' : '📁 Выбрать изображение'}
        </label>
        
        {value && (
          <button
            onClick={() => onChange('')}
            style={{
              marginLeft: '8px',
              padding: '12px 24px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            🗑️ Удалить
          </button>
        )}
      </div>
    </div>
  );
}
