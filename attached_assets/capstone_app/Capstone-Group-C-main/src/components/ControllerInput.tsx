import { TextSemiBold } from "@/components/StyledText";
import { Colors } from "@/CONST/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

interface ControllerInputProps<TFieldValues extends FieldValues> {
  label: string;
  placeholder: string;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  name: Path<TFieldValues>;
  sensitive?: boolean;
  multiline?: boolean;
  textInputStyle?: StyleProp<TextStyle>;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  iconLeft?: keyof typeof Ionicons.glyphMap;
  autoFocus?: boolean;
  shouldRemoveWhitespace?: boolean;
}

const ControllerInput = <TFieldValues extends FieldValues>({
  label,
  placeholder,
  control,
  rules = {},
  name,
  sensitive = false,
  multiline = false,
  textInputStyle = null,
  keyboardType = "default",
  iconLeft,
  autoFocus = false,
  shouldRemoveWhitespace = false,
}: ControllerInputProps<TFieldValues>) => {
  const [showSensitive, setShowSensitive] = useState(false);

  return (
    <Controller
      control={control}
      rules={rules}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View>
          <View style={styles.labelContainer}>
            <TextSemiBold style={styles.label}>{label}</TextSemiBold>
            <TextSemiBold style={styles.error}>{error?.message}</TextSemiBold>
          </View>

          <View
            style={[
              styles.inputContainer,
              { borderColor: error ? Colors.pink : Colors.faintGrey },
            ]}
          >
            {iconLeft && (
              <View style={styles.iconLeftContainer}>
                <Ionicons name={iconLeft} size={16} color={Colors.lightText} />
              </View>
            )}
            <TextInput
              style={[
                styles.input,
                { maxHeight: multiline ? 120 : 40 },
                textInputStyle,
              ]}
              onBlur={onBlur}
              autoFocus={autoFocus}
              onChangeText={(text) => {
                const sanitizedText = shouldRemoveWhitespace
                  ? text.replace(/\s+/g, "")
                  : text;
                onChange(sanitizedText);
              }}
              value={value}
              placeholder={placeholder}
              placeholderTextColor={Colors.lightText}
              secureTextEntry={sensitive && !showSensitive}
              multiline={multiline}
              keyboardType={keyboardType}
            />
            {sensitive && (
              <TouchableOpacity
                style={styles.iconRightContainer}
                onPress={() => setShowSensitive(!showSensitive)}
              >
                <Ionicons
                  name={showSensitive ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={Colors.grey}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    />
  );
};

export default ControllerInput;

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.black,
  },
  error: {
    color: Colors.pink,
    fontSize: 12,
  },
  iconLeftContainer: {
    marginLeft: 16,
  },
  inputContainer: {
    borderColor: Colors.faintGrey,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: "top",
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
    fontFamily: "DMSans_400Regular",
    textAlign: "left",
  },
  iconRightContainer: {
    marginRight: 16,
  },
});
