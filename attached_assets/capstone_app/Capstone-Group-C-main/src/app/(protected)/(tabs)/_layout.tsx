import { TabButton } from "@/components/TabButton";
import { useTheme } from "@/hooks/useTheme";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot style={styles.tabSlot} />
      <TabList
        style={[
          styles.tabList,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.detailLowContrast,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <TabTrigger name="home" href="/(protected)/(tabs)/(home)" asChild>
          <TabButton icon="House" text="Home" />
        </TabTrigger>
        <TabTrigger name="chat" href="/(protected)/(tabs)/(chat)" asChild>
          <TabButton icon="Speech" text="Chat" />
        </TabTrigger>
        <TabTrigger name="summary" href="/(protected)/(tabs)/(summary)" asChild>
          <TabButton icon="PaintBucket" text="Summary" />
        </TabTrigger>
        <TabTrigger name="profile" href="/(protected)/(tabs)/(profile)" asChild>
          <TabButton icon="User" text="Profile" />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabSlot: {
    flex: 1,
  },
  tabList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 2,
    justifyContent: "space-evenly",
  },
  tabButton: {
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
