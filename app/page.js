"use client";

import styles from "./page.module.css";
import { motion } from "framer-motion";
import Main from '../app/comp/main/Main'
import Comp2 from './comp/comp2/Comp2'
import Comp1 from './comp/comp1/Comp1'
import Footer from '../app/comp/footer/Footer'


export default function Home() {

  const sections = [
    { id: "main", component: <Main /> },
    { id: "comp1", component: <Comp1/> },
    { id: "comp2", component: <Comp2 /> },
    { id: "footer", component: <Footer /> },
  ];

  // Варианты анимации для секций
  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 80 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <motion.div key="page">
        <div className={styles.wrapper}>
          {sections.map(({ id, component }, index) => (
            <motion.section
              key={id}
              id={id}
              className={styles.section}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
            >
              {component}
            </motion.section>
          ))}
        </div>
      </motion.div>
    </>
  );
}