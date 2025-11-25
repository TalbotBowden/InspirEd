import { TextSemiBold } from "@/components/StyledText";
import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TranscriptDoc = {
  id: string;
  text: string;
  summary?: string;
  createdAt?: Date | null;
};

export default function AppointmentHistory() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<TranscriptDoc[]>([]);

  useEffect(() => {
    const uid = getAuth().currentUser?.uid;
    if (!uid) {
      setLoading(false);
      setItems([]);
      return;
    }

    // Listen for user transcripts, newest first
    const unsub = firestore()
      .collection("users")
      .doc(uid)
      .collection("transcripts")
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snap) => {
          const next: TranscriptDoc[] = snap.docs.map((d) => {
            const data: any = d.data() || {};
            const createdAt =
              data.createdAt?.toDate?.() ??
              (typeof data.createdAt === "number" ? new Date(data.createdAt) : null);
            return {
              id: d.id,
              text: String(data.text ?? ""),
              summary: data.summary ? String(data.summary) : undefined,
              createdAt,
            };
          });
          setItems(next);
          setLoading(false);
        },
        (err) => {
          console.warn("Failed to load transcripts:", err);
          setLoading(false);
        }
      );

    return unsub;
  }, []);

  const renderItem = ({ item }: { item: TranscriptDoc }) => {
    const when = item.createdAt ? item.createdAt.toLocaleString() : "Unknown time";
    const preview = (item.summary?.trim() || makePreview(item.text)) || "No summary available.";

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/summaryPage",
            params: { transcript: item.text, summary: item.summary ?? "" },
          })
        }
      >
        <TextSemiBold style={styles.cardTitle}>{when}</TextSemiBold>
        <Text style={styles.cardPreview} numberOfLines={4}>
          {preview}
        </Text>
      </Pressable>
    );
  };

  const content = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#37A99F" />
          <Text style={{ marginTop: 8, color: "#666" }}>Loading visits…</Text>
        </View>
      );
    }
    if (!items.length) {
      return (
        <View style={styles.center}>
          <Text style={styles.empty}>No visits yet. Your past visit summaries will appear here.</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    );
  }, [items, loading]);

  return (
    <LinearGradient
      colors={[
        "rgba(255,255,255,1.0)",
        "rgba(255,255,255,1.0)",
        "rgba(200,200,200,0.7)",
        "rgba(34,126,130,0.85)",
      ]}
      style={[styles.gradient, { paddingHorizontal: 16 }]}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <TextSemiBold style={styles.title}>Appointment History</TextSemiBold>
        {content}
      </View>
    </LinearGradient>
  );
}

/** Make a short preview from the transcript (first ~2 sentences / 220 chars). */
function makePreview(text: string): string {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  const sentences = t.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
  const s = sentences || t;
  return s.length > 220 ? s.slice(0, 220).trim() + "…" : s;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 12, color: "#0b1b21" },
  empty: { color: "#666", textAlign: "center" },
  gradient: { flex: 1 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.06)",
  },
  cardTitle: { fontSize: 16, color: "#0b1b21", marginBottom: 6 },
  cardPreview: { fontSize: 14, color: "#334155", lineHeight: 20 },
});
