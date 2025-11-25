import { TextRegular, TextSemiBold } from "@/components/StyledText";
import { useSession } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { useUserData } from "@/stores/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

// Sets up helpers that will be used in the UI
export default function Home() {
  const { colors } = useTheme();
  const { signOut } = useSession();
  const userData = useUserData();
  const router = useRouter();

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          title: `Welcome Back, ${userData?.first_name}!`,
        }}
      />
      <View style={[styles.container]}>
        {/* Widgets */}
        <LinearGradient
          colors={[
            "rgba(255,255,255,1.0)",
            "rgba(220,220,220,0.7)",
            "rgba(200,200,200,0.7)",
            "rgba(34,126,130,0.85)",
          ]}
          style={[styles.gradient, { paddingHorizontal: 16 }]}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 16, paddingTop: 12 }}
          >
            <View style={[styles.card, styles.widgetPrimary]}>
              <TextSemiBold style={styles.widgetTitle}>
                Learning Path
              </TextSemiBold>
              <TextRegular style={styles.widgetSubtitle}>
                Engage in a personalized learning experience for your needs
              </TextRegular>
              <TouchableOpacity
                style={styles.learnButton}
                onPress={() => (router as any).push("/learn")}
              >
                <TextSemiBold style={styles.learnButtonText}>
                  Start learning
                </TextSemiBold>
              </TouchableOpacity>
            </View>

            <View style={[styles.card, styles.widgetSecondary]}>
              <TextSemiBold style={styles.widgetTitle}>
                Visit History
              </TextSemiBold>
              <TextRegular style={styles.widgetSubtitle}>
                View your previous visit history
              </TextRegular>
              <TouchableOpacity
                style={[styles.learnButton, { backgroundColor: "#8AB84A" }]}
                onPress={() => (router as any).push("/appointmentHistory")}
              >
                <TextSemiBold style={styles.learnButtonText}>
                  View history
                </TextSemiBold>
              </TouchableOpacity>
            </View>

            <View style={[styles.card, styles.widgetSecondary]}>
              <TextSemiBold style={styles.widgetTitle}>
                Explore Library
              </TextSemiBold>
              <TextRegular style={styles.widgetSubtitle}>
                Browse curated resources
              </TextRegular>
              <TouchableOpacity
                style={[styles.learnButton, { backgroundColor: "#8AB84A" }]}
                onPress={() => (router as any).push("/library")}
              >
                <TextSemiBold style={styles.learnButtonText}>
                  Browse
                </TextSemiBold>
              </TouchableOpacity>
            </View>

            <View style={{ height: 24 }} />
          </ScrollView>
        </LinearGradient>
      </View>
    </React.Fragment>
  );
}

// Used for consistent look and feel
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeText: {
    fontSize: 20,
  },
  widgetPrimary: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
  },
  widgetSecondary: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  widgetTitle: {
    color: "#000",
    fontSize: 20,
  },
  widgetSubtitle: {
    color: "#000",
    fontSize: 14,
    marginTop: 8,
  },
  learnButton: {
    backgroundColor: "#8AB84A",
    padding: 10,
    borderRadius: 6,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  learnButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  gradient: {
    flex: 1,
  },
});
