import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { DatabaseAdapter } from './DatabaseAdapter.js';

/**
 * Firebase/Firestore адаптер
 */
export class FirebaseAdapter extends DatabaseAdapter {
  constructor(firebaseConfig) {
    super();
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }

  async get(collectionName, id) {
    const docRef = doc(this.db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  }

  async update(collectionName, id, data) {
    const docRef = doc(this.db, collectionName, id);
    await updateDoc(docRef, data);
  }

  async create(collectionName, id, data) {
    const docRef = doc(this.db, collectionName, id);
    await setDoc(docRef, data);
  }

  async delete(collectionName, id) {
    const docRef = doc(this.db, collectionName, id);
    await deleteDoc(docRef);
  }

  async getAll(collectionName) {
    const collectionRef = collection(this.db, collectionName);
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * Подписаться на изменения документа
   * Использует Firebase onSnapshot для реактивных обновлений
   * При любом изменении документа callback будет вызван автоматически
   */
  subscribe(collectionName, id, callback) {
    const docRef = doc(this.db, collectionName, id);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
    // Возвращаем функцию отписки для cleanup
    return unsubscribe;
  }
}
