import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Log } from "../types/types";

export const LogCard = (log: Log) => {
  const orderedKeys: (keyof Log)[] = [
    "calories",
    "protein",
    "carbohydrates",
    "fat",
    "sugar",
    "fiber",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{log.date}</Text>
      {orderedKeys.map((key) => {
        if (key in log) {
          return (
            <View key={key}>
              <Text style={styles.text}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                {Math.round(log[key] as number)}
              </Text>
            </View>
          );
        }
        return null;
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,

    height: "auto",
    width: "85%",
    borderBottomColor: "grey",
    borderTopColor: "grey",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    // backgroundColor: "#91AC8F",
    // borderRadius: 15,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 3.84,
    // elevation: 2,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "grey",
  },
});
