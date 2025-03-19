import { Tabs, useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect } from "react";
import { UserContext } from "@/app/state/UserState/UserContext";

export default function AuthenticatedTabLayout() {
  const { isSignedIn } = useContext(UserContext);
  //   const router = useRouter();
  //   useFocusEffect(() => {
  //     !isSignedIn && router.replace("/UserAuth");
  //   });
  //   : router.push("/");
  //   if (!isSignedIn) {
  //     return null;
  //   }
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
        name="UserAuth"
        options={{
          title: "UserAuth",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-circle-outline"
              color="#4B5945"
              size={size}
            />
          ),
          tabBarLabelStyle: { color: "#4B5945" },
          href: !isSignedIn ? "/UserAuth" : null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Log",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color="#4B5945" size={size} />
          ),
          tabBarLabelStyle: { color: "#4B5945" },
          href: isSignedIn ? "/" : null,
        }}
      />
      <Tabs.Screen
        name="Scanner"
        options={{
          title: "Scanner",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan-outline" color="#4B5945" size={size} />
          ),
          tabBarLabelStyle: { color: "#4B5945" },
          href: isSignedIn ? "/Scanner" : null,
        }}
      />
      <Tabs.Screen
        name="AddMeal"
        options={{
          title: "Add Meal",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color="#4B5945" size={size} />
          ),
          tabBarLabelStyle: { color: "#4B5945" },
          href: isSignedIn ? "/AddMeal" : null,
        }}
      />
      <Tabs.Screen
        name="DailyGoal"
        options={{
          title: "Daily Goal",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="today-outline" color="#4B5945" size={size} />
          ),
          tabBarLabelStyle: { color: "#4B5945" },
          href: isSignedIn ? "/DailyGoal" : null,
        }}
      />
    </Tabs>
  );
}
