import {
  TextInput,
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import { useEffect, useState } from "react";
import { macroCalculator } from "../utils/macroCalculator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFixedDate } from "../utils/todaysDate";
import { containerShadow } from "../styles/styleUtils";
import { updateCurrentMacros } from "../hooks/updateCurrentMacros";
import { useAuth } from "../state/AuthState/AuthContext";
import { router } from "expo-router";
import { AddManually } from "./AddManually";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculateSafeSum, getSafeValue } from "../hooks/getSafeValue";
import UpdateModal from "../components/UpdateModal";
import { trackCalorieBurn } from "../utils/trackBurnedCalories";
import { trackConsumption as trackTotalConsumption } from "../utils/trackConsumption";
import { Consumption, Macros } from "../types/types";

export default function Menu() {
  //   const { scannedProduct, setScannedProduct } = useScannedProductStore();
  //   const { setCurrentMacros, currentMacros } = useCurrentMacroStore();
  const [weight, setWeight] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const [burnedCalories, setBurnedCalories] = useState<string>("");
  const [postData, setPostData] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const { user, userData, scannedProduct, setScannedProduct } = useAuth();
  const [buttonSwitch, setButtonSwitch] = useState(false);
  const totalConsumption = userData?.consumption!;

  if (!userData || !user) return;

  const currentMacros = userData?.currentMacros;
  const productName =
    scannedProduct?.product?.product_name || "Unknown Product";
  const productBrand =
    scannedProduct?.product?.brands.split(",")[0].trim() || "Unknown Brand";

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

  const consumedMacros: Macros = {
    calories: getSafeValue(macros.kcal),
    protein: getSafeValue(macros.proteins),
    carbohydrates: getSafeValue(macros.carbohydrates),
    fat: getSafeValue(macros.fat),
    fiber: getSafeValue(macros.fiber),
    sugar: getSafeValue(macros.sugars),
  };

  const handleUpdateMacros = () => {
    const updatedMacros = {
      calories: calculateSafeSum(macros.kcal, currentMacros.calories),
      protein: calculateSafeSum(macros.proteins, currentMacros.protein),
      carbohydrates: calculateSafeSum(
        macros.carbohydrates,
        currentMacros.carbohydrates
      ),
      fat: calculateSafeSum(macros.fat, currentMacros.fat),
      fiber: calculateSafeSum(macros.fiber, currentMacros.fiber),
      sugar: calculateSafeSum(macros.sugars, currentMacros.sugar),
    };

    trackTotalConsumption(user.uid, totalConsumption, consumedMacros);

    if (updatedMacros) {
      updateCurrentMacros({
        uid: user?.uid,
        newMacros: updatedMacros,
      });
    }
    if (macros.kcal > 0) {
      setButtonSwitch(!buttonSwitch);
      setWeight(0);

      setScannedProduct(null);
    }
  };

  const handleSetWeight = () => {
    setWeight(Number(input));
    setButtonSwitch(!buttonSwitch);
    // setInput(String(0));
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

  const handleBurnedCalories = () => {
    trackCalorieBurn(
      user.uid,
      userData.currentMacros,
      Number(burnedCalories),
      Number(currentMacros.calories)
    );
  };

  //   useEffect(() => {
  //     // trackTotalConsumption(user.uid, userData.consumption, currentMacros);
  //   }, [userData.currentMacros]);

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem("macroLogs");
      console.log("AsyncStorage cleared successfully");
    } catch (error) {
      console.log("Error clearing AsyncStorage:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {scannedProduct ? (
        <View style={styles.contentContainer}>
          <Pressable
            style={styles.cancleButton}
            onPress={() => {
              setScannedProduct(null);
              //   setButtonSwitch(false);
              //   router.replace("/Scanner");
            }}
          >
            <Ionicons
              name="arrow-back-circle-outline"
              size={40}
              color={"#D4AA7D"}
            />
          </Pressable>
          <View style={styles.macroContainer}>
            <Text style={styles.productName}>{productName}</Text>
            <Text style={styles.brandName}>({productBrand})</Text>
            <Text
              style={[
                styles.text,
                {
                  borderBottomWidth: 0,
                  fontWeight: "bold",
                  alignSelf: "flex-start",
                  marginLeft: 12,
                  marginTop: 10,
                },
              ]}
            >
              Nutrition Facts • {weight}g
            </Text>
            {Object.entries(macros).map(
              ([key, value]) =>
                !isNaN(value) && (
                  <View
                    key={key}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#ccc",
                      width: "90%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={[styles.text, { marginTop: 10 }]}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                    <Text style={[styles.text, { marginTop: 10 }]}>
                      {value}
                      {nutriments[`${key}_unit`] ||
                        nutriments[`energy-${key}_unit`] ||
                        ""}
                    </Text>
                  </View>
                )
            )}
          </View>
          <TextInput
            keyboardType="numeric"
            value={input}
            onChangeText={(input) => setInput(input)}
            style={styles.input}
            placeholder="Enter weight in grams"
          />
          <View style={styles.buttonContainer}>
            {/* <Pressable
              onPress={() => console.log(scannedProduct)}
              style={styles.button}
            >
              <Text>Save Product</Text>
            </Pressable> */}
            {!buttonSwitch ? (
              <Pressable onPress={handleSetWeight} style={styles.optionButton}>
                <Ionicons name="calculator" size={20} color="#fff" />
                <Text style={styles.buttonText}>Calculate Macros</Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.optionButton}
                disabled={weight <= 0}
                onPress={() => {
                  handleUpdateMacros();
                  router.replace("/");
                }}
              >
                <Ionicons name="add" size={24} color="#fff" />
                <Text style={styles.buttonText}>Set to daily progress</Text>
              </Pressable>
            )}
            <Pressable
              style={styles.optionButton}
              disabled={weight <= 0}
              onPress={() => {
                setWeight(0);
                setInput("");
                setButtonSwitch(false);
              }}
            >
              <Ionicons name="refresh-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>Reset Calculation</Text>
            </Pressable>

            {/* <Pressable style={styles.button} onPress={clearAsyncStorage}>
              <Text style={styles.buttonText}>Clear macroLogs</Text>
            </Pressable> */}
            {/* <Link href="/AddManually">Add meal manually</Link> */}
            <Pressable
              style={[styles.optionButton, { paddingLeft: 13 }]}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Custom Entry</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.menuContainer}>
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 30,
              width: "90%",
              marginVertical: 20,
              textAlign: "left",
            }}
          >
            Menu
          </Text>

          <View style={styles.totalConsumtionContainer}>
            <Text style={styles.totalConsumptonTitle}>Total consumption</Text>
            <View style={styles.consumptionRow}>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.totalConsumptionValue}>
                {totalConsumption.consumedCalories}
              </Text>
            </View>
            <View style={styles.consumptionRow}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.totalConsumptionValue}>
                {totalConsumption.consumedProtein}
              </Text>
            </View>
            <View style={styles.consumptionRow}>
              <Text style={styles.nutritionLabel}>Carbs</Text>
              <Text style={styles.totalConsumptionValue}>
                {totalConsumption.consumedCarbohydrates}
              </Text>
            </View>
            <View style={styles.consumptionRow}>
              <Text style={styles.nutritionLabel}>Fat</Text>
              <Text style={styles.totalConsumptionValue}>
                {totalConsumption.consumedFat}
              </Text>
            </View>
            <View style={styles.consumptionRow}>
              <Text style={styles.nutritionLabel}>Fiber</Text>
              <Text style={styles.totalConsumptionValue}>
                {totalConsumption.consumedFiber}
              </Text>
            </View>
            <View style={styles.consumptionRow}>
              <Text style={styles.nutritionLabel}>Sugar</Text>
              <Text style={styles.totalConsumptionValue}>
                {totalConsumption.consumedSugar}
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {/* <Text>or</Text> */}
            {/* <View style={styles.splitter} /> */}
            <Pressable
              style={styles.button}
              onPress={() => router.push("/(auth)/CreateMeal")}
            >
              <Text style={styles.buttonText}>Create a Meal</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => router.replace("/FoodsAndMeals")}
            >
              <Text style={styles.buttonText}>Meals & Foods</Text>
            </Pressable>
            {/* <View style={styles.splitter} /> */}
            <Pressable
              style={styles.button}
              onPress={() => setUpdateModalVisible(!updateModalVisible)}
            >
              <Text style={styles.buttonText}>Burned Calories</Text>
            </Pressable>
            {/* <View style={styles.splitter} /> */}
            <Pressable
              style={styles.button}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Manual Entry</Text>
            </Pressable>
          </View>
        </View>
      )}
      <Modal
        animationType="slide"
        //   transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <AddManually setShowModal={setModalVisible} />
      </Modal>
      <Modal
        animationType="slide"
        //   transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <AddManually setShowModal={setModalVisible} />
      </Modal>
      <UpdateModal
        label="Enter Burned calories"
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(!updateModalVisible)}
        setValue={setBurnedCalories}
        value={String(burnedCalories)}
        onSave={handleBurnedCalories}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: "center",
    alignItems: "center",
    // width: "100%",
    minHeight: "100%",
    backgroundColor: "#2D3E40",
    // padding: 20,
    position: "relative",
  },
  contentContainer: {
    // ...containerShadow.containerShadow,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    // padding: 20,
    // marginTop: 10,
    backgroundColor: "#2D3E40",
    // borderRadius: 15,
    marginVertical: 20,
  },
  menuContainer: {
    alignItems: "center",
    width: "100%",
    // justifyContent: "center",
    // backgroundColor: "#ccc",
  },
  macroContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    height: "auto",
    padding: 20,
    marginTop: 40,
    backgroundColor: "#5D7073",
    borderRadius: 15,
    // marginVertical: 20,
  },
  totalConsumtionContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "auto",
    padding: 25,
    marginTop: 40,
    backgroundColor: "#5D7073",
    borderRadius: 15,
  },
  totalConsumptonTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  consumptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
    alignItems: "center",
  },
  nutritionLabel: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  totalConsumptionValue: {
    color: "white",
  },
  buttonContainer: {
    // backgroundColor: "#5D7073",
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 50,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  brandName: {
    fontSize: 14,
    color: "white",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
  input: {
    ...containerShadow.containerShadow,
    width: "90%",
    marginTop: 30,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    ...containerShadow.containerShadow,
    backgroundColor: "#D4AA7D",
    width: "80%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 10,
    marginVertical: 10,

    // paddingLeft: 10,
    // marginVertical: 10,
  },
  optionButton: {
    ...containerShadow.containerShadow,
    width: "85%",
    height: 60,
    flexDirection: "row",
    // padding: 15,
    backgroundColor: "#D4AA7D",
    borderRadius: 10,
    alignItems: "center",
    paddingLeft: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    width: "80%",
    textAlign: "center",
  },
  cancleButton: {
    position: "absolute",
    top: 15,
    left: 15,
  },
  splitter: {
    width: "80%",
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    // marginVertical: "50%",
  },
});
