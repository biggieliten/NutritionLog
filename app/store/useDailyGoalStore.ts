// // import { create } from "zustand";
// // import { persist, createJSONStorage } from "zustand/middleware";
// // import { db } from "@/firebaseConfig";
// // import { doc, getDoc, updateDoc } from "firebase/firestore";

// // export const useDailyGoalStore = create(
// //   persist(
// //     (set, get) => ({
// //       dailyGoal: null,
// //       lastUpdated: null,
// //       loadDailyGoal: async (uid: string) => {
// //         try {

// //           const storedData = storage.getString("dailyGoal");
// //           if (storedData) {
// //             set(JSON.parse(storedData));
// //           } else {
// //             const docRef = doc(db, "users", uid);
// //             const snapshot = await getDoc(docRef);
// //             if (snapshot.exists()) {
// //               const { dailyGoal, lastUpdated } = snapshot.data();
// //               set({ dailyGoal, lastUpdated });
// //               storage.set(
// //                 "dailyGoal",
// //                 JSON.stringify({ dailyGoal, lastUpdated })
// //               );
// //             }
// //           }
// //         } catch (error) {
// //           console.error("Error loading daily goal:", error);
// //         }
// //       },

// //       updateDailyGoal: async (uid, newGoal) => {
// //         const timestamp = Date.now();
// //         set({ dailyGoal: newGoal, lastUpdated: timestamp });

// //         storage.set(
// //           "dailyGoal",
// //           JSON.stringify({ dailyGoal: newGoal, lastUpdated: timestamp })
// //         );

// //         const docRef = doc(db, "users", uid);
// //         await updateDoc(docRef, { dailyGoal: newGoal, lastUpdated: timestamp });
// //       },
// //     }),
// //     {
// //       name: "dailyGoal",
// //       storage: createJSONStorage(() => storage),
// //     }
// //   )
// // );

// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { DailyGoal } from "../types/types";
// import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

// type DailyGoalStore = {
//   dailyGoal: DailyGoal;
//   resetDailyGoal: () => void;
//   setDailyGoal: (dailyGoal: DailyGoal) => void;
//   //   getDailyGoal: () => void;
// };
// const defaultDailyGoal = {
//   calories: 0,
//   protein: 0,
//   carbohydrates: 0,
//   fat: 0,
//   fiber: 0,
//   sugar: 0,
// };

// export const useDailyGoalStore = create(
//   persist<DailyGoalStore>(
//     (set, get) => ({
//       dailyGoal: defaultDailyGoal,
//       resetDailyGoal: () => set({ dailyGoal: defaultDailyGoal }),
//       setDailyGoal: (dailyGoal) => set({ dailyGoal: dailyGoal }),
//       //   getDailyGoal: () => set({ dailyGoal: get().dailyGoal }),
//     }),
//     {
//       name: "dailyGoal",
//       storage: createJSONStorage(() => AsyncStorage),
//     }
//   )
// );

//
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type DailyGoal = {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
};

type DailyGoalStore = {
  dailyGoal: DailyGoal | null;
  setDailyGoal: (goal: DailyGoal) => void;
  loadDailyGoal: (uid: string) => Promise<void>;
  saveDailyGoal: (uid: string) => Promise<void>;
};

const defaultDailyGoal: DailyGoal = {
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
      dailyGoal: null,

      setDailyGoal: (goal) => {
        set({ dailyGoal: goal });
      },

      // Load from AsyncStorage first, then Firestore if missing
      loadDailyGoal: async (uid: string) => {
        const cachedGoal = get().dailyGoal;

        if (cachedGoal) {
          console.log(
            "Loaded from AsyncStorage:",
            await AsyncStorage.getItem("dailyGoal")
          );
          return; // Use AsyncStorage data
        } else {
          // Otherwise, fetch from Firestore
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const newGoal = docSnap.data().dailyGoal;
            set({ dailyGoal: newGoal }); // Store in Zustand (AsyncStorage)
            console.log("Loaded from Firestore:", newGoal);
          }
        }
      },

      // Save to Firestore only if the goal has changed
      saveDailyGoal: async (uid: string) => {
        const goal = get().dailyGoal;
        const docRef = doc(db, "users", uid);

        let test = await setDoc(docRef, { dailyGoal: goal }, { merge: true });
        console.log("Saved to Firestore:", AsyncStorage.getItem("dailyGoal"));
      },
    }),
    {
      name: "dailyGoal",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
