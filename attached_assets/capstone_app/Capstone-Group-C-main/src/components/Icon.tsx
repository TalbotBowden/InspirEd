import CONST from "@/CONST";
import { icons } from "lucide-react-native";

type IconProps = {
  name: keyof typeof icons;
  color: string;
  size: number;
  strokeWidth?: number;
};

export default function Icon({
  name,
  color,
  size,
  strokeWidth = CONST.DEFAULT_STROKE_WIDTH,
}: IconProps) {
  const LucideIcon = icons[name];

  return <LucideIcon color={color} size={size} strokeWidth={strokeWidth} />;
}
