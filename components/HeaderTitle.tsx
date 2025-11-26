import React from "react";
import { View, StyleSheet, Image } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

const InspiredLogo = require("@/assets/images/inspired-logo.png");

interface HeaderTitleProps {
  title: string;
  showTagline?: boolean;
}

export function HeaderTitle({ title, showTagline = false }: HeaderTitleProps) {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <Image
        source={InspiredLogo}
        style={styles.icon}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {showTagline ? (
          <ThemedText style={[styles.tagline, { color: theme.textSecondary }]}>
            Learn to Empower
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: Spacing.sm,
  },
  textContainer: {
    flexDirection: "column",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
  tagline: {
    fontSize: 10,
    fontWeight: "400",
    marginTop: -2,
  },
});
