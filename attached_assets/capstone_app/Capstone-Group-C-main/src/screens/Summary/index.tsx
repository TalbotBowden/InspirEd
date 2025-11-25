import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Optional: replace this with your AI summarization backend call
async function summarizeText(text: string): Promise<string> {
  // Placeholder summarization (could use OpenAI or your backend API)
  if (!text) return "No transcript available to summarize.";
  const sentences = text.split(". ");
  return sentences.length > 3 ? sentences.slice(0, 3).join(". ") + "..." : text;
}

export default function SummaryPage() {
  const router = useRouter();
  const { transcript } = useLocalSearchParams<{ transcript: string }>();
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const result = await summarizeText(transcript || "");
      setSummary(result);
    })();
  }, [transcript]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recording Summary</Text>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>Original Transcript:</Text>
        <Text style={styles.textBlock}>
          {transcript || "No transcript provided."}
        </Text>

        <Text style={styles.sectionTitle}>Summary:</Text>
        {summary ? (
          <Text style={styles.textBlock}>{summary}</Text>
        ) : (
          <ActivityIndicator size="large" color="#37A99F" />
        )}
      </ScrollView>

      <Pressable style={styles.backButton} onPress={() => router.push("/")}>
        <Text style={styles.backText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7F9" },
  header: {
    fontSize: 24,
    fontWeight: "700",
    padding: 16,
    textAlign: "center",
    backgroundColor: "#fff",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 6,
  },
  textBlock: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: "#37A99F",
    margin: 16,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
  },
  backText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
