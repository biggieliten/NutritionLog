import {
  ScrollView,
  Pressable,
  Text,
  View,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import { useSignOut } from "../hooks/useSignOut";
import { useAuth } from "../state/AuthState/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set, update } from "firebase/database";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import {
  sendEmailVerification,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { setUserInfo } from "../hooks/updateDoc";
import UpdateModal from "../components/UpdateModal";
import { updatePersonalInfo } from "../hooks/updateBodyMetrics";

export default function Pofile() {
  const { user, userData } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [newWeight, setNewWeight] = useState<string>("");
  const [newHeight, setNewHeight] = useState<string>("");
  const [newAge, setNewAge] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fieldType, setFieldType] = useState<string | null>(null);
  console.log(user?.uid, "user uid");

  if (!user || !userData) return;

  useEffect(() => {
    if (userData?.profilePicUrl) {
      setImage(userData.profilePicUrl);
    }
  }, [userData]);

  const updateProfilePiture = async (imageUri: string) => {
    try {
      if (imageUri) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          profilePicUrl: imageUri,
        });
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [10, 10],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      updateProfilePiture(selectedImage);
    }
  };

  const updateUsername = async (newUsername: string) => {
    await setUserInfo({
      uid: user.uid,
      username: newUsername,
    });
  };

  const updateEmailAddress = async (newEmail: string) => {
    if (user) {
      await updateEmail(user, newEmail);
      await sendEmailVerification(user);
    }
  };

  const updatePass = async (newPassword: string) => {
    await updatePassword(user, newPassword);
    sendEmailVerification(user);
  };

  const handleSave = async () => {
    if (!user) return;
    if (fieldType === "username") {
      await updateUsername(newUsername!);
    } else if (fieldType === "email") {
      await updateEmailAddress(newEmail!);
    } else if (fieldType === "password") {
      await updatePass(newPassword!);
    } else if (
      fieldType === "weight" ||
      fieldType === "height" ||
      fieldType === "age"
    ) {
      const value =
        fieldType === "weight"
          ? newWeight
          : fieldType === "height"
          ? newHeight
          : newAge;

      await updatePersonalInfo({
        uid: user.uid,
        key: fieldType,
        value: Number(value),
      });
    }
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.logOutButton} onPress={useSignOut}>
        <Ionicons name="exit-outline" size={20} color="white" />
      </Pressable>
      <View>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Image
            source={require("../../assets/images/default-pfp.png")}
            style={styles.image}
          />
        )}
        <Pressable style={styles.pickImageButton} onPress={pickImage}>
          <Ionicons name="camera-reverse" color={"blue"} size={15} />
        </Pressable>
      </View>
      <View style={styles.bodyMetricsContainer}>
        {userData.bodyMetrics?.weight ? (
          <View style={styles.weightContainer}>
            <Text style={styles.bodyMetricValues}>
              {userData.bodyMetrics.weight}
              <Text style={styles.unit}> kg</Text>
            </Text>
            <Text style={{ fontWeight: "bold", color: "#fff" }}>Weight</Text>
          </View>
        ) : (
          <Pressable
            style={styles.setBodyMetricsButton}
            onPress={() => {
              setFieldType("weight");
              setModalVisible(!modalVisible);
            }}
          >
            <Ionicons name="add-circle-outline" color="#fff" size={24} />
            <Text style={{ color: "#fff" }}>Set Weight</Text>
          </Pressable>
        )}
        {userData.bodyMetrics?.height ? (
          <View style={styles.heightContainer}>
            <Text style={styles.bodyMetricValues}>
              {userData.bodyMetrics.height}
              <Text style={styles.unit}>cm</Text>
            </Text>
            <Text style={{ fontWeight: "bold", color: "#fff" }}>Height</Text>
          </View>
        ) : (
          <Pressable
            style={styles.setBodyMetricsButton}
            onPress={() => {
              setFieldType("height");
              setModalVisible(!modalVisible);
            }}
          >
            <Ionicons name="add-circle-outline" color="#fff" size={24} />
            <Text style={{ color: "#fff" }}>Set Height</Text>
          </Pressable>
        )}
        {userData.bodyMetrics?.age ? (
          <View style={styles.ageContainer}>
            <Text style={styles.bodyMetricValues}>
              {userData.bodyMetrics.age}
              <Text style={styles.unit}> y.o</Text>
            </Text>
            <Text style={{ fontWeight: "bold", color: "#fff" }}>Age</Text>
          </View>
        ) : (
          <Pressable
            style={styles.setBodyMetricsButton}
            onPress={() => {
              setFieldType("age");
              setModalVisible(!modalVisible);
            }}
          >
            <Ionicons name="add-circle-outline" color="#fff" size={24} />
            <Text style={{ color: "#fff" }}>Set Age</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.splitter} />
      <View style={styles.userInfoContianer}>
        <View style={styles.textContainer}>
          <Text style={[styles.infoText, { fontWeight: "bold" }]}>
            Username
          </Text>
          <Text style={styles.infoText}> {userData?.username}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.infoText, { fontWeight: "bold" }]}>Email</Text>
          <Text style={styles.infoText}>{userData?.email}</Text>
        </View>
      </View>
      <View style={styles.updateContainer}>
        <Text
          style={{
            textAlign: "left",
            width: "100%",
            color: "#5D7073",
            fontWeight: "bold",
            marginBottom: 7,
            paddingLeft: 7,
          }}
        >
          Account
        </Text>
        <Pressable
          onPress={() => {
            setFieldType("username"), setModalVisible(!modalVisible);
          }}
          style={styles.updateButton}
        >
          <Text style={styles.infoText}>Change username</Text>
          <Ionicons name="arrow-forward" color="#5D7073" size={16} />
        </Pressable>
        <Pressable
          onPress={() => {
            setFieldType("email"), setModalVisible(!modalVisible);
          }}
          style={styles.updateButton}
        >
          <Text style={styles.infoText}>Change email</Text>
          <Ionicons name="arrow-forward" color="#5D7073" size={16} />
        </Pressable>
        <Pressable
          onPress={() => {
            setFieldType("password"), setModalVisible(!modalVisible);
          }}
          style={styles.updateButton}
        >
          <Text style={styles.infoText}>Change password</Text>
          <Ionicons name="arrow-forward" color="#5D7073" size={16} />
        </Pressable>
        <Text
          style={{
            textAlign: "left",
            width: "100%",
            color: "#5D7073",
            fontWeight: "bold",
            marginTop: 10,
            marginVertical: 7,
            paddingLeft: 7,
          }}
        >
          Body metrics
        </Text>
        <Pressable
          onPress={() => {
            setFieldType("weight"), setModalVisible(!modalVisible);
          }}
          style={styles.updateButton}
        >
          <Text style={styles.infoText}>Change Weight</Text>
          <Ionicons name="arrow-forward" color="#5D7073" size={16} />
        </Pressable>
        <Pressable
          onPress={() => {
            setFieldType("height"), setModalVisible(!modalVisible);
          }}
          style={styles.updateButton}
        >
          <Text style={styles.infoText}>Change Height</Text>
          <Ionicons name="arrow-forward" color="#5D7073" size={16} />
        </Pressable>
        <Pressable
          onPress={() => {
            setFieldType("age"), setModalVisible(!modalVisible);
          }}
          style={styles.updateButton}
        >
          <Text style={styles.infoText}>Change Age</Text>
          <Ionicons name="arrow-forward" color="#5D7073" size={16} />
        </Pressable>
      </View>
      <UpdateModal
        visible={modalVisible}
        onClose={() => setModalVisible(!modalVisible)}
        onSave={handleSave}
        label={
          fieldType === "username"
            ? "Enter new username"
            : fieldType === "email"
            ? "Enter new email"
            : fieldType === "password"
            ? "Enter new password"
            : fieldType === "weight"
            ? "Enter new weight"
            : fieldType === "height"
            ? "Enter new height"
            : "Enter new age"
        }
        secureText={fieldType === "password"}
        setValue={
          fieldType === "username"
            ? setNewUsername
            : fieldType === "email"
            ? setNewEmail
            : fieldType === "password"
            ? setNewPassword
            : fieldType === "weight"
            ? setNewWeight
            : fieldType === "height"
            ? setNewHeight
            : setNewAge
        }
        value={
          fieldType === "username"
            ? newUsername || ""
            : fieldType === "email"
            ? newEmail || ""
            : fieldType === "password"
            ? newPassword || ""
            : fieldType === "weight"
            ? newWeight
            : fieldType === "height"
            ? newHeight
            : newAge
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    position: "relative",
    alignItems: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "#2D3E40",

    // justifyContent: "center",
  },
  image: {
    position: "relative",
    marginTop: 60,
    borderRadius: 100,
    width: 150,
    height: 150,
  },
  //   noImage: {
  //     position: "relative",
  //     marginTop: 40,
  //   },
  pickImageButton: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "#91AC8F",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 5,
    bottom: 13,
    right: 3,
  },
  bodyMetricsContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 20,
  },
  setBodyMetricsButton: {
    width: "33%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5D7073",
    padding: 10,
    borderRadius: 10,
  },
  bodyMetricValues: {
    fontSize: 20,
    color: "#fff",
  },
  weightContainer: {
    alignItems: "center",
    width: "33%",

    borderRightWidth: 1,
    borderColor: "#fff",
  },
  heightContainer: {
    alignItems: "center",
    width: "33%",
  },
  ageContainer: {
    alignItems: "center",
    width: "33%",

    borderLeftWidth: 1,
    borderColor: "#fff",
  },
  unit: {
    fontSize: 12,
  },
  userInfoContianer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 40,
    borderRadius: 10,
  },
  textContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  infoText: {
    color: "#5D7073",
    marginVertical: 7,
  },
  updateContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 10,
    // marginTop: 20,
    borderRadius: 10,
  },
  updateButton: {
    width: "90%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    // alignItems: "center
  },

  logOutButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    height: "auto",
    width: "auto",
    backgroundColor: "#D14D41",
    top: 5,
    right: 0,
  },
  splitter: {
    width: "80%",
    height: 0,
    borderBottomWidth: 1,
    borderColor: "#fff",
    marginVertical: 20,
  },
});
