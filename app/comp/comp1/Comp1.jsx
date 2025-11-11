"use client";
import styles from './comp1.module.css';

import { useContent } from '../../../universal-admin-package/src/index';

export default function Comp1() {
  const historyData = useContent('pages.history.hero') || {};

  return (
    <div className={styles.container}>
      
    </div>
  );
}