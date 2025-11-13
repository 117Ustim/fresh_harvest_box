"use client";

import { useState } from 'react';
import styles from './contactForm.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Здесь можно добавить логику отправки формы
    alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Свяжитесь с нами</h2>
      <p className={styles.subtitle}>Заполните форму, и мы ответим вам в ближайшее время</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Имя</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
            placeholder="Ваше имя"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            required
            placeholder="your@email.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>Телефон</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.input}
            placeholder="+7 (___) ___-__-__"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>Сообщение</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={styles.textarea}
            rows="4"
            placeholder="Ваше сообщение..."
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Отправить
        </button>
      </form>
    </div>
  );
}
