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
          setMacroLogs([]); // Initialize with an empty array
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
            ...currentMacros, // Use the current macros directly
          },
        ];

        setMacroLogs(updatedLogs);

        // Save logs and reset macros
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

  //   // Load current macros from async storage
  //   useEffect(() => {
  //     const loadMacros = async () => {
  //       try {
  //         const storedMacros = await AsyncStorage.getItem("currentMacros");
  //         if (storedMacros) {
  //           setCurrentMacros(JSON.parse(storedMacros));
  //         }
  //       } catch (error) {
  //         console.log("Error loading current macros:", error);
  //       }
  //     };
  //     loadMacros();
  //   }, []);

  //   // Load logs from async storage
  //   useEffect(() => {
  //     const loadLogs = async () => {
  //       try {
  //         const storedLogs = await AsyncStorage.getItem("macroLogs");
  //         if (storedLogs) {
  //           setMacroLogs(JSON.parse(storedLogs));
  //           console.log("Loaded logs from AsyncStorage:", JSON.parse(storedLogs));
  //         }
  //       } catch (error) {
  //         console.log("Error loading logs from AsyncStorage:", error);
  //       }
  //     };
  //     loadLogs();
  //   }, []);

  //   // Save current macros to async storage
  //   useEffect(() => {
  //     const saveMacros = async () => {
  //       try {
  //         await AsyncStorage.setItem(
  //           "currentMacros",
  //           JSON.stringify(currentMacros)
  //         );
  //       } catch (error) {
  //         console.log("Error saving current macros:", error);
  //       }
  //     };
  //     saveMacros();
  //   }, [currentMacros]);

  //   // Check for new day and update logs
  //   useEffect(() => {
  //     const checkForNewDay = async () => {
  //       const today = getToday();
  //       if (today !== lastSavedDate) {
  //         // Save current macros to logs
  //         const newLog: Log = {
  //           date: lastSavedDate,
  //           ...currentMacros,
  //         };
  //         const updatedLogs = [...macroLogs, newLog];
  //         setMacroLogs(updatedLogs);

  //         // Save logs to async storage
  //         try {
  //           await AsyncStorage.setItem("macroLogs", JSON.stringify(updatedLogs));
  //           console.log("Logs saved:", updatedLogs);
  //         } catch (error) {
  //           console.log("Error saving macro logs:", error);
  //         }

  //         // Reset current macros for the new day
  //         setCurrentMacros({
  //           calories: 0,
  //           protein: 0,
  //           carbohydrates: 0,
  //           fat: 0,
  //           fiber: 0,
  //           sugar: 0,
  //         });

  //         // Update last saved date
  //         setLastSavedDate(today);
  //         try {
  //           await AsyncStorage.setItem("lastSavedDate", today);
  //         } catch (error) {
  //           console.log("Error saving last saved date:", error);
  //         }
  //       }
  //     };
  //     checkForNewDay();
  //   }, [lastSavedDate]);

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
