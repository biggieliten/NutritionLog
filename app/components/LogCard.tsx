import { useContext } from "react";
import { View, Text } from "react-native";
import { GlobalContext } from "../state/GlobalState/GlobalContext";
import { GlobalContextType } from "../types/types";

export const LogCard = (dailyGoal: any, currentMacros: any) => {
  return (
    <View>
      <Text>Daily Progress</Text>
      <View>
        {currentMacros.map((c: any) => (
          <Text>{c.calories}</Text>
        ))}
        /
        {dailyGoal.map((d: any) => (
          <Text>{d.calories}</Text>
        ))}
      </View>
      {/* <Text>
        Calories: {currentMacros.calories}/{dailyGoal.calories}kcal
      </Text>
      <Text>
        Protein: {currentMacros.protein}/{dailyGoal.protein}g
      </Text>
      <Text>
        Carbs: {currentMacros.carbs}/{dailyGoal.carbs}g
      </Text>
      <Text>
        Fat: {currentMacros.fat}/{dailyGoal.fat}g
      </Text>
      <Text>
        Fiber: {currentMacros.fiber}/{dailyGoal.fiber}g
      </Text>
      <Text>
        Sugar: {currentMacros.sugar}/{dailyGoal.sugar}g
      </Text> */}
    </View>
  );
};
