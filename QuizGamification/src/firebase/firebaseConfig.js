// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAhYGZI3jtHSffLFV7cz8Ygd1nIUv47Lo0",
    authDomain: "gamifyedu-b10f4.firebaseapp.com",
    databaseURL: "https://gamifyedu-b10f4-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gamifyedu-b10f4",
    storageBucket: "gamifyedu-b10f4.firebasestorage.app",
    messagingSenderId: "698233556624",
    appId: "1:698233556624:web:56d7ad687e083b80e45215"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);







