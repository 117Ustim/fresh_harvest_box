"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./menu.module.css";
import { AdminPanel} from '../../../../universal-admin-package/src/index';

export default function Menu({ openModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Отслеживание скролла
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Разбиваем текст логотипа на буквы
  const logoText = "fresh harvest box";
  const letters = logoText.split("");

  return (
    <>
    
   
     {/* Кнопка админ-панели (⚙️ в правом нижнем углу) */}
          <AdminPanel theme={{ primaryColor: '#1976D2' }} />
    <nav className={styles.menu}>
      <div className={styles.left}>
        <motion.div
          key={`link1-${scrolled}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Link href="#main" className={styles.link}>How It Works</Link>
        </motion.div>
        <motion.div
          key={`link2-${scrolled}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <Link href="#comp2" className={styles.link}>Fruits</Link>
        </motion.div>
        <motion.div
          key={`link3-${scrolled}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.65 }}
        >
          <Link href="#footer" className={styles.link}>Contacts</Link>
        </motion.div>
      </div>

      <div className={styles.logo}>
        <motion.div
          key={`logo-${scrolled}`}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <Image src="/main/cub_logo.png" alt="Fresh Harvest Box" width={16} height={16} />
        </motion.div>
        <span className={styles.logoText}>
          {letters.map((letter, index) => (
            <motion.span
              key={`${index}-${scrolled}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.13 }}
              style={{ display: 'inline-block' }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </span>
      </div>

      <div className={styles.right}>
        <motion.button 
          key={`button-${scrolled}`}
          className={styles.contactButton}
          initial={{ backgroundColor: 'rgba(174, 19, 50, 0.3)' }}
          animate={{ backgroundColor: 'rgba(174, 19, 50, 1)' }}
          transition={{ duration: 2.9 }}
          onClick={() => {
            console.log('contactButton clicked');
            openModal();
          }}
        >
          contact us
        </motion.button>
      </div>

      <button 
        className={styles.burger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Затемненный фон */}
            <motion.div
              className={styles.mobileOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Выезжающее меню */}
            <motion.div
              className={styles.mobileMenu}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'tween',
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <Link href="#main" className={styles.mobileLink} onClick={() => setIsOpen(false)}>How It Works</Link>
              <Link href="#comp2" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Fruits</Link>
              <Link href="#footer" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Contacts</Link>
              <button className={styles.mobileContactButton} onClick={() => { setIsOpen(false); openModal(); }}>contact us</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav> 
    </>
  );
}
