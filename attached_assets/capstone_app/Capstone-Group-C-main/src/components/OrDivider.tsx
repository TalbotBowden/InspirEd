import { Divider } from "@/components/Dividers";
import { TextSemiBold } from "@/components/StyledText";
import React from "react";
import { StyleSheet, View } from "react-native";

const OrDivider = () => {
  return (
    <View style={styles.orContainer}>
      <Divider />
      <TextSemiBold style={styles.orText}>Or</TextSemiBold>
      <Divider />
    </View>
  );
};

export default OrDivider;

const styles = StyleSheet.create({
  orContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 16,
    color: "#444",
  },
});
