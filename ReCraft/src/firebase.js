// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfsaDKZ2XUkzEcxTq5GUr63uBhW9ID_FQ",
  authDomain: "recraft-e1506.firebaseapp.com",
  projectId: "recraft-e1506",
  storageBucket: "recraft-e1506.firebasestorage.app",
  messagingSenderId: "760809442713",
  appId: "1:760809442713:web:412980f4cfb619e335d708",
  measurementId: "G-K8449WJ1DV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;