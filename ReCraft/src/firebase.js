import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

// ⭐️ THE CRITICAL FIX ⭐️
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export default app;