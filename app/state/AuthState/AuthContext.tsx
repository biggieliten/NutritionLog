import { auth, db } from "@/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { get } from "firebase/database";
import { user } from "@/app/types/firebaseTypes";
import { ScanResult } from "@/app/types/types";
import { firebaseUser } from "@/app/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext<{
  //   signIn: () => void;
  //   signOut: () => void;
  //   register: () => void;
  user: User | null;
  userData: firebaseUser | null;
  setUserData: React.Dispatch<React.SetStateAction<firebaseUser | null>>;
  scannedProduct: ScanResult | null;
  setScannedProduct: React.Dispatch<React.SetStateAction<ScanResult | null>>;
  //   setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  //   isSignedIn: boolean;
  // session?: string | null;
  // isLoading: boolean;
}>({
  //   signIn: () => null,
  //   signOut: () => null,
  //   register: () => null,
  user: null,
  userData: null,
  setUserData: () => null,
  scannedProduct: null,
  setScannedProduct: () => null,
  //   setIsSignedIn: () => null,
  //   isSignedIn: false,
  // session: null,
  // isLoading: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const { setIsSignedIn, isSignedIn, setSignedInUser, signedInUser } =
  //     useContext(UserContext);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<firebaseUser | null>(null);
  const [signedInUser, setSignedInUser] = useState<any>();
  console.log(isSignedIn, "isSignedIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [scannedProduct, setScannedProduct] = useState<ScanResult | null>(null);

  // const UserAuthState = () => {

  //   const getUserData = async (userId: string) => {
  //     const docRef = user && doc(db, "users", userId);
  //     const docSnap = docRef && (await getDoc(docRef));

  //     if (docSnap?.exists()) {
  //       console.log(docSnap?.data(), "docSnap data");
  //       return docSnap.data();
  //     }

  //     return docSnap?.data();
  //   };

  //   useEffect(() => {
  //     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  //       setUser(firebaseUser);

  //       if (!firebaseUser) return;

  //       const data = await getUserData(firebaseUser?.uid);
  //       setUserData(data as firebaseUser);
  //     });

  //     return () => unsubscribe();
  //   }, []);

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setUserData(null);
        return;
      }

      const userDocRef = doc(db, "users", firebaseUser.uid);

      const userDocUnsubscribe = onSnapshot(
        userDocRef,
        async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();

            const lastActive = await AsyncStorage.getItem(
              "nutrilog-lastActive"
            );
            if (!lastActive) return;
            setUserData({ ...(data as firebaseUser), lastActive });
          }
        },
        (error) => {
          console.error("Error listening to user data:", error);
        }
      );

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
