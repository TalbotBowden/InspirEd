import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderWrapperProps } from "./types";

export default function HeaderWrapper({
  style,
  contentContainerStyle,
  children,
}: HeaderWrapperProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
        style,
      ]}
    >
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
});
