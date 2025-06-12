import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { containerShadow } from "../styles/styleUtils";
import { useAuth } from "../state/AuthState/AuthContext";
import { updateDailyGoal } from "../hooks/updateDailyGoal";
import { router } from "expo-router";
import { get } from "firebase/database";
import { formatDate, getFixedDate, getWeekday } from "../utils/todaysDate";

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
        styles.container,
        // stylesDailyGoal.containerShadow,
      ]}
    >
      <Text style={styles.title}>Define Intake Goal</Text>
      {/* <Text style={styles.date}>{getWeekday()}</Text>
      <Text style={styles.date}>{formatDate(getFixedDate())}</Text>{" "} */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Calories <Text style={{ fontWeight: 100 }}>(kcal) </Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your daily calories"
          //   placeholderTextColor={}
          keyboardType="numeric"
          //   value={String(goal.calories)}
          onChangeText={(input) =>
            setGoal({ ...goal, calories: Number(input) })
          }
        />

        <Text style={styles.label}>
          Protein
          <Text style={{ fontWeight: 100 }}> (g)</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your daily protein"
          keyboardType="numeric"
          //   value={String(goal.protein)}
          onChangeText={(input) => setGoal({ ...goal, protein: Number(input) })}
        />

        <Text style={styles.label}>
          Carbs<Text style={{ fontWeight: 100 }}> (g)</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your daily carbs"
          keyboardType="numeric"
          //   value={String(goal.carbohydrates)}
          onChangeText={(input) =>
            setGoal({ ...goal, carbohydrates: Number(input) })
          }
        />

        <Text style={styles.label}>
          Fat
          <Text style={{ fontWeight: 100 }}> (g)</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your daily fat"
          keyboardType="numeric"
          //   value={String(goal.fat)}
          onChangeText={(input) => setGoal({ ...goal, fat: Number(input) })}
        />
        <Text style={styles.label}>
          Fiber<Text style={{ fontWeight: 100 }}> (g)</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your daily fiber"
          keyboardType="numeric"
          //   value={String(goal.fiber)}
          onChangeText={(input) => setGoal({ ...goal, fiber: Number(input) })}
        />
        <Text style={styles.label}>
          Sugar<Text style={{ fontWeight: 100 }}> (g)</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your daily sugar"
          keyboardType="numeric"
          //   value={String(goal.sugar)}
          onChangeText={(input) => setGoal({ ...goal, sugar: Number(input) })}
        />

        <Pressable
          style={[
            styles.button,
            // stylesDailyGoal.containerShadow
          ]}
          onPress={handleSaveGoal}
        >
          <Text style={styles.buttonText}>Save Goal</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: "100%",
    backgroundColor: "#2D3E40",
  },
  inputContainer: {
    width: "90%",
    marginHorizontal: "auto",
    borderRadius: 7,
    padding: 20,
    marginTop: 10,
  },
  title: {
    borderRadius: 7,
    // overflow: "hidden",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
    width: "100%",
    marginVertical: 20,
    marginTop: 100,
    textAlign: "center",
  },
  date: {
    color: "#D4AA7D",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#D4AA7D",
    marginTop: 10,
    maxWidth: "100%",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomWidth: 1,
    borderColor: "#D4AA7D",
    fontSize: 16,
    color: "#2D3E40",
    ...containerShadow.containerShadow,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    ...containerShadow.containerShadow,
  },
  buttonText: {
    color: "#D4AA7D",
    fontSize: 18,
    fontWeight: "bold",
  },
});
