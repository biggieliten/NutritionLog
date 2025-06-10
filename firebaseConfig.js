import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDuUVB2F0reb3k6FsKF3GM3qFdaFZFqu4c",
  authDomain: "nutritionlog-fdbe8.firebaseapp.com",
  projectId: "nutritionlog-fdbe8",
  storageBucket: "nutritionlog-fdbe8.firebasestorage.app",
  messagingSenderId: "1062469268495",
  appId: "1:1062469268495:web:8c3d5eb8f4186af9875f7a",
  measurementId: "G-1FXZYP3TM2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
