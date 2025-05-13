import { auth } from "../../firebaseConfig.js";
import { signOut } from "firebase/auth";

export const useSignOut = () => {
  signOut(auth)
    .then(() => {})
    .catch((error) => {
      console.error("Sign out error: ", error);
    });
};
