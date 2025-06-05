import { View, StyleSheet, Text } from "react-native";
import * as Progress from "react-native-progress";
import { divisionToPercentage } from "../utils/divisionToPercentage";

const MacroProgress = ({
  label,
  current,
  goal,
  //   width = ,
  progressColor,
  unfilledColor,
}: any) => {
  const progress = divisionToPercentage(current, goal) / 100;

  return (
    <View style={styles.macroRow}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
          <Text style={{ fontWeight: "bold" }}>{Math.round(current)}g </Text>
          <Text style={{}}> of {goal}g</Text>
        </View>
      </View>
      <View style={styles.progressContiner}>
        <Progress.Bar
          progress={progress}
          color={progressColor}
          unfilledColor={unfilledColor}
          width={300}
          height={10}
          borderRadius={60}
          borderColor="transparent"
        />
      </View>
    </View>
  );
};

export default MacroProgress;

const styles = StyleSheet.create({
  macroRow: {
    marginVertical: 8,
    alignItems: "center",
  },
  progressContiner: {
    // position: "relative",
    alignItems: "center",
    height: 20,
    width: "auto",
    display: "flex",
    justifyContent: "space-evenly",
  },

  labelContainer: {
    display: "flex",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  label: {
    color: "#8FA3A6",
    marginBottom: 5,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "left",
  },
});
