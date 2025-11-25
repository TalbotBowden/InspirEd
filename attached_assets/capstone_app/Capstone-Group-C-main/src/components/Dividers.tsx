import { Colors } from "@/CONST/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";

const Divider = () => {
  return <View style={styles.divider} />;
};

const VerticalDivider = ({ color = Colors.faintGrey }: { color?: string }) => {
  return <View style={[styles.verticalDivider, { backgroundColor: color }]} />;
};

export { Divider, VerticalDivider };

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Colors.faintGrey,
    marginVertical: 8,
    flex: 1,
  },
  verticalDivider: {
    flex: 1,
    maxWidth: 1,
    backgroundColor: Colors.faintGrey,
  },
});
