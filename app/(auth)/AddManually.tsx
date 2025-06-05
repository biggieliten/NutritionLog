import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../state/AuthState/AuthContext";
import { updateCurrentMacros } from "../hooks/updateCurrentMacros";
import { set } from "firebase/database";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { trackConsumption } from "../utils/trackConsumption";

type Props = {
  setShowModal: (bool: boolean) => void;
};

export const AddManually = ({ setShowModal }: Props) => {
  const { userData, user } = useAuth();
  if (!userData || !user) return;
  const [newMacros, setNewMacros] = useState({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  });
  const currentMacros = userData?.currentMacros;

  const updatedMacros = {
    calories: currentMacros.calories + newMacros.calories,
    protein: currentMacros.protein + newMacros.protein,
    carbohydrates: currentMacros.carbohydrates + newMacros.carbohydrates,
    fat: currentMacros.fat + newMacros.fat,
    fiber: currentMacros.fiber + newMacros.fiber,
    sugar: currentMacros.sugar + newMacros.sugar,
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Pressable
            style={styles.cancleButton}
            onPress={() => setShowModal(false)}
          >
            <Ionicons
              name="arrow-back-circle-outline"
              size={40}
              color={"#D4AA7D"}
            />
          </Pressable>
          <Text style={styles.header}>Enter Macronutrients</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Calories</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Number"
              placeholderTextColor={"#fff"}
              // value={String(newMacros.calories)}
              onChangeText={(input) =>
                setNewMacros({ ...newMacros, calories: Number(input) })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Protein (g)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Number"
              placeholderTextColor={"#fff"}
              // value={String(newMacros.protein)}
              onChangeText={(input) =>
                setNewMacros({ ...newMacros, protein: Number(input) })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Carbs (g)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Number"
              placeholderTextColor={"#fff"}
              // value={String(newMacros.carbohydrates)}
              onChangeText={(input) =>
                setNewMacros({ ...newMacros, carbohydrates: Number(input) })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Fat (g)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              // value={String(newMacros.fat)}
              placeholder="Number"
              placeholderTextColor={"#fff"}
              onChangeText={(input) =>
                setNewMacros({ ...newMacros, fat: Number(input) })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Fiber (g)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Number"
              placeholderTextColor={"#fff"}
              // value={String(newMacros.fiber)}
              onChangeText={(input) =>
                setNewMacros({ ...newMacros, fiber: Number(input) })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Sugar (g)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Number"
              placeholderTextColor={"#fff"}
              // value={String(newMacros.sugar)}
              onChangeText={(input) =>
                setNewMacros({ ...newMacros, sugar: Number(input) })
              }
            />
          </View>

          <Pressable
            onPress={() => {
              updateCurrentMacros({ uid: user.uid, newMacros: updatedMacros });
              trackConsumption(user.uid, userData.consumption, newMacros);
              setShowModal(false);
              router.replace("/");
            }}
          >
            <Ionicons
              style={styles.addButton}
              name="add-circle-outline"
              size={40}
              color={"#D4AA7D"}
            />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "100%",
    // backgroundColor: "#fff",
    // padding: 20,
  },
  contentContainer: {
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: "100%",
    // padding: 20,
    // marginTop: 10,
    backgroundColor: "#2D3E40",
    marginVertical: 20,
  },
  header: {
    marginTop: 40,
    color: "#D4AA7D",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#5D7073",
    color: "#fff",
    // borderWidth: 1,
    borderColor: "#8FA3A6",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignSelf: "flex-start",
    width: "100%",
  },
  inputTitle: {
    alignSelf: "flex-start",
    color: "#D4AA7D",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "70%",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cancleButton: {
    position: "absolute",
    top: 15,
    left: 15,
  },
  addButton: {
    marginBottom: 30,
  },
});
