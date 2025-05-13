import {
  TextInput,
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import { useState } from "react";
import { macroCalculator } from "../utils/macroCalculator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFixedDate } from "../utils/todaysDate";
import { containerShadow } from "../styles/styles";
import { updateCurrentMacros } from "../hooks/updateCurrentMacros";
import { useAuth } from "../state/AuthState/AuthContext";
import { router } from "expo-router";
import { AddManually } from "./AddManually";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getSafeValue } from "../hooks/getSafeValue";

export default function AddMeal() {
  //   const { scannedProduct, setScannedProduct } = useScannedProductStore();
  //   const { setCurrentMacros, currentMacros } = useCurrentMacroStore();
  const [weight, setWeight] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const [postData, setPostData] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const { user, userData, scannedProduct, setScannedProduct } = useAuth();

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

  const handleUpdateMacros = () => {
    const updatedMacros = {
      calories: getSafeValue(macros.kcal, currentMacros.calories),
      protein: getSafeValue(macros.proteins, currentMacros.protein),
      carbohydrates: getSafeValue(
        macros.carbohydrates,
        currentMacros.carbohydrates
      ),
      fat: getSafeValue(macros.fat, currentMacros.fat),
      fiber: getSafeValue(macros.fiber, currentMacros.fiber),
      sugar: getSafeValue(macros.sugars, currentMacros.sugar),
    };
    if (updatedMacros) {
      updateCurrentMacros({
        uid: user?.uid,
        newMacros: updatedMacros,
      });
    }
  };

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {scannedProduct ? (
        <View style={styles.contentContainer}>
          <Pressable
            style={styles.cancleButton}
            onPress={() => {
              setScannedProduct(null);
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
                    // key={key}
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
            <Pressable onPress={handleSetWeight} style={styles.optionButton}>
              <Ionicons name="calculator" size={20} color="#fff" />
              <Text style={styles.buttonText}>Calculate Macros</Text>
            </Pressable>
            <Pressable
              style={styles.optionButton}
              disabled={!macros}
              onPress={() => {
                handleUpdateMacros();
                router.replace("/");
              }}
            >
              <Ionicons name="add" size={24} color="#fff" />
              <Text style={styles.buttonText}>Set daily progress</Text>
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
        <>
          <View>
            <Pressable
              style={styles.button}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Add manually</Text>
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
          {/* <Text>or</Text> */}
          <View style={styles.splitter}></View>
          <Pressable
            style={styles.button}
            onPress={() => router.replace("/Scanner")}
          >
            <Text style={styles.buttonText}>Scan barcode</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
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
  macroContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "auto",
    padding: 20,
    marginTop: 10,
    backgroundColor: "#5D7073",
    borderRadius: 15,
    marginVertical: 20,
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
    marginTop: 10,
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
    width: "80%",

    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    ...containerShadow.containerShadow,
    width: 200,
    height: 60,
    flexDirection: "row",
    backgroundColor: "#D4AA7D",
    borderRadius: 10,
    alignItems: "center",
    paddingLeft: 10,
    marginVertical: 10,
  },
  optionButton: {
    ...containerShadow.containerShadow,
    width: "80%",
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
    marginVertical: "50%",
  },
});
