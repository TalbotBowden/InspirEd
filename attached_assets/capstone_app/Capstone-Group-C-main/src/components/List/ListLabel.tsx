import CONST from "@/CONST";
import Icon from "@/components/Icon";
import Switch from "@/components/Switch";
import { useTheme } from "@/hooks/useTheme";
import { ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { TextRegular } from "../StyledText";
import { ListLabelProps } from "./types";

export default function ListLabel({
  icon,
  label,
  secondaryLabel,
  type,
  isSwitchOn = false,
  onToggleSwitch,
  onPress,
}: ListLabelProps) {
  const { colors } = useTheme();
  const isRedirect = type === "redirect";

  const handlePress = () => {
    if (isRedirect && onPress) {
      onPress();
    }
  };

  return (
    <Pressable
      style={styles.container}
      disabled={!isRedirect}
      onPress={handlePress}
    >
      <View style={styles.left}>
        {icon && (
          <Icon
            color={colors.detailLowContrast}
            name={icon}
            size={CONST.LIST_ICON_SIZE}
          />
        )}
        <TextRegular style={[styles.label, { color: colors.textHighContrast }]}>
          {label}
        </TextRegular>
      </View>

      {/* RIGHT SIDE */}
      <View style={styles.right}>
        {secondaryLabel && (
          <TextRegular
            style={[styles.secondary, { color: colors.textLowContrast }]}
          >
            {secondaryLabel}
          </TextRegular>
        )}

        {isRedirect ? (
          <ChevronRight
            size={CONST.LIST_ICON_SIZE}
            color={colors.detailLowContrast}
          />
        ) : (
          <Switch
            isEnabled={isSwitchOn}
            toggleSwitch={() => onToggleSwitch?.(!isSwitchOn)}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 48,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flexShrink: 1,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: CONST.FONT_SIZE_MD,
  },
  secondary: {
    fontSize: CONST.FONT_SIZE_SM,
  },
});
