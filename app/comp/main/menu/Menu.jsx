"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./menu.module.css";
import { AdminPanel} from '../../../../universal-admin-package/src/index';

export default function Menu({ openModal }) {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
    
   
     {/* Кнопка админ-панели (⚙️ в правом нижнем углу) */}
          <AdminPanel theme={{ primaryColor: '#1976D2' }} />
    <nav className={styles.menu}>
      <div className={styles.left}>
        <Link href="#main" className={styles.link}>How It Works</Link>
        <Link href="#comp2" className={styles.link}>Fruits</Link>
        <Link href="#footer" className={styles.link}>Contacts</Link>
      </div>

      <div className={styles.logo}>
        <Image src="/main/cub_logo.png" alt="Fresh Harvest Box" width={16} height={16} />
        <span className={styles.logoText}>fresh harvest box</span>
      </div>

      <div className={styles.right}>
        <button 
          className={styles.contactButton} 
          onClick={() => {
            console.log('contactButton clicked');
            openModal();
          }}
        >
          contact us
        </button>
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
