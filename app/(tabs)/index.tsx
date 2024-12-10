import { useContext } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { GlobalContext } from "../state/GlobalState/GlobalContext";
import { LogCard } from "../components/LogCard";
import { Log } from "../types/types";
import { stylesIndex } from "../styles/styles";

export default function Index() {
  const {
    currentMacros,
    dailyGoal,
    macroLogs,
    setLastSavedDate,
    setCurrentMacros,
  } = useContext(GlobalContext);

  return (
    <ScrollView contentContainerStyle={stylesIndex.container}>
      <Pressable
        style={{ borderWidth: 1, margin: 10, padding: 5, width: 80 }}
        onPress={() => {
          setLastSavedDate("2024-12-29");
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
        <Text>Simulate date change</Text>
      </Pressable>
      <View style={stylesIndex.dailyProgressContainer}>
        <Text>Daily Progress</Text>
        <Text>
          Calories: {currentMacros.calories} / {dailyGoal.calories}
        </Text>
        <Text>
          Protein: {currentMacros.protein} / {dailyGoal.protein}
        </Text>
        <Text>
          Carbs: {currentMacros.carbohydrates} / {dailyGoal.carbohydrates}
        </Text>
        <Text>
          Fat: {currentMacros.fat} / {dailyGoal.fat}
        </Text>
        <Text>
          Fiber: {currentMacros.fiber} / {dailyGoal.fiber}
        </Text>
        <Text>
          Sugar: {currentMacros.sugar} / {dailyGoal.sugar}
        </Text>
      </View>

      <Text
        style={{
          width: 70,
          marginTop: 15,
        }}
      >
        Past Logs
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
