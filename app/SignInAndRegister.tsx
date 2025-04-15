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
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, db } from "../firebaseConfig.js";
import { useAuth } from "./state/AuthState/AuthContext";
import NutriLog from "../assets/images/NutriLog.js";

export default function SignInAndRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleRegister = async () => {
    setLoading(true);
    if (!email.length || !password.length) {
      alert("Please enter valid credentials");
    }
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
    if (!email.length || !password.length) {
      alert("Please enter valid login credentials");
    }
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
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <NutriLog width={200} height={200} />
      </View>
      <TextInput
        placeholder="Enter email"
        placeholderTextColor={"#aeaeaea6"}
        value={email}
        onChange={(t) => setEmail(t.nativeEvent.text.trim())}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter password"
        placeholderTextColor={"#aeaeaea6"}
        value={password}
        onChange={(t) => setPassword(t.nativeEvent.text.trim())}
        style={styles.input}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {/* <Text>{error}</Text> */}
        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
        {/* <Text>{error}</Text> */}
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
      {/* <Pressable onPress={() => console.log(!auth.currentUser, "user id")}>
        <Text>Log user</Text>
      </Pressable>
      <Pressable onPress={() => router.replace("/DailyGoal")}>
        <Text>Route</Text>
      </Pressable> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    maxWidth: 250,
    borderColor: "#aeaeae57",
    borderWidth: 1,
    borderRadius: 60,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "80%",
  },
  logoContainer: {
    // marginBottom: 20,
    // alignItems: "center",
    // backgroundColor: "#B2C9AD",
    // height: "auto",
    // width: "auto",
  },
  button: {
    width: "auto",
    height: "auto",
    padding: 10,
    margin: 5,
    backgroundColor: "#2A662D",
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
  },
});
