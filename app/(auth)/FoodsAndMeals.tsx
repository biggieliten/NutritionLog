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
import { MealEntry } from "../types/types";
import { set } from "firebase/database";
import { mealLabels } from "./CreateMeal";
import { UpdateMealModal } from "../components/UpdateMealModal";
import { AddFoodItemModal } from "../components/AddFoodItemModal";
import { FoodCard } from "../components/FoodCard";

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

  //   if (!userData || !user) {
  //     return <Loading />;
  //   }

  useEffect(() => {
    if (!userData) return;
    setMeals(userData.savedMeals);
  }, [userData]);

  //   const meals = userData.savedMeals;
  //   const foods = userData.foodItems;

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
      {/* <Text>Meals and Foods</Text> */}

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
            showsVerticalScrollIndicator={true} // Add this
          >
            {meals.map((meal) => (
              <MealCard
                id={meal.id}
                key={meal.id}
                meals={meal}
                edit={editMeal}
                eat={eatMeal}
                remove={removeMeal}
              />
            ))}
          </ScrollView>
        </View>
      ) : (
        <View>
          {/* <Text style={styles.header}>Foods</Text> */}
          <ScrollView
            style={styles.foodsContainer}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true} // Add this
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
              >
                <Ionicons name="scan-circle" size={50} color="#D4AA7D" />
              </TouchableOpacity>
            </View>
            <View>
              {userData?.foodItems && userData.foodItems.length > 0 ? (
                <View>
                  {userData.foodItems.map((foodItem) => (
                    <FoodCard key={foodItem.id} foodItem={foodItem} />
                  ))}
                </View>
              ) : (
                <View>
                  <Text>No food items yet. Add your first food item!</Text>
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
