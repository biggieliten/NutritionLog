import { doc, updateDoc } from "firebase/firestore";
import { updateCurrentMacros } from "../hooks/updateCurrentMacros";
import { useAuth } from "../state/AuthState/AuthContext";
import { Macros } from "../types/types";
import { db } from "@/firebaseConfig";

export const trackCalorieBurn = (
  uid: string,
  currentMacros: Macros,
  burnedCalories: number,
  currentCalories: number
) => {
  //   if (!user || !userData) return;

  const newCalories = currentCalories - burnedCalories;

  updateCurrentMacros({
    uid: uid,
    newMacros: { ...currentMacros, calories: newCalories },
  });
  const docRef = doc(db, "users", uid);

  updateDoc(docRef, {
    burnedCalories: burnedCalories,
  });
};
