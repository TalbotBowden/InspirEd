import AnimatedHeader from "@/components/AnimatedHeader";
import AnimatedPage from "@/components/AnimatedPage";
import Avatar from "@/components/Avatar";
import CardWrapper from "@/components/CardWrapper";
import InfoList from "@/components/InfoList";
import PageTitle from "@/components/PageTitle";
import SettingsList from "@/components/SettingsList";
import { TextRegular } from "@/components/StyledText";
import CONST from "@/CONST";
import { useSession } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { useUserData } from "@/stores/useUserStore";
import { router, Stack } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useAnimatedRef, useScrollOffset } from "react-native-reanimated";

export default function Profile() {
  const { colors } = useTheme();
  const userData = useUserData();
  const { signOut } = useSession();

  const animatedPageRef = useAnimatedRef<ScrollView>();
  const scrollOffset = useScrollOffset(animatedPageRef);
  return (
    <>
      <Stack.Screen
        options={{
          header: (props) => (
            <AnimatedHeader scrollOffset={scrollOffset} {...props} />
          ),
        }}
      />
      <AnimatedPage
        contentContainerStyle={styles.container}
        ref={animatedPageRef}
      >
        <PageTitle title="Profile" subtitle="Manage your account" />
        <CardWrapper style={styles.profileCard}>
          <Avatar initials={`${userData?.first_name?.charAt(0)}`} />
          <View style={styles.profileInfo}>
            <TextRegular
              style={[
                styles.profileCardName,
                { color: colors.textHighContrast },
              ]}
            >
              {userData?.first_name} {userData?.last_name}
            </TextRegular>
            <TextRegular
              style={[styles.secondaryText, { color: colors.textLowContrast }]}
            >
              {userData?.email}
            </TextRegular>
          </View>
        </CardWrapper>

        <SettingsList />

        <InfoList />

        <Pressable
          onPress={() => {
            signOut();
            router.replace("/");
          }}
        >
          <TextRegular style={{ color: colors.textLowContrast }}>
            Sign Out
          </TextRegular>
        </Pressable>
      </AnimatedPage>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 28,
    paddingBottom: 32,
  },
  contentContainer: {
    padding: 16,
  },
  deleteAccountText: {
    fontSize: CONST.FONT_SIZE_SM,
  },
  // Profile stuff
  profileCard: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
  },
  profileInfo: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
  },
  profileCardName: {
    fontSize: CONST.FONT_SIZE_MD,
  },
  secondaryText: {
    fontSize: CONST.FONT_SIZE_SM,
  },
});
