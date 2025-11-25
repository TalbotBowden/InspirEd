// src/hooks/useSpeechToText.ts
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useEffect, useRef, useState } from "react";

export function useSpeechToText() {
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bufferRef = useRef<string>("");

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

  useEffect(() => {
    (async () => {
      try {
        const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        setPermissionGranted(granted);
      } catch (e: any) {
        setPermissionGranted(false);
        setError(e?.message || String(e));
      }
    })();
  }, []);

  const start = async () => {
    setError(null);
    bufferRef.current = "";
    setTranscript((prev) => prev.replace(/(\n\n\[listening\]\n.*)$/, "").trim());
    if (permissionGranted === false) {
      const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      setPermissionGranted(granted);
      if (!granted) {
        setError("Microphone permission is required to record.");
        return;
      }
    }
    await ExpoSpeechRecognitionModule.start({ lang: "en-US", interimResults: true });
  };

  const stop = async () => {
    await ExpoSpeechRecognitionModule.stop();
    const finalPiece = bufferRef.current;
    setTranscript((prev) =>
      prev.replace(/(\n\n\[listening\]\n.*)$/, "").concat(finalPiece ? (prev ? "\n" : "") + finalPiece : "").trim()
    );
    bufferRef.current = "";
  };

  return { recognizing, transcript, error, permissionGranted, start, stop, setTranscript };
}
