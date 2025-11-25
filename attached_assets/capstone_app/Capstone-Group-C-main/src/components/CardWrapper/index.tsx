import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, View } from "react-native";

type CardWrapperProps = {
  children?: React.ReactNode;
  style?: object;
};

export default function CardWrapper({ children, style }: CardWrapperProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        { borderColor: colors.detailLowContrast },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
  },
});
