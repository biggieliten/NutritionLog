import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flexCenter: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export const containerShadow = StyleSheet.create({
  containerShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
});
