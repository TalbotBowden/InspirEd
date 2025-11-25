import LoadingScreen from "@/components/LoadingScreen";
import { useIsAuthReady } from "@/stores/useAuthInitStore";
import { useLoadFromStorage } from "@/stores/useTapStore";
import { useIsFetchingUser, useIsUserLoggedIn } from "@/stores/useUserStore";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function ProtectedLayout() {
  const loadFromStorage = useLoadFromStorage();
  const isUserLoggedIn = useIsUserLoggedIn();
  const isFetchingUser = useIsFetchingUser();
  const isAuthReady = useIsAuthReady();
  const [user, setUser] = useState<any | null>(getAuth().currentUser);
  const shouldRedirectToLogin = !isUserLoggedIn || user === null;
  const isLoading = !isAuthReady || isFetchingUser;

  useEffect(() => {
    loadFromStorage();

    // Subscribe to auth changes
    const unsub = onAuthStateChanged(getAuth(), (firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsub; // clean up listener
  }, []);

  // // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) return <LoadingScreen />;

  if (shouldRedirectToLogin) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
