import { router, useFocusEffect } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
        lastUpdated: Date(),
        dailyGoal: {
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
        },
        currentMacros: {
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
        },
        logs: [],
      });
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
      console.log(auth, "currentuser IS NOT NULL, SIGNED IN");

      //   const docRef = user && doc(db, "users", user.uid);
      //   const docSnap = docRef && (await getDoc(docRef));

      //   if (docSnap?.exists()) {
      //     console.log(docSnap?.data(), "docSnap data");
      //   }

      router.replace("/");

      //   setEmail("");
      //   setPassword("");
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login Error: ", error);
    }
  };

  useEffect(() => {
    if (!user) {
      //   setUser(null);
      //   console.log(auth.currentUser, "currentuser IS NULL, SIGNED OUT");
      console.log(auth, "currentuser IS NULL, SIGNED OUT");
    }
    if (user) {
      //   setUser(auth.currentUser);
      console.log(auth, "currentuser IS NOT NULL, SIGNED IN");
      //   console.log(user, "user");
    }
  }, [user]);

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
      <Pressable onPress={() => console.log(!auth.currentUser, "user id")}>
        <Text>Log user</Text>
      </Pressable>
      <Pressable onPress={() => router.replace("/DailyGoal")}>
        <Text>Route</Text>
      </Pressable>
    </ScrollView>
  );
}
