"use client";
import styles from './footer.module.css';
import { useContent } from '../../../universal-admin-package/src/index';

export default function Footer() {
  const footerData = useContent('pages.footer.hero') || {};

  return (
    <footer className={styles.container}>
      sgggggggggggggggggg
    </footer>
  );
}