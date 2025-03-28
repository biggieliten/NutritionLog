import { db } from "@/firebaseConfig";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { Log, DailyGoal } from "../types/types";
arrayUnion;
type addLogType = {
  uid: string;
  newLog: Log;
};

export const addLog = async ({ uid, newLog }: addLogType) => {
  if (!uid) return;

  const userDocRef = doc(db, "users", uid);

  try {
    await updateDoc(userDocRef, {
      logs: arrayUnion(newLog),
    });
    console.log("Log added successfully!");
  } catch (e) {
    console.error("Error adding log:", e);
  }
};
