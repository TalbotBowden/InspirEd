import CONST from "@/CONST";
import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, View } from "react-native";
import { TextRegular } from "../StyledText";

type PageTitleProps = {
  title: string;
  subtitle?: string;
};

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TextRegular style={[styles.title, { color: colors.textHighContrast }]}>
        {title}
      </TextRegular>
      <TextRegular style={[styles.subtitle, { color: colors.textLowContrast }]}>
        {subtitle}
      </TextRegular>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 8,
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: CONST.FONT_SIZE_SM,
  },
});
