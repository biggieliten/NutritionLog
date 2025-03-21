import { db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { DailyGoal, Log } from "../types/types";

type userDocType = {
  uid: string;
  email: string | null;
  dailyGoal: DailyGoal;
  logs: Log[];
};

export const setUserDoc = async ({
  uid,
  email,
  dailyGoal: { calories, carbohydrates, protein, fat, sugar, fiber },
  logs,
}: userDocType) => {
  const userDocRef = doc(db, "users", uid);
  try {
    await setDoc(userDocRef, {
      email: email,
      dailyGoal: {
        calories: calories,
        carbohydrates: carbohydrates,
        protein: protein,
        fat: fat,
        sugar: sugar,
        fiber: fiber,
      },
      logs: logs,
    });

    console.log("Document successfully written!");
  } catch (e) {
    console.error("Error setting document:", e);
  }
};
