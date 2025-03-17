import { createContext, useContext, useState, useEffect } from "react";
import { GlobalContextType, ScanResult, Log, Macros } from "@/app/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToday } from "@/app/utils/todaysDate";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export const UserContext = createContext<any>({} as any);

export const UserProvider = ({ children }: any) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  //   const [scannedUPC, setScannedUPC] = useState<string>("");
  //   const [UPCContent, setUPCContent] = useState<ScanResult>({} as ScanResult);
  //   const [macroLogs, setMacroLogs] = useState<Log[]>([]);
  //   const [lastSavedDate, setLastSavedDate] = useState<string>(getToday());
  //   const [lastSavedDate, setLastSavedDate] = useState<string>("2024-12-23");

  //   const [dailyGoal, setDailyGoal] = useState<Macros>({
  //     calories: 0,
  //     protein: 0,
  //     carbohydrates: 0,
  //     fat: 0,
  //     fiber: 0,
  //     sugar: 0,
  //   });
  //   const [currentMacros, setCurrentMacros] = useState<Macros>({
  //     calories: 0,
  //     protein: 0,
  //     carbohydrates: 0,
  //     fat: 0,
  //     fiber: 0,
  //     sugar: 0,
  //   });

  // Loading macroLogs whenever the state changes.
  //   useEffect(() => {
  //     const loadMacroLogs = async () => {
  //       try {
  //         const savedLogs = await AsyncStorage.getItem("macroLogs");
  //         if (savedLogs) {
  //           setMacroLogs(JSON.parse(savedLogs));
  //         } else {
  //           setMacroLogs([]);
  //         }
  //       } catch (error) {
  //         console.error("Error loading macroLogs:", error);
  //       }
  //     };

  //     loadMacroLogs();
  //   }, [macroLogs]);

  // Loading all data from AsyncStorage on app start. (When GlobalProvider is mounted)
  //   useEffect(() => {
  //     const loadAppData = async () => {
  //       try {
  //         const [storedMacros, storedLogs, storedDate, storedDailyGoal] =
  //           await Promise.all([
  //             AsyncStorage.getItem("currentMacros"),
  //             AsyncStorage.getItem("macroLogs"),
  //             AsyncStorage.getItem("lastSavedDate"),
  //             AsyncStorage.getItem("dailyGoal"),
  //           ]);

  //         if (storedMacros) {
  //           setCurrentMacros(JSON.parse(storedMacros));
  //         }
  //         if (storedLogs) {
  //           setMacroLogs(JSON.parse(storedLogs));
  //         }
  //         if (storedDate) {
  //           setLastSavedDate(storedDate);
  //         } else {
  //           const today = getToday();
  //           setLastSavedDate(today);
  //           await AsyncStorage.setItem("lastSavedDate", today);
  //         }
  //         if (storedDailyGoal) {
  //           setDailyGoal(JSON.parse(storedDailyGoal));
  //         }
  //       } catch (error) {
  //         console.error("Error loading app data:", error);
  //       }
  //       //   [macroLogs];
  //     };

  //     loadAppData();
  //   }, []);

  // Saving the dailyGoal to AsyncStorage whenever it changes.
  //   useEffect(() => {
  //     const storedDailyGoal = async () => {
  //       try {
  //         await AsyncStorage.setItem("dailyGoal", JSON.stringify(dailyGoal));
  //         console.log("Saved dailyGoal:", dailyGoal);
  //       } catch (error) {
  //         console.log("Error saving daily goal:", error);
  //       }
  //     };
  //     storedDailyGoal();
  //   }, [dailyGoal]);

  // Function to add the currentMacros / dailyProgress on date change.
  //   useEffect(() => {
  //     const checkForNewDay = async () => {
  //       const today = getToday();
  //       if (today !== lastSavedDate) {
  //         const updatedLogs = [
  //           ...macroLogs,
  //           {
  //             date: lastSavedDate,
  //             ...currentMacros,
  //           },
  //         ];

  //         setMacroLogs(updatedLogs);

  //         try {
  //           await AsyncStorage.setItem("macroLogs", JSON.stringify(updatedLogs));
  //           console.log("Logs saved:", updatedLogs);

  //           setCurrentMacros({
  //             calories: 0,
  //             protein: 0,
  //             carbohydrates: 0,
  //             fat: 0,
  //             fiber: 0,
  //             sugar: 0,
  //           });

  //           setLastSavedDate(today);
  //           await AsyncStorage.setItem("lastSavedDate", today);
  //         } catch (error) {
  //           console.log("Error saving macro logs or date:", error);
  //         }
  //       }
  //     };

  //     checkForNewDay();
  //   }, [lastSavedDate]);

  //   useEffect(() => {
  //     const saveMacros = async () => {
  //       try {
  //         await AsyncStorage.setItem(
  //           "currentMacros",
  //           JSON.stringify(currentMacros)
  //         );
  //         console.log("Saved currentMacros:", currentMacros);
  //       } catch (error) {
  //         console.log("Error saving current macros:", error);
  //       }
  //     };

  //     saveMacros();
  //   }, [currentMacros]);

  return (
    <UserContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        // scannedUPC,
        // setScannedUPC,
        // UPCContent,
        // setUPCContent,
        // dailyGoal,
        // setDailyGoal,
        // currentMacros,
        // setCurrentMacros,

        // macroLogs,
        // setMacroLogs,
        // setLastSavedDate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
