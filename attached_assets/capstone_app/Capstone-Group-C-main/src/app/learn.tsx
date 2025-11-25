import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LearnPage() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Learning Path</Text>
      <Text style={styles.body}>
        This is the Learn page. Add courses or learning modules here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 12 },
  body: { fontSize: 16, color: "#333" },
});
