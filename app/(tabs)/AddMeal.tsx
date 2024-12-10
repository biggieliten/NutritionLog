import { TextInput, View, Text, Pressable } from "react-native";
import { GlobalContext } from "../state/GlobalState/GlobalContext";
import { useContext, useState } from "react";
import { macroCalculator } from "../utils/macroCalculator";
import roundTwoDecimals from "../utils/roundTwoDecimals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToday } from "../utils/todaysDate";

export default function AddMeal() {
  const {
    scannedUPC,
    UPCContent,
    setCurrentMacros,
    currentMacros,
    setMacroLogs,
    macroLogs,
    setLastSavedDate,
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
    // setCurrentMacros({
    //   calories: currentMacros.calories,
    //   protein: currentMacros.protein,
    //   carbohydrates: currentMacros.carbohydrates,
    //   fat: currentMacros.fat,
    //   fiber: currentMacros.fiber,
    //   sugar: currentMacros.sugar,
    // });
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
    <View style={{}}>
      <Text>{UPCContent.product.product_name}</Text>
      {Object.entries(macros).map(([key, value]) => (
        <Text key={key}>
          {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
          {roundTwoDecimals(value)} {nutriments[`${key}_unit`] || ""}
        </Text>
      ))}
      <TextInput
        keyboardType="numeric"
        onChangeText={(input) => setInput(input)}
        style={{ borderWidth: 1 }}
        placeholder="Enter weight in grams"
      />
      <Pressable onPress={handleSetWeight}>
        <Text>Add Meal</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          const updatedMacros = {
            calories: macros.kcal + currentMacros.calories,
            protein: macros.proteins + currentMacros.protein,
            carbohydrates: macros.carbohydrates + currentMacros.carbohydrates,
            fat: macros.fat + currentMacros.fat,
            fiber: macros.fiber + currentMacros.fiber,
            sugar: macros.sugars + currentMacros.sugar,
          };
          if (updatedMacros) {
            setCurrentMacros(updatedMacros);
          }
          console.log(getToday());
          console.log(currentMacros, "macroLogs in AddMeal");
          //   setLastSavedDate("2024-12-24");

          //   setMacroLogs([]);
        }}
      >
        <Text>Set Meal</Text>
      </Pressable>
      <Pressable style={{ marginTop: 30 }} onPress={clearAsyncStorage}>
        <Text>Clear macroLogs</Text>
      </Pressable>
    </View>
  );
}
