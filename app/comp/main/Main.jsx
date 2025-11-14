"use client";
import { motion } from "framer-motion";
import styles from'./main.module.css';
import Image from 'next/image';
import Link from 'next/link';
 import { useContent } from '../../../universal-admin-package/src/index';
import Menu from "./menu/Menu";
import siteData  from "../../../database.example";

export default function Main ({ openModal }) {
  // Получаем данные из Firebase через useContent или database.example
  const mainData = useContent('pages.main.hero') || siteData.main.hero ;





  return (
<>

    <div className={styles.container}>
   <Menu openModal={openModal} />
   <h1 className={styles.title}>{mainData.title} 
  
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
   
   <button 
     onClick={() => {
       console.log('btnShop clicked');
       openModal();
     }} 
     
   >
     <Image 
       src="/main/btn_shop.png" 
       alt="Shop button"
       width={220}
       height={220}
       className={styles.btnShop}
     />
   </button>
   
 <p className={styles.description}>{mainData.description} 
    
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
     <p className={styles.fruitCardText}>{mainData.cardDescription1} 
    
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
     
     <p className={styles.fruitCardRightText}>{mainData.cardDescription2}
     
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