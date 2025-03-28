import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Log } from "../types/types";

type LoggedMacrosStore = {
  loggedMacros: Log[];
  setMacrosToLog: (macros: Log[]) => void;
};

export const useLoggedMacrosStore = create(
  persist<LoggedMacrosStore>(
    (set) => ({
      loggedMacros: [],
      setMacrosToLog: (macros) => set({ loggedMacros: macros }),
    }),
    {
      name: "loggedMacros",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
