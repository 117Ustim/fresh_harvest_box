import React, { useState } from 'react';

/**
 * Поле для загрузки массива изображений (галерея/карусель)
 */
export function ImageArrayField({ value, onChange, config, crudManager }) {
  const [uploading, setUploading] = useState(false);
  const images = value || [];

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await crudManager.uploadFile(file);
      onChange([...images, url]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка загрузки: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    console.log('🗑️ ImageArrayField - удаление изображения:', index);
    console.log('🗑️ ImageArrayField - было изображений:', images.length);
    console.log('🗑️ ImageArrayField - стало изображений:', newImages.length);
    console.log('🗑️ ImageArrayField - новый массив:', newImages);
    onChange(newImages);
  };

  const handleReorder = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
  };

  const imageContainerStyle = {
    position: 'relative',
    aspectRatio: '1',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #ddd'
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const removeButtonStyle = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
    <div>
      {images.length > 0 && (
        <div style={gridStyle}>
          {images.map((url, index) => (
            <div key={index} style={imageContainerStyle}>
              <img src={url} alt={`Image ${index + 1}`} style={imageStyle} />
              <button
                onClick={() => handleRemove(index)}
                style={removeButtonStyle}
                title="Удалить"
              >
                ×
              </button>
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        style={{display: 'none'}}
        id="image-array-upload"
      />
      <label htmlFor="image-array-upload" style={uploadButtonStyle}>
        {uploading ? 'Загрузка...' : '📁 Добавить изображение'}
      </label>

      {config.max && (
        <div style={{marginTop: '8px', fontSize: '12px', color: '#666'}}>
          Загружено: {images.length} / {config.max}
        </div>
      )}
    </div>
  );
}
