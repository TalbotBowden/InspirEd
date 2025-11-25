import PageHeader from "@/components/PageHeader";
import { SessionProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useIsAuthReady, useSetIsAuthReady } from "@/stores/useAuthInitStore";
import {
  useStartUserListener,
  useStopUserListener,
} from "@/stores/useUserStore";
import {
  DMSans_400Regular,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import { getAuth } from "@react-native-firebase/auth";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });
  const startUserListener = useStartUserListener();
  const stopUserListener = useStopUserListener();
  const setIsAuthReady = useSetIsAuthReady();
  const isAuthReady = useIsAuthReady();

  useEffect(() => {
    const unsubscribeAuth = getAuth().onAuthStateChanged((user) => {
      if (user) {
        // Get the user's firebase uid
        const uid = user.uid;
        // Start the user listener to fetch user data
        startUserListener(uid);
      } else {
        // User is signed out, stop the user listener
        stopUserListener();
      }

      // Set the auth state to ready
      setIsAuthReady(true);
    });

    return () => {
      unsubscribeAuth(); // auth listener
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded && isAuthReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isAuthReady]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <KeyboardProvider>
          <SessionProvider>
            <Stack>
              <Stack.Screen
                name="(protected)"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen
                name="signup"
                options={{
                  header: (props) => <PageHeader {...props} />,
                }}
              />
              <Stack.Screen
                name="country-picker"
                options={{
                  presentation: "modal",
                  header: (props) => <PageHeader {...props} />,
                }}
              />
            </Stack>
          </SessionProvider>
        </KeyboardProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
