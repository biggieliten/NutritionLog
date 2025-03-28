import { db } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// export const getUserDoc = async (uid: string) => {
//   const docRef = doc(db, "users", uid);
//   try {
//     const docSnap = await getDoc(docRef);

//     console.log(docSnap.data(), "docSnap / user data");
//   } catch (e) {
//     console.error("Error getting document:", e);
//   }
// };

export const getUserDoc = async (uid: string) => {
  try {
    const cachedUserData = await AsyncStorage.getItem(`_${uid}`);

    if (cachedUserData) {
      console.log("cachedDoc", JSON.parse(cachedUserData));
    }

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const storedUserData = docSnap.data();
      console.log(docSnap.data(), "docSnap / user data");

      await AsyncStorage.setItem(`_${uid}`, JSON.stringify(storedUserData));

      console.log("fetched from firebase", storedUserData);

      return storedUserData;
    }
  } catch (e) {
    console.error("Error getting document:", e);
  }
};
