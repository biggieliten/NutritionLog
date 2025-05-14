import { View, ActivityIndicator } from "react-native";

export const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2D3E40",
      }}
    >
      <ActivityIndicator size="large" color="#D4AA7D" />
    </View>
  );
};
