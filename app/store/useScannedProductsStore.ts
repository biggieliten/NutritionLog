import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product, ScanResult } from "../types/types";

type scannedProductStore = {
  scannedProduct: ScanResult;
  //   scannedProcuts: product[];
  setScannedProduct: (sp: any) => void;
  //   setScannedProducts: (sp: any) => void;
};

export const useScannedProductStore = create(
  persist<scannedProductStore>(
    (set, get) => ({
      scannedProduct: {
        code: "",
        product: {
          nutriments: {},
          product_name: "",
        },
      },

      //   scannedProducts: [],
      setScannedProduct: (sp: ScanResult) => set({ scannedProduct: sp }),
      //   setScannedProducts: (sp: product) => set({ scannedProducts: sp }),
    }),
    {
      name: "scannedProducts",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
