// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config object
// Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9SBw0ZckY3ht0CwH39C5pPRWwkR2zR4M",
  authDomain: "authencation-39485.firebaseapp.com",
  databaseURL: "https://authencation-39485-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "authencation-39485",
  storageBucket: "authencation-39485.firebasestorage.app",
  messagingSenderId: "366538675183",
  appId: "1:366538675183:web:8504a18fce2d563c491c1a",
  measurementId: "G-0V7B973Q8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Export the app for other uses if needed
export default app;
