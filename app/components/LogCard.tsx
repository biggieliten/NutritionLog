import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GlobalContext } from "../state/GlobalState/GlobalContext";
import { GlobalContextType, Log } from "../types/types";

export const LogCard = (log: Log) => {
  return (
    <View style={styles.container}>
      <Text>Date: {log.date}</Text>
      <Text>Calories: {log.calories}</Text>
      <Text>Protein: {log.protein}</Text>
      <Text>Carbohydrates: {log.carbohydrates}</Text>
      <Text>Fat: {log.fat}</Text>
      <Text>Fiber: {log.fiber}</Text>
      <Text>Sugar: {log.sugar}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,

    height: "auto",
    width: 250,
    backgroundColor: "lightgrey",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
