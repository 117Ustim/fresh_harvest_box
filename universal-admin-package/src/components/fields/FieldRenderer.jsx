import React from 'react';
import { TextField } from './TextField.jsx';
import { TextAreaField } from './TextAreaField.jsx';
import { ImageField } from './ImageField.jsx';
import { ImageArrayField } from './ImageArrayField.jsx';
import { RepeaterField } from './RepeaterField.jsx';
import { ImageWithDescriptionField } from './ImageWithDescriptionField.jsx';

/**
 * Рендерит поле в зависимости от типа
 */
export function FieldRenderer({ type, value, onChange, config, crudManager }) {
  const fieldProps = {
    value,
    onChange,
    config,
    crudManager
  };

  switch (type) {
    case 'text':
      return <TextField {...fieldProps} />;
    
    case 'textarea':
      return <TextAreaField {...fieldProps} />;
    
    case 'image':
      return <ImageField {...fieldProps} />;
    
    case 'image-array':
      return <ImageArrayField {...fieldProps} />;
    
    case 'image-with-description':
      return <ImageWithDescriptionField {...fieldProps} />;
    
    case 'image-gallery-with-description':
      // Это массив объектов с image/icon и description
      return <RepeaterField {...fieldProps} />;
    
    case 'repeater':
      return <RepeaterField {...fieldProps} />;
    
    default:
      return <TextField {...fieldProps} />;
  }
}
