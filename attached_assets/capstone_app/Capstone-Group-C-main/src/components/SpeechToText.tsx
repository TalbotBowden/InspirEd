import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

type Props = {
  onStart?: () => void;
};

export default function SpeechToText({ onStart }: Props) {
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript || "");
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("Speech error:", event);
  });

  const handleStart = async () => {
   // fire your callback first (or after, either is fine)
    onStart?.();                    // ✅ navigate when Start is tapped
    try {
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      await ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
      });
    } catch (err) {
      console.warn("Speech start failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.transcript}>{transcript}</Text>
      {!recognizing ? (
        <Button title="Start" onPress={handleStart} />
      ) : (
        <Button title="Stop" onPress={() => ExpoSpeechRecognitionModule.stop()} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  transcript: { marginBottom: 12 },
});
