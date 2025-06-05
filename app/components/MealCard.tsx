import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Macros, MealEntry } from "../types/types";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  id: string;
  meals: MealEntry;
  remove: (id: string) => void;
  edit: any;
  eat: any;
};

export const MealCard = ({ meals, remove, edit, eat }: Props) => {
  const [isFoodsVisible, setIsFoodsVisible] = useState(false);
  const [isMacrosVisible, setIsMacrosVisible] = useState(false);
  const foodsRotateAnim = useRef(new Animated.Value(0)).current;
  const macrosRotateAnim = useRef(new Animated.Value(0)).current;

  const orderedKeys: (keyof Macros)[] = [
    "calories",
    "protein",
    "carbohydrates",
    "fat",
    "sugar",
    "fiber",
  ];

  type ExpandCardProps = {
    setVisible: (bool: boolean) => void;
    visible: boolean;
    animation: Animated.Value;
  };

  const expandCard = ({ setVisible, visible, animation }: ExpandCardProps) => {
    setVisible(!visible);
    Animated.timing(animation, {
      toValue: visible ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const foodsRotate = foodsRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const macrosRotate = macrosRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Pressable
          style={{ width: 30, height: 30, borderRadius: 15 }}
          onPress={() => {
            remove(meals.id);
          }}
        >
          <Ionicons
            // onPress={() => remove(meals.id)}
            size={20}
            color="#D4AA7D"
            name="trash-bin-outline"
          />
        </Pressable>
        <Pressable>
          <Ionicons
            onPress={() => edit(meals)}
            size={20}
            color="#D4AA7D"
            name="pencil-outline"
          />
        </Pressable>
        <Pressable>
          <Ionicons
            onPress={() => eat(meals)}
            size={20}
            color="#D4AA7D"
            name="fast-food"
          />
        </Pressable>
      </View>
      <View style={{ position: "absolute", top: 10, right: 10 }}></View>
      <Text style={styles.mealName}>{meals.name}</Text>
      <Text style={styles.mealLabel}>{meals.label}</Text>

      {/* <Text>{meal.name}</Text> */}
      <View style={styles.dropdown}>
        <Text style={styles.dropdownLabel}>Ingredients</Text>
        <Animated.View
          style={{
            // position: "absolute",
            // right: 50,
            // top: 50,
            // zIndex: 1,
            transform: [{ rotate: foodsRotate }],
          }}
        >
          <Ionicons
            name={"chevron-down"}
            size={24}
            color="#D4AA7D"
            onPress={() =>
              expandCard({
                setVisible: setIsFoodsVisible,
                visible: isFoodsVisible,
                animation: foodsRotateAnim,
              })
            }
          />
        </Animated.View>
      </View>
      {isFoodsVisible && (
        <View style={styles.dropdownContentContainer}>
          {meals.foods.map((food: any) => (
            <View style={styles.ingredientInfoContainer}>
              <Text style={styles.ingredientName}>
                {food.name}{" "}
                <Text style={styles.ingredientBrand}>({food.brand})</Text>
              </Text>
              <Text style={styles.ingredientAmount}>{food.amount}g</Text>
            </View>
          ))}
        </View>
      )}
      <View style={styles.dropdown}>
        <Text style={styles.dropdownLabel}>Macros</Text>
        <Animated.View
          style={{
            // position: "absolute",
            // right: 10,
            // top: 10,
            // zIndex: 1,
            transform: [{ rotate: macrosRotate }],
          }}
        >
          <Ionicons
            name={"chevron-down"}
            size={24}
            color="#D4AA7D"
            onPress={() =>
              expandCard({
                setVisible: setIsMacrosVisible,
                visible: isMacrosVisible,
                animation: macrosRotateAnim,
              })
            }
          />
        </Animated.View>
      </View>
      {isMacrosVisible && (
        <View style={styles.dropdownContentContainer}>
          {orderedKeys.map((key, i) => (
            <View
              style={[
                styles.dropdownMacroItem,
                i === orderedKeys.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={styles.macroLabel} key={key}>
                <Text>{meals.macros[key]}</Text>
              </Text>
              <Text style={styles.macroLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 10,
    marginBottom: 20,
    backgroundColor: "#2D3E40",
    borderRadius: 10,
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  mealName: {
    color: "#fff",
    fontWeight: "bold",
  },
  mealLabel: {
    color: "#fff",
    marginBottom: 10,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#5D7073",
    padding: 5,
    marginVertical: 5,
    borderRadius: 10,
  },
  dropdownLabel: {
    fontSize: 13,
    color: "#fff",
    // fontWeight: "bold",
  },
  dropdownContentContainer: {
    backgroundColor: "#5D7073",
    padding: 5,
    marginVertical: 5,
    borderRadius: 10,
  },
  dropdownMacroItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 6,
    // marginHorizontal: 10,
    backgroundColor: "#5D7073",
    // borderRadius: 10,
    // marginVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#D4AA7D",
  },
  ingredientInfoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 2,
  },
  ingredientName: {
    color: "#fff",
    fontSize: 14,
    // fontWeight: "bold",
    // marginBottom: 5,
  },
  ingredientAmount: {
    color: "#D4AA7D",
    fontSize: 14,
    // fontWeight: "",
    // marginBottom: 5,
  },
  ingredientBrand: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "thin",
    // marginBottom: 5,
  },
  macroLabel: {
    fontSize: 16,
    color: "#fff",
  },
  macroValue: {
    fontSize: 16,
    color: "#fff",
  },
});
