import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const getUserDoc = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  try {
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data(), "docSnap / user data");
  } catch (e) {
    console.error("Error getting document:", e);
  }
};
