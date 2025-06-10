import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MealEntry, FoodItems, firebaseUser } from "../types/types";
import { mealLabels } from "../(auth)/CreateMeal";
import { useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { Ionicons } from "@expo/vector-icons";
import { calculateMealMacros } from "../utils/calculateMealMacros";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { User } from "firebase/auth";
import { updateCurrentMacros } from "../hooks/updateCurrentMacros";
import { calculateSafeSum } from "../hooks/getSafeValue";
import { set } from "firebase/database";

type Props = {
  user?: User;
  userData: firebaseUser;
  meal: MealEntry;
  food: FoodItems[];
  mode: "edit" | "eat";
  visible?: boolean;
  setVisible: () => void;
  onComplete: (mealId: string, mealData: any) => void;
};

export const UpdateMealModal = ({
  user,
  userData,
  meal,
  food,
  mode,
  onComplete,
  setVisible,
  visible,
}: Props) => {
  //   const [mealData, setMealData] = useState(meal);
  const [editedMeal, setEditedMeal] = useState<MealEntry>({ ...meal });
  const [mealLabel, setMealLabel] = useState(meal.label);
  const [mealName, setMealName] = useState(meal.name);
  const [foodAmount, setFoodAmount] = useState<number>(0);
  const [selectedFood, setSelectedFood] = useState<FoodItems[]>(meal.foods);
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>();
  console.log(selectedFoodId, mealLabel);
  //   setMealLabel(meal.label);

  const handleEditMeal = async () => {
    if (!user) {
      alert("User not logged in");
      return;
    }
    try {
      const updatedMeal: MealEntry = {
        ...meal,
        label: mealLabel,
        name: mealName,
        foods: selectedFood,
        macros: calculateMealMacros(selectedFood),
        scanned: false,
      };
      setEditedMeal(updatedMeal);

      const userRef = doc(db, "users", user!.uid);

      const updatedMeals = userData.savedMeals.map((existingMeal: MealEntry) =>
        existingMeal.id === meal.id ? updatedMeal : existingMeal
      );

      await updateDoc(userRef, {
        savedMeals: updatedMeals,
      });

      alert("Meal updated successfully");
      setVisible();
    } catch (error) {
      console.error("Error updating meal:", error);
      alert("Failed to update meal");
    }
  };

  const handleEatMeal = async (eatMealAsIs: boolean) => {
    try {
      const mealToEat = eatMealAsIs
        ? meal
        : {
            ...meal,
            label: mealLabel,
            name: mealName,
            foods: selectedFood,
            macros: calculateMealMacros(selectedFood),
          };

      const currentMacros = userData.currentMacros;

      const updatedMacros = {
        calories: calculateSafeSum(
          currentMacros.calories,
          mealToEat.macros.calories
        ),
        protein: calculateSafeSum(
          currentMacros.protein,
          mealToEat.macros.protein
        ),
        carbohydrates: calculateSafeSum(
          currentMacros.carbohydrates,
          mealToEat.macros.carbohydrates
        ),
        fat: calculateSafeSum(currentMacros.fat, mealToEat.macros.fat),
        fiber: calculateSafeSum(currentMacros.fiber, mealToEat.macros.fiber),
        sugar: calculateSafeSum(currentMacros.sugar, mealToEat.macros.sugar),
      };

      await updateCurrentMacros({ uid: user!.uid, newMacros: updatedMacros });
      onComplete(meal.id, mealToEat);
      setVisible();
    } catch (error) {
      alert("Failed to eat meal: " + error);
    }
  };

  const addFoodToMeal = () => {
    if (!selectedFoodId || foodAmount <= 0) {
      alert("Please select a food and enter a valid amount");
      return;
    }

    const foodToAdd = food.find((item) => item.id === selectedFoodId);
    if (!foodToAdd) return;

    const existingFoodIndex = selectedFood.findIndex(
      (f) => f.id === selectedFoodId
    );

    if (existingFoodIndex >= 0) {
      const updatedFoods = [...selectedFood];
      updatedFoods[existingFoodIndex] = {
        ...updatedFoods[existingFoodIndex],
        amount: foodAmount,
      };
      setSelectedFood(updatedFoods);
    } else {
      setSelectedFood([...selectedFood, { ...foodToAdd, amount: foodAmount }]);
    }

    setSelectedFoodId(null);
    setFoodAmount(0);
  };

  const removeFoodFromMeal = (id: string) => {
    setSelectedFood(selectedFood.filter((food) => food.id !== id));
  };

  console.log(foodAmount, "foodAmount");

  return (
    <Modal
      visible={visible}
      style={styles.modal}
      animationType="fade"
      transparent
    >
      <View style={styles.overlay}>
        <ScrollView style={styles.modal}>
          <Pressable style={styles.closeButton} onPress={setVisible}>
            <Ionicons name="close" size={30} color="#D4AA7D" />
          </Pressable>
          <Text style={styles.modalTitle}>Edit - {meal.name}</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Meal Name</Text>
            <TextInput
              style={styles.input}
              value={mealName}
              onChangeText={setMealName}
              placeholder="Enter meal name"
              placeholderTextColor="#999"
            />
          </View>
          <View>
            <SelectList
              setSelected={(label: any) => setMealLabel(label)}
              data={mealLabels}
              defaultOption={{ key: meal.label, value: meal.label }}
              inputStyles={{ color: "white" }}
              boxStyles={{
                marginVertical: 5,
                backgroundColor: "#436164",
                borderWidth: 0,
              }}
            />
            <SelectList
              setSelected={(key: any) => setSelectedFoodId(key)}
              data={food.map((item) => ({
                key: item.id,
                value: `${item.name} (${item.brand})`,
              }))}
              inputStyles={{ color: "white" }}
              boxStyles={{
                marginVertical: 5,
                backgroundColor: "#436164",
                borderWidth: 0,
              }}
              //   defaultOption={{ key: "BreakFast", value: "Breakfast" }}
            />
            {/* <SelectList /> */}
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
            <TouchableOpacity style={styles.addButton} onPress={addFoodToMeal}>
              <Ionicons name="add-circle-outline" size={20} color="#D4AA7D" />
              <Text style={styles.buttonText}>Add to meal</Text>
            </TouchableOpacity>
          </View>
          {selectedFood.length > 0 && (
            <View style={styles.selectedFoodsContainer}>
              <Text style={styles.inputLabel}>Selected Foods</Text>

              {selectedFood.map((food, index) => (
                <View key={index} style={styles.selectedFoodItem}>
                  <View style={styles.foodInfo}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.foodName}>{food.name}</Text>
                      <Text
                        style={{ marginLeft: 5, color: "#fff", fontSize: 12 }}
                      >
                        ({food.amount ?? 0}g)
                      </Text>
                    </View>
                    <Text style={styles.foodBrand}>{food.brand}</Text>
                    <Text style={styles.foodMacros}>
                      {(food.per100g.calories * (food.amount ?? 0)) / 100} kcal
                      | {(food.per100g.protein * (food.amount ?? 0)) / 100}g
                      protein
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => removeFoodFromMeal(food.id)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={24} color="#D4AA7D" />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {selectedFood.length > 0 && (
            <View style={styles.macrosContainer}>
              <Text style={styles.sectionTitle}>Total Macros</Text>
              <View style={styles.macrosGrid}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {Math.round(calculateMealMacros(selectedFood).calories)}
                  </Text>
                  <Text style={styles.macroLabel}>Calories</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {Math.round(calculateMealMacros(selectedFood).protein)}g
                  </Text>
                  <Text style={styles.macroLabel}>Protein</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {Math.round(
                      calculateMealMacros(selectedFood).carbohydrates
                    )}
                    g
                  </Text>
                  <Text style={styles.macroLabel}>Carbs</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {Math.round(calculateMealMacros(selectedFood).fat)}g
                  </Text>
                  <Text style={styles.macroLabel}>Fat</Text>
                </View>
              </View>
            </View>
          )}
          <View style={styles.buttonContainer}>
            {mode === "edit" ? (
              <Pressable style={styles.actionButton} onPress={handleEditMeal}>
                <Text style={styles.actionButtonText}>Save Changes</Text>
              </Pressable>
            ) : (
              <View style={styles.eatMealButtons}>
                <Pressable
                  style={[
                    styles.actionButton,
                    { backgroundColor: "#436164", marginRight: 10 },
                  ]}
                  onPress={() => handleEatMeal(false)}
                >
                  <Text style={styles.actionButtonText}>Eat Edited Meal</Text>
                </Pressable>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => handleEatMeal(true)}
                >
                  <Text style={styles.actionButtonText}>Eat Meal As Is</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* {mode === "edit" ? (
            <Pressable onPress={() => handleEditMeal()}>
			<Text>Confirm</Text>
            </Pressable>
			) : (
				<Pressable
				onPress={() =>
                onComplete(meal.id, editedMeal ? editedMeal : meal)
				}
				>
				<Text>Eat</Text>
				</Pressable>
				)} */}

          {/* <Pressable onPress={setVisible}>
            <Ionicons name="close" color="#D4AA7D" size={24} />
			</Pressable> */}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    maxHeight: "90%",
    backgroundColor: "#2D3E40",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
    textAlign: "center",
  },
  selectedFoodsContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginVertical: 8,
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
  foodMacros: {
    color: "white",
    marginTop: 4,
  },
  removeButton: {
    padding: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 3,
  },
  scrollContent: {
    padding: 15,
  },
  inputGroup: {
    marginVertical: 5,
  },
  //   inputLabel: {
  //     fontSize: 16,
  //     color: "white",
  //     marginBottom: 8,
  //   },
  input: {
    backgroundColor: "#436164",
    padding: 12,
    borderRadius: 8,
    color: "white",
  },
  selectBox: {
    backgroundColor: "#436164",
    borderWidth: 0,
  },
  dropdown: {
    backgroundColor: "#436164",
    borderWidth: 0,
  },
  foodSelectionContainer: {
    marginBottom: 15,
  },
  amountContainer: {
    marginTop: 10,
  },
  amountInput: {
    backgroundColor: "#436164",
    padding: 12,
    borderRadius: 8,
    color: "white",
    width: 80,
    marginTop: 5,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#436164",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    justifyContent: "center",
  },
  buttonContainer: {
    // marginTop: 20,
    marginBottom: 15,
  },
  eatMealButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  //   closeButton: {
  //     marginTop: 10,
  //     padding: 8,
  //   },
  buttonText: {
    color: "#D4AA7D",
    marginLeft: 8,
  },
  //   selectedFoodsContainer: {
  //     marginVertical: 15,
  //   },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  //   selectedFoodItem: {
  //     flexDirection: "row",
  //     justifyContent: "space-between",
  //     alignItems: "center",
  //     backgroundColor: "#436164",
  //     borderRadius: 10,
  //     padding: 12,
  //     marginBottom: 8,
  //   },
  //   foodInfo: {
  //     flex: 1,
  //   },
  //   foodName: {
  //     color: "white",
  //     fontWeight: "bold",
  //     fontSize: 16,
  //   },
  //   foodBrand: {
  //     color: "#ccc",
  //     fontSize: 14,
  //   },
  //   foodMacros: {
  //     color: "white",
  //     marginTop: 4,
  //   },
  //   removeButton: {
  //     padding: 5,
  //   },
  macrosContainer: {
    backgroundColor: "#436164",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  macrosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  macroItem: {
    width: "48%",
    marginBottom: 10,
    alignItems: "center",
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
  actionButton: {
    backgroundColor: "#D4AA7D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
