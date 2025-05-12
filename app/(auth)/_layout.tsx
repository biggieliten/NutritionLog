import { Redirect, Stack, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect } from "react";
import AuthProvider, { useAuth } from "../state/AuthState/AuthContext";

export default function AuthenticatedTabLayout() {
  const { user } = useAuth();

  console.log(user, "user");
  if (!user) return <Redirect href="/SignInAndRegister" />;
  //   return <Stack />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: { backgroundColor: "#25292e" },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#D4AA7D",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color="#fff" size={size} />
          ),
          tabBarLabelStyle: { color: "#fff" },
          href: user ? "/" : null,
        }}
      />
      <Tabs.Screen
        name="Scanner"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan-outline" color="#fff" size={size} />
          ),
          tabBarLabelStyle: { color: "#fff" },
          href: user ? "/Scanner" : null,
        }}
      />
      <Tabs.Screen
        name="AddMeal"
        options={{
          title: "Add Meal",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color="#fff" size={size} />
          ),
          tabBarLabelStyle: { color: "#fff" },
          href: user ? "/AddMeal" : null,
        }}
      />
      <Tabs.Screen
        name="DailyGoal"
        options={{
          title: "Daily Goal",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flag-outline" color="#fff" size={size} />
          ),
          tabBarLabelStyle: { color: "#fff" },
          href: user ? "/DailyGoal" : null,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color="#fff" size={size} />
          ),
          tabBarLabelStyle: { color: "#fff" },
          href: user ? "/Profile" : null,
        }}
      />
    </Tabs>
  );
}
