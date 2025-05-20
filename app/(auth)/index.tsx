import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import LogCard from "../components/LogCard";
import { Log, Macros, DailyGoal } from "../types/types";
import { stylesIndex } from "../styles/styles";
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
  // const [renderedLogs, setRenderedLogs] = useState(5);
  const { user, userData } = useAuth();

  if (!user || !userData) {
    return <Loading />;
  }

  //   if (!userData) return;

  const [renderedLogs, setRenderedLogs] = useState(5);
  const currentMacros = userData?.currentMacros || {};
  const totalConsumption = userData?.consumption || {};
  console.log("🪵 | Index | consumption:", totalConsumption);
  const dailyGoal = userData?.dailyGoal || {};
  const logs = userData?.logs || [];
  const remainingCalories = dailyGoal.calories - currentMacros.calories;
  //   const totalConsumption = {
  //     calories: currentMacros.calories,
  //     protein: currentMacros.protein,
  //     carbohydrates: currentMacros.carbohydrates,
  //     fat: currentMacros.fat,
  //     fiber: currentMacros.fiber,
  //     sugar: currentMacros.sugar,
  //   };
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
    // todaysDate = "2025-05-22";

    onNewDate(
      todaysDate,
      userData.lastActive || "",
      currentMacros,
      //   totalConsumption,
      defaultValues,
      defaultValues,
      user.uid
    );
  }, [user, userData, userData.lastActive]);

  return (
    <ScrollView contentContainerStyle={stylesIndex.container}>
      <View style={stylesIndex.header}>
        <Text style={stylesIndex.headerWeekday}>{getWeekday()}</Text>
        {/* <View style={stylesIndex.headerDateContainer}> */}
        <Text style={stylesIndex.headerDate}>{formatDate(getFixedDate())}</Text>
        {/* <Apple width={40} height={40} /> */}
      </View>

      {/* <Pressable onPress={lastActiv}><Text>Press</Text></Pressable> */}

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
            {/* <Text style={stylesIndex.sectionTitle}>Today's Progress</Text> */}
            {/* <View style={stylesIndex.calorieProgressContainer}>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text
                  style={{
                    color: "#3e4e50",
                    marginTop: 10,
                    fontSize: 16,
                  }}
                >
                  {remainingCalories} left
                </Text>
                <Ionicons name="add-circle-outline" />
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
                    <View style={stylesIndex.calorieStatusContainer}>
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
                  {remainingCalories} burned
                </Text>
                <Ionicons name="remove-circle-outline" />
              </View>
            </View> */}

            <View style={stylesIndex.dailyProgressContainer}>
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

      <View style={stylesIndex.splitterBox}>
        <View style={stylesIndex.splitter}></View>
        <Ionicons name="time-outline" color="#D4AA7D" size={28} />
        <View style={stylesIndex.splitter}></View>
      </View>

      {/* <Text style={stylesIndex.historySectionTitle}>Previous Acivity</Text> */}
      <View style={stylesIndex.historyContainer}>
        {reverseLogs && reverseLogs.length > 0 ? (
          <>
            {reverseLogs
              .slice(0, renderedLogs)
              .map((log: Log, index: number) => (
                <LogCard key={index} {...log} />
              ))}
            {!allLogsRendered && (
              <Pressable
                style={stylesIndex.loadMoreButton}
                onPress={loadMoreLogs}
              >
                <Text style={stylesIndex.loadMoreButtonText}>Load more</Text>
              </Pressable>
            )}
          </>
        ) : (
          <Text style={stylesIndex.emptyHistoryText}>
            Your macros called — they’d like to be logged.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
