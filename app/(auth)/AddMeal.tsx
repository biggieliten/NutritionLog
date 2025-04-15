import {
  TextInput,
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { macroCalculator } from "../utils/macroCalculator";
import roundOneDecimal from "../utils/roundTwoDecimals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToday } from "../utils/todaysDate";
import { stylesAddMeal } from "../styles/styles";
import { useScannedProductStore } from "../store/useScannedProductsStore";
import { Product } from "../types/types";
import { updateCurrentMacros } from "../hooks/updateCurrentMacros";
import { useAuth } from "../state/AuthState/AuthContext";
import { Link, router } from "expo-router";
import { AddManually } from "./AddManually";

export default function AddMeal() {
  //   const { scannedProduct, setScannedProduct } = useScannedProductStore();
  //   const { setCurrentMacros, currentMacros } = useCurrentMacroStore();
  const [weight, setWeight] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const [postData, setPostData] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const { user, userData, scannedProduct } = useAuth();

  //   if (
  //     !scannedProduct ||
  //     !scannedProduct.product ||
  //     !scannedProduct.product.nutriments
  //   ) {
  //     return <Text>No product found for this UPC.</Text>;
  //   }
  if (!userData || !user) return;
  const currentMacros = userData?.currentMacros;

  const nutriments: { [key: string]: any } =
    scannedProduct?.product?.nutriments || {};

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

    // updateCurrentMacros({
    //   uid: user?.uid,
    //   newMacros: {
    //     calories: currentMacros.calories,
    //     protein: currentMacros.protein,
    //     carbohydrates: currentMacros.carbohydrates,
    //     fat: currentMacros.fat,
    //     fiber: currentMacros.fiber,
    //     sugar: currentMacros.sugar,
    //   },
    // });

    // setWeight(Number(0));
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem("macroLogs");
      console.log("AsyncStorage cleared successfully");
    } catch (error) {
      console.log("Error clearing AsyncStorage:", error);
    }
  };

  const handleStoreProduct = (product: Product) => {};

  return (
    <ScrollView contentContainerStyle={stylesAddMeal.container}>
      {scannedProduct ? (
        <View style={stylesAddMeal.contentContainer}>
          <Text style={stylesAddMeal.title}>
            {scannedProduct.product.product_name}
          </Text>
          {Object.entries(macros).map(([key, value]) => (
            <Text key={key} style={stylesAddMeal.text}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
              {roundOneDecimal(value)} {nutriments[`${key}_unit`] || ""}
            </Text>
          ))}
          <TextInput
            keyboardType="numeric"
            onChangeText={(input) => setInput(input)}
            style={stylesAddMeal.input}
            placeholder="Enter weight in grams"
          />
          <Pressable
            onPress={() => console.log(scannedProduct)}
            style={stylesAddMeal.button}
          >
            <Text>Save Product</Text>
          </Pressable>
          <Pressable onPress={handleSetWeight} style={stylesAddMeal.button}>
            <Text style={stylesAddMeal.buttonText}>Calculate Macros</Text>
          </Pressable>
          <Pressable
            style={stylesAddMeal.button}
            disabled={!macros}
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
                updateCurrentMacros({
                  uid: user?.uid,
                  newMacros: updatedMacros,
                });
              }
            }}
          >
            <Text style={stylesAddMeal.buttonText}>Set daily progress</Text>
          </Pressable>
          <Pressable style={stylesAddMeal.button} onPress={clearAsyncStorage}>
            <Text style={stylesAddMeal.buttonText}>Clear macroLogs</Text>
          </Pressable>
          {/* <Link href="/AddManually">Add meal manually</Link> */}
          <Pressable
            style={stylesAddMeal.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={stylesAddMeal.buttonText}>Add manually</Text>
          </Pressable>
          <Modal
            animationType="slide"
            //   transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <AddManually setShowModal={setModalVisible} />
          </Modal>
        </View>
      ) : (
        <ScrollView>
          <View>
            <Pressable
              style={stylesAddMeal.button}
              onPress={() => setModalVisible(true)}
            >
              <Text style={stylesAddMeal.buttonText}>Add manually</Text>
            </Pressable>
            <Modal
              animationType="slide"
              //   transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <AddManually setShowModal={setModalVisible} />
            </Modal>
          </View>
          <Text>or</Text>
          <Pressable
            style={stylesAddMeal.button}
            onPress={() => router.replace("/Scanner")}
          >
            <Text style={stylesAddMeal.buttonText}>Scan barcode</Text>
          </Pressable>
        </ScrollView>
      )}
    </ScrollView>
  );
}
