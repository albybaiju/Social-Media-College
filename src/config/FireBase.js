// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAbx1qgCxD7FBr9QGeqjVsSggtGS3YO1AI",
  authDomain: "mproject-a061b.firebaseapp.com",
  projectId: "mproject-a061b",
  storageBucket: "mproject-a061b.appspot.com",
  messagingSenderId: "1025692097849",
  appId: "1:1025692097849:web:e32eb538cfb0b8ef4a5ce8",
  measurementId: "G-BH60ZX3D11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
