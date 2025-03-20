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
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext<{
  //   signIn: () => void;
  //   signOut: () => void;
  //   register: () => void;
  user: User | null;
  //   setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  //   isSignedIn: boolean;
  // session?: string | null;
  // isLoading: boolean;
}>({
  //   signIn: () => null,
  //   signOut: () => null,
  //   register: () => null,
  user: null,
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
  const [signedInUser, setSignedInUser] = useState<any>();
  console.log(isSignedIn, "isSignedIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // const UserAuthState = () => {

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  //   const handleRegister = async () => {
  //     setLoading(true);
  //     try {
  //       const credentials = await createUserWithEmailAndPassword(
  //         auth,
  //         email,
  //         password
  //       );
  //       const user = credentials.user;
  //       setUser(user);

  //       const userDocRef = doc(db, "users", user.uid);
  //       await setDoc(userDocRef, {
  //         email: user.email,
  //         dailyGoal: {
  //           calories: 0,
  //           carbohydrates: 0,
  //           protein: 0,
  //           fat: 0,
  //         },
  //         logs: [],
  //       });

  //       setIsSignedIn(true);

  //       //   if(user) {

  //       //   setEmail("");
  //       //   setPassword("");
  //     } catch (error) {
  //       setError("Invalid email or password");
  //       console.error("Login Error: ", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   const handleSignIn = async () => {
  //     try {
  //       await signInWithEmailAndPassword(auth, email, password);

  //       //   console.log(user.email), "user id";
  //       setIsSignedIn(true);
  //       //   setEmail("");
  //       //   setPassword("");
  //       //   console.log(isSignedIn, "is signed in on LOGIN");
  //       //   console.log(auth.currentUser, "currentUser on LOGIN");
  //       //   setIsSignedIn(true);
  //       //   navigate("index");
  //       // navigation.navigate("Home"); // Redirect to another screen after successful login
  //     } catch (error) {
  //       setError("Invalid email or password");
  //       console.error("Login Error: ", error);
  //     }
  //   };
  //   const handleSignOut = () => {
  //     signOut(auth)
  //       .then(() => {
  //         // console.log("Signed out");
  //         // console.log(isSignedIn, "is signed in on SIGN OUT");
  //         // console.log(auth.currentUser), "currentUser on SIGN OUT";
  //         setIsSignedIn(false);
  //       })
  //       .catch((error) => {
  //         console.error("Sign out error: ", error);
  //       });
  //   };
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
