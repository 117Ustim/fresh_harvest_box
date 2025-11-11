/**
 * Пример использования с REST API
 */

import { AdminPanel, RestApiAdapter } from '@universal-admin/core';

// Конфигурация для REST API
const adminConfig = {
  collections: {
    pages: {
      home: {
        title: { type: 'text', label: 'Заголовок' },
        content: { type: 'textarea', label: 'Контент' }
      }
    }
  }
};

// REST API адаптер
const restAdapter = new RestApiAdapter({
  baseUrl: 'https://api.yoursite.com',
  authToken: 'your-auth-token', // Опционально
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value'
  }
});

// Использование
export default function App() {
  return (
    <AdminPanel
      config={adminConfig}
      database={restAdapter}
      theme={{
        primaryColor: '#4CAF50'
      }}
    />
  );
}

/**
 * Ваш REST API должен поддерживать следующие эндпоинты:
 * 
 * GET    /pages/home          - Получить документ
 * PUT    /pages/home          - Обновить документ
 * POST   /pages/home          - Создать документ
 * DELETE /pages/home          - Удалить документ
 * GET    /pages               - Получить все документы коллекции
 */
