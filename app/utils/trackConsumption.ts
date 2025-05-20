import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { Macros, Consumption } from "../types/types";

export const trackConsumption = async (
  userId: string,
  totalConsumption: Consumption,
  consumed: Macros
) => {
  if (!userId) return;
  const consumptionCalc = {
    consumedCalories: totalConsumption.consumedCalories + consumed.calories,
    consumedProtein: totalConsumption.consumedProtein + consumed.protein,
    consumedCarbohydrates:
      totalConsumption.consumedCarbohydrates + consumed.carbohydrates,
    consumedFat: totalConsumption.consumedFat + consumed.fat,
    consumedFiber: totalConsumption.consumedFiber + consumed.fiber,
    consumedSugar: totalConsumption.consumedSugar + consumed.sugar,
  };

  const docRef = doc(db, "users", userId);

  try {
    await updateDoc(docRef, {
      consumption: {
        ...consumptionCalc,
      },
    });
    console.log("Consumption updated successfully!");
  } catch (e) {
    console.error("Error updating consumption:", e);
  }
};
