import { auth, db } from "@/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { ScanResult } from "@/app/types/types";
import { firebaseUser } from "@/app/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFixedDate } from "@/app/utils/todaysDate";

const AuthContext = createContext<{
  user: User | null;
  userData: firebaseUser | null;
  setUserData: React.Dispatch<React.SetStateAction<firebaseUser | null>>;
  scannedProduct: ScanResult | null;
  setScannedProduct: React.Dispatch<React.SetStateAction<ScanResult | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  user: null,
  userData: null,
  setUserData: () => null,
  scannedProduct: null,
  setScannedProduct: () => null,
  isLoading: false,
  setIsLoading: () => null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<firebaseUser | null>(null);
  const [scannedProduct, setScannedProduct] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const authUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setUserData(null);
        setIsLoading(false);
        return;
      }

      const userDocRef = doc(db, "users", firebaseUser.uid);

      const userDocUnsubscribe = onSnapshot(
        userDocRef,
        async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();

            try {
              let lastActive = await AsyncStorage.getItem(
                "nutrilog-lastActive"
              );

              if (!lastActive) {
                const today = getFixedDate();
                await AsyncStorage.setItem("nutrilog-lastActive", today);
                lastActive = today;
              }

              setUserData({ ...(data as firebaseUser), lastActive });
            } catch (e) {
              console.error("Error getting last active:", e);
            } finally {
              setIsLoading(false);
            }
          }
        },
        (error) => {
          console.error("Error listening to user data:", error);
        }
      );

      // Runs the clean up function when the component unmounts (or when the user changes)
      return () => userDocUnsubscribe();
    });

    return () => authUnsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        setUserData,
        scannedProduct,
        setScannedProduct,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
