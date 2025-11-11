/**
 * Пример использования в Next.js проекте
 */

import { AdminPanel, FirebaseAdapter, CloudinaryAdapter, useAdminContent } from '@universal-admin/core';

// 1. Конфигурация
const adminConfig = {
  collections: {
    pages: {
      home: {
        title: { 
          type: 'text', 
          label: 'Заголовок',
          placeholder: 'Введите заголовок страницы'
        },
        subtitle: { 
          type: 'text', 
          label: 'Подзаголовок' 
        },
        description: { 
          type: 'textarea', 
          label: 'Описание',
          rows: 5
        },
        mainImage: {
          type: 'image',
          label: 'Главное изображение'
        },
        carousel: { 
          type: 'image-array', 
          label: 'Карусель изображений',
          max: 10
        },
        features: {
          type: 'repeater',
          label: 'Преимущества',
          fields: {
            title: { type: 'text', label: 'Название' },
            image: { type: 'image', label: 'Изображение' },
            description: { type: 'textarea', label: 'Описание' }
          }
        }
      },
      about: {
        title: { type: 'text', label: 'Заголовок' },
        content: { type: 'textarea', label: 'Контент' }
      }
    },
    products: {
      list: {
        items: {
          type: 'repeater',
          label: 'Товары',
          fields: {
            name: { type: 'text', label: 'Название' },
            price: { type: 'text', label: 'Цена' },
            image: { type: 'image', label: 'Фото' }
          }
        }
      }
    }
  }
};

// 2. Инициализация адаптеров
const firebaseAdapter = new FirebaseAdapter({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
});

const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
});

// 3. Использование в компоненте
export default function HomePage() {
  return (
    <>
      {/* Админ-панель */}
      <AdminPanel
        config={adminConfig}
        database={firebaseAdapter}
        storage={cloudinaryAdapter}
        theme={{
          primaryColor: '#1976D2'
        }}
      />

      {/* Контент страницы */}
      <HomeContent />
    </>
  );
}

// 4. Компонент с контентом
function HomeContent() {
  const { data, loading } = useAdminContent(
    new CrudManager({
      database: firebaseAdapter,
      storage: cloudinaryAdapter
    }),
    'pages',
    'home'
  );

  if (loading) return <div>Загрузка...</div>;

  return (
    <main>
      <h1>{data?.title}</h1>
      <h2>{data?.subtitle}</h2>
      <p>{data?.description}</p>

      {/* Карусель */}
      {data?.carousel && (
        <div className="carousel">
          {data.carousel.map((img, i) => (
            <img key={i} src={img} alt={`Slide ${i}`} />
          ))}
        </div>
      )}

      {/* Преимущества */}
      {data?.features && (
        <div className="features">
          {data.features.map((feat, i) => (
            <div key={i}>
              <img src={feat.image} alt={feat.title} />
              <h3>{feat.title}</h3>
              <p>{feat.description}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
