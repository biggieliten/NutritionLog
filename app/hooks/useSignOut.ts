import { auth } from "../../firebaseConfig.js";
import { signOut } from "firebase/auth";

export const useSignOut = () => {
  signOut(auth)
    .then(() => {
      // console.log("Signed out");
      // console.log(isSignedIn, "is signed in on SIGN OUT");
      // console.log(auth.currentUser), "currentUser on SIGN OUT";
      // setIsSignedIn(false);
    })
    .catch((error) => {
      console.error("Sign out error: ", error);
    });
};

// export default useSignOut;
