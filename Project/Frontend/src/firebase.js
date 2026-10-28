import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBOncv5yJO_BeKcre-2K36f4i7DpxTO6DI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "new-one-70721.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "new-one-70721",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "new-one-70721.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1028580254935",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1028580254935:web:75035b1de9c4affa467c92",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NRL9JTLB7Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { storage, auth, onAuthStateChanged, db };
