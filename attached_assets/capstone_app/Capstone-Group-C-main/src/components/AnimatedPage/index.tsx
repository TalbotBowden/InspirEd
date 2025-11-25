import { useTheme } from "@/hooks/useTheme";
import { ScrollView, StyleSheet } from "react-native";

type AnimatedPageProps = {
  style?: object;
  contentContainerStyle?: object;
  children?: React.ReactNode;
  ref?: React.Ref<ScrollView>;
};

export default function AnimatedPage({
  children,
  style,
  contentContainerStyle,
  ref,
}: AnimatedPageProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      ref={ref}
      style={[styles.container, style, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
});
