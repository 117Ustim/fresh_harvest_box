"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './comp2.module.css';
import Image from 'next/image';

export default function Comp2() {
  const [currentSlide, setCurrentSlide] = useState(0);

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
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>ORGANIC FRUITS</h1>
        <p className={styles.description}>
          Our organic fruits are hand-picked from local farms and delivered straight to your doorstep, 
          ensuring that you get the freshest and most nutritious produce possible. We offer a wide 
          selection of organic fruits grown without the use of harmful pesticides or chemicals.
        </p>

        <div className={styles.cardsWrapper}>
          <div className={styles.cardsGrid}>
            {products.map((product, index) => (
              <div 
                key={index} 
                className={styles.card}
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

          <div className={styles.carousel}>
            <div className={styles.carouselTrack} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {products.map((product, index) => (
                <div 
                  key={index} 
                  className={styles.carouselCard}
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

        <Link href="#" className={styles.orderCircle}>
          <Image 
            src="/comp_1/Vector.png" 
            alt="Order"
            width={15}
            height={15}
            className={styles.orderIcon}
          />
          <span className={styles.orderText}>ORDER</span>
        </Link>
      </div>
    </div>
  );
}