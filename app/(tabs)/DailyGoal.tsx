import { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { GlobalContext } from "../state/GlobalState/GlobalContext";

export default function SetGoal() {
  const { dailyGoal, setDailyGoal } = useContext(GlobalContext);
  const [goal, setGoal] = useState(dailyGoal);

  //useEffect to activly update the daily goal
  useEffect(() => {
    setDailyGoal(goal);
  }, [goal]);

  const handleSaveGoal = () => {
    setGoal(goal);
    console.log(dailyGoal, "global daily goal");
  };

  return (
    <View>
      <Text>Set Your Daily Macros</Text>

      <Text>Calories</Text>
      <TextInput
        keyboardType="numeric"
        value={String(dailyGoal.calories)}
        onChangeText={(text) =>
          setGoal({ ...dailyGoal, calories: Number(text) })
        }
      />

      <Text>Protein (g)</Text>
      <TextInput
        keyboardType="numeric"
        value={String(dailyGoal.protein)}
        onChangeText={(text) =>
          setGoal({ ...dailyGoal, protein: Number(text) })
        }
      />

      <Text>Carbs (g)</Text>
      <TextInput
        keyboardType="numeric"
        value={String(dailyGoal.carbohydrates)}
        onChangeText={(text) =>
          setGoal({ ...dailyGoal, carbohydrates: Number(text) })
        }
      />

      <Text>Fat (g)</Text>
      <TextInput
        keyboardType="numeric"
        value={String(dailyGoal.fat)}
        onChangeText={(text) => setGoal({ ...dailyGoal, fat: Number(text) })}
      />

      <Pressable style={{ borderWidth: 1, margin: 0 }} onPress={handleSaveGoal}>
        <Text>Save Goal</Text>
      </Pressable>
    </View>
  );
}
