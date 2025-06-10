import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { Link, router } from "expo-router";
import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useAuth } from "../state/AuthState/AuthContext";
import { MealEntry, FoodItems } from "../types/types";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { calculateMealMacros } from "../utils/calculateMealMacros";
import { roundOneDecimal } from "../utils/roundTwoDecimals";

export const mealLabels = [
  { key: "Breakfast", value: "Breakfast" },
  { key: "Lunch", value: "Lunch" },
  { key: "Dinner", value: "Dinner" },
  { key: "Dessert", value: "Dessert" },
  { key: "Snack", value: "Snack" },
  { key: "Other", value: "Other" },
];

export default function CreateMeal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealLabel, setMealLabel] = useState<
    "Breakfast" | "Lunch" | "Dinner" | "Dessert" | "Snack" | "Other"
  >("Breakfast");
  const [selectedFoods, setSelectedFoods] = useState<FoodItems[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState<string>("");
  const [selectListKey, setSelectListKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [foodAmount, setFoodAmount] = useState<number>(0);
  const mealId = "meal-" + Math.random().toString(16).slice(2);

  const { user, userData } = useAuth();

  //   if (!userData?.foodItems) {
  //     return <Loading />;
  //   }

  const addFoodToMeal = () => {
    if (!selectedFoodId) return;

    const foodToAdd = userData?.foodItems?.find(
      (food) => food.id === selectedFoodId
    );
    if (foodToAdd && !selectedFoods.some((food) => food.id === foodToAdd.id)) {
      setSelectedFoods([
        ...selectedFoods,
        { ...foodToAdd, amount: foodAmount },
      ]);
      setSelectedFoodId("");
      setSelectListKey((prev) => prev + 1);
      setFoodAmount(0);
    }
  };

  const removeFoodFromMeal = (id: string) => {
    setSelectedFoods(selectedFoods.filter((food) => food.id !== id));
  };

  const saveMeal = async () => {
    if (!mealName || selectedFoods.length === 0 || !user) {
      alert("Please add a meal name and at least one food item");
      return;
    }

    setIsLoading(true);
    try {
      const newMeal: MealEntry = {
        id: mealId,
        label: mealLabel,
        name: mealName,
        foods: selectedFoods,
        macros: calculateMealMacros(selectedFoods),
        scanned: false,
      };

      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        savedMeals: arrayUnion(newMeal),
      });

      alert("Meal saved successfully!");
      router.replace("/FoodsAndMeals");
    } catch (error) {
      console.error("Error saving meal:", error);
      alert("Failed to save meal. Please try again.");
    } finally {
      setIsLoading(false);
      setMealName("");
      setSelectedFoods([]);
      setSelectedFoodId("");
      setFoodAmount(0);
    }
  };
  console.log(selectedFoodId, "selectedFoodId");
  console.log(selectedFoods, "selectedFoods");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons
          name="arrow-back-circle-outline"
          size={40}
          color={"#D4AA7D"}
        />
      </Pressable>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Create a Meal</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Meal Name Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Meal Name</Text>
          <TextInput
            style={styles.input}
            value={mealName}
            onChangeText={setMealName}
            placeholder="Enter meal name"
            placeholderTextColor="#999"
          />
        </View>

        {/* Meal Type Selection */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Meal Type</Text>
          <SelectList
            setSelected={(label: any) => setMealLabel(label)}
            data={mealLabels}
            defaultOption={{ key: "Breakfast", value: "Breakfast" }}
            search={false}
            boxStyles={styles.dropdownBox}
            inputStyles={styles.dropdownInput}
            dropdownStyles={styles.dropdown}
            dropdownItemStyles={styles.dropdownItem}
            dropdownTextStyles={styles.dropdownText}
          />
        </View>

        {/* Food Selection */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Add Foods</Text>

          {userData?.foodItems && userData.foodItems.length > 0 ? (
            <>
              <View style={styles.addFoodWrapper}>
                <View style={{ flex: 1, marginBottom: 10 }}>
                  <SelectList
                    setSelected={(key: string) => {
                      if (key === "add-new-food") {
                        setSelectedFoodId("");
                        setSelectListKey((prev) => prev + 1);
                        router.push("/(auth)/FoodsAndMeals");
                      } else setSelectedFoodId(key);
                    }}
                    data={[
                      {
                        key: "add-new-food",
                        value: "Add a new food ->",
                      },
                      ...userData.foodItems.map((item) => ({
                        key: item.id,
                        value: `${item.name} (${item.brand})`,
                      })),
                    ]}
                    save="key"
                    search={true}
                    placeholder="Select a food"
                    boxStyles={styles.dropdownBox}
                    inputStyles={styles.dropdownInput}
                    dropdownStyles={styles.dropdown}
                    dropdownItemStyles={styles.dropdownItem}
                    dropdownTextStyles={styles.dropdownText}
                    key={selectListKey}
                  />
                </View>
              </View>
              <Text style={styles.inputLabel}>Amount</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="(Grams)"
                placeholderTextColor={"#999"}
                value={foodAmount ? String(foodAmount) : ""}
                onChangeText={(input) => {
                  setFoodAmount(Number(input));
                }}
                style={styles.amountInput}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={addFoodToMeal}
                disabled={foodAmount <= 0}
              >
                <Ionicons name="add-circle" size={24} color="#D4AA7D" />
                <Text style={styles.addButtonText}>Add Food to Meal</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.noFoodsText}>
              No foods available. Scan or add foods first.
              <Link href={"/(auth)/FoodsAndMeals"}>Handle foods and meals</Link>
            </Text>
          )}
        </View>

        {/* Selected Foods List */}
        {selectedFoods.length > 0 && (
          <View style={styles.selectedFoodsContainer}>
            <Text style={styles.inputLabel}>Selected Foods</Text>

            {selectedFoods.map((food, index) => (
              <View key={index} style={styles.selectedFoodItem}>
                <View style={styles.foodInfo}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text
                      style={{ marginLeft: 5, color: "#fff", fontSize: 12 }}
                    >
                      ({food.amount ?? 0}g)
                    </Text>
                  </View>
                  <Text style={styles.foodBrand}>{food.brand}</Text>
                  <Text style={styles.foodMacros}>
                    {(food.per100g.calories * (food.amount ?? 0)) / 100} kcal |{" "}
                    {(food.per100g.protein * (food.amount ?? 0)) / 100}g protein
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => removeFoodFromMeal(food.id)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close-circle" size={24} color="#D4AA7D" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Total Macros */}
        {selectedFoods.length > 0 && (
          <View style={styles.macrosContainer}>
            <Text style={styles.macrosTitle}>Total Macros</Text>
            <View style={styles.macrosGrid}>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>
                  {roundOneDecimal(calculateMealMacros(selectedFoods).calories)}
                </Text>
                <Text style={styles.macroLabel}>Calories</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>
                  {roundOneDecimal(calculateMealMacros(selectedFoods).protein)}g
                </Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>
                  {roundOneDecimal(
                    calculateMealMacros(selectedFoods).carbohydrates
                  )}
                  g
                </Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>
                  {roundOneDecimal(calculateMealMacros(selectedFoods).fat)}g
                </Text>
                <Text style={styles.macroLabel}>Fat</Text>
              </View>
            </View>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            (mealName === "" || selectedFoods.length === 0) &&
              styles.disabledButton,
          ]}
          onPress={saveMeal}
          disabled={mealName === "" || selectedFoods.length === 0 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Meal</Text>
          )}
        </TouchableOpacity>
      </View>
      <Modal visible={scannerVisible} animationType="slide">
        <Scanner
          setShowScanner={setScannerVisible}
          showScanner={scannerVisible}
        />
      </Modal>
    </ScrollView>
  );
}

// Keep your existing helper components
type ScannerProps = {
  setShowScanner: (bool: boolean) => void;
  showScanner: boolean;
};

const Scanner = ({ setShowScanner, showScanner }: ScannerProps) => {
  return (
    <CameraView style={{ flex: 1 }}>
      <Pressable
        style={{ position: "absolute", top: 40, left: 20 }}
        onPress={() => setShowScanner(!showScanner)}
      >
        <Ionicons name="arrow-back-circle" size={30} color="#D4AA7D" />
      </Pressable>
    </CameraView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2D3E40",
    minHeight: "100%",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  formContainer: {
    backgroundColor: "#5D7073",
    borderRadius: 15,
    padding: 20,
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "white",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#436164",
    borderRadius: 10,
    padding: 12,
    color: "white",
    width: "100%",
  },
  addFoodWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  dropdownBox: {
    backgroundColor: "#436164",
    borderWidth: 0,
    borderRadius: 10,
    padding: 12,

    width: "100%",
  },
  amountInput: {
    backgroundColor: "#436164",
    borderWidth: 0,
    borderRadius: 10,
    padding: 12,
    color: "white",
    width: "30%",
  },
  dropdownInput: {
    color: "#fff",
  },
  dropdown: {
    backgroundColor: "#436164",
    borderWidth: 0,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    color: "white",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#436164",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  addButtonText: {
    color: "#D4AA7D",
    marginLeft: 8,
  },
  noFoodsText: {
    color: "white",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
  selectedFoodsContainer: {
    marginBottom: 20,
  },
  selectedFoodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#436164",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  foodBrand: {
    color: "#ccc",
    fontSize: 14,
  },
  foodMacros: {
    color: "white",
    marginTop: 4,
  },
  removeButton: {
    padding: 5,
  },
  macrosContainer: {
    backgroundColor: "#436164",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  macrosTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  macrosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  macroItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 10,
  },
  macroValue: {
    color: "#D4AA7D",
    fontSize: 18,
    fontWeight: "bold",
  },
  macroLabel: {
    color: "white",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#D4AA7D",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#8a7153",
    opacity: 0.7,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
