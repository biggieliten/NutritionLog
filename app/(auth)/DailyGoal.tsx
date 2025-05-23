import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { stylesDailyGoal } from "../styles/styles";
import { useAuth } from "../state/AuthState/AuthContext";
import { updateDailyGoal } from "../hooks/updateDailyGoal";
import { router } from "expo-router";

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
      await updateDailyGoal({ uid: user.uid, newGoal: goal });
    }
    router.replace("/");
  };

  return (
    <View
      style={[
        stylesDailyGoal.container,
        // stylesDailyGoal.containerShadow,
      ]}
    >
      <Text style={stylesDailyGoal.title}>Set daily goal</Text>
      <View style={stylesDailyGoal.inputContainer}>
        <Text style={stylesDailyGoal.label}>
          Calories <Text style={{ fontWeight: 100 }}>(kcal) </Text>
        </Text>
        <TextInput
          style={stylesDailyGoal.input}
          placeholder="Enter your daily calories"
          //   placeholderTextColor={}
          keyboardType="numeric"
          //   value={String(goal.calories)}
          onChangeText={(input) =>
            setGoal({ ...goal, calories: Number(input) })
          }
        />

        <Text style={stylesDailyGoal.label}>
          Protein
          <Text style={{ fontWeight: 100 }}> (g)</Text>
        </Text>
        <TextInput
          style={stylesDailyGoal.input}
          placeholder="Enter your daily protein"
          keyboardType="numeric"
          //   value={String(goal.protein)}
          onChangeText={(input) => setGoal({ ...goal, protein: Number(input) })}
        />

        <Text style={stylesDailyGoal.label}>
          Carbs<Text style={{ fontWeight: 100 }}> (g)</Text>
        </Text>
        <TextInput
          style={stylesDailyGoal.input}
          placeholder="Enter your daily carbs"
          keyboardType="numeric"
          //   value={String(goal.carbohydrates)}
          onChangeText={(input) =>
            setGoal({ ...goal, carbohydrates: Number(input) })
          }
        />

        <Text style={stylesDailyGoal.label}>
          Fat
          <Text style={{ fontWeight: 100 }}> (g)</Text>
        </Text>
        <TextInput
          style={stylesDailyGoal.input}
          placeholder="Enter your daily fat"
          keyboardType="numeric"
          //   value={String(goal.fat)}
          onChangeText={(input) => setGoal({ ...goal, fat: Number(input) })}
        />
        <Text style={stylesDailyGoal.label}>
          Fiber<Text style={{ fontWeight: 100 }}> (g)</Text>
        </Text>
        <TextInput
          style={stylesDailyGoal.input}
          placeholder="Enter your daily fiber"
          keyboardType="numeric"
          //   value={String(goal.fiber)}
          onChangeText={(input) => setGoal({ ...goal, fiber: Number(input) })}
        />
        <Text style={stylesDailyGoal.label}>
          Sugar<Text style={{ fontWeight: 100 }}> (g)</Text>
        </Text>
        <TextInput
          style={stylesDailyGoal.input}
          placeholder="Enter your daily sugar"
          keyboardType="numeric"
          //   value={String(goal.sugar)}
          onChangeText={(input) => setGoal({ ...goal, sugar: Number(input) })}
        />

        <Pressable
          style={[
            stylesDailyGoal.button,
            // stylesDailyGoal.containerShadow
          ]}
          onPress={handleSaveGoal}
        >
          <Text style={stylesDailyGoal.buttonText}>Save Goal</Text>
        </Pressable>
      </View>
    </View>
  );
}
