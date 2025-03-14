import { create } from "zustand";
import { Macros } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

type CurrentMacroStore = {
  currentMacros: Macros;
  resetCurrentMacros: () => void;
  setCurrentMacros: (macros: Macros) => void;
};

const defaultCurrentMacros = {
  calories: 0,
  protein: 0,
  carbohydrates: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
};

export const useCurrentMacroStore = create(
  persist<CurrentMacroStore>(
    (set, get) => ({
      currentMacros: defaultCurrentMacros,
      resetCurrentMacros: () => set({ currentMacros: defaultCurrentMacros }),
      setCurrentMacros: (macros) => set({ currentMacros: macros }),
    }),
    {
      name: "currentMacros",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
