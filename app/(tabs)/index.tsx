import { useContext } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { GlobalContext } from "../state/GlobalState/GlobalContext";
import { LogCard } from "../components/LogCard";
import { Log } from "../types/types";
import { stylesIndex } from "../styles/styles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { divisionToPercentage } from "../utils/divisionToPercentage";
import { Link } from "expo-router";

export default function Index() {
  const {
    currentMacros,
    dailyGoal,
    macroLogs,
    setLastSavedDate,
    setCurrentMacros,
    setDailyGoal,

    setMacroLogs,
  } = useContext(GlobalContext);

  const percentageOfDailyCalories = divisionToPercentage(
    currentMacros.calories,
    dailyGoal.calories
  );
  //   console.log(percentageOfDailyCalories, "divisionToPercentage");

  return (
    <ScrollView contentContainerStyle={stylesIndex.container}>
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
          setLastSavedDate("2024-12-31");
          setDailyGoal({
            calories: 0,
            protein: 0,
            carbohydrates: 0,
            fat: 0,
            fiber: 0,
            sugar: 0,
          });
          //   setMacroLogs([]);
        }}
      >
        <Text
          style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
        >
          Simulate date change
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
                      {currentMacros.calories} / {dailyGoal.calories}
                    </Text>
                  </>
                )}
              </AnimatedCircularProgress>
            </View>
          </>
        )}

        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Protein: {currentMacros.protein} / {dailyGoal.protein}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Carbs: {currentMacros.carbohydrates} / {dailyGoal.carbohydrates}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Fat: {currentMacros.fat} / {dailyGoal.fat}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Fiber: {currentMacros.fiber} / {dailyGoal.fiber}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Sugar: {currentMacros.sugar} / {dailyGoal.sugar}
        </Text>
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
      {macroLogs && macroLogs.length > 0 ? (
        macroLogs.map((log: Log, index: number) => (
          <LogCard key={index} {...log} />
        ))
      ) : (
        <Text>No logs available</Text>
      )}
    </ScrollView>
  );
}
