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
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10001
  };

  const modalStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e2e8f0'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{marginTop: 0, marginBottom: '24px', fontSize: '22px', fontWeight: '600', color: '#1e293b'}}>
          Создать новую страницу
        </h3>

        <div style={{marginBottom: '20px'}}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1e293b'
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
              padding: '14px 18px',
              fontSize: '15px',
              border: error ? '2px solid #ef4444' : '1px solid #e2e8f0',
              borderRadius: '10px',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#ffffff',
              color: '#1e293b',
              transition: 'all 0.2s ease'
            }}
            autoFocus
          />
          {error && (
            <div style={{
              marginTop: '8px',
              color: '#ef4444',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}
          <div style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#64748b'
          }}>
            Используйте латинские буквы в нижнем регистре
          </div>
        </div>

        <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              background: 'rgba(100, 116, 139, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(100, 116, 139, 0.3)',
              color: '#64748b',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            Отмена
          </button>
          <button
            onClick={handleCreate}
            style={{
              padding: '12px 24px',
              background: 'rgba(99, 102, 241, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#6366f1',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}
