"use client";
import styles from './footer.module.css';
import Image from 'next/image';
import { useContent } from '../../../universal-admin-package/src/index';

export default function Footer() {
  const footerData = useContent('pages.footer.hero') || {};

  return (
    <footer className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <Image 
            src="/footer/image.png" 
            alt="Footer image"
            width={349}
            height={179}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
        
        <div className={styles.logoWrapper}>
          <Image 
            src="/main/cub_logo.png" 
            alt="Fresh Harvest Box" 
            width={16} 
            height={16} 
          />
          <span className={styles.logoText}>fresh harvest box</span>
        </div>

        <nav className={styles.menuCenter}>
          <a href="#main" className={styles.menuLink}>How It Works</a>
          <a href="#comp2" className={styles.menuLink}>Fruits</a>
          <a href="#footer" className={styles.menuLink}>Contacts</a>
        </nav>

        <div className={styles.contactBlock}>
          <div className={styles.socialIcons}>
            <Image 
              src="/footer/f.png" 
              alt="Facebook"
              width={44}
              height={44}
            />
            <Image 
              src="/footer/t.png" 
              alt="Twitter"
              width={44}
              height={44}
            />
            <Image 
              src="/footer/y.png" 
              alt="YouTube"
              width={44}
              height={44}
            />
          </div>
          <div className={styles.phone}>+380(67) 357-33-54</div>
          <div className={styles.address}>03471 Kiyv , Latoshinscogo 42</div>
        </div>
      </div>
    </footer>
  );
}