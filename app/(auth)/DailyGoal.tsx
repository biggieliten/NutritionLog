import { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { stylesDailyGoal } from "../styles/styles";
import { useDailyGoalStore } from "../store/useDailyGoalStore";

export default function SetGoal() {
  const { dailyGoal, setDailyGoal } = useDailyGoalStore();

  //useEffect to activly update the daily goal
  useEffect(() => {
    setDailyGoal(dailyGoal);
  }, [dailyGoal]);

  const handleSaveGoal = () => {
    setDailyGoal(dailyGoal);
    // console.log(dailyGoal, "global daily goal");
  };

  return (
    <ScrollView
      contentContainerStyle={[
        stylesDailyGoal.container,
        stylesDailyGoal.containerShadow,
      ]}
    >
      {/* <View
        style={{
          backgroundColor: "red",
          width: 50,
          height: 50,
          borderRadius: 50,
        }}
      >
        <Text>Profile</Text>
      </View> */}

      <Text style={stylesDailyGoal.title}>Set Your Daily Macros</Text>

      <View style={stylesDailyGoal.inputContainer}>
        <Text style={stylesDailyGoal.label}>Calories</Text>
        <TextInput
          style={stylesDailyGoal.input}
          keyboardType="numeric"
          value={String(dailyGoal.calories)}
          onChangeText={(text) =>
            setDailyGoal({ ...dailyGoal, calories: Number(text) })
          }
        />

        <Text style={stylesDailyGoal.label}>Protein (g)</Text>
        <TextInput
          style={stylesDailyGoal.input}
          keyboardType="numeric"
          value={String(dailyGoal.protein)}
          onChangeText={(text) =>
            setDailyGoal({ ...dailyGoal, protein: Number(text) })
          }
        />

        <Text style={stylesDailyGoal.label}>Carbs (g)</Text>
        <TextInput
          style={stylesDailyGoal.input}
          keyboardType="numeric"
          value={String(dailyGoal.carbohydrates)}
          onChangeText={(text) =>
            setDailyGoal({ ...dailyGoal, carbohydrates: Number(text) })
          }
        />

        <Text style={stylesDailyGoal.label}>Fat (g)</Text>
        <TextInput
          style={stylesDailyGoal.input}
          keyboardType="numeric"
          value={String(dailyGoal.fat)}
          onChangeText={(text) =>
            setDailyGoal({ ...dailyGoal, fat: Number(text) })
          }
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
