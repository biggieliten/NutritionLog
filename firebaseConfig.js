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
// console.log(db);
export { db, auth };
// const analytics = getAnalytics(app);
// connectFirestoreEmulator(db, "localhost", 8080); // For local testing

//Below is a test for when i had issues with expo and firebase

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyDuUVB2F0reb3k6FsKF3GM3qFdaFZFqu4c",
//   authDomain: "nutritionlog-fdbe8.firebaseapp.com",
//   projectId: "nutritionlog-fdbe8",
//   storageBucket: "nutritionlog-fdbe8.firebasestorage.app",
//   messagingSenderId: "1062469268495",
//   appId: "1:1062469268495:web:8c3d5eb8f4186af9875f7a",
//   measurementId: "G-1FXZYP3TM2",
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });

// export { db, auth };
