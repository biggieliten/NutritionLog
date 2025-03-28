import { db } from "@/firebaseConfig";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { DailyGoal, Log } from "../types/types";

type userDocType = {
  uid: string;
  email: string | null;
  dailyGoal: DailyGoal;
  //   currentMacros: DailyGoal;
  logs: Log[];
};

export const setUserDoc = async ({
  uid,
  email,
  dailyGoal: { calories, carbohydrates, protein, fat, sugar, fiber },
  //   currentMacros: { calories, carbohydrates, protein, fat, sugar, fiber },
  logs,
}: userDocType) => {
  const userDocRef = doc(db, "users", uid);
  try {
    await updateDoc(userDocRef, {
      email: email,
      dailyGoal: {
        calories: calories,
        carbohydrates: carbohydrates,
        protein: protein,
        fat: fat,
        sugar: sugar,
        fiber: fiber,
      },
      //   currentMacros: {
      //     calories: 10,
      //     protein: 110,
      //     carbohydrates: 1110,
      //     fat: 1110,
      //     fiber: 110,
      //     sugar: 110,
      //   },
    });

    console.log("Document successfully written!");
  } catch (e) {
    console.error("Error setting document:", e);
  }
};
