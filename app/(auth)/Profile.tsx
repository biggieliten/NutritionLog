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

export default function Pofile() {
  const { user, userData } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fieldType, setFieldType] = useState<string | null>(null);
  console.log(user?.uid, "user uid");

  if (!user) return;

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
      //   cacheImage(result.assets[0].uri);
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
  };

  const handleSave = async () => {
    if (!user) return;
    if (fieldType === "username") {
      await updateUsername(newUsername!);
    } else if (fieldType === "email") {
      await updateEmailAddress(newEmail!);
    } else if (fieldType === "password") {
      await updatePass(newPassword!);
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
      <View style={styles.splitter} />
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Username: {userData?.username}</Text>
        <Text style={styles.infoText}>Email: {userData?.email}</Text>
      </View>
      <View style={styles.updateContainer}>
        <Pressable
          onPress={() => {
            setFieldType("username"), setModalVisible(!modalVisible);
          }}
          style={styles.updateButton}
        >
          <Text style={styles.infoText}>Change username</Text>
          <Ionicons name="arrow-forward" />
        </Pressable>
        <Pressable
          onPress={() => {
            setFieldType("email"), setModalVisible(!modalVisible);
          }}
          style={styles.updateButton}
        >
          <Text style={styles.infoText}>Change email</Text>
          <Ionicons name="arrow-forward" />
        </Pressable>
        <Pressable
          onPress={() => {
            setFieldType("password"), setModalVisible(!modalVisible);
          }}
          style={styles.updateButton}
        >
          <Text style={styles.infoText}>Change password</Text>
          <Ionicons name="arrow-forward" />
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
            : "Enter new password"
        }
        secureText={fieldType === "password"}
        setValue={
          fieldType === "username"
            ? setNewUsername
            : fieldType === "email"
            ? setNewEmail
            : setNewPassword
        }
        value={
          fieldType === "username"
            ? newUsername || ""
            : fieldType === "email"
            ? newEmail || ""
            : newPassword || ""
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
  infoContainer: {
    width: "70%",
    backgroundColor: "#5D7073",
    padding: 10,
    marginBottom: 40,
    borderRadius: 10,
  },
  infoText: {
    color: "#C9D1D2",
    marginVertical: 5,
  },
  updateContainer: {
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5D7073",
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
