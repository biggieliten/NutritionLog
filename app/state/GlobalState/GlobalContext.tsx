import { createContext, useContext, useState, useEffect } from "react";
import { GlobalContextType, UPC, Log, Macros } from "@/app/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToday } from "@/app/utils/todaysDate";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

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
  useEffect(() => {
    const loadMacroLogs = async () => {
      try {
        const savedLogs = await AsyncStorage.getItem("macroLogs");
        if (savedLogs) {
          setMacroLogs(JSON.parse(savedLogs));
        } else {
          setMacroLogs([]);
        }
      } catch (error) {
        console.error("Error loading macroLogs:", error);
      }
    };

    loadMacroLogs();
  }, [macroLogs]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load data from AsyncStorage
        const [storedMacros, storedLogs, storedDate] = await Promise.all([
          AsyncStorage.getItem("currentMacros"),
          AsyncStorage.getItem("macroLogs"),
          AsyncStorage.getItem("lastSavedDate"),
        ]);

        if (storedMacros) {
          setCurrentMacros(JSON.parse(storedMacros));
        }
        if (storedLogs) {
          setMacroLogs(JSON.parse(storedLogs));
        }
        if (storedDate) {
          setLastSavedDate(storedDate);
        } else {
          const today = getToday();
          setLastSavedDate(today);
          await AsyncStorage.setItem("lastSavedDate", today);
        }
      } catch (error) {
        console.error("Error initializing app data:", error);
      }
      //   [macroLogs];
    };

    initializeApp();
  }, []);

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

        try {
          await AsyncStorage.setItem("macroLogs", JSON.stringify(updatedLogs));
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
          await AsyncStorage.setItem("lastSavedDate", today);
        } catch (error) {
          console.log("Error saving macro logs or date:", error);
        }
      }
    };

    checkForNewDay();
  }, [lastSavedDate]);

  useEffect(() => {
    const saveMacros = async () => {
      try {
        await AsyncStorage.setItem(
          "currentMacros",
          JSON.stringify(currentMacros)
        );
        console.log("Saved currentMacros:", currentMacros);
      } catch (error) {
        console.log("Error saving current macros:", error);
      }
    };

    saveMacros();
  }, [currentMacros]);

  return (
    <GlobalContext.Provider
      value={{
        scannedUPC,
        setScannedUPC,
        UPCContent,
        setUPCContent,
        dailyGoal,
        setDailyGoal,
        setCurrentMacros,
        currentMacros,

        macroLogs,
        setMacroLogs,
        setLastSavedDate,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
