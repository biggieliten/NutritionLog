import { useFocusEffect } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig.js";
import { UserContext } from "../state/UserState/UserContext";

// import { navigate } from "expo-router/build/global-state/routing.js";

export default function test() {
  const { setIsSignedIn, isSignedIn, setSignedInUser, signedInUser } =
    useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState() as any;

  //   useFocusEffect(() => {
  //     if (!auth.currentUser) {
  //       setIsSignedIn(false);
  //       console.log(isSignedIn, "useffect is signed out");
  //     }
  //     if (auth.currentUser) {
  //       setIsSignedIn(true);
  //       console.log(isSignedIn, "useffect is signed in");
  //     }
  //   });

  const handleRegister = async () => {
    setLoading(true);
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = credentials.user;
      setUser(user);

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        dailyGoal: {
          calories: 0,
          carbohydrates: 0,
          protein: 0,
          fat: 0,
        },
        logs: [],
      });

      setIsSignedIn(true);

      //   if(user) {

      //   setEmail("");
      //   setPassword("");
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      //   console.log(user.email), "user id";
      setIsSignedIn(true);
      //   setEmail("");
      //   setPassword("");
      //   console.log(isSignedIn, "is signed in on LOGIN");
      //   console.log(auth.currentUser, "currentUser on LOGIN");
      //   setIsSignedIn(true);
      //   navigate("index");
      // navigation.navigate("Home"); // Redirect to another screen after successful login
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login Error: ", error);
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // console.log("Signed out");
        // console.log(isSignedIn, "is signed in on SIGN OUT");
        // console.log(auth.currentUser), "currentUser on SIGN OUT";
        setIsSignedIn(false);
      })
      .catch((error) => {
        console.error("Sign out error: ", error);
      });
  };

  //   useFocusEffect(() => {
  //     const userState = onAuthStateChanged(auth, (user) => {
  //       setSignedInUser(user);
  //       console.log(isSignedIn, "is signed in");
  //     });
  //     console.log(signedInUser, "signed in user");
  //     return userState;
  //   });

  useEffect(() => {
    if (!auth.currentUser) {
      setUser(null);
      console.log(auth.currentUser, "IS NULL, SIGNED OUT");
    }
    if (auth.currentUser) {
      setUser(auth.currentUser);
      console.log(auth.currentUser, "IS NOT NULL, SIGNED IN");
      console.log(user, "user");
    }
  }, [isSignedIn]);
  //   useEffect(() => {
  //     if (!isSignedIn) {
  //       console.log(auth.currentUser, "IS NULL, SIGNED OUT");
  //     }
  //     if (isSignedIn) {
  //       console.log(auth.currentUser, "IS NOT NULL, SIGNED IN");
  //     }
  //   }, [isSignedIn]);

  //Create error modal if error occures. Use the firebsae errors
  // if auth.currentUser = null, the user is signed out
  return (
    <ScrollView>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChange={(t) => setEmail(t.nativeEvent.text.trim())}
      />
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChange={(t) => setPassword(t.nativeEvent.text.trim())}
      />
      {loading ? (
        <Text>{error}</Text>
      ) : (
        <Pressable onPress={() => handleRegister()}>
          <Text>Register</Text>
        </Pressable>
      )}
      {loading ? (
        <Text>{error}</Text>
      ) : (
        <Pressable onPress={() => handleLogin()}>
          <Text>Login</Text>
        </Pressable>
      )}
      <Pressable onPress={() => handleSignOut()}>
        <Text>Sign Out</Text>
      </Pressable>
      <Pressable onPress={() => console.log(!auth.currentUser, "user id")}>
        <Text>Log user</Text>
      </Pressable>
    </ScrollView>
  );
}
