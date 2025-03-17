import {
  GoogleAuthProvider,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { auth, db } from "../../firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";

// const provider = new GoogleAuthProvider();

export default function test() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState() as any;

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
      console.log(user.email), "user id";
      // navigation.navigate("Home"); // Redirect to another screen after successful login
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login Error: ", error);
    }
  };

  //Create error modal if error occures. Use the error from
  return (
    <ScrollView>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChange={(t) => setEmail(t.nativeEvent.text)}
      />
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChange={(t) => setPassword(t.nativeEvent.text)}
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
    </ScrollView>
  );
}
