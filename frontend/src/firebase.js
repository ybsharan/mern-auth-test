// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-auth-c2cc6.firebaseapp.com',
  projectId: 'mern-auth-c2cc6',
  storageBucket: 'mern-auth-c2cc6.appspot.com',
  messagingSenderId: '685934246215',
  appId: '1:685934246215:web:4391d92072c95a87adf462',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
