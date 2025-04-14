import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { DailyGoal } from "../types/types";

type Props = {
  uid: string;
  newGoal: DailyGoal;
};

export const updateDailyGoal = async ({ uid, newGoal }: Props) => {
  if (!uid) return;

  const userDocRef = doc(db, "users", uid);

  try {
    await updateDoc(userDocRef, {
      dailyGoal: newGoal,
    });
    console.log("Daily goal updated successfully!");
  } catch (e) {
    console.error("Error adding log:", e);
  }
};
