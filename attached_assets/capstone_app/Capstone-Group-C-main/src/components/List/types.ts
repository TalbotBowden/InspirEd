import { Href } from "expo-router";
import { icons } from "lucide-react-native";

export type ListLabelProps = {
  icon?: keyof typeof icons;
  label: string;
  secondaryLabel?: string;
  type: "toggle" | "redirect";
  isSwitchOn?: boolean;
  onToggleSwitch?: (value: boolean) => void;
  onPress?: () => void;
};
