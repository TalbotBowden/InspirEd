import React from "react";
import { View, StyleSheet, Image } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/theme";

const InspiredLogo = require("@/assets/images/inspired-logo.png");

interface HeaderTitleProps {
  title: string;
  showTagline?: boolean;
}

export function HeaderTitle({ title, showTagline = false }: HeaderTitleProps) {
  return (
    <View style={styles.container}>
      <Image
        source={InspiredLogo}
        style={styles.logo}
        resizeMode="contain"
      />
      <ThemedText style={styles.title}>{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 44,
    height: 44,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.light.text,
    letterSpacing: -0.3,
  },
});
