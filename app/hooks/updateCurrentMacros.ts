import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { Macros } from "../types/types";

type Props = {
  uid: string;
  newMacros: Macros;
};

export const updateCurrentMacros = async ({ uid, newMacros }: Props) => {
  if (!uid) return;

  const userDocRef = doc(db, "users", uid);

  try {
    await updateDoc(userDocRef, {
      currentMacros: newMacros,
    });
    console.log("Daily goal updated successfully!");
  } catch (e) {
    console.error("Error adding log:", e);
  }
};
