"use client";
import { motion } from "framer-motion";
import styles from'./main.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { AdminPanel, useContent } from '../../../universal-admin-package/src/index';
import Menu from "./menu/Menu";

export default function Main () {
  // Получаем данные из Firebase через useContent
  const heroData = useContent('pages.main.hero') || {};
  const galleryData = useContent('pages.main.gallery') || {};

  return (
<>
 {/* Кнопка админ-панели (⚙️ в правом нижнем углу) */}
      <AdminPanel theme={{ primaryColor: '#1976D2' }} />
    <div className={styles.container}>
   <Menu/>
   <h1 className={styles.title}>
     fresh harvest box is your one-stop place for a delicious fruit basket
   </h1>
   
   <div className={styles.imageWomen}>
     <Image 
       src="/main/image_women.png" 
       alt="Woman with fruits"
       width={452}
       height={702}

       priority
     />
   </div>
   
   <div className={styles.vectorWomen}>
     <Image 
       src="/main/Vector_women.png" 
       alt="Vector decoration"
       width={486}
       height={742}
     />
   </div>
   
   <div className={styles.imageBanana}>
     <Image 
       src="/main/image_banane.png" 
       alt="Banana"
       width={183}
       height={125}
     />
   </div>
   
   <div className={styles.imageStrawberry}>
     <Image 
       src="/product/image_strawberry.png" 
       alt="Strawberry"
       width={120}
       height={120}
     />
   </div>
   
   <Link href="#" className={styles.btnShop}>
     <Image 
       src="/main/btn_shop.png" 
       alt="Shop button"
       width={114}
       height={114}
     />
   </Link>
   
 <p className={styles.description}>
     Our expertly curated fruit baskets are made with the freshest, highest quality fruits available. Whether you are looking for a healthy snack or a gift for a loved one, Fresh Harvest Box has got you covered.
   </p>
<div className={styles.fruitCard}>
     <h3>Fruit</h3>
     <div className={styles.fruitCardImage}>
       <Image 
         src="/product/image_watermelon.png" 
         alt="Watermelon"
         width={200}
         height={172}
       />
     </div>
     <p className={styles.fruitCardText}>
       Refreshing and juicy, watermelon is the perfect summer treat and a great source of hydration
     </p>
   </div>
  
  
   
   
   
   <div className={styles.fruitCardRight}>
     <h3>Fruit</h3>
     <div className={styles.fruitCardRightImage}>
       <Image 
         src="/main/strawberry_basket.png" 
         alt="Strawberry basket"
         width={162}
         height={185}
       />
     </div>
     
     <p className={styles.fruitCardRightText}>
       Sweet and juicy, strawberries are packed with vitamin C and antioxidants, making them a delicious and healthy snack
     </p>
   </div>
   
   <div className={styles.tagsContainer}>
     <button className={styles.tagButton}>
       <span>#organic</span>
     </button>
     <button className={styles.tagButton}>
       <span>#products</span>
     </button>
     <button className={styles.tagButton}>
       <span>#basket</span>
     </button>
     <button className={styles.tagButton}>
       <span>#fruits</span>
     </button>
   </div>
    </div>
    </>
  );
}