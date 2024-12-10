import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export const getAsyncStorage = async (key: string) => {
  const [items, setItems] = useState<any[]>([]);

  const data = await AsyncStorage.getItem(key);
  if (data) {
    setItems(JSON.parse(data));
    console.log(data, "data in async storage");
  } else {
    console.log("No data found in async storage");
  }

  return items;
};
