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
  Modal,
} from "react-native";
import { auth, db } from "../firebaseConfig.js";
import { useAuth } from "./state/AuthState/AuthContext";
import NutriLog from "../assets/images/NutriLog.js";
import { getFixedDate } from "./utils/todaysDate";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignInAndRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegister = async () => {
    const todaysDate = getFixedDate();

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
      const today = getFixedDate();
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        username: username,
        profilePicUrl: "",
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
        savedMeals: [],
        logs: [],

        consumption: {
          consumedCalories: 0,
          consumedProtein: 0,
          consumedCarbohydrates: 0,
          consumedFat: 0,
          consumedFiber: 0,
          consumedSugar: 0,
        },
        burnedCalories: 0,
      });

      await AsyncStorage.setItem("nutrilog-lastActive", today);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log(user, "user");
        } else {
          console.log("No user is signed in");
        }
      });

      await AsyncStorage.setItem("nutrilog-lastActive", today);
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login Error: ", error);
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  const handleLogin = async () => {
    if (!email.length || !password.length) {
      alert("Please enter valid login credentials");
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log(auth, "currentuser IS NOT NULL, SIGNED IN");

      router.replace("/");
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login Error: ", error);
    }
  };

  useEffect(() => {
    if (!user) {
      console.log(auth, "currentuser IS NULL, SIGNED OUT");
    }
    if (user) {
      console.log(auth, "currentuser IS NOT NULL, SIGNED IN");
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <NutriLog {...({ width: 200, height: 100 } as any)} />
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
        secureTextEntry={true}
        value={password}
        onChange={(t) => setPassword(t.nativeEvent.text.trim())}
        style={styles.input}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Create account</Text>
        </Pressable>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        // animationType="fade"
        transparent
      >
        <View style={styles.overlay}>
          <Pressable
            onPress={() => setModalVisible(false)}
            style={{ position: "absolute", top: 40, left: 20 }}
          >
            <Ionicons
              name="arrow-back-circle-outline"
              size={40}
              color={"#D4AA7D"}
            />
          </Pressable>
          <Text
            style={{
              color: "#fff",
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            Create An Account
          </Text>
          <TextInput
            placeholder="Enter Username"
            placeholderTextColor={"#fff"}
            value={username}
            onChange={(t) => setUsername(t.nativeEvent.text.trim())}
            style={[styles.input, { marginTop: 50 }]}
          />
          <TextInput
            placeholder="Enter Email"
            placeholderTextColor={"#fff"}
            value={email}
            onChange={(t) => setEmail(t.nativeEvent.text.trim())}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter Password"
            placeholderTextColor={"#fff"}
            secureTextEntry={true}
            value={password}
            onChange={(t) => setPassword(t.nativeEvent.text.trim())}
            style={styles.input}
          />
          <Pressable style={styles.registerButton} onPress={handleRegister}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              Register
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3E4E50",
  },
  input: {
    height: 40,
    maxWidth: 250,
    backgroundColor: "#5D7073",
    color: "#fff",
    borderColor: "#5D7073",
    borderWidth: 1,
    borderRadius: 60,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "80%",
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: "center",
    height: "auto",
    width: "auto",
  },
  button: {
    width: "auto",
    height: "auto",
    padding: 10,
    margin: 5,
    backgroundColor: "#D4AA7D",
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
  },
  overlay: {
    flex: 1,
    backgroundColor: "#2D3E40",
    justifyContent: "center",
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#D4AA7D",
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
  },
});
