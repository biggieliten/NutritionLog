import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GlobalContext } from "../state/GlobalState/GlobalContext";
import { GlobalContextType, Log } from "../types/types";

export const LogCard = (log: Log) => {
  return (
    <View style={styles.container}>
      {Object.entries(log).map(([key, value]) => (
        <Text key={key} style={styles.text}>
          {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
          {value === log.date ? value : Math.round(value)}
        </Text>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,

    height: "auto",
    width: 250,

    backgroundColor: "#91AC8F",
    borderRadius: 15,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
