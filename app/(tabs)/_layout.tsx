import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
    //   screenOptions={{
    //     headerShown: false,
    //     tabBarActiveTintColor: "#ffd33d",
    //     headerStyle: { backgroundColor: "#25292e" },
    //     headerShadowVisible: false,
    //     headerTintColor: "#fff",
    //     tabBarStyle: { backgroundColor: "#25292e" },
    //   }}
    >
      <Tabs.Screen name="index" options={{ title: "Log" }} />;
      <Tabs.Screen name="Scanner" options={{ title: "Scanner" }} />;
      {/* <Tabs.Screen name="Log" options={{ title: "asd" }} />; */}
    </Tabs>
  );
}
