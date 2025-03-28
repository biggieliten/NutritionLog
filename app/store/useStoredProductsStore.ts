import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "../types/types";

type StoreProductsStore = {
  productTostore: Product;
  storedProducts: Product[];
  setTostoredProducts: (product: Product) => void;
  // setStoredProducts: (product: any) => void;
};

export const useStoreProductsStore = create(
  persist<StoreProductsStore>(
    (set) => ({
      productTostore: { product_name: "", nutriments: {} },
      storedProducts: [],
      setTostoredProducts: (product: any) =>
        set((state) => ({
          storedProducts: [...state.storedProducts, product],
        })),
    }),
    {
      name: "storedProducts",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
