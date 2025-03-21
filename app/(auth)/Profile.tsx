import { ScrollView, Pressable, Text } from "react-native";
import { useSignOut } from "../hooks/useSignOut";
import { useAuth } from "../state/AuthState/AuthContext";
import { db } from "@/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getUserDoc } from "../hooks/getDoc";
import { setUserDoc } from "../hooks/setDoc";
import { addLog } from "../hooks/addLog";

export default function Pofile() {
  const { user } = useAuth();

  if (!user) return;

  return (
    <ScrollView>
      <Pressable
        style={{
          borderRadius: 10,
          margin: 10,
          padding: 10,
          height: "auto",
          width: "40%",
          backgroundColor: "#91AC8F",
        }}
        onPress={useSignOut}
      >
        <Text>Sign Out</Text>
      </Pressable>
      <Pressable
        style={{
          borderRadius: 10,
          margin: 10,
          padding: 10,
          height: "auto",
          width: "40%",
          backgroundColor: "#91AC8F",
        }}
        onPress={() => getUserDoc(user.uid)}
      >
        <Text>Get dock</Text>
      </Pressable>
      <Pressable
        style={{
          borderRadius: 10,
          margin: 10,
          padding: 10,
          height: "auto",
          width: "40%",
          backgroundColor: "#91AC8F",
        }}
        onPress={() =>
          setUserDoc({
            uid: user.uid,
            email: user.email,
            dailyGoal: {
              calories: 2000,
              carbohydrates: 120,
              protein: 130,
              fat: 20,
              sugar: 10,
              fiber: 30,
            },
            logs: [],
          })
        }
      >
        <Text>Set dock</Text>
      </Pressable>
      <Pressable
        style={{
          borderRadius: 10,
          margin: 10,
          padding: 10,
          height: "auto",
          width: "40%",
          backgroundColor: "#91AC8F",
        }}
        onPress={() =>
          addLog({
            uid: user.uid,
            newLog: {
              calories: 2000,
              protein: 130,
              carbohydrates: 120,
              fat: 20,
              fiber: 30,
              sugar: 10,
              date: "2022-02-01",
            },
          })
        }
      >
        <Text>Set newLog</Text>
      </Pressable>
      <Pressable
        style={{
          borderRadius: 10,
          margin: 10,
          padding: 10,
          height: "auto",
          width: "40%",
          backgroundColor: "#91AC8F",
        }}
        onPress={() => console.log(user?.uid, "user uid")}
      >
        <Text>user uid</Text>
      </Pressable>
      <Pressable
        style={{
          borderRadius: 10,
          margin: 10,
          padding: 10,
          height: "auto",
          width: "40%",
          backgroundColor: "#91AC8F",
        }}
        onPress={() => console.log(user?.email, "user email")}
      >
        <Text>user email</Text>
      </Pressable>
      <Pressable
        style={{
          borderRadius: 10,
          margin: 10,
          padding: 10,
          height: "auto",
          width: "40%",
          backgroundColor: "#91AC8F",
        }}
        onPress={() => console.log(user?.emailVerified, "user emailVerified")}
      >
        <Text>user verf</Text>
      </Pressable>
    </ScrollView>
  );
}
