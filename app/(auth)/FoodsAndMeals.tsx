import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../state/AuthState/AuthContext";
import { Loading } from "../components/Loading";
import { MealCard } from "../components/MealCard";
import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MealEntry, FoodItems } from "../types/types";
import { set } from "firebase/database";
import { mealLabels } from "./CreateMeal";
import { UpdateMealModal } from "../components/UpdateMealModal";
import { AddFoodItemModal } from "../components/AddFoodItemModal";
import { FoodCard } from "../components/FoodCard";
import { FoodScannerModal } from "../components/FoodScannerModal";
import { randomId } from "../utils/generateRandomId";

export default function FoodsAndMeals() {
  const { userData, user } = useAuth();
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [currentMeal, setCurrentMeal] = useState<MealEntry>();
  const [editedMeal, setEditedMeal] = useState<MealEntry>();
  const [isLoading, setIsLoading] = useState(false);
  const [modalMode, setModalMode] = useState<"edit" | "eat">("edit");
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [foodModalVisible, setFoodModalVisible] = useState(false);
  const [choice, setChoice] = useState<"meals" | "foods">("meals");
  const [foodScannerVisible, setFoodScannerVisible] = useState(false);
  const foodId = randomId("food-");

  const handleAddScannedFood = async (foodData: any) => {
    try {
      if (!user || !userData) {
        return;
      }

      if (foodData?.product) {
        const productId = foodData.product._id || null;

        const currentFoodItems = userData.foodItems || [];

        if (
          productId &&
          currentFoodItems.some((food) => food.id === productId)
        ) {
          setFoodScannerVisible(false);
          alert("This product is already scanned.");
          return;
        }

        const productName = foodData.product.product_name || "Unknown Product";
        const brandName = foodData.product.brands || "Unknown Brand";

        const newFood: FoodItems = {
          id: foodData.product._id,
          name: productName,
          brand: brandName,
          per100g: {
            calories: foodData.product.nutriments?.["energy-kcal_100g"] || 0,
            protein: foodData.product.nutriments?.["proteins_100g"] || 0,
            carbohydrates:
              foodData.product.nutriments?.["carbohydrates_100g"] || 0,
            fat: foodData.product.nutriments?.["fat_100g"] || 0,
            fiber: foodData.product.nutriments?.["fiber_100g"] || 0,
            sugar: foodData.product.nutriments?.["sugars_100g"] || 0,
          },
        };

        const updatedFoodItems = [...currentFoodItems, newFood];

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          foodItems: updatedFoodItems,
        });

        alert("Food item added successfully.");

        console.log("Added food to database:", newFood);
      } else {
        alert("Invalid product data. Please try again.");
      }
    } catch (error: any) {
      console.error("Error adding food item:", error);
      alert("Failed to add food item: " + error.message);
    }
  };
  useEffect(() => {
    if (!userData) return;
    setMeals(userData.savedMeals);
  }, [userData]);

  const removeMeal = async (id: string) => {
    try {
      setIsLoading(true);
      console.log("Removing meal with id:", id);

      const updatedMeals = meals.filter((meal) => meal.id !== id);

      setMeals(updatedMeals);

      const docRef = doc(db, "users", user!.uid);

      await updateDoc(docRef, { savedMeals: updatedMeals });

      console.log("Meal removed successfully");
    } catch (error: any) {
      console.error("Error removing meal:", error);
      alert("Failed to remove meal: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFood = async (id: string) => {
    try {
      setIsLoading(true);
      console.log("Removing food item with id:", id);

      if (!user || !userData) {
        alert("User not authenticated. Please log in again.");
        return;
      }

      const updatedFoodItems = userData.foodItems.filter(
        (foodItem) => foodItem.id !== id
      );

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        foodItems: updatedFoodItems,
      });

      alert("Food item removed successfully.");
      console.log("Food item removed successfully");
    } catch (error: any) {
      console.error("Error removing food item:", error);
      alert("Failed to remove food item: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const editMeal = (meal: MealEntry) => {
    setCurrentMeal(meal);
    setModalMode("edit");
    setMealModalVisible(true);
  };

  const eatMeal = (meal: MealEntry) => {
    setCurrentMeal(meal);
    setModalMode("eat");
    setMealModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Ionicons
          name="arrow-back-circle-outline"
          size={40}
          color={"#D4AA7D"}
        />
      </Pressable>

      {isLoading && <Loading />}
      <View style={styles.choicesContainer}>
        <Pressable
          style={choice === "meals" ? styles.mealChoice : styles.choice}
          onPress={() => setChoice("meals")}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
            Meals
          </Text>
        </Pressable>
        <Pressable
          style={choice === "foods" ? styles.foodChoice : styles.choice}
          onPress={() => setChoice("foods")}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
            Foods
          </Text>
        </Pressable>
      </View>
      {choice === "meals" ? (
        <View>
          <ScrollView
            style={styles.mealsContainer}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {meals && meals.length > 0 ? (
              meals.map((meal) => (
                <MealCard
                  id={meal.id}
                  key={meal.id}
                  meals={meal}
                  edit={editMeal}
                  eat={eatMeal}
                  remove={removeMeal}
                />
              ))
            ) : (
              <View style={styles.noContentContainer}>
                <Text style={styles.noContentText}>No meals here yet</Text>
                <Pressable onPress={() => router.push("/CreateMeal")}>
                  <Ionicons name="navigate-circle-outline"></Ionicons>
                </Pressable>
              </View>
            )}
            {meals && meals.length <= 2 && (
              <Pressable
                style={styles.addMoreContentButton}
                onPress={() => router.push("/CreateMeal")}
              >
                <Ionicons name="add-circle" size={30} color="#2D3E40" />
              </Pressable>
            )}
          </ScrollView>
        </View>
      ) : (
        <View>
          <ScrollView
            style={styles.foodsContainer}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.foodButtonsContainer}>
              <TouchableOpacity
                style={[styles.addFoodButton, { backgroundColor: "#D4AA7D" }]}
                onPress={() => setFoodModalVisible(!foodModalVisible)}
              >
                <Ionicons name="add-circle" size={50} color="#2D3E40" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addFoodButton, { backgroundColor: "#2D3E40" }]}
                onPress={() => setFoodScannerVisible(!foodScannerVisible)}
              >
                <Ionicons name="scan-circle" size={50} color="#D4AA7D" />
              </TouchableOpacity>
            </View>
            <View>
              {userData?.foodItems && userData.foodItems.length > 1 ? (
                <View>
                  {userData.foodItems.map((foodItem) => (
                    <FoodCard
                      key={foodItem.id}
                      foodItem={foodItem}
                      remove={removeFood}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.noContentContainer}>
                  <Text style={styles.noContentText}>No food here yet!</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
      {mealModalVisible && (
        <ScrollView
          style={{
            zIndex: 3,
            marginVertical: "auto",
            marginHorizontal: "auto",
          }}
        >
          <UpdateMealModal
            mode={modalMode}
            user={user!}
            userData={userData!}
            food={userData!.foodItems}
            meal={currentMeal!}
            visible={mealModalVisible}
            setVisible={() => setMealModalVisible(!mealModalVisible)}
            onComplete={() => {}}
          />
        </ScrollView>
      )}
      {foodModalVisible && (
        <AddFoodItemModal
          user={user!}
          userData={userData!}
          visible={foodModalVisible}
          setVisible={() => setFoodModalVisible(!foodModalVisible)}
          onComplete={() => {
            setFoodModalVisible(false);
          }}
        />
      )}
      {foodScannerVisible && (
        <FoodScannerModal
          visible={foodScannerVisible}
          setVisible={setFoodScannerVisible}
          onAddFood={handleAddScannedFood}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2D3E40",
    minHeight: "100%",
    padding: 20,
    flexDirection: "column",
  },
  choice: {
    backgroundColor: "#5D7073",
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  mealChoice: {
    backgroundColor: "#D4AA7D",
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  foodChoice: {
    backgroundColor: "#D4AA7D",
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  choicesContainer: {
    width: "90%",
    height: 50,
    flexDirection: "row",
    backgroundColor: "#5D7073",
    marginVertical: 25,
    marginHorizontal: "auto",
    justifyContent: "space-between",
    borderRadius: 10,
  },
  mealsContainer: {
    backgroundColor: "#5D7073",
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
    height: "80%",
  },
  foodsContainer: {
    backgroundColor: "#5D7073",
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
    height: "80%",
  },
  noContentContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  noContentText: {
    color: "#2D3E40",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 20,
  },
  addMoreContentButton: {
    backgroundColor: "#D4AA7D",
    width: "auto",
    alignSelf: "center",
    padding: 10,
    borderRadius: "50%",
  },
  foodButtonsContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  addFoodButton: {
    borderRadius: 50,
    width: 50,
    height: 50,
    zIndex: 0,
    marginHorizontal: 10,
  },
});
