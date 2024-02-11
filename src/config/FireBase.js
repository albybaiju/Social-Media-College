// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB49mhhJGAsK01P9H-rW9m3OKE8EFOC4oE",
  authDomain: "mainproject-9d5bf.firebaseapp.com",
  projectId: "mainproject-9d5bf",
  storageBucket: "mainproject-9d5bf.appspot.com",
  messagingSenderId: "391842511478",
  appId: "1:391842511478:web:6a7abe605da48a9dca7d57",
  measurementId: "G-4HHDSCGW62",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
