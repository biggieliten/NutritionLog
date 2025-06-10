import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import LogCard from "../components/LogCard";
import { Log, Macros, DailyGoal } from "../types/types";
import { containerShadow } from "../styles/styleUtils";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { divisionToPercentage } from "../utils/divisionToPercentage";
import { Link } from "expo-router";
import { getFixedDate, formatDate, getWeekday } from "../utils/todaysDate";
import { useAuth } from "../state/AuthState/AuthContext";
import MacroProgress from "../components/MacroProgress";
import { onNewDate } from "../helpers/resetOnNewDate";
import { Ionicons } from "@expo/vector-icons";
import { Loading } from "../components/Loading";
import { trackCalorieBurn } from "../utils/trackBurnedCalories";
import { CalorieStatus } from "../components/CalorieStatus";
import { trackConsumption } from "../utils/trackConsumption";

export default function Index() {
  const { user, userData } = useAuth();

  if (!user || !userData) {
    return <Loading />;
  }

  const [renderedLogs, setRenderedLogs] = useState(5);
  const currentMacros = userData?.currentMacros || {};
  const totalConsumption = userData?.consumption || {};
  console.log("🪵 | Index | consumption:", totalConsumption);
  const dailyGoal = userData?.dailyGoal || {};
  const logs = userData?.logs || [];
  const remainingCalories = dailyGoal.calories - currentMacros.calories;
  const percentageOfDailyCalories = divisionToPercentage(
    currentMacros.calories,
    dailyGoal.calories
  );
  const reverseLogs = [...logs].reverse() || [];
  const allLogsRendered = renderedLogs >= reverseLogs.length;

  const defaultValues: DailyGoal | Macros = {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  };

  const loadMoreLogs = () => {
    setRenderedLogs((prev) => prev + 5);
  };

  useEffect(() => {
    if (!user || !userData) return;
    let todaysDate = getFixedDate();

    onNewDate(
      todaysDate,
      userData.lastActive || "",
      currentMacros,
      defaultValues,
      defaultValues,
      user.uid
    );
  }, [user, userData, userData.lastActive]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerWeekday}>{getWeekday()}</Text>
        <Text style={styles.headerDate}>{formatDate(getFixedDate())}</Text>
      </View>

      <>
        {dailyGoal.calories <= 0 ? (
          <Link href="/DailyGoal" style={{ width: "65%", marginTop: 10 }}>
            <View
              style={{
                width: "100%",
                padding: 8,
                backgroundColor: "#D4AA7D",
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                position: "relative",
                // justifyContent: "space-evenly",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  width: "auto",
                  marginLeft: 30,
                  //   flex: 1,
                  fontSize: 18,
                  fontWeight: "bold",
                  //   backgroundColor: "#ccc",
                }}
              >
                Define Todays Goal
              </Text>
              <Ionicons
                name="arrow-forward-outline"
                size={24}
                color={"#fff"}
                style={{ position: "absolute", right: 30 }}
              />
            </View>
          </Link>
        ) : (
          <>
            <CalorieStatus
              remainingCalories={remainingCalories}
              burnedCalories={userData.burnedCalories}
              percentageOfDailyCalories={percentageOfDailyCalories}
              currentMacros={currentMacros}
            />
            <View style={styles.dailyProgressContainer}>
              <MacroProgress
                label="Protein"
                progressColor="#D4AA7D"
                unfilledColor="#E9D5BC"
                current={currentMacros.protein}
                goal={dailyGoal.protein}
              />
              <MacroProgress
                label="Carbs"
                progressColor="#8FA3A6"
                unfilledColor="#C9D1D2"
                current={currentMacros.carbohydrates}
                goal={dailyGoal.carbohydrates}
              />
              <MacroProgress
                label="Fat"
                progressColor="#D97862"
                unfilledColor="#EACDC7"
                current={currentMacros.fat}
                goal={dailyGoal.fat}
              />
              {dailyGoal.fiber > 0 && !isNaN(dailyGoal.fiber) && (
                <MacroProgress
                  label="Fiber"
                  progressColor="#6A9395"
                  unfilledColor="#C0D6CD"
                  current={currentMacros.fiber}
                  goal={dailyGoal.fiber}
                />
              )}
              {dailyGoal.sugar > 0 && (
                <MacroProgress
                  label="Sugar"
                  progressColor="#C2855A"
                  unfilledColor="#E7CDB6"
                  current={currentMacros.sugar}
                  goal={dailyGoal.sugar}
                />
              )}
            </View>
          </>
        )}
      </>

      <View style={styles.splitterBox}>
        <View style={styles.splitter}></View>
        <Ionicons name="time-outline" color="#D4AA7D" size={28} />
        <View style={styles.splitter}></View>
      </View>

      <View style={styles.historyContainer}>
        {reverseLogs && reverseLogs.length > 0 ? (
          <>
            {reverseLogs
              .slice(0, renderedLogs)
              .map((log: Log, index: number) => (
                <LogCard key={index} {...log} />
              ))}
            {!allLogsRendered && (
              <Pressable style={styles.loadMoreButton} onPress={loadMoreLogs}>
                <Text style={styles.loadMoreButtonText}>Load more</Text>
              </Pressable>
            )}
          </>
        ) : (
          <Text style={styles.emptyHistoryText}>
            Your macros called — they’d like to be logged.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    minHeight: "100%",
    backgroundColor: "#2D3E40",
    paddingBottom: 30,
    paddingTop: 10,
  },
  header: {
    width: "100%",

    // borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    // ...containerShadow.containerShadow,
  },
  headerWeekday: {
    color: "#FFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerDate: {
    color: "#FFFF",
    fontWeight: "normal",
    fontSize: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  dailyProgressContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    padding: 18,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 20,
    ...containerShadow.containerShadow,
  },
  calorieProgressContainer: {
    width: "90%",
    height: "auto",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 20,
  },
  calorieStatusContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  historySectionTitle: {
    color: "#D4AA7D",
    fontSize: 20,
    fontWeight: "bold",
    // marginBottom: 10,
    marginTop: 10,
    marginLeft: 20,
    alignSelf: "flex-start",
    // marginLeft: "auto",
    // marginRight: "auto",
  },
  historyContainer: {
    width: "100%",
    borderRadius: 16,
  },
  emptyHistoryText: {
    color: "#b0b0b0",
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 20,
  },
  loadMoreButton: {
    marginHorizontal: "auto",
    backgroundColor: "#D4AA7D",
    borderRadius: 8,
    marginTop: 10,
    padding: 10,
  },
  loadMoreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  splitterBox: {
    width: "90%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  splitter: {
    width: "40%",
    height: 1,
    backgroundColor: "#ccc",
    opacity: 0.5,
    marginVertical: 30,
  },
});
