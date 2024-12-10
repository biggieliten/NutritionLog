import { Stack } from "expo-router";
import { GlobalProvider } from "./state/GlobalState/GlobalContext";
// import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
}
