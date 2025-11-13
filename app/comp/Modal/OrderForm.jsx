"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './orderForm.module.css';

export default function OrderForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    card: '',
    comments: ''
  });

  const products = [
    {
      title: 'Strawberry Basket',
      plant: 'Plant',
      image: '/modal/strawberry.png',
      bg: 'rgba(248, 118, 107, 1)'
    },
    {
      title: 'Apple Basket',
      plant: 'Plant',
      image: '/modal/IMG_1.png',
      bg: 'rgba(237, 210, 81, 1)'
    },
    {
      title: 'Fruits Basket',
      plant: 'Plant',
      image: '/modal/unsplash.png',
      bg: 'rgba(157, 194, 98, 1)'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order submitted:', formData);
    alert('Thank you for your order!');
  };

  return (
    <div className={styles.orderContainer}>
      <h2 className={styles.title}>Your Order</h2>
      
      <div className={styles.cards}>
        {products.map((product, index) => (
          <div 
            key={index} 
            className={`${styles.card} ${
              index === 2 ? styles.cardThird : ''
            } ${
              index === 1 ? styles.cardSecond : ''
            }`}
            style={{ background: product.bg }}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{product.title}</h3>
              <p className={styles.cardPlant}>{product.plant}</p>
            </div>
            <div className={styles.cardImageWrapper}>
              <Image 
                src={product.image}
                alt={product.title}
                width={229}
                height={196}
                className={styles.cardImage}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter full name..."
            className={styles.input}
            required
          />
          
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email..."
            className={styles.input}
            required
          />
          
          <input
            type="text"
            name="card"
            value={formData.card}
            onChange={handleChange}
            placeholder="Enter card..."
            className={styles.input}
            required
          />
          
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Enter comments..."
            className={styles.textarea}
          />
          
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>

        <div className={styles.imageSection}>
          <Image 
            src="/modal/image_1.png"
            alt="Order"
            width={471}
            height={458}
            className={styles.sideImage}
          />
        </div>
      </div>
    </div>
  );
}
