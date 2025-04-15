import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { stylesDailyGoal } from "../styles/styles";
import { useAuth } from "../state/AuthState/AuthContext";
import { updateDailyGoal } from "../hooks/updateDailyGoal";

export default function SetGoal() {
  const { user, userData } = useAuth();
  //   const { dailyGoal, setDailyGoal, loadDailyGoal, saveDailyGoal } =
  //     useDailyGoalStore();
  if (!userData) return;
  const dailyGoal = userData?.dailyGoal;
  const [goal, setGoal] = useState(dailyGoal);

  useEffect(() => {}, [userData]);

  const handleSaveGoal = async () => {
    // setDailyGoal(goal);

    if (user?.uid) {
      await updateDailyGoal({ uid: user.uid, newGoal: goal }); // Sync to Firestore
    }
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
          value={String(goal.calories)}
          onChangeText={(input) =>
            setGoal({ ...goal, calories: Number(input) })
          }
        />

        <Text style={stylesDailyGoal.label}>Protein (g)</Text>
        <TextInput
          style={stylesDailyGoal.input}
          keyboardType="numeric"
          value={String(goal.protein)}
          onChangeText={(input) => setGoal({ ...goal, protein: Number(input) })}
        />

        <Text style={stylesDailyGoal.label}>Carbs (g)</Text>
        <TextInput
          style={stylesDailyGoal.input}
          keyboardType="numeric"
          value={String(goal.carbohydrates)}
          onChangeText={(input) =>
            setGoal({ ...goal, carbohydrates: Number(input) })
          }
        />

        <Text style={stylesDailyGoal.label}>Fat (g)</Text>
        <TextInput
          style={stylesDailyGoal.input}
          keyboardType="numeric"
          value={String(goal.fat)}
          onChangeText={(input) => setGoal({ ...goal, fat: Number(input) })}
        />
        <Text style={stylesDailyGoal.label}>Fiber (g)</Text>
        <TextInput
          style={stylesDailyGoal.input}
          keyboardType="numeric"
          value={String(goal.fiber)}
          onChangeText={(input) => setGoal({ ...goal, fiber: Number(input) })}
        />
        <Text style={stylesDailyGoal.label}>Sugar (g)</Text>
        <TextInput
          style={stylesDailyGoal.input}
          keyboardType="numeric"
          value={String(goal.sugar)}
          onChangeText={(input) => setGoal({ ...goal, sugar: Number(input) })}
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
