import { View, Text, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useAuth } from "../state/AuthState/AuthContext";
import { divisionToPercentage } from "../utils/divisionToPercentage";
// import { stylesIndex } from "../styles/styleUtils";
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
      <View style={styles.statCard}>
        <View style={[styles.statTextContainer, { marginRight: 25 }]}>
          <View style={styles.iconCircle}>
            <Ionicons name="pizza" size={24} color="#D4AA7D" />
          </View>
          <Text style={styles.statLabel}>Remaining</Text>
          <Text style={styles.statValue}>{Math.round(remainingCalories)}</Text>
        </View>
      </View>

      {/* Main Progress Circle */}
      <View style={styles.progressCircleContainer}>
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
            <View style={styles.innerCircle}>
              <View style={styles.calorieStatusContainer}>
                <Text style={styles.currentCalories}>
                  {currentMacros.calories.toFixed(0)}
                </Text>
                <Text style={styles.totalCalories}>
                  of {Math.round(userData?.dailyGoal.calories)} kcal
                </Text>
              </View>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      <View style={styles.statCard}>
        <View style={[styles.statTextContainer, { marginLeft: 25 }]}>
          <View style={[styles.iconCircle, styles.burnedIconCircle]}>
            <Ionicons name="flame" size={24} color="#D4AA7D" />
          </View>
          <Text style={styles.statLabel}>Burned</Text>
          <Text style={styles.statValue}>{Math.round(burnedCalories)}</Text>
        </View>
      </View>
    </View>
  );

  //   return (
  //     <View style={styles.calorieProgressContainer}>
  //       <View style={{ flexDirection: "column", alignItems: "center" }}>
  //         <Text style={{ fontWeight: "bold", color: "#3A4D4F" }}>Remaining</Text>
  //         <Text
  //           style={{
  //             color: "#3e4e50",
  //             marginVertical: 5,
  //             fontSize: 16,
  //           }}
  //         >
  //           {Math.round(remainingCalories)}
  //         </Text>
  //         <Ionicons name="pizza" size={30} color="#D4AA7D" />
  //       </View>
  //       <AnimatedCircularProgress
  //         size={150}
  //         width={8}
  //         fill={Number(percentageOfDailyCalories)}
  //         tintColor="#668a8c"
  //         rotation={0}
  //         backgroundColor="#C9D1D2"
  //         lineCap="round"
  //       >
  //         {() => (
  //           <View
  //             style={{
  //               backgroundColor: "#fff",
  //               height: 180,
  //               width: 180,
  //               borderRadius: 100,
  //               alignItems: "center",
  //               justifyContent: "center",
  //             }}
  //           >
  //             <View style={styles.calorieStatusContainer}>
  //               <Text
  //                 style={{
  //                   color: "#D4AA7D",
  //                   fontSize: 20,
  //                   fontWeight: "bold",
  //                 }}
  //               >
  //                 {currentMacros.calories.toFixed(0)}
  //               </Text>
  //               <Text
  //                 style={{
  //                   color: "#5d7073",
  //                 }}
  //               >
  //                 of {Math.round(userData?.dailyGoal.calories)} kcal
  //               </Text>
  //             </View>
  //           </View>
  //         )}
  //       </AnimatedCircularProgress>
  //       <View style={{ flexDirection: "column", alignItems: "center" }}>
  //         <Text style={{ fontWeight: "bold", color: "#3A4D4F" }}>Burned</Text>
  //         <Text
  //           style={{
  //             color: "#3e4e50",
  //             marginVertical: 5,
  //             fontSize: 16,
  //           }}
  //         >
  //           {Math.round(burnedCalories)}
  //         </Text>
  //         <Ionicons name="flame" size={30} color="#D4AA7D" />
  //       </View>
  //     </View>
  //   );
};

const styles = StyleSheet.create({
  calorieProgressContainer: {
    width: "90%",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressCircleContainer: {
    alignItems: "center",
    flex: 1.5,
    zIndex: 2,
  },
  innerCircle: {
    backgroundColor: "#fff",
    height: 134,
    width: 134,
    borderRadius: 67,
    alignItems: "center",
    justifyContent: "center",
  },
  calorieStatusContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  currentCalories: {
    color: "#D4AA7D",
    fontSize: 24,
    fontWeight: "bold",
  },
  totalCalories: {
    color: "#5d7073",
    fontSize: 12,
  },
  statCard: {
    // flex: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    height: "auto",
    width: 150,
    // justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    zIndex: 1,
  },
  iconCircle: {
    backgroundColor: "#f0f6f7",
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  burnedIconCircle: {
    backgroundColor: "#fff0eb",
  },
  statTextContainer: {
    alignItems: "center",
  },
  statLabel: {
    fontWeight: "bold",
    color: "#3A4D4F",
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: "#3e4e50",
    fontSize: 18,
    fontWeight: "600",
  },
});

// const styles = StyleSheet.create({
//   calorieProgressContainer: {
//     width: "90%",
//     height: "auto",
//     backgroundColor: "#fff",
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     alignItems: "center",
//     borderRadius: 16,
//     paddingVertical: 20,
//   },
//   calorieStatusContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
