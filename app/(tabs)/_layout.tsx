import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: { backgroundColor: "#25292e" },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Log",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color="#4B5945" size={size} />
          ),
          tabBarLabelStyle: { color: "#4B5945" },
        }}
      />
      ;
      <Tabs.Screen
        name="Scanner"
        options={{
          title: "Scanner",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan-outline" color="#4B5945" size={size} />
          ),
          tabBarLabelStyle: { color: "#4B5945" },
        }}
      />
      ;
      <Tabs.Screen
        name="AddMeal"
        options={{
          title: "Add Meal",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color="#4B5945" size={size} />
          ),
          tabBarLabelStyle: { color: "#4B5945" },
        }}
      />
      ;
      <Tabs.Screen
        name="DailyGoal"
        options={{
          title: "Daily Goal",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="today-outline" color="#4B5945" size={size} />
          ),
          tabBarLabelStyle: { color: "#4B5945" },
        }}
      />
    </Tabs>
  );
}
