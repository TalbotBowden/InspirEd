import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { DerivedValue } from "react-native-reanimated";

export type PageHeaderProps = NativeStackHeaderProps & {
  scrollOffset: DerivedValue<number>;
};
