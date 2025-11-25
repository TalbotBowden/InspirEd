import List from "@/components/List";
import { ListLabelProps } from "@/components/List/types";
import React from "react";
import { TextRegular } from "./StyledText";
import { Alert, StyleSheet, View } from "react-native";
import CONST from "@/CONST";
import { useTheme } from "@/hooks/useTheme";
import { getLocales } from "expo-localization";
import * as Linking from "expo-linking";

export default function SettingsList() {
  const { colors, theme, toggleTheme } = useTheme();
  const deviceLanguage = getLocales()[0].languageCode;
  const isDarkMode = theme === "dark";

  const settings: Array<ListLabelProps> = [
    {
      icon: "Bell",
      label: "Notifications",
      type: "toggle",
      isSwitchOn: false,
      onToggleSwitch: (value: boolean) => {},
    },
    {
      icon: "Moon",
      label: "Dark Mode",
      type: "toggle",
      isSwitchOn: isDarkMode,
      onToggleSwitch: (value: boolean) => {
        toggleTheme();
      },
    },
    {
      icon: "Globe",
      label: "Language",
      type: "redirect",
      secondaryLabel: deviceLanguage ? deviceLanguage.toUpperCase() : undefined,
      onPress: () => {
        Alert.alert(
          "Changing the app language \n",
          "1. Continue to the next screen.\n \n 2. Tap on the 'Preferred Language' option and select your preferred language from the list.\n \n If no languages are available, go to your general iPhone language settings to set your primary language.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Continue",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      },
    },
  ];

  return (
    <View>
      <TextRegular style={[styles.title, { color: colors.textLowContrast }]}>
        Settings
      </TextRegular>
      <List data={settings} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: CONST.FONT_SIZE_MD,
    marginBottom: 12,
  },
});
