import { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { GlobalContext } from "../state/GlobalState/GlobalContext";
import { stylesDailyGoal } from "../styles/styles";

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
    <ScrollView
      contentContainerStyle={[
        stylesDailyGoal.container,
        stylesDailyGoal.containerShadow,
      ]}
    >
      <Text style={stylesDailyGoal.title}>Set Your Daily Macros</Text>

      <View style={stylesDailyGoal.inputContainer}>
        <Text style={stylesDailyGoal.label}>Calories</Text>
        <TextInput
          style={stylesDailyGoal.input}
          keyboardType="numeric"
          value={String(dailyGoal.calories)}
          onChangeText={(text) =>
            setGoal({ ...dailyGoal, calories: Number(text) })
          }
        />

        <Text style={stylesDailyGoal.label}>Protein (g)</Text>
        <TextInput
          style={stylesDailyGoal.input}
          keyboardType="numeric"
          value={String(dailyGoal.protein)}
          onChangeText={(text) =>
            setGoal({ ...dailyGoal, protein: Number(text) })
          }
        />

        <Text style={stylesDailyGoal.label}>Carbs (g)</Text>
        <TextInput
          style={stylesDailyGoal.input}
          keyboardType="numeric"
          value={String(dailyGoal.carbohydrates)}
          onChangeText={(text) =>
            setGoal({ ...dailyGoal, carbohydrates: Number(text) })
          }
        />

        <Text style={stylesDailyGoal.label}>Fat (g)</Text>
        <TextInput
          style={stylesDailyGoal.input}
          keyboardType="numeric"
          value={String(dailyGoal.fat)}
          onChangeText={(text) => setGoal({ ...dailyGoal, fat: Number(text) })}
        />

        <Pressable
          style={[stylesDailyGoal.button, stylesDailyGoal.containerShadow]}
          onPress={handleSaveGoal}
        >
          <Text style={stylesDailyGoal.buttonText}>Save Goal</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
