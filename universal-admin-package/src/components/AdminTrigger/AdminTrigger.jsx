import React from 'react';
import './AdminTrigger.css';

/**
 * Кнопка для вызова админ-панели
 */
export function AdminTrigger({ onClick, theme = {} }) {
  // Применяем кастомный цвет через CSS переменную
  const style = theme.primaryColor 
    ? { '--admin-primary-color': theme.primaryColor } 
    : {};

  return (
    <button
      onClick={onClick}
      className="admin-trigger"
      style={style}
    >
      ⚙️ Админ-панель
    </button>
  );
}
