import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import LogCard from "../components/LogCard";
import { Log, Macros, DailyGoal } from "../types/types";
import { stylesIndex } from "../styles/styles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import * as Progress from "react-native-progress";
import { divisionToPercentage } from "../utils/divisionToPercentage";
import { Link, router } from "expo-router";
import {
  getFixedDate,
  formatDate,
  getDate,
  getWeekday,
} from "../utils/todaysDate";
import { useAuth } from "../state/AuthState/AuthContext";
import { addLog } from "../hooks/addLog";
import { updateDailyGoal } from "../hooks/updateDailyGoal";
import { updateCurrentMacros } from "../hooks/updateCurrentMacros";
import MacroProgress from "../components/MacroProgress";
import Apple from "@/assets/images/apple";
import { resetOnNewDate } from "../helpers/resetOnNewDate";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const { user, userData } = useAuth();

  if (!user || !userData) return;

  const currentMacros = userData?.currentMacros || {};
  const dailyGoal = userData?.dailyGoal || {};
  const logs = userData?.logs || [];
  const reverseLogs = [...logs].reverse() || [];
  const remainingCalories = dailyGoal.calories - currentMacros.calories;
  const percentageOfDailyCalories = divisionToPercentage(
    currentMacros.calories,
    dailyGoal.calories
  );
  //   getToday();
  //   const todaysDate = getToday();
  //   console.log(userData.lastActive, "userData lastActive");

  const defaultValues: DailyGoal | Macros = {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  };
  //   const defaultMacros: Macros = {
  //     calories: 0,
  //     protein: 0,
  //     carbohydrates: 0,
  //     fat: 0,
  //     fiber: 0,
  //     sugar: 0,
  //   };

  const lastActiv = async () => {
    // const a = await AsyncStorage.getItem("nutrilog-lastActive");

    // console.log(userData.lastActive, "lastActive");
    console.log(getWeekday(), "getToday();");
  };
  useEffect(() => {
    if (user && userData) {
      let todaysDate = getFixedDate();
      //   todaysDate = "2025-05-11";

      resetOnNewDate(
        todaysDate,
        userData.lastActive || "",
        currentMacros,
        // dailyGoal,
        defaultValues,
        defaultValues,
        user.uid
        // userData.email
      );
      //   resetOnNewDate(
      //     todaysDate,
      //     userData.date || "",
      //     userData.currentMacros || defaultMacros,
      //     defaultDailyGoal,
      //     defaultMacros,
      //     user.uid
      //   );
    }
  }, [user, userData, userData.lastActive]);

  const logChunk = () => {};

  return (
    <ScrollView contentContainerStyle={stylesIndex.container}>
      {/* Header */}
      <View style={stylesIndex.header}>
        <Text style={stylesIndex.headerWeekday}>{getWeekday()}</Text>
        {/* <View style={stylesIndex.headerDateContainer}> */}
        <Text style={stylesIndex.headerDate}>{formatDate(getFixedDate())}</Text>
        {/* <Apple width={40} height={40} /> */}
        {/* </View> */}
      </View>

      <Pressable onPress={lastActiv}>{/* <Text>Press</Text> */}</Pressable>

      <>
        {dailyGoal.calories <= 0 ? (
          <View
            style={{
              width: "70%",
              margin: 10,
              padding: 8,
              backgroundColor: "#5D7073 ",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link href="/DailyGoal">
              <Text
                style={{
                  textAlign: "center",
                  color: "#D4AA7D",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Set Your Daily Macro Goals
              </Text>
            </Link>
          </View>
        ) : (
          <>
            {/* <Text style={stylesIndex.sectionTitle}>Today's Progress</Text> */}
            <View style={stylesIndex.calorieProgressContainer}>
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
                    {/* <Text
                      style={{
                        color: "#D4AA7D",
                        fontSize: 20,
                        fontWeight: "bold",
                        marginBottom: 10,
                      }}
                    >
                      Calories
                    </Text> */}
                    {/* <Text
                      style={{
                        color: "#D4AA7D",
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      {dailyGoal.calories <= 0
                        ? `0%`
                        : `${percentageOfDailyCalories}%`}
                    </Text> */}
                    {/* <Text
							style={{
							  color: "#D4AA7D",
							  fontSize: 20,
							  fontWeight: "bold",
							}}
						  >
							{currentMacros.calories} / {userData?.dailyGoal.calories}
						  </Text> */}
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
              <Text
                style={{
                  color: "#3e4e50",
                  marginTop: 10,
                  fontSize: 16,
                }}
              >
                {remainingCalories} calories remaining
              </Text>
            </View>

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

      <Text style={stylesIndex.sectionTitle}>History</Text>
      <View style={stylesIndex.historyContainer}>
        {reverseLogs && reverseLogs.length > 0 ? (
          reverseLogs.map((log: Log, index: number) => (
            <LogCard key={index} {...log} />
          ))
        ) : (
          <Text style={stylesIndex.emptyHistoryText}>No logs available</Text>
        )}
      </View>
    </ScrollView>
  );
}
