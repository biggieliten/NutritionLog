import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../state/AuthState/AuthContext";
import { updateCurrentMacros } from "../hooks/updateCurrentMacros";
import { set } from "firebase/database";
import { router } from "expo-router";

type Props = {
  setShowModal: (bool: boolean) => void;
};

export const AddManually = ({ setShowModal }: Props) => {
  const { userData, user } = useAuth();
  if (!userData || !user) return;
  const [newMacros, setNewMacros] = useState({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  });
  const currentMacros = userData?.currentMacros;

  const updatedMacros = {
    calories: currentMacros.calories + newMacros.calories,
    protein: currentMacros.protein + newMacros.protein,
    carbohydrates: currentMacros.carbohydrates + newMacros.carbohydrates,
    fat: currentMacros.fat + newMacros.fat,
    fiber: currentMacros.fiber + newMacros.fiber,
    sugar: currentMacros.sugar + newMacros.sugar,
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Pressable onPress={() => setShowModal(false)}>
            <Text>Cancel</Text>
          </Pressable>
          <Text>Add macros manually</Text>
          <Text>Calories</Text>
          <TextInput
            keyboardType="numeric"
            value={String(newMacros.calories)}
            onChangeText={(input) =>
              setNewMacros({ ...newMacros, calories: Number(input) })
            }
          />

          <Text>Protein (g)</Text>
          <TextInput
            keyboardType="numeric"
            value={String(newMacros.protein)}
            onChangeText={(input) =>
              setNewMacros({ ...newMacros, protein: Number(input) })
            }
          />

          <Text>Carbs (g)</Text>
          <TextInput
            keyboardType="numeric"
            value={String(newMacros.carbohydrates)}
            onChangeText={(input) =>
              setNewMacros({ ...newMacros, carbohydrates: Number(input) })
            }
          />

          <Text>Fat (g)</Text>
          <TextInput
            keyboardType="numeric"
            value={String(newMacros.fat)}
            onChangeText={(input) =>
              setNewMacros({ ...newMacros, fat: Number(input) })
            }
          />
          <Text>Fiber (g)</Text>
          <TextInput
            keyboardType="numeric"
            value={String(newMacros.fiber)}
            onChangeText={(input) =>
              setNewMacros({ ...newMacros, fiber: Number(input) })
            }
          />
          <Text>Sugar (g)</Text>
          <TextInput
            keyboardType="numeric"
            value={String(newMacros.sugar)}
            onChangeText={(input) =>
              setNewMacros({ ...newMacros, sugar: Number(input) })
            }
          />

          <Pressable
            onPress={() => {
              updateCurrentMacros({ uid: user.uid, newMacros: updatedMacros });
              setShowModal(false);
              router.replace("/");
            }}
          >
            <Text>Add macros</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "100%",
    backgroundColor: "transparent",
    padding: 20,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
    marginTop: 10,
    backgroundColor: "#91AC8F",
    borderRadius: 15,
    marginVertical: 20,
  },
});
