import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SetGoals() {
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbohydrates, setCarbohydrates] = useState<string>("");
  const [fat, setFat] = useState<string>("");

  const handleSaveGoals = async () => {
    const goals = {
      calories: Number(calories),
      protein: Number(protein),
      carbohydrates: Number(carbohydrates),
      fat: Number(fat),
    };

    try {
      await AsyncStorage.setItem("goals", JSON.stringify(goals));
      console.log("Goals saved to AsyncStorage:", goals);
    } catch (err) {
      console.error("Error saving goals to AsyncStorage:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Set Your Goals</Text>
      <TextInput
        keyboardType="numeric"
        value={calories}
        onChangeText={(text) => {
          console.log("Calories input changed:", text);
          setCalories(text);
        }}
        style={styles.input}
        placeholder="Calories"
      />
      <TextInput
        keyboardType="numeric"
        value={protein}
        onChangeText={(text) => {
          console.log("Protein input changed:", text);
          setProtein(text);
        }}
        style={styles.input}
        placeholder="Protein"
      />
      <TextInput
        keyboardType="numeric"
        value={carbohydrates}
        onChangeText={(text) => {
          console.log("Carbohydrates input changed:", text);
          setCarbohydrates(text);
        }}
        style={styles.input}
        placeholder="Carbohydrates"
      />
      <TextInput
        keyboardType="numeric"
        value={fat}
        onChangeText={(text) => {
          console.log("Fat input changed:", text);
          setFat(text);
        }}
        style={styles.input}
        placeholder="Fat"
      />
      <Pressable
        onPress={handleSaveGoals}
        style={{ borderWidth: 1, margin: 10 }}
      >
        <Text>Save Goals</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
  },
});
