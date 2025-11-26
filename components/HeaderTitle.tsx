import React from "react";
import { View, StyleSheet, Image } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/theme";

const InspiredSymbol = require("@/assets/images/inspired-symbol.png");

interface HeaderTitleProps {
  title: string;
  showTagline?: boolean;
}

export function HeaderTitle({ title, showTagline = false }: HeaderTitleProps) {
  return (
    <View style={styles.container}>
      <Image
        source={InspiredSymbol}
        style={styles.symbol}
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
  symbol: {
    width: 36,
    height: 36,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.light.text,
    letterSpacing: -0.3,
  },
});
