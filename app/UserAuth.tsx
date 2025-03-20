import { router, useFocusEffect } from "expo-router";
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
import { auth, db } from "../firebaseConfig.js";
import { useAuth } from "./state/AuthState/AuthContext";
// import { UserContext } from "./state/UserState/UserContext";

// import { navigate } from "expo-router/build/global-state/routing.js";

export default function UserAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = credentials.user;

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

      //   setIsSignedIn(true);

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
      router.replace("/");
      // Navigate to the authenticated flow
      //   onAuthStateChanged(auth, (user) => {
      //     if (user) {
      //       //   console.log("User logged in:", user);
      //     }
      //   });
      //   console.log(user.email), "user id";
      //   setIsSignedIn(true);
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
        // setIsSignedIn(false);
      })
      .catch((error) => {
        console.error("Sign out error: ", error);
      });
  };

  useEffect(() => {
    if (!user) {
      //   setUser(null);
      console.log(auth.currentUser, "currentuser IS NULL, SIGNED OUT");
    }
    if (user) {
      //   setUser(auth.currentUser);
      console.log(auth.currentUser, "currentuser IS NOT NULL, SIGNED IN");
      console.log(user, "user");
    }
  }, [user]);
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
    <ScrollView style={{ backgroundColor: "green" }}>
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
        <Pressable onPress={handleRegister}>
          <Text>Register</Text>
        </Pressable>
      )}
      {loading ? (
        <Text>{error}</Text>
      ) : (
        <Pressable onPress={handleLogin}>
          <Text>Login</Text>
        </Pressable>
      )}
      <Pressable onPress={() => handleSignOut()}>
        <Text>Sign Out</Text>
      </Pressable>
      <Pressable onPress={() => console.log(!auth.currentUser, "user id")}>
        <Text>Log user</Text>
      </Pressable>
      <Pressable onPress={() => router.replace("/DailyGoal")}>
        <Text>Route</Text>
      </Pressable>
    </ScrollView>
  );
}
