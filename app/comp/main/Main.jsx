"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from'./main.module.css';
import Image from 'next/image';
import { useContent } from '../../../universal-admin-package/src/index';
import Menu from "./menu/Menu";
import siteData  from "../../../database.example";

export default function Main ({ openModal }) {
  const mainData = useContent('pages.main.hero') || siteData.main.hero ;
  
  // Ref для отслеживания видимости элементов
  const imageWomenRef = useRef(null);
  const titleRef = useRef(null);
  const btnShopRef = useRef(null);
  const fruitCardRef = useRef(null);
  const fruitCardRightRef = useRef(null);
  const isImageInView = useInView(imageWomenRef, { once: false, amount: 0.3 });
  const isTitleInView = useInView(titleRef, { once: false, amount: 0.5 });
  const isBtnShopInView = useInView(btnShopRef, { once: false, amount: 0.1 });
  const isFruitCardInView = useInView(fruitCardRef, { once: false, amount: 0.3 });
  const isFruitCardRightInView = useInView(fruitCardRightRef, { once: false, amount: 0.3 });
  
  // Варианты анимации для 3D переворота
  const imageVariants = {
    hidden: { 
      scale: 0.4,
      rotateY: 180,
      opacity: 0,
      z: -400,
      x: "-50%"
    },
    visible: { 
      scale: 1,
      rotateY: 0,
      opacity: 1,
      z: 0,
      x: "-50%",
      transition: {
        duration: 1.0,
        ease: "easeOut"
      }
    }
  };
  
  // Варианты анимации для контейнера заголовка
  const titleContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02
      }
    }
  };
  
  // Варианты анимации для каждой буквы
  const letterVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      rotateX: -90,
      scale: 0.5
    },
    visible: { 
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };
  
  // Варианты анимации для кнопки btnShop
  const btnShopVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.0,
        ease: "easeInOut",
        delay: 0.5
      }
    }
  };
  
  // Варианты анимации для fruitCard (плавное появление)
  const fruitCardVariants = {
    hidden: { 
      opacity: 0
    },
    visible: { 
      opacity: 1,
      transition: {
        duration: 1.7,
        ease: "easeOut"
      }
    }
  };
  
  // Разбиваем текст на буквы
  const titleText = mainData.title || "";
  const letters = titleText.split("");

  return (
    <>
      <div className={styles.container}>
        <Menu openModal={openModal} />
        <motion.h1 
          ref={titleRef}
          className={styles.title}
          variants={titleContainerVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              style={{ 
                display: "inline-block",
                transformStyle: "preserve-3d"
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.h1>
        
        <motion.div 
          ref={imageWomenRef}
          className={styles.imageWomen}
          variants={imageVariants}
          initial="hidden"
          animate={isImageInView ? "visible" : "hidden"}
          style={{ 
            transformStyle: "preserve-3d",
            transformOrigin: "center center"
          }}
        >
          <Image 
            src="/main/image_women.png" 
            alt="Woman with fruits"
            width={452}
            height={702}
            priority
          />
        </motion.div>
        
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
        
        <motion.button 
          ref={btnShopRef}
          onClick={() => {
            console.log('btnShop clicked');
            openModal();
          }}
          variants={btnShopVariants}
          initial="hidden"
          animate={isBtnShopInView ? "visible" : "hidden"}
        >
          <Image 
            src="/main/btn_shop.png" 
            alt="Shop button"
            width={220}
            height={220}
            className={styles.btnShop}
          />
        </motion.button>
        
        <p className={styles.description}>{mainData.description}</p>
        
        <motion.div 
          ref={fruitCardRef}
          className={styles.fruitCard}
          variants={fruitCardVariants}
          initial="hidden"
          animate={isFruitCardInView ? "visible" : "hidden"}
        >
          <h3>Fruit</h3>
          <div className={styles.fruitCardImage}>
            <Image 
              src="/product/image_watermelon.png" 
              alt="Watermelon"
              width={200}
              height={172}
            />
          </div>
          <p className={styles.fruitCardText}>{mainData.cardDescription1}</p>
        </motion.div>
        
        <motion.div 
          ref={fruitCardRightRef}
          className={styles.fruitCardRight}
          variants={fruitCardVariants}
          initial="hidden"
          animate={isFruitCardRightInView ? "visible" : "hidden"}
        >
          <h3>Fruit</h3>
          <div className={styles.fruitCardRightImage}>
            <Image 
              src="/main/strawberry_basket.png" 
              alt="Strawberry basket"
              width={162}
              height={185}
            />
          </div>
          <p className={styles.fruitCardRightText}>{mainData.cardDescription2}</p>
        </motion.div>
        
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
