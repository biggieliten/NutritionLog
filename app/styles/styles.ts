import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flexCenter: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const containerShadow = StyleSheet.create({
  containerShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
});

export const stylesIndex = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "100%",
    backgroundColor: "white",
  },
  containerShadow: {
    ...containerShadow.containerShadow,
  },

  dailyProgressContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "85%",

    padding: 10,
    marginTop: 15,

    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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

export const stylesDailyGoal = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "100%",
    backgroundColor: "#B2C9AD",
  },
  inputContainer: {
    width: "80%",
    // minHeight: "100%",
  },
  containerShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  dailyProgressContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    padding: 20,
    marginTop: 10,
    backgroundColor: "#91AC8F",
    borderRadius: 15,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  title: {
    position: "absolute",
    top: 70,

    textAlign: "center",
    textAlignVertical: "center",

    width: "60%",
    height: 50,

    borderRadius: 10,

    fontSize: 20,
    fontWeight: "bold",

    color: "white",
    backgroundColor: "#91AC8F",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
    color: "white",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#91AC8F",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export const stylesAddMeal = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "100%",
    backgroundColor: "#B2C9AD",
    padding: 20,
  },
  contentContainer: {
    ...containerShadow.containerShadow,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
    marginTop: 10,
    backgroundColor: "#91AC8F",
    borderRadius: 15,
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  input: {
    ...containerShadow.containerShadow,

    width: "100%",
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    ...containerShadow.containerShadow,
    width: "60%",
    height: 50,
    // padding: 15,
    backgroundColor: "#B2C9AD",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
