import { createContext, useContext, useState, useEffect } from "react";
import { GlobalContextType, UPC, Log, Macros } from "@/app/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToday } from "@/app/utils/todaysDate";
import { loadFromAsyncStorage, saveToAsyncStorage } from "@/app/hooks/storage";

export const GlobalContext = createContext<GlobalContextType>(
  {} as GlobalContextType
);

export const GlobalProvider = ({ children }: any) => {
  const [scannedUPC, setScannedUPC] = useState<string>("");
  const [UPCContent, setUPCContent] = useState<UPC>({} as UPC);
  const [macroLogs, setMacroLogs] = useState<Log[]>([]);
  const [lastSavedDate, setLastSavedDate] = useState<string>(getToday());
  //   const [lastSavedDate, setLastSavedDate] = useState<string>("2024-12-23");

  const [dailyGoal, setDailyGoal] = useState<Macros>({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  });
  const [currentMacros, setCurrentMacros] = useState<Macros>({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  });

  const initialState = {
    scannedUPC,
    setScannedUPC,
    UPCContent,
    setUPCContent,
    dailyGoal,
    setDailyGoal,
    currentMacros,
    setCurrentMacros,
    macroLogs,
    setMacroLogs,
    setLastSavedDate,
  };

  // Loading all data from AsyncStorage on app start. (When GlobalProvider is mounted)
  useEffect(() => {
    const loadAppData = async () => {
      const today = getToday();

      try {
        const [storedMacros, storedLogs, storedDate, storedDailyGoal] =
          await Promise.all([
            loadFromAsyncStorage("currentMacros"),
            loadFromAsyncStorage("macroLogs"),
            loadFromAsyncStorage("lastSavedDate"),
            loadFromAsyncStorage("dailyGoal"),
          ]);

        setCurrentMacros(storedMacros);
        setMacroLogs(storedLogs);
        setDailyGoal(storedDailyGoal);

        if (storedDate) {
          setLastSavedDate(storedDate);
        } else {
          setLastSavedDate(today);
          await saveToAsyncStorage("lastSavedDate", today);
        }
      } catch (error) {
        console.error("Error loading app data:", error);
      }
    };

    loadAppData();
  }, []);

  // Saving the dailyGoal to AsyncStorage whenever it changes.
  useEffect(() => {
    const storedDailyGoal = async () => {
      await saveToAsyncStorage("dailyGoal", dailyGoal);
    };
    storedDailyGoal();
  }, [dailyGoal]);

  // Function to add the currentMacros / dailyProgress on date change.
  useEffect(() => {
    const checkForNewDay = async () => {
      const today = getToday();
      if (today !== lastSavedDate) {
        const updatedLogs = [
          ...macroLogs,
          {
            date: lastSavedDate,
            ...currentMacros,
          },
        ];

        setMacroLogs(updatedLogs);

        await saveToAsyncStorage("macroLogs", updatedLogs);
        console.log("Logs saved:", updatedLogs);

        setCurrentMacros({
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
        });

        setLastSavedDate(today);
        await saveToAsyncStorage("lastSavedDate", today);
      }
    };

    checkForNewDay();
  }, [lastSavedDate]);

  useEffect(() => {
    const saveCurrentMacros = async () => {
      await saveToAsyncStorage("currentMacros", currentMacros);
    };

    saveCurrentMacros();
  }, [currentMacros]);

  return (
    <GlobalContext.Provider value={initialState}>
      {children}
    </GlobalContext.Provider>
  );
};
