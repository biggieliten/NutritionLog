import { Stack } from "expo-router";
import { GlobalProvider } from "./state/GlobalState/GlobalContext";

export default function RootLayout() {
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
}
