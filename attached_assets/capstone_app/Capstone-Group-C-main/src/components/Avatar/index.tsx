import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { TextRegular } from "@/components/StyledText";
import { Image } from "expo-image";
import { AvatarProps } from "./types";
import CONST from "@/CONST";
import { useTheme } from "@/hooks/useTheme";

const Avatar = ({
  pointerEvents = "auto",
  onPress = null,
  size = CONST.AVATAR_SIZE_DEFAULT,
  source = null,
  initials = "",
  color,
  loading = false,
}: AvatarProps) => {
  const { colors } = useTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (loading) {
      opacity.value = withRepeat(
        withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      opacity.value = withTiming(1);
    }
  }, [loading]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Pressable
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: color || colors.textHighContrast,
        },
      ]}
      onPress={onPress}
      pointerEvents={pointerEvents}
    >
      {loading ? (
        <Animated.View
          style={[
            {
              width: "100%",
              height: "100%",
              backgroundColor: colors.textLowContrast,
              borderRadius: 9999,
            },
            animatedStyle,
          ]}
        />
      ) : source ? (
        <>
          <Image
            source={typeof source === "string" ? { uri: source } : source}
            style={{ width: "100%", height: "100%", borderRadius: 9999 }}
            contentFit="cover"
          />
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
          />
        </>
      ) : (
        <TextRegular
          style={{
            fontSize: size * CONST.AVATAR_INITIAL_SCALE_FACTOR,
            color: colors.background,
            textAlign: "center",
          }}
        >
          {initials}
        </TextRegular>
      )}
    </Pressable>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
  },
});
