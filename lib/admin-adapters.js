/**
 * Инициализация адаптеров для админ-панели
 */
import { FirebaseAdapter, CloudinaryAdapter } from '../universal-admin-package/src/index.js';

// Firebase адаптер
export const firebaseAdapter = new FirebaseAdapter({
   apiKey: "AIzaSyCBrseT2QqIMUNlCLiimHJd2lcoMUR4qOM",
  authDomain: "universal-server-ee34c.firebaseapp.com",
  projectId: "universal-server-ee34c",
  storageBucket: "universal-server-ee34c.firebasestorage.app",
  messagingSenderId: "904380529319",
  appId: "1:904380529319:web:9459537e03a06350faf982"
});

// Cloudinary адаптер
export const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: 'dxgofnyop',
  uploadPreset: 'unsigned_preset'
});
