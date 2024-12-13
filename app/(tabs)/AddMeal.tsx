import { TextInput, View, Text, Pressable, ScrollView } from "react-native";
import { GlobalContext } from "../state/GlobalState/GlobalContext";
import { useContext, useState } from "react";
import { macroCalculator } from "../utils/macroCalculator";
import roundTwoDecimals from "../utils/roundTwoDecimals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToday } from "../utils/todaysDate";
import { stylesAddMeal } from "../styles/styles";

export default function AddMeal() {
  const {
    scannedUPC,
    UPCContent: UPCContent,
    setCurrentMacros,
    currentMacros,
    setMacroLogs,
    macroLogs,
    setLastSavedDate,
    dailyGoal,
  } = useContext(GlobalContext);
  const [weight, setWeight] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const [postData, setPostData] = useState<any>({});

  if (!UPCContent || !UPCContent.product || !UPCContent.product.nutriments) {
    return <Text>No product found for this UPC.</Text>;
  }

  const nutriments: { [key: string]: any } = UPCContent.product.nutriments;
  const macros = macroCalculator(
    weight,
    nutriments["energy-kcal_100g"],
    nutriments.proteins_100g,
    nutriments.carbohydrates_100g,
    nutriments.fat_100g,
    nutriments.fiber_100g,
    nutriments.sugars_100g
  );

  const handleSetWeight = () => {
    setWeight(Number(input));
  };
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem("macroLogs");
      console.log("AsyncStorage cleared successfully");
    } catch (error) {
      console.log("Error clearing AsyncStorage:", error);
    }
  };
  return (
    <ScrollView contentContainerStyle={stylesAddMeal.container}>
      {UPCContent ? (
        <View style={stylesAddMeal.contentContainer}>
          <Text style={stylesAddMeal.title}>
            {UPCContent.product.product_name}
          </Text>
          {Object.entries(macros).map(([key, value]) => (
            <Text key={key} style={stylesAddMeal.text}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
              {roundTwoDecimals(value)} {nutriments[`${key}_unit`] || ""}
            </Text>
          ))}
          <TextInput
            keyboardType="numeric"
            onChangeText={(input) => setInput(input)}
            style={stylesAddMeal.input}
            placeholder="Enter weight in grams"
          />
          <Pressable onPress={handleSetWeight} style={stylesAddMeal.button}>
            <Text style={stylesAddMeal.buttonText}>Calculate Macros</Text>
          </Pressable>
          <Pressable
            style={stylesAddMeal.button}
            onPress={() => {
              const updatedMacros = {
                calories: macros.kcal + currentMacros.calories,
                protein: macros.proteins + currentMacros.protein,
                carbohydrates:
                  macros.carbohydrates + currentMacros.carbohydrates,
                fat: macros.fat + currentMacros.fat,
                fiber: macros.fiber + currentMacros.fiber,
                sugar: macros.sugars + currentMacros.sugar,
              };
              if (updatedMacros) {
                setCurrentMacros(updatedMacros);
              }
            }}
          >
            <Text style={stylesAddMeal.buttonText}>Set daily progress</Text>
          </Pressable>
          <Pressable style={stylesAddMeal.button} onPress={clearAsyncStorage}>
            <Text style={stylesAddMeal.buttonText}>Clear macroLogs</Text>
          </Pressable>
        </View>
      ) : (
        <Text>No product found for this UPC.</Text>
      )}
    </ScrollView>
  );
}
