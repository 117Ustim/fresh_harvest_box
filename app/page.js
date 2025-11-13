"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import Main from '../app/comp/main/Main'
import Comp2 from './comp/comp2/Comp2'
import Comp1 from './comp/comp1/Comp1'
import Comp3 from './comp/comp3/Comp3'
import Footer from '../app/comp/footer/Footer'
import Modal from './comp/Modal/Modal'
import OrderForm from './comp/Modal/OrderForm'


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    console.log('openModal called');
    setIsModalOpen(true);
  };
  const closeModal = () => {
    console.log('closeModal called');
    setIsModalOpen(false);
  };

  const sections = [
    { id: "main", component: <Main openModal={openModal} /> },
    { id: "comp1", component: <Comp1/> },
    { id: "comp2", component: <Comp2 openModal={openModal} /> },
    { id: "comp3", component: <Comp3/> },
    { id: "footer", component: <Footer /> },
  ];

  // Варианты анимации для секций
  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 40 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
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
              viewport={{ once: true, amount: 0.1 }}
              variants={sectionVariants}
            >
              {component}
            </motion.section>
          ))}
        </div>
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <OrderForm />
      </Modal>
    </>
  );
}
