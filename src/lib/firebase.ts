// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuI7inX96pblcftFJCf9jcWK4oqi-bP88",
  authDomain: "weareaspect.firebaseapp.com",
  projectId: "weareaspect",
  storageBucket: "weareaspect.firebasestorage.app",
  messagingSenderId: "974961856210",
  appId: "1:974961856210:web:332a8f4a80f6a44269a70b",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);