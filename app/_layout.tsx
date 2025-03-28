import { Slot, Stack, router } from "expo-router";
// import { UserContext, UserProvider } from "./state/UserState/UserContext";
import { useContext, useEffect } from "react";
import AuthProvider from "./state/AuthState/AuthContext";

// import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
