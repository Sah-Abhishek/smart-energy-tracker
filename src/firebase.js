// firebase.js
// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1vTKbZ0D7mIgw80ETrBkit3TGLgIeBQc",
  authDomain: "test2smartenergytracker.firebaseapp.com",
  projectId: "test2smartenergytracker",
  storageBucket: "test2smartenergytracker.firebasestorage.app",
  messagingSenderId: "847606313108",
  appId: "1:847606313108:web:0bb0017901e685a8244481",
  measurementId: "G-FK4Q8VBBH8"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

