import { TextRegular } from "@/components/StyledText";
import { Colors } from "@/CONST/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const CountryPicker = ({ emoji }: { emoji: string }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.navigate("/country-picker")}
    >
      <TextRegular>{emoji}</TextRegular>
      <Ionicons name="chevron-down" size={16} color={Colors.black} />
    </TouchableOpacity>
  );
};

export default CountryPicker;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.faintGrey,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});
