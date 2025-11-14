"use client";
import { useState } from 'react';
import styles from './comp3.module.css';
import Image from 'next/image';

// import { useContent } from '../../../universal-admin-package/src/index';

export default function Comp3() {
    
  // const comp3Data = useContent('pages.history.hero') || {};
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Здесь логика отправки email
    console.log('Email submitted:', email);
    // Пример: await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
    setEmail('');
  };

  return (
    <div className={styles.container}> 
      <h1 className={styles.title}>Fresh Harvest Box has got you covered</h1>
      <div className={styles.imagesWrapper}>
        <Image 
          src="/comp_3/Rec_1.png" 
          alt="Fresh Harvest Box" 
          width={792} 
          height={502}
          className={styles.imageLeft}
        />
        <Image 
          src="/comp_3/Rec_2.png" 
          alt="Fresh Harvest Box" 
          width={400} 
          height={502}
          className={styles.imageRight}
        />
      </div>
      <p className={styles.description}>
        Our boxes are packed with delicious, nutritious fruits and vegetables, perfect for anyone looking to eat healthier or support local farmers. Order your box today and start enjoying the best that nature has to offer!
      </p>
      <form className={styles.emailForm} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email..."
            className={styles.emailInput}
            required
          />
          <button type="submit" className={styles.submitButton}>
            send
          </button>
        </div>
      </form>
    </div>
  )
};