'use client'
import React, { useState } from 'react';
import './CreatePageModal.css';

/**
 * Модальное окно для создания новой страницы
 */
export function CreatePageModal({ onClose, onCreatePage, theme }) {
  const [pageName, setPageName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    // Валидация
    if (!pageName.trim()) {
      setError('Введите название страницы');
      return;
    }

    // Проверка на допустимые символы (только латиница, цифры, дефис, подчеркивание)
    if (!/^[a-z0-9_-]+$/i.test(pageName)) {
      setError('Используйте только латинские буквы, цифры, дефис и подчеркивание');
      return;
    }

    onCreatePage(pageName.toLowerCase());
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10001
  };

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '20px'}}>
          Создать новую страницу
        </h3>

        <div style={{marginBottom: '20px'}}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
          }}>
            Название страницы (ID)
          </label>
          <input
            type="text"
            value={pageName}
            onChange={(e) => {
              setPageName(e.target.value);
              setError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="например: about, contacts, services"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: error ? '2px solid #f44336' : '1px solid #ddd',
              borderRadius: '6px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            autoFocus
          />
          {error && (
            <div style={{
              marginTop: '8px',
              color: '#f44336',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}
          <div style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#666'
          }}>
            Используйте латинские буквы в нижнем регистре
          </div>
        </div>

        <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f5f5f5',
              color: '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Отмена
          </button>
          <button
            onClick={handleCreate}
            style={{
              padding: '10px 20px',
              backgroundColor: theme.primaryColor || '#1976D2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}
