// import { ScrollView, Pressable, Text } from "react-native";
// import { auth } from "../../firebaseConfig.js";
// import { signOut } from "firebase/auth";
// import { UserContext } from "../state/UserState/UserContext";
// import { useContext } from "react";

// export default function Pofile() {
//   const handleSignOut = () => {
//     const { setIsSignedIn, isSignedIn, setSignedInUser, signedInUser } =
//       useContext(UserContext);

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
//   return (
//     <ScrollView>
//       <Pressable onPress={handleSignOut}>
//         <Text>Sign Out</Text>
//       </Pressable>
//     </ScrollView>
//   );
// }
