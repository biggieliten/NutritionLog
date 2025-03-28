import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DailyGoal } from "../types/types";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

type DailyGoalStore = {
  dailyGoal: DailyGoal;
  resetDailyGoal: () => void;
  setDailyGoal: (dailyGoal: DailyGoal) => void;
  //   getDailyGoal: () => void;
};
const defaultDailyGoal = {
  calories: 0,
  protein: 0,
  carbohydrates: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
};

export const useDailyGoalStore = create(
  persist<DailyGoalStore>(
    (set, get) => ({
      dailyGoal: defaultDailyGoal,
      resetDailyGoal: () => set({ dailyGoal: defaultDailyGoal }),
      setDailyGoal: (dailyGoal) => set({ dailyGoal: dailyGoal }),
      //   getDailyGoal: () => set({ dailyGoal: get().dailyGoal }),
    }),
    {
      name: "dailyGoal",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
