import React from "react";
import { View, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/constants/theme";

interface HeaderTitleProps {
  title: string;
  showTagline?: boolean;
}

export function HeaderTitle({ title, showTagline = false }: HeaderTitleProps) {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <ThemedText style={styles.title}>{title}</ThemedText>
      </View>
      {showTagline ? (
        <ThemedText style={[styles.tagline, { color: theme.textSecondary }]}>
          Learn to Empower. Empower to Hope.
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.primary,
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 1,
    letterSpacing: 0.2,
  },
});
