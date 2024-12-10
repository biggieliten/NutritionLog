import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flexCenter: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export const stylesIndex = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  dailyProgressContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,

    padding: 10,
    marginTop: 10,

    backgroundColor: "lightgrey",
    borderRadius: 15,
  },
  camera: {
    flex: 1,
  },
  flashButton: {
    position: "absolute",
    bottom: 30,
    marginLeft: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  scanButton: {
    position: "absolute",
    bottom: 30,
    marginLeft: 80,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
});
