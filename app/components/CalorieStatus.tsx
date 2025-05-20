import { View, Text, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useAuth } from "../state/AuthState/AuthContext";
import { divisionToPercentage } from "../utils/divisionToPercentage";
// import { stylesIndex } from "../styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { Macros, DailyGoal } from "../types/types";
import { Loading } from "./Loading";

type Props = {
  remainingCalories: number;
  burnedCalories: number;
  percentageOfDailyCalories: number;
  currentMacros: Macros;
};

export const CalorieStatus = ({
  remainingCalories,
  burnedCalories,
  percentageOfDailyCalories,
  currentMacros,
}: Props) => {
  const { user, userData } = useAuth();

  //   if (!user || !userData) {
  //     return <Loading />;
  //   }

  //   const currentMacros = userData?.currentMacros || {};
  //   const dailyGoal = userData?.dailyGoal || {};
  //   const logs = userData?.logs || [];
  //   const remainingCalories = dailyGoal.calories - currentMacros.calories;
  //   const percentageOfDailyCalories = divisionToPercentage(
  //     currentMacros.calories,
  //     dailyGoal.calories
  //   );

  return (
    <View style={styles.calorieProgressContainer}>
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <Text
          style={{
            color: "#3e4e50",
            marginTop: 10,
            fontSize: 16,
          }}
        >
          {remainingCalories}
        </Text>
        <Text>left</Text>
        <Ionicons name="add-circle-outline" size={30} color="#D4AA7D" />
      </View>
      <AnimatedCircularProgress
        size={150}
        width={8}
        fill={Number(percentageOfDailyCalories)}
        tintColor="#668a8c"
        rotation={0}
        backgroundColor="#C9D1D2"
        lineCap="round"
      >
        {() => (
          <View
            style={{
              backgroundColor: "#fff",
              height: 180,
              width: 180,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={styles.calorieStatusContainer}>
              <Text
                style={{
                  color: "#D4AA7D",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {currentMacros.calories}
              </Text>
              <Text
                style={{
                  color: "#5d7073",
                }}
              >
                of {userData?.dailyGoal.calories} kcal
              </Text>
            </View>
          </View>
        )}
      </AnimatedCircularProgress>
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <Text
          style={{
            color: "#3e4e50",
            marginTop: 10,
            fontSize: 16,
          }}
        >
          {burnedCalories}
        </Text>
        <Text>burned</Text>
        <Ionicons name="remove-circle-outline" size={30} color="#D4AA7D" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calorieProgressContainer: {
    width: "90%",
    height: "auto",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 20,
  },
  calorieStatusContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
