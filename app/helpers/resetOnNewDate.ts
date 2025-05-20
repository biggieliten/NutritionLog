import { update } from "firebase/database";
import { updateCurrentMacros } from "../hooks/updateCurrentMacros";
import { updateDailyGoal } from "../hooks/updateDailyGoal";
import { DailyGoal, Macros, Log, Consumption } from "../types/types";
import { addLog } from "../hooks/addLog";
import { setUserInfo } from "../hooks/updateDoc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { trackConsumption } from "../utils/trackConsumption";

const currentMacrosToLog = (macros: Macros, date: string): Log => {
  return {
    ...macros,
    date: date,
    burnedCalories: 0,
  };
};

export const onNewDate = async (
  today: string,
  lastActive: string,
  currentMacros: Macros,
  //   consumption: Consumption,
  resetGoal: DailyGoal,
  resetCM: Macros,
  uid: string
) => {
  const newLog = currentMacrosToLog(currentMacros, lastActive);
  const docRef = doc(db, "users", uid);
  if (lastActive && lastActive !== today) {
    await addLog({
      uid: uid,
      newLog: newLog,
    });
    await updateCurrentMacros({
      uid: uid,
      newMacros: resetCM,
    });
    await updateDailyGoal({
      uid: uid,
      newGoal: resetGoal,
    });
    await updateDoc(docRef, {
      burnedCalories: 0,
    });
    // await setUserInfo({
    //   uid: uid,
    // //   lastActive: today,
    // });
    await AsyncStorage.setItem("nutrilog-lastActive", today);
    // trackConsumption(uid, consumption, currentMacros);
  }
};

// export default resetOnNewDate;
