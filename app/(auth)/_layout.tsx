import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../state/AuthState/AuthContext";
import { Loading } from "../components/Loading";
import { StatusBar } from "react-native";

export default function AuthenticatedTabLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) return <Redirect href="/SignInAndRegister" />;

  return (
    <>
      <StatusBar
        translucent={false}
        barStyle={"dark-content"}
        backgroundColor={""}
        hidden={true}
      />
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
          name="Menu"
          options={{
            title: "Menu",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle-outline" color="#fff" size={size} />
            ),
            tabBarLabelStyle: { color: "#fff" },
            href: user ? "/Menu" : null,
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
        {/* <Tabs.Screen name="AddManually" options={{ href: null }} /> */}
        <Tabs.Screen name="CreateMeal" options={{ href: null }} />
        <Tabs.Screen name="FoodsAndMeals" options={{ href: null }} />
      </Tabs>
    </>
  );
}
