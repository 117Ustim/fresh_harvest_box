"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './comp2.module.css';
import Image from 'next/image';
import siteData from "../../../database.example"
import { useContent } from '../../../universal-admin-package/src/index';


export default function Comp2({ openModal }) {

// Получаем данные из Firebase через useContent или через database.example
  const comp2Data = useContent('pages.comp2.hero') || siteData.comp2.hero;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const containerRef = useRef(null);
  const titleIntervalRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Сбрасываем состояния
            setIsVisible(false);
            setDisplayedTitle('');
            setShowDescription(false);
            
            // Очищаем предыдущий интервал если есть
            if (titleIntervalRef.current) {
              clearInterval(titleIntervalRef.current);
            }
            
            // Небольшая задержка перед началом анимации
            setTimeout(() => {
              setIsVisible(true);
              
              // Анимация появления заголовка по буквам
              const title = comp2Data.title;
              let currentIndex = 0;
              
              titleIntervalRef.current = setInterval(() => {
                if (currentIndex <= title.length) {
                  setDisplayedTitle(title.slice(0, currentIndex));
                  currentIndex++;
                } else {
                  clearInterval(titleIntervalRef.current);
                  // Показываем описание после завершения анимации заголовка
                  setTimeout(() => {
                    setShowDescription(true);
                  }, 200);
                }
              }, 100);
            }, 100);
          }
        });
      },
      { threshold: 0.2 } // Анимация запускается когда 20% компонента видно
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      if (titleIntervalRef.current) {
        clearInterval(titleIntervalRef.current);
      }
    };
  }, [comp2Data.title]);

  const products = [
    { title: 'Strawberry', plant: 'Plant', price: 100, bg: 'rgba(248, 118, 107, 1)', image: '/product/image_strawberry.png' },
    { title: 'Banana', plant: 'Plant', price: 80, bg: 'rgba(237, 210, 81, 1)', image: '/product/image_banana.png' },
    { title: 'Watermelon', plant: 'Plant', price: 40, bg: 'rgba(157, 194, 98, 1)', image: '/product/image_watermelon.png' },
    { title: 'Lime', plant: 'Plant', price: 60, bg: 'rgba(191, 214, 99, 1)', image: '/product/image_lime.png' },
    { title: 'Apple', plant: 'Plant', price: 50, bg: 'rgba(233, 63, 41, 1)', image: '/product/image_apple.png' },
    { title: 'Peach', plant: 'Plant', price: 80, bg: 'rgba(219, 79, 75, 1)', image: '/product/image_peach.png' },
    { title: 'Plums', plant: 'Plant', price: 40, bg: 'rgba(155, 83, 102, 1)', image: '/product/image_plums.png' },
    { title: 'Orange', plant: 'Plant', price: 60, bg: 'rgba(244, 127, 76, 1)', image: '/product/image_orange.png' },
    { title: 'Kiwi', plant: 'Plant', price: 90, bg: 'rgba(152, 179, 126, 1)', image: '/product/image_kiwi.png' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
        <h1 className={styles.title}>{displayedTitle}</h1>
        <p className={`${styles.description} ${showDescription ? styles.descriptionVisible : ''}`}>
          {comp2Data.description}
        </p>

        <div className={styles.cardsWrapper}>
          <div className={styles.cardsGrid}>
            {products.map((product, index) => (
              <div 
                key={index} 
                className={`${styles.card} ${isVisible ? styles.cardVisible : ''}`}
                style={{ 
                  backgroundColor: product.bg,
                  animationDelay: `${0.1 * index}s`
                }}
              >
                <h2 className={styles.cardTitle}>{product.title}</h2>
                <p className={styles.cardPlant}>{product.plant}</p>
                <div className={styles.imageWrapper}>
                  <Image 
                    src={product.image} 
                    alt={product.title}
                    width={295}
                    height={251}
                    className={styles.cardImage}
                  />
                </div>
                <button className={styles.cardButton} disabled>
                  <span className={styles.buttonText}>{product.price} UAH / kg</span>
                </button>
              </div>
            ))}
          </div>

          <div className={styles.carousel}>
            <div className={styles.carouselTrack} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {products.map((product, index) => (
                <div 
                  key={index} 
                  className={`${styles.carouselCard} ${isVisible ? styles.cardVisible : ''}`}
                  style={{ backgroundColor: product.bg }}
                >
                  <h2 className={styles.cardTitle}>{product.title}</h2>
                  <p className={styles.cardPlant}>{product.plant}</p>
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={product.image} 
                      alt={product.title}
                      width={295}
                      height={251}
                      className={styles.cardImage}
                    />
                  </div>
                  <button className={styles.cardButton} disabled>
                    <span className={styles.buttonText}>{product.price} UAH / kg</span>
                  </button>
                </div>
              ))}
            </div>
            <button className={styles.carouselButton} onClick={prevSlide}>
              ←
            </button>
            <button className={styles.carouselButton} onClick={nextSlide}>
              →
            </button>
          </div>
        </div>

        <button 
          onClick={() => {
            console.log('orderCircle clicked');
            openModal();
          }} 
          className={styles.orderCircle}
        >
          <Image 
            src="/comp_1/Vector.png" 
            alt="Order"
            width={15}
            height={15}
            className={styles.orderIcon}
          />
          <span className={styles.orderText}>ORDER</span>
        </button>
      </div>
    </div>
  );
}