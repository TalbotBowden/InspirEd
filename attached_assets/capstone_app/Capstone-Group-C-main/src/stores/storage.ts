import { MMKV } from "react-native-mmkv";

// Create an MMKV instance
export const storage = new MMKV({
  id: "taps-storage",
});
