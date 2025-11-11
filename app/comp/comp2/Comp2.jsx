"use client";

import styles from './comp2.module.css';
import Image from 'next/image';
import { useContent } from '../../../universal-admin-package/src/index';

export default function Comp2() {
  const agenciesData = useContent('pages.agencies.hero') || {};
  const cardData = agenciesData.card || [];
    
  

  return (
    <div className={styles.container}>
      
    </div>
  );
}