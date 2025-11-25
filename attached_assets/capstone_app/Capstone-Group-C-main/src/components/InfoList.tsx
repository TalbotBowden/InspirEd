import List from "@/components/List";
import { ListLabelProps } from "@/components/List/types";
import CONST from "@/CONST";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { TextRegular } from "./StyledText";

export default function InfoList() {
  const { colors } = useTheme();

  const info: Array<ListLabelProps> = [
    {
      label: "About",
      type: "redirect",
      onPress: () => {
        Alert.alert("About", "This is the about section.");
      },
    },
    {
      label: "Privacy Policy",
      type: "redirect",
      onPress: () => {
        Alert.alert("Privacy Policy", "This is the privacy policy section.");
      },
    },
    {
      label: "Terms of Service",
      type: "redirect",
      onPress: () => {
        Alert.alert(
          "Terms of Service",
          "This is the terms of service section."
        );
      },
    },
    {
      label: "Help & Support",
      type: "redirect",
      onPress: () => {
        Alert.alert("Help & Support", "This is the help & support section.");
      },
    },
  ];

  return (
    <View>
      <TextRegular style={[styles.title, { color: colors.textLowContrast }]}>
        Legal
      </TextRegular>
      <List data={info} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: CONST.FONT_SIZE_MD,
    marginBottom: 12,
  },
});
