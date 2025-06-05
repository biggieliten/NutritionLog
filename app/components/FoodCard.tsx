import { StyleSheet, TouchableOpacity, View, Text, Alert } from "react-native";
import { FoodItems } from "../types/types";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  foodItem: FoodItems;
  remove?: (id: string) => void;
};

export const FoodCard = ({ foodItem, remove }: Props) => {
  const macroOrder = [
    "calories",
    "protein",
    "carbohydrates",
    "fat",
    "fiber",
    "sugar",
  ];
  const formatMacro = (key: string, value: number) => {
    if (key === "calories") return `${value} kcal`;
    return `${value}g`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {foodItem.name}
            <Text style={{ fontSize: 12, fontWeight: "light", paddingLeft: 4 }}>
              {" "}
              (100g)
            </Text>
          </Text>
          <Text style={styles.subtitle}>{foodItem.brand}</Text>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            Alert.alert(
              "Delete Product",
              "Are you sure you want to delete this product?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => remove && remove(foodItem.id),
                },
              ]
            );
          }}
        >
          <Ionicons name="trash-outline" size={22} color="#D4AA7D" />
        </TouchableOpacity>
      </View>

      <View style={styles.macroContainer}>
        {macroOrder.map((key) => {
          const value = foodItem.per100g[key as keyof typeof foodItem.per100g];
          if (value === undefined) return null;

          return (
            <View key={key} style={styles.macroBadge}>
              <Text style={styles.macroLabel}>
                {key === "carbohydrates"
                  ? "Carbs"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <Text style={styles.macroValue}>
                {Math.round(value)}
                {key === "calories" ? " kcal" : "g"}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#2D3E40",
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#D4AA7D",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#D4AA7D",
    marginBottom: 12,
  },
  removeButton: {
    backgroundColor: "#5D7073",
    padding: 8,
    marginLeft: 10,
    borderRadius: 10,
  },
  macroContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    justifyContent: "space-between",
  },
  macroBadge: {
    justifyContent: "center",
    backgroundColor: "#436164",
    borderRadius: 8,
    padding: 8,
    margin: 4,
    width: "30%",
    height: 70,
    alignItems: "center",
  },
  macroLabel: {
    color: "#D4AA7D",
    fontSize: 13,
    marginBottom: 4,
  },
  macroValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
