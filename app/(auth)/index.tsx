import React from "react";
import { useContext } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { LogCard } from "../components/LogCard";
import { Log, Macros, DailyGoal } from "../types/types";
import { stylesIndex } from "../styles/styles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import * as Progress from "react-native-progress";
import { divisionToPercentage } from "../utils/divisionToPercentage";
import { Link, router } from "expo-router";
import { getToday } from "../utils/todaysDate";
import { useAuth } from "../state/AuthState/AuthContext";
import { useSignOut } from "../hooks/useSignOut";
import { addLog } from "../hooks/addLog";
import { updateDailyGoal } from "../hooks/updateDailyGoal";
import { updateCurrentMacros } from "../hooks/updateCurrentMacros";
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
      <Pressable onPress={() => console.log(currentMacros)}>
        <Text>cm</Text>
      </Pressable>
      <Pressable
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
      </Pressable>
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
                Set daily calorie goal
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
                tintColor="#4B5945"
                rotation={70}
                backgroundColor="#B2C9AD"
              >
                {() => (
                  <>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 20,
                        fontWeight: "bold",
                        marginBottom: 10,
                      }}
                    >
                      Calories
                    </Text>
                    <Text
                      style={{
                        color: "white",
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
                        color: "white",
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      {currentMacros.calories} / {userData?.dailyGoal.calories}
                    </Text>
                  </>
                )}
              </AnimatedCircularProgress>
            </View>
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Protein: {currentMacros.protein} / {userData?.dailyGoal.protein}
              </Text>
              <Progress.Bar
                progress={
                  divisionToPercentage(
                    currentMacros.protein,
                    dailyGoal.protein
                  ) / 100
                }
                color="black"
                unfilledColor="white"
                width={150}
              />
            </View>
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Carbs: {currentMacros.carbohydrates} /{" "}
                {userData?.dailyGoal.carbohydrates}
              </Text>
              <Progress.Bar
                progress={
                  divisionToPercentage(
                    currentMacros.carbohydrates,
                    dailyGoal.carbohydrates
                  ) / 100
                }
                color="black"
                unfilledColor="white"
                width={150}
              />
            </View>
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Fat: {currentMacros.fat} / {userData?.dailyGoal.fat}
              </Text>
              <Progress.Bar
                progress={
                  divisionToPercentage(currentMacros.fat, dailyGoal.fat) / 100
                }
                color="black"
                unfilledColor="white"
                width={150}
              />
            </View>
            {dailyGoal.fiber > 0 && (
              <View>
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Fiber: {currentMacros.fiber} / {userData?.dailyGoal.fiber}
                </Text>
                <Progress.Bar
                  progress={
                    divisionToPercentage(currentMacros.fiber, dailyGoal.fiber) /
                    100
                  }
                  color="black"
                  unfilledColor="white"
                  width={150}
                />
              </View>
            )}
            {dailyGoal.sugar > 0 && (
              <View>
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Sugar: {currentMacros.sugar} / {userData?.dailyGoal.sugar}
                </Text>
                <Progress.Bar
                  progress={
                    divisionToPercentage(currentMacros.sugar, dailyGoal.sugar) /
                    100
                  }
                  color="black"
                  unfilledColor="white"
                  width={150}
                />
              </View>
            )}
          </>
        )}
      </View>
      <Text
        style={{
          color: "white",
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
