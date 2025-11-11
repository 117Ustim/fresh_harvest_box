import React from 'react';

/**
 * Многострочное текстовое поле
 */
export function TextAreaField({ value, onChange, config }) {
  const textareaStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit'
  };

  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={config.placeholder || ''}
      rows={config.rows || 5}
      style={textareaStyle}
      onFocus={(e) => e.target.style.borderColor = '#1976D2'}
      onBlur={(e) => e.target.style.borderColor = '#ddd'}
    />
  );
}
