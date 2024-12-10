import { useContext } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { GlobalContext } from "../state/GlobalState/GlobalContext";
import { LogCard } from "../components/LogCard";
import { Log } from "../types/types";

export default function Index() {
  const {
    currentMacros,
    dailyGoal,
    macroLogs,
    setLastSavedDate,
    setCurrentMacros,
  } = useContext(GlobalContext);
  return (
    <ScrollView style={styles.container}>
      <Pressable
        style={{ borderWidth: 1, margin: 10, padding: 5, width: 80 }}
        onPress={() => {
          setLastSavedDate("2024-12-26");
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

      <Text style={{ marginTop: 20 }}>Past Logs</Text>

      {macroLogs.length > 0 ? (
        macroLogs.map((log: Log, index: number) => (
          <View key={index}>
            <Text>Date: {log.date}</Text>
            <Text>Calories: {log.calories}</Text>
            <Text>Protein: {log.protein}</Text>
            <Text>Carbohydrates: {log.carbohydrates}</Text>
            <Text>Fat: {log.fat}</Text>
            <Text>Fiber: {log.fiber}</Text>
            <Text>Sugar: {log.sugar}</Text>
          </View>
        ))
      ) : (
        <Text>No logs available</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
