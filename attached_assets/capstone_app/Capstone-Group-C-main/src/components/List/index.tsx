import CONST from "@/CONST";
import { useTheme } from "@/hooks/useTheme";
import { FlashList } from "@shopify/flash-list";
import { StyleSheet, View } from "react-native";
import ListLabel from "./ListLabel";

type ListProps = {
  data?: Array<any>;
};

export default function List({ data }: ListProps) {
  const { colors } = useTheme();

  const _separator = () => (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.detailLowContrast,
      }}
    />
  );

  return (
    <FlashList
      style={{
        flex: 0, // Prevent it from filling entire container
        borderColor: colors.detailLowContrast,
        borderRadius: CONST.CARD_BORDER_RADIUS,
        borderWidth: StyleSheet.hairlineWidth,
      }}
      ItemSeparatorComponent={_separator}
      data={data}
      renderItem={({ item }) => <ListLabel {...item} />}
    />
  );
}
