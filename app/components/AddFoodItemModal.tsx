// import { View, Text, TextInput } from "react-native";

// export const AddFoodItemModal = () => {
//   return (
//     <View>
//       <Text>Add Food Item Modal</Text>
//       <View>
//         <Text>Food Label</Text>
//         <TextInput />
//       </View>
//       <View>
//         <Text>Brand</Text>
//         <TextInput />
//       </View>
//       <View>
//         <Text>100/g</Text>
//         <View>
//           <Text>Calories</Text>
//           <TextInput />
//         </View>
//         <View>
//           <Text>Protein</Text>
//           <TextInput />
//         </View>
//         <View>
//           <Text>Carbohydrates</Text>
//           <TextInput />
//         </View>
//         <View>
//           <Text>Fat</Text>
//           <TextInput />
//         </View>
//         <View>
//           <Text>Fiber</Text>
//           <TextInput />
//         </View>
//         <View>
//           <Text>Sugar</Text>
//           <TextInput />
//         </View>
//       </View>
//     </View>
//   );
// };

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { FoodItems } from "../types/types";

type Props = {
  user: any;
  userData: any;
  visible: boolean;
  setVisible: () => void;
  onComplete?: () => void;
};

export const AddFoodItemModal = ({
  user,
  userData,
  visible,
  setVisible,
  onComplete,
}: Props) => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");
  const [sugar, setSugar] = useState("");
  const foodId = "food-" + Math.random().toString(16).slice(2);

  const resetForm = () => {
    setName("");
    setBrand("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setFiber("");
    setSugar("");
  };

  const handleAddFood = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "User not authenticated. Please log in again.");
        return;
      }

      if (!name || !brand || !calories || !protein || !carbs || !fat) {
        Alert.alert("Validation Error", "Please fill all required fields.");
        return;
      }

      const newFood: FoodItems = {
        id: foodId,
        name,
        brand,
        per100g: {
          calories: Number(calories),
          protein: Number(protein),
          carbohydrates: Number(carbs),
          fat: Number(fat),
          fiber: fiber ? Number(fiber) : 0,
          sugar: sugar ? Number(sugar) : 0,
        },
      };

      const currentFoodItems = userData.foodItems || [];

      const updatedFoodItems = [...currentFoodItems, newFood];

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        foodItems: updatedFoodItems,
      });

      Alert.alert("Success", "Food item added successfully.");

      resetForm();
      setVisible();

      if (onComplete) onComplete();
    } catch (error) {
      console.error("Error adding food item:", error);
      Alert.alert("Error", "Failed to add food item. Please try again.");
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Add New Food Item</Text>
          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Food Name*</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter food name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Brand*</Text>
              <TextInput
                style={styles.input}
                value={brand}
                onChangeText={setBrand}
                placeholder="Enter brand name"
                placeholderTextColor="#999"
              />
            </View>

            <Text style={styles.sectionTitle}>Nutrition per 100g</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Calories (kcal)*</Text>
              <TextInput
                style={styles.input}
                value={calories}
                onChangeText={setCalories}
                placeholder="Enter calories"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Protein (g)*</Text>
              <TextInput
                style={styles.input}
                value={protein}
                onChangeText={setProtein}
                placeholder="Enter protein"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Carbohydrates (g)*</Text>
              <TextInput
                style={styles.input}
                value={carbs}
                onChangeText={setCarbs}
                placeholder="Enter carbohydrates"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fat (g)*</Text>
              <TextInput
                style={styles.input}
                value={fat}
                onChangeText={setFat}
                placeholder="Enter fat"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fiber (g)</Text>
              <TextInput
                style={styles.input}
                value={fiber}
                onChangeText={setFiber}
                placeholder="Enter fiber"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Sugar (g)</Text>
              <TextInput
                style={styles.input}
                value={sugar}
                onChangeText={setSugar}
                placeholder="Enter sugar"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAddFood}
            >
              <Text style={styles.actionButtonText}>Add Food</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={setVisible}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeIcon} onPress={setVisible}>
            <Ionicons name="close" color="#D4AA7D" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#2D3E40",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    position: "relative",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
    textAlign: "center",
  },
  formContainer: {
    maxHeight: 400,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D4AA7D",
    marginVertical: 10,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: "white",
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#436164",
    padding: 12,
    borderRadius: 8,
    color: "white",
  },
  buttonContainer: {
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: "#D4AA7D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#2D3E40",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 8,
  },
  closeButtonText: {
    color: "#D4AA7D",
    textAlign: "center",
  },
  closeIcon: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});
