import HeaderWrapper from "@/components/HeaderWrapper";
import CONST from "@/CONST";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedReaction,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { TextRegular } from "../StyledText";
import { PageHeaderProps } from "./types";

const AnimatedHeaderWrapper = Animated.createAnimatedComponent(HeaderWrapper);

export default function AnimatedHeader({
  options,
  navigation,
  scrollOffset,
}: PageHeaderProps) {
  const { colors } = useTheme();
  const [titleVisible, setTitleVisible] = useState(false);
  const [borderVisible, setBorderVisible] = useState(false);
  const title = options.title;

  useAnimatedReaction(
    () => scrollOffset.value > 30,
    (visible) => {
      scheduleOnRN(setTitleVisible, visible);
    }
  );

  useAnimatedReaction(
    () => scrollOffset.value > 0,
    (visible) => {
      scheduleOnRN(setBorderVisible, visible);
    }
  );

  const style = {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: borderVisible
      ? colors.detailLowContrast
      : colors.background,
    transitionProperty: ["borderBottomColor"],
    transitionDuration: 0,
  };

  return (
    <AnimatedHeaderWrapper
      style={[{ backgroundColor: colors.background }, style]}
    >
      <View style={styles.titleContainer}>
        {titleVisible && (
          <Animated.View
            entering={FadeIn.duration(CONST.HEADER_TRANSITION_DURATION)}
            exiting={FadeOut.duration(CONST.HEADER_TRANSITION_DURATION)}
          >
            <PageHeaderTitle title={title} />
          </Animated.View>
        )}
      </View>
    </AnimatedHeaderWrapper>
  );
}

type PageHeaderTitleProps = {
  title?: string;
};

function PageHeaderTitle({ title }: PageHeaderTitleProps) {
  const { colors } = useTheme();

  return (
    <TextRegular style={[styles.title, { color: colors.textHighContrast }]}>
      {title}
    </TextRegular>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
  },

  titleContainer: {
    height: CONST.HEADER_HEIGHT,
    paddingBottom: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 8,
  },
});
