import CONST from "@/CONST";
import { useTheme } from "@/hooks/useTheme";
import { Switch as RNSwitch } from "react-native";

type SwitchProps = {
  isEnabled: boolean;
  toggleSwitch: () => void;
};

export default function Switch({ isEnabled, toggleSwitch }: SwitchProps) {
  const { colors } = useTheme();

  return (
    <RNSwitch
      ios_backgroundColor={colors.detailLowContrast}
      trackColor={{
        false: colors.detailLowContrast,
        true: colors.detailHighContrast,
      }}
      style={{
        transform: [
          { scaleX: CONST.SWITCH_SCALE },
          { scaleY: CONST.SWITCH_SCALE },
        ],
      }}
      thumbColor={colors.background}
      onValueChange={toggleSwitch}
      value={isEnabled}
    />
  );
}
