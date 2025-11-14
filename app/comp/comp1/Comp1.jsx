"use client";
import styles from './comp1.module.css';
import Image from 'next/image';

import { useContent } from '../../../universal-admin-package/src/index';
import siteData from "../../../database.example"




export default function Comp1() {
   // Получаем данные из Firebase через useContent или через database.example
  const comp1Data = useContent('pages.comp1.hero') || siteData.comp1.hero;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{comp1Data.title}
        
        </h1>
        <p className={styles.description}>
          {comp1Data.description}
        </p>
        
        <div className={styles.cardsContainer}>
          <div className={styles.card}>
            <button className={`${styles.cardButton} ${styles.buttonFirst}`} disabled>
              <span className={styles.buttonText}>First Step</span>
            </button>
            <p className={styles.cardText}>
              Just choose the fruit you want to order by clicking on the checkboxes next to it.
            </p>
          </div>
          
          <div className={styles.card}>
            <button className={`${styles.cardButton} ${styles.buttonSecond}`} disabled>
              <span className={styles.buttonText}>Second Step</span>
            </button>
            <p className={styles.cardText}>
              Click on the basket and fill out the form.
            </p>
          </div>
          
          <div className={styles.card}>
            <button className={`${styles.cardButton} ${styles.buttonThird}`} disabled>
              <span className={styles.buttonText}>Third Step</span>
            </button>
            <p className={styles.cardText}>
              Sit back and relax! Your fresh fruit basket will be delivered.
            </p>
          </div>
        </div>

        <div className={styles.imageContainer}>
          <Image 
            src="/comp_1/gif_1.png" 
            alt="Fruit basket demonstration" 
            width={860}
            height={476}
            className={`${styles.responsiveImage} ${styles.desktopImage}`}
          />
          <Image 
            src="/comp_1/gif_2.png" 
            alt="Fruit basket demonstration" 
            width={704}
            height={476}
            className={`${styles.responsiveImage} ${styles.tabletImage}`}
          />
          <Image 
            src="/comp_1/gif_3.png" 
            alt="Fruit basket demonstration" 
            width={335}
            height={476}
            className={`${styles.responsiveImage} ${styles.mobileImage}`}
          />
        </div>
      </div>
    </div>
  );
}