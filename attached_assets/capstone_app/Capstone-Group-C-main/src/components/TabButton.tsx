import Icon from "@/components/Icon";
import CONST from "@/CONST";
import { useTheme } from "@/hooks/useTheme";
import { TabTriggerSlotProps } from "expo-router/ui";
import { icons } from "lucide-react-native";
import { Ref } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { TextRegular } from "./StyledText";

export type TabButtonProps = TabTriggerSlotProps & {
  icon?: keyof typeof icons;
  text?: string;
  ref?: Ref<View>;
};

export function TabButton({
  icon,
  text,
  children,
  isFocused,
  ...props
}: TabButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable {...props} style={styles.container}>
      {icon && (
        <Icon
          name={icon}
          size={CONST.TAB_ICON_SIZE}
          color={isFocused ? colors.teal : colors.textLowContrast}
          strokeWidth={isFocused ? 2 : 1.5}
        />
      )}
      {text && (
        <TextRegular
          style={[
            styles.text,
            {
              color: isFocused ? colors.teal : colors.textLowContrast,
            },
          ]}
        >
          {text}
        </TextRegular>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 4,
    padding: 10,
  },
  text: {
    fontSize: 12,
  },
});
