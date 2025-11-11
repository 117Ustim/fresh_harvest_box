/**
 * ПРИМЕР: Универсальная интеграция админ-панели
 * Подходит для любого Next.js или React сайта
 */

import { AdminProvider, AdminPanel, useContent } from '@universal-admin/core';
import { FirebaseAdapter, CloudinaryAdapter } from '@universal-admin/core';

// ============================================
// ШАГ 1: Создайте конфигурацию
// ============================================

const adminConfig = {
  collections: {
    pages: {
      home: {
        // Секция "Главный экран"
        hero: {
          _label: 'Главный экран',
          _description: 'Первый экран который видят посетители',
          title: { 
            type: 'text', 
            label: 'Заголовок',
            defaultValue: 'Добро пожаловать!'
          },
          subtitle: { 
            type: 'text', 
            label: 'Подзаголовок',
            defaultValue: 'Это наш сайт'
          },
          background: { 
            type: 'image', 
            label: 'Фоновое изображение' 
          }
        },
        
        // Секция "О нас"
        about: {
          _label: 'О нас',
          title: { type: 'text', label: 'Заголовок' },
          text: { type: 'textarea', label: 'Текст', rows: 5 },
          photo: { type: 'image', label: 'Фотография' }
        },
        
        // Секция "Галерея"
        gallery: {
          _label: 'Галерея',
          title: { type: 'text', label: 'Заголовок' },
          images: { type: 'image-array', label: 'Изображения', max: 20 }
        }
      },
      
      about: {
        // Секция "Информация"
        info: {
          _label: 'Информация',
          title: { type: 'text', label: 'Заголовок' },
          description: { type: 'textarea', label: 'Описание' }
        },
        
        // Секция "Команда"
        team: {
          _label: 'Наша команда',
          title: { type: 'text', label: 'Заголовок' },
          members: {
            type: 'image-gallery-with-description',
            label: 'Члены команды'
          }
        }
      }
    }
  }
};

// ============================================
// ШАГ 2: Настройте адаптеры
// ============================================

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

// ============================================
// ШАГ 3: Оберните приложение в Provider
// ============================================

// Next.js: pages/_app.js
export default function MyApp({ Component, pageProps }) {
  return (
    <AdminProvider 
      config={adminConfig}
      database={firebaseAdapter}
      storage={cloudinaryAdapter}
    >
      {/* Админка - показывается на всех страницах */}
      <AdminPanel theme={{ primaryColor: '#1976D2' }} />
      
      {/* Ваше приложение */}
      <Component {...pageProps} />
    </AdminProvider>
  );
}

// React: App.js
function App() {
  return (
    <AdminProvider 
      config={adminConfig}
      database={firebaseAdapter}
      storage={cloudinaryAdapter}
    >
      <AdminPanel />
      <HomePage />
    </AdminProvider>
  );
}

// ============================================
// ШАГ 4: Используйте контент на страницах
// ============================================

// СПОСОБ 1: Получить всю секцию
function HeroSection() {
  const hero = useContent('pages.home.hero');
  
  if (!hero) return <div>Загрузка...</div>;
  
  return (
    <section style={{ 
      backgroundImage: `url(${hero.background})`,
      padding: '100px 20px',
      textAlign: 'center'
    }}>
      <h1>{hero.title}</h1>
      <h2>{hero.subtitle}</h2>
    </section>
  );
}

// СПОСОБ 2: Получить отдельные поля
function AboutSection() {
  const title = useContent('pages.home.about.title');
  const text = useContent('pages.home.about.text');
  const photo = useContent('pages.home.about.photo');
  
  return (
    <section>
      <h2>{title}</h2>
      <img src={photo} alt="About" />
      <p>{text}</p>
    </section>
  );
}

// СПОСОБ 3: Получить всю страницу
function HomePage() {
  const content = useContent('pages.home');
  
  if (!content) return <div>Загрузка...</div>;
  
  return (
    <main>
      {/* Hero секция */}
      <section>
        <h1>{content.hero.title}</h1>
        <h2>{content.hero.subtitle}</h2>
      </section>
      
      {/* About секция */}
      <section>
        <h2>{content.about.title}</h2>
        <p>{content.about.text}</p>
        <img src={content.about.photo} alt="About" />
      </section>
      
      {/* Gallery секция */}
      <section>
        <h2>{content.gallery.title}</h2>
        <div className="gallery">
          {content.gallery.images?.map((img, i) => (
            <img key={i} src={img} alt={`Gallery ${i}`} />
          ))}
        </div>
      </section>
    </main>
  );
}

// ============================================
// АЛЬТЕРНАТИВА: Без Provider (initAdmin)
// ============================================

import { initAdmin } from '@universal-admin/core';

// В _app.js или index.js (один раз)
initAdmin({
  config: adminConfig,
  database: firebaseAdapter,
  storage: cloudinaryAdapter
});

// Админка где угодно
function Header() {
  return (
    <header>
      <nav>...</nav>
      <AdminPanel />
    </header>
  );
}

// Контент работает так же
function Page() {
  const content = useContent('pages.home');
  return <div>{content.hero.title}</div>;
}

// ============================================
// ПРОИЗВОДИТЕЛЬНОСТЬ: Без подписки
// ============================================

// Если контент статичный (не меняется часто)
function StaticContent() {
  const title = useContent('pages.home.hero.title', {
    subscribe: false  // Загружается один раз, без реактивности
  });
  
  return <h1>{title}</h1>;
}

// ============================================
// ЗНАЧЕНИЯ ПО УМОЛЧАНИЮ
// ============================================

function SafeContent() {
  const title = useContent('pages.home.hero.title', {
    defaultValue: 'Заголовок по умолчанию'
  });
  
  // Если в Firebase нет данных - покажет default
  return <h1>{title}</h1>;
}
