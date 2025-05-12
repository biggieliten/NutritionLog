import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToAsyncStorage = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to AsyncStorage:", error);
  }
};

export const loadFromAsyncStorage = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value !== null) {
      return JSON.parse(value);
    } else {
      console.log(`No value found in AsyncStorage for key ${key}.`);
      return null;
    }
  } catch (error) {
    console.error(`Error loading from AsyncStorage with key ${key}:`, error);
    return null;
  }
};
// export default { saveToAsyncStorage, loadFromAsyncStorage };
