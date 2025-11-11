"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./menu.module.css";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.menu}>
      <div className={styles.left}>
        <Link href="#main" className={styles.link}>How It Works</Link>
        <Link href="#comp1" className={styles.link}>Fruits</Link>
        <Link href="#comp2" className={styles.link}>Contacts</Link>
      </div>

      <div className={styles.logo}>
        <Image src="/main/cub_logo.png" alt="Fresh Harvest Box" width={16} height={16} />
        <span className={styles.logoText}>fresh harvest box</span>
      </div>

      <div className={styles.right}>
        <button className={styles.contactButton}>contact us</button>
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

      {isOpen && (
        <div className={styles.mobileMenu}>
          <Link href="#main" className={styles.mobileLink} onClick={() => setIsOpen(false)}>How It Works</Link>
          <Link href="#comp1" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Fruits</Link>
          <Link href="#comp2" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Contacts</Link>
          <button className={styles.contactButton}>contact us</button>
        </div>
      )}
    </nav>
  );
}
