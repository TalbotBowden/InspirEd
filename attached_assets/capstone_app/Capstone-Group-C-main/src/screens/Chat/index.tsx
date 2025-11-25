// src/app/chat.tsx
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Expo Speech Recognition
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export default function RecordPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const bufferRef = useRef<string>(""); // accumulates interim results

  // --- Recognition events ---
  useSpeechRecognitionEvent("start", () => {
    setRecognizing(true);
    setError(null);
  });

  useSpeechRecognitionEvent("end", () => {
    setRecognizing(false);
  });

  useSpeechRecognitionEvent("result", (event) => {
    const piece = event?.results?.[0]?.transcript ?? "";
    bufferRef.current = piece;
    setTranscript((prev) => {
      const base = prev.replace(/(\n\n\[listening\]\n.*)$/, "");
      return `${base}\n\n[listening]\n${piece}`.trim();
    });
  });

  useSpeechRecognitionEvent("error", (evt) => {
    setError(String(evt?.error ?? "Unknown speech error"));
    setRecognizing(false);
  });

  // Ask for mic permissions on mount
  useEffect(() => {
    (async () => {
      try {
        const { granted } =
          await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        setPermissionGranted(granted);
      } catch (e: any) {
        setPermissionGranted(false);
        setError(e?.message || String(e));
      }
    })();
  }, []);

  const saveTranscript = async (text: string) => {
    const final = text.trim();
    const uid = getAuth().currentUser?.uid;
    if (!uid || !final) return;

    await firestore()
      .collection("users")
      .doc(uid)
      .collection("transcripts")
      .add({
        text: final,
        createdAt: firestore.FieldValue.serverTimestamp(),
        device: Platform.OS,
      });
  };

  const startRecording = async () => {
    setError(null);
    bufferRef.current = "";
    setTranscript((prev) =>
      prev.replace(/(\n\n\[listening\]\n.*)$/, "").trim()
    );
    try {
      if (permissionGranted === false) {
        const { granted } =
          await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        setPermissionGranted(granted);
        if (!granted) {
          setError("Microphone permission is required to record.");
          return;
        }
      }
      await ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
      });
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const stopRecording = async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
      const finalPiece = bufferRef.current;
      const finalText = transcript
        .replace(/(\n\n\[listening\]\n.*)$/, "")
        .concat(finalPiece ? (transcript ? "\n" : "") + finalPiece : "")
        .trim();

      setTranscript(finalText);
      await saveTranscript(finalText);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      bufferRef.current = "";
    }
  };

  const toggleRecording = () => {
    if (recognizing) stopRecording();
    else startRecording();
  };

  const finishRecording = async () => {
    if (recognizing) await stopRecording();
    await saveTranscript(transcript);
    router.push({
      pathname: "/(protected)/(tabs)/(summary)",
      params: { transcript },
    }); // ✅ navigate to summary
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Record</Text>
        {recognizing ? (
          <View style={styles.dotRow}>
            <View style={styles.dot} />
            <Text style={styles.dotText}>Listening…</Text>
          </View>
        ) : null}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {!transcript ? (
          <Text style={styles.placeholder}>
            Tap the microphone to start recording. Your transcript will appear
            here.
          </Text>
        ) : (
          <Text style={styles.transcript}>{transcript}</Text>
        )}
        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.micButton, recognizing && styles.micButtonActive]}
          onPress={toggleRecording}
        >
          <Ionicons
            name={recognizing ? "stop-circle" : "mic"}
            size={36}
            color="#fff"
          />
        </Pressable>

        {/* Finish Recording Button */}
        <Pressable
          style={[
            styles.finishButton,
            !recognizing && !transcript.trim() && { opacity: 0.5 },
          ]}
          onPress={finishRecording}
          disabled={!recognizing && !transcript.trim()}
        >
          <Text style={styles.finishText}>Finish recording</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7F9" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#0b1b21" },
  scroll: { flex: 1 },
  placeholder: { color: "#6b7680", fontSize: 16, lineHeight: 22 },
  transcript: { color: "#0b1b21", fontSize: 16, lineHeight: 24 },
  error: { color: "#b00020", marginTop: 10 },
  footer: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    alignItems: "center",
  },
  micButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#37A99F",
  },
  micButtonActive: { backgroundColor: "#1f7a73" },
  finishButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#0b1b21",
    marginTop: 12,
  },
  finishText: { color: "#fff", fontWeight: "700" },
  dotRow: { flexDirection: "row", alignItems: "center", marginLeft: "auto" },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e11d48",
    marginRight: 6,
  },
  dotText: { color: "#e11d48", fontWeight: "600" },
});
