import {
  ScrollView,
  Pressable,
  Text,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { useSignOut } from "../hooks/useSignOut";
import { useAuth } from "../state/AuthState/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set } from "firebase/database";

export default function Pofile() {
  const [image, setImage] = useState<string | null>(null);
  const { user, userData } = useAuth();
  console.log(user?.uid, "user uid");
  if (!user) return;

  const cachedImageKey = `profile-pic-${user.uid}`;

  useEffect(() => {
    const loadCachedImage = async () => {
      try {
        const cachedImage = await AsyncStorage.getItem(cachedImageKey);
        if (cachedImage) {
          setImage(cachedImage);
        }
      } catch (error) {
        console.error("Error loading cached image:", error);
      }
    };

    loadCachedImage();
  }, [user?.uid]);

  const cacheImage = async (imageUri: string) => {
    try {
      await AsyncStorage.setItem(cachedImageKey, imageUri);
      console.log("Profile picture saved to AsyncStorage");
    } catch (error) {
      console.error("Error saving profile picture:", error);
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
      setImage(result.assets[0].uri);
      cacheImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
      <Pressable onPress={pickImage}>
        <Text>Pick a profile picture</Text>
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
        onPress={useSignOut}
      >
        <Text>Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    borderRadius: 50,
    width: 100,
    height: 100,
  },
});
