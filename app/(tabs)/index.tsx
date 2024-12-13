import { useContext } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { GlobalContext } from "../state/GlobalState/GlobalContext";
import { LogCard } from "../components/LogCard";
import { Log } from "../types/types";
import { stylesIndex } from "../styles/styles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { divisionToPercentage } from "../utils/divisionToPercentage";
import { Link } from "expo-router";
// import { containerShadow } from "../styles/styles";

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
      {/* <Text style={{ position: "absolute", top: 20 }}>Log</Text> */}
      <Pressable
        style={{
          //   ...containerShadow.containerShadow,
          borderRadius: 10,
          marginBottom: 10,
          padding: 7,
          width: "40%",
          backgroundColor: "#91AC8F",
          marginTop: 50,
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
          //   setCurrentMacros({
          //     calories: 0,
          //     protein: 0,
          //     carbohydrates: 0,
          //     fat: 0,
          //     fiber: 0,
          //     sugar: 0,
          //   });
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 15,
            textAlign: "center",
          }}
        >
          Simulate date change
        </Text>
      </Pressable>
      <View style={stylesIndex.dailyProgressContainer}>
        <Text
          style={[
            {
              color: "#ffff",
              fontWeight: "bold",
              marginBottom: 20,
              marginTop: 10,
              fontSize: 20,
            },
          ]}
        >
          Daily Progress
        </Text>
        {dailyGoal.calories <= 0 ? (
          <View
            style={{
              width: "100%",
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
                  color: "#4B5945",
                }}
              >
                Set daily calorie goal
              </Text>
            </Link>
          </View>
        ) : (
          <>
            <View style={{ height: 200 }}>
              <AnimatedCircularProgress
                size={200}
                width={10}
                fill={Number(percentageOfDailyCalories)}
                tintColor="#66785F"
                rotation={70}
                backgroundColor="#B2C9AD"
              >
                {() => (
                  <>
                    <Text>Calories</Text>
                    <Text>
                      {currentMacros.calories} / {dailyGoal.calories}
                    </Text>
                    <Text style={{ fontSize: 18 }}>
                      {dailyGoal.calories <= 0
                        ? `0%`
                        : `${percentageOfDailyCalories}%`}
                    </Text>
                  </>
                )}
              </AnimatedCircularProgress>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ flex: 1 }}>
                  Protein: {currentMacros.protein} / {dailyGoal.protein}
                </Text>
                <Text style={{ flex: 1 }}>
                  Carbs: {currentMacros.carbohydrates} /{" "}
                  {dailyGoal.carbohydrates}
                </Text>
                <Text style={{ flex: 1 }}>
                  Fat: {currentMacros.fat} / {dailyGoal.fat}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* <Text>
          Fiber: {currentMacros.fiber} / {dailyGoal.fiber}
        </Text>
        <Text>
          Sugar: {currentMacros.sugar} / {dailyGoal.sugar}
        </Text> */}
      </View>

      <Text
        style={{
          width: 70,
          marginTop: 15,
          color: "#ffff",
          fontWeight: "bold",
          marginBottom: 20,

          fontSize: 20,
        }}
      >
        History
      </Text>
      {macroLogs.length > 0 ? (
        macroLogs.map((log: Log, index: number) => (
          <LogCard key={index} {...log} />
        ))
      ) : (
        <Text>No logs available</Text>
      )}
    </ScrollView>
  );
}
