import React from 'react';

/**
 * Текстовое поле
 */
export function TextField({ value, onChange, config }) {
  const inputStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={config.placeholder || ''}
      style={inputStyle}
      onFocus={(e) => e.target.style.borderColor = '#1976D2'}
      onBlur={(e) => e.target.style.borderColor = '#ddd'}
    />
  );
}
