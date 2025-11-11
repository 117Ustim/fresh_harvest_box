# @universal-admin/core

🚀 Универсальная админ-панель для любого сайта. Подключается за 5 минут!

## ✨ Возможности

- ✅ **Универсальность** - работает с Firebase, REST API, любым бэкендом
- ✅ **Конфигурация через JSON** - описываешь структуру, админка генерируется автоматически
- ✅ **Загрузка файлов** - Cloudinary, AWS S3, любой storage
- ✅ **Типы полей** - text, textarea, image, image-array, repeater
- ✅ **Реактивные обновления** - изменения отображаются мгновенно
- ✅ **Простая интеграция** - один компонент, минимум кода
- ✅ **Кастомизация** - темы, стили, свои типы полей

## 📦 Установка

```bash
npm install @universal-admin/core
```

Или локально (для разработки):
```bash
# Скопируйте папку universal-admin-package в ваш проект
```

## 🚀 Быстрый старт

### 1. Создайте конфигурацию

```javascript
// admin.config.js
export const adminConfig = {
  collections: {
    pages: {
      home: {
        title: { type: 'text', label: 'Заголовок' },
        subtitle: { type: 'text', label: 'Подзаголовок' },
        description: { type: 'textarea', label: 'Описание' },
        carousel: { type: 'image-array', label: 'Карусель' },
        features: {
          type: 'repeater',
          label: 'Преимущества',
          fields: {
            title: { type: 'text', label: 'Название' },
            image: { type: 'image', label: 'Изображение' }
          }
        }
      }
    }
  }
};
```

### 2. Инициализируйте адаптеры

```javascript
// lib/admin-adapters.js
import { FirebaseAdapter, CloudinaryAdapter } from '@universal-admin/core';

export const firebaseAdapter = new FirebaseAdapter({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... остальные параметры
});

export const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: 'your-cloud-name',
  uploadPreset: 'your-preset'
});
```

### 3. Добавьте на страницу

```javascript
// app/page.js
'use client';

import { AdminPanel } from '@universal-admin/core';
import { adminConfig } from './admin.config';
import { firebaseAdapter, cloudinaryAdapter } from './lib/admin-adapters';

export default function HomePage() {
  return (
    <>
      <AdminPanel
        config={adminConfig}
        database={firebaseAdapter}
        storage={cloudinaryAdapter}
      />
      
      <YourContent />
    </>
  );
}
```

### 4. Используйте данные

```javascript
import { useAdminContent, CrudManager } from '@universal-admin/core';

const crudManager = new CrudManager({
  database: firebaseAdapter,
  storage: cloudinaryAdapter
});

function YourContent() {
  const { data, loading } = useAdminContent(crudManager, 'pages', 'home');

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>{data?.title}</h1>
      <p>{data?.description}</p>
      
      {data?.carousel?.map((img, i) => (
        <img key={i} src={img} alt={`Slide ${i}`} />
      ))}
    </div>
  );
}
```

## 📚 Типы полей

### text
```javascript
{ type: 'text', label: 'Заголовок', placeholder: 'Введите текст' }
```

### textarea
```javascript
{ type: 'textarea', label: 'Описание', rows: 5 }
```

### image
```javascript
{ type: 'image', label: 'Главное фото' }
```

### image-array
```javascript
{ type: 'image-array', label: 'Галерея', max: 10 }
```

### repeater
```javascript
{
  type: 'repeater',
  label: 'Список элементов',
  fields: {
    title: { type: 'text', label: 'Название' },
    description: { type: 'textarea', label: 'Описание' },
    image: { type: 'image', label: 'Изображение' }
  }
}
```

## 🔌 Адаптеры

### Firebase
```javascript
import { FirebaseAdapter } from '@universal-admin/core';

const adapter = new FirebaseAdapter({
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
});
```

### REST API
```javascript
import { RestApiAdapter } from '@universal-admin/core';

const adapter = new RestApiAdapter({
  baseUrl: 'https://api.yoursite.com',
  authToken: 'your-token',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Cloudinary Storage
```javascript
import { CloudinaryAdapter } from '@universal-admin/core';

const storage = new CloudinaryAdapter({
  cloudName: 'your-cloud-name',
  uploadPreset: 'your-preset'
});
```

## 🎨 Кастомизация

```javascript
<AdminPanel
  config={adminConfig}
  database={adapter}
  storage={storage}
  theme={{
    primaryColor: '#4CAF50'
  }}
/>
```

## 🔐 Безопасность

По умолчанию используется простой пароль `admin123`. Для продакшена:

1. Используйте Firebase Authentication
2. Настройте Firestore Security Rules
3. Добавьте роли пользователей

## 📖 Примеры

Смотрите папку `examples/`:
- `nextjs-example.jsx` - Полный пример для Next.js
- `rest-api-example.jsx` - Использование с REST API

## 🛠️ Разработка

```bash
# Клонируйте репозиторий
git clone https://github.com/yourusername/universal-admin

# Установите зависимости
npm install

# Запустите dev сервер
npm run dev
```

## 📝 Лицензия

MIT

## 🤝 Вклад

Pull requests приветствуются!

## 📧 Контакты

Вопросы? Создайте issue на GitHub.
