import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { LogCard } from "../components/LogCard";
import { Log, Macros, DailyGoal } from "../types/types";
import { stylesIndex } from "../styles/styles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import * as Progress from "react-native-progress";
import { divisionToPercentage } from "../utils/divisionToPercentage";
import { Link, router } from "expo-router";
import { getToday, formatDate } from "../utils/todaysDate";
import { useAuth } from "../state/AuthState/AuthContext";
import { addLog } from "../hooks/addLog";
import { updateDailyGoal } from "../hooks/updateDailyGoal";
import { updateCurrentMacros } from "../hooks/updateCurrentMacros";
import { MacroProgress } from "../components/MacroProgress";
import Apple from "@/assets/images/apple";

export default function Index() {
  const { user, userData } = useAuth();

  if (!user || !userData) return;

  const currentMacros = userData?.currentMacros;
  const dailyGoal = userData?.dailyGoal;
  const logs = userData?.logs;

  const percentageOfDailyCalories = divisionToPercentage(
    currentMacros.calories,
    dailyGoal.calories
  );

  const todaysDate = getToday();

  const defaultDailyGoal: DailyGoal = {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  };
  const defaultMacros: Macros = {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  };
  // Creating a new variable to convert the currentMacros to a Log object to match Log type.
  const currentMacrosToLog = (macros: Macros, date: string): Log => {
    return {
      ...macros,
      date: date,
    };
  };
  return (
    <ScrollView contentContainerStyle={stylesIndex.container}>
      <View
        style={{
          width: "90%",
          alignItems: "center",
          borderBottomColor: "#f3f3f3",
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingBottom: 15,
          paddingTop: 5,
          //   marginBottom: 20,
          //   backgroundColor: "#4B5945",
          //   borderRadius: 10,
        }}
      >
        <Text
          style={{
            // width: "95%",
            height: 40,
            paddingTop: 15,
            justifyContent: "center",
          }}
        >
          Today, {formatDate(getToday())}
        </Text>
        <View style={{}}>
          <Apple width={40} height={40} />
        </View>
        {/* <Ionicons name="add-circle" color="#4B5945" size={40} /> */}
      </View>
      {/* <Pressable onPress={() => console.log(currentMacros)}>
        <Text>cm</Text>
      </Pressable> */}
      {/* <Pressable
        style={{
          borderRadius: 10,
          margin: 10,
          padding: 10,
          height: "auto",
          width: "40%",
          backgroundColor: "#91AC8F",
        }}
        onPress={() => {
          //   setLastSavedDate("2024-12-31");
          const newLog = currentMacrosToLog(currentMacros, todaysDate);
          addLog({ uid: user.uid, newLog: newLog });
          updateDailyGoal({ uid: user.uid, newGoal: defaultDailyGoal });
          updateCurrentMacros({
            uid: user.uid,
            newMacros: defaultMacros,
          });
          user ? console.log(dailyGoal, "load daily goal") : console.log("");
        }}
      >
        <Text
          style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
        >
          Log macros
        </Text>
      </Pressable> */}
      <View style={stylesIndex.dailyProgressContainer}>
        {dailyGoal.calories <= 0 ? (
          <View
            style={{
              width: "70%",
              margin: 10,
              padding: 8,

              backgroundColor: "white",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link href="/DailyGoal">
              <Text
                style={{
                  textAlign: "center",
                  color: "#91AC8F",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Set goal
              </Text>
            </Link>
          </View>
        ) : (
          <>
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Daily Progress
            </Text>
            <View>
              <AnimatedCircularProgress
                size={200}
                width={10}
                fill={Number(percentageOfDailyCalories)}
                tintColor="#e52328"
                rotation={70}
                backgroundColor="#ea4e5aa3"
                lineCap="round"
              >
                {() => (
                  <View
                    style={{
                      backgroundColor: "white",
                      height: 180,
                      width: 180,
                      borderRadius: 100,
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0px 0px 10px #000000",
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: 20,
                        fontWeight: "bold",
                        marginBottom: 10,
                      }}
                    >
                      Calories
                    </Text>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      {dailyGoal.calories <= 0
                        ? `0%`
                        : `${percentageOfDailyCalories}%`}
                    </Text>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      {currentMacros.calories} / {userData?.dailyGoal.calories}
                    </Text>
                  </View>
                )}
              </AnimatedCircularProgress>
            </View>
            <MacroProgress
              label="Protein"
              progressColor="#ffaa00"
              unfilledColor="#feeeb4"
              current={currentMacros.protein}
              goal={dailyGoal.protein}
            />

            <MacroProgress
              label="Carbs"
              progressColor="#02a7b1"
              unfilledColor="#bfeaed"
              current={currentMacros.carbohydrates}
              goal={dailyGoal.carbohydrates}
            />

            <MacroProgress
              label="Fat"
              progressColor="#fa5a4c"
              unfilledColor="#f0d2d1"
              current={currentMacros.fat}
              goal={dailyGoal.fat}
            />

            {dailyGoal.fiber > 0 && (
              <MacroProgress
                label="Fiber"
                progressColor="#7dbe80"
                unfilledColor="#d5e9d6"
                current={currentMacros.fiber}
                goal={dailyGoal.fiber}
              />
            )}

            {dailyGoal.sugar > 0 && (
              <MacroProgress
                label="Sugar"
                progressColor="#ec7ba5"
                unfilledColor="#f7d6e2"
                current={currentMacros.sugar}
                goal={dailyGoal.sugar}
              />
            )}
          </>
        )}
      </View>
      <Text
        style={{
          color: "grey",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        History
      </Text>
      {logs && logs.length > 0 ? (
        logs.map((log: Log, index: number) => <LogCard key={index} {...log} />)
      ) : (
        <Text style={{ color: "white" }}>No logs available</Text>
      )}
    </ScrollView>
  );
}
