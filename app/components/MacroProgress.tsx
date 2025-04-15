import { View, StyleSheet, Text } from "react-native";
import * as Progress from "react-native-progress";
import { divisionToPercentage } from "../utils/divisionToPercentage";

export const MacroProgress = ({
  label,
  current,
  goal,
  width = 150,
  progressColor,
  unfilledColor,
}: any) => {
  const progress = divisionToPercentage(current, goal) / 100;

  return (
    <View style={styles.macroRow}>
      <Text style={styles.macroText}>{label}</Text>
      <View style={styles.progressContiner}>
        <Progress.Bar
          progress={progress}
          color={progressColor}
          unfilledColor={unfilledColor}
          width={width}
          height={20}
          borderRadius={60}
        />
        <Text style={styles.progressText}>
          {" "}
          {current} / {goal}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  macroRow: {
    marginVertical: 8,
    alignItems: "center",
  },
  progressContiner: {
    position: "relative",
    alignItems: "center",
    height: 20,
    width: "auto",
  },
  progressText: {
    position: "absolute",
    fontSize: 15,
    textAlign: "center",
    color: "white",
  },
  macroText: {
    color: "grey",
    marginBottom: 5,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "left",
    // alignSelf: "flex-start",
  },
});
