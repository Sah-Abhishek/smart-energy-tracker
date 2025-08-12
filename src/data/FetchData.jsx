// src/data/FetchData.jsx
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp
} from "firebase/firestore";

// ✅ Firebase config (use your own .env values)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// ✅ Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// Reference to Firestore collection
const readingsRef = collection(db, "sensorData");

// ✅ Add a new reading
export const addEnergyReading = async (data) => {
  try {
    const docRef = await addDoc(readingsRef, {
      ...data,
      timestamp: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding reading:", error);
    throw error;
  }
};

// ✅ Fetch latest readings (one-time)
export const getLatestReadings = async (limitCount = 10) => {
  try {
    const q = query(readingsRef, orderBy("timestamp", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching readings:", error);
    throw error;
  }
};

// ✅ Real-time listener for multiple readings
export const fetchReadings = (callback, limitCount = 10) => {
  const q = query(readingsRef, orderBy("timestamp", "desc"), limit(limitCount));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data.reverse()); // Oldest → newest
  });
  return unsubscribe; // Must be called in cleanup
};

// ✅ Fetch latest single reading (one-time)
export const fetchLatestReading = async () => {
  try {
    const q = query(readingsRef, orderBy("timestamp", "desc"), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching latest reading:", error);
    throw error;
  }
};


export const listenToLatestReading = (callback) => {
  const q = query(readingsRef, orderBy("timestamp", "desc"), limit(1));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.forEach(doc => {
      callback({ id: doc.id, ...doc.data() });
    });
  });
  return unsubscribe;
};
