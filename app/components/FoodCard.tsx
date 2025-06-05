import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { FoodItems } from "../types/types";

type Props = {
  foodItem: FoodItems;
};

export const FoodCard = ({ foodItem }: Props) => {
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
      <Text style={styles.title}>
        {foodItem.name}
        <Text style={{ fontSize: 12, fontWeight: "light", paddingLeft: 4 }}>
          {" "}
          (100g)
        </Text>
      </Text>
      <Text style={styles.subtitle}>{foodItem.brand}</Text>

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

  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.title}>
  //         {foodItem.name}
  //         <Text> ({foodItem.brand})</Text>
  //       </Text>
  //       <View>
  //         <Text>Per 100g</Text>
  //         <View style={styles.macroContainer}>
  //           {macroOrder.map((key) => {
  //             const value =
  //               foodItem.per100g[key as keyof typeof foodItem.per100g];
  //             if (value === undefined) return null;

  //             return (
  //               <View key={key} style={styles.macroBadge}>
  //                 <Text style={styles.macroLabel}>
  //                   {key === "carbohydrates"
  //                     ? "Carbs"
  //                     : key.charAt(0).toUpperCase() + key.slice(1)}{" "}
  //                 </Text>
  //                 <Text style={styles.macroValue}>{formatMacro(key, value)}</Text>
  //               </View>
  //             );
  //           })}
  //         </View>
  //       </View>
  //     </View>
  //   );
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

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   button: {
//     backgroundColor: "#D4AA7D",
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 4,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   macroContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginTop: 8,
//   },
//   macroBadge: {
//     justifyContent: "center",
//     backgroundColor: "#2D3E40",
//     borderRadius: 6,
//     padding: 8,
//     margin: 5,
//     width: 80,
//     height: 80,
//     alignItems: "center",
//   },
//   macroLabel: {
//     color: "#D4AA7D",
//     fontSize: 12,
//     marginBottom: 2,
//   },
//   macroValue: {
//     color: "white",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
// });
