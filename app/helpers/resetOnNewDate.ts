import { update } from "firebase/database";
import { updateCurrentMacros } from "../hooks/updateCurrentMacros";
import { updateDailyGoal } from "../hooks/updateDailyGoal";
import { DailyGoal, Macros, Log } from "../types/types";
import { addLog } from "../hooks/addLog";
import { setUserInfo } from "../hooks/updateDoc";
import AsyncStorage from "@react-native-async-storage/async-storage";

const currentMacrosToLog = (macros: Macros, date: string): Log => {
  return {
    ...macros,
    date: date,
  };
};

export const resetOnNewDate = async (
  today: string,
  lastActive: string,
  currentMacros: Macros,
  resetGoal: DailyGoal,
  resetCM: Macros,
  uid: string
) => {
  const newLog = currentMacrosToLog(currentMacros, lastActive);
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
    // await setUserInfo({
    //   uid: uid,
    // //   lastActive: today,
    // });
    await AsyncStorage.setItem("nutrilog-lastActive", today);
  }
};

// export default resetOnNewDate;
