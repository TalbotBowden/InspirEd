import React from "react";
import { View, StyleSheet, Image } from "react-native";

const InspiredLogo = require("@/assets/images/inspired-logo.png");

interface HeaderTitleProps {
  title?: string;
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 40,
  },
});
