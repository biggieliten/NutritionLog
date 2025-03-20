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
// <Stack>
//   <AuthFlowHandler />
// </Stack>

// function AuthFlowHandler() {
//   const { isSignedIn } = useContext(UserContext);

//   useEffect(() => {
//     if (!isSignedIn) {
//       router.replace("/"); // Redirect to login if not authenticated
//     }
//   }, [isSignedIn]);

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       {isSignedIn ? (
//         <Stack.Screen name="(app)" options={{ headerShown: false }} />
//       ) : (
//         <Stack.Screen name="(public)" options={{ headerShown: false }} />
//       )}
//     </Stack>
//   );
// }
