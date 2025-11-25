import CountryPicker from "@/components/CountryPicker";
import { TextSemiBold } from "@/components/StyledText";
import { Colors } from "@/CONST/Colors";
import { useCountry } from "@/stores/useCountryStore";
import {
  CountryCode,
  getExampleNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";
import React, { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";
import MaskInput from "react-native-mask-input";

interface ControllerPhoneInputProps<TFieldValues extends FieldValues> {
  label: string;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  name: Path<TFieldValues>;
  /**  Set to `true` if you want eye/eye-off toggle (e.g. PIN). */
  sensitive?: boolean;
  textInputStyle?: StyleProp<TextStyle>;
  /** ISO-3166 country code for validation; default “US”. */
  region?: CountryCode;
  autoFocus?: boolean;
}

const ControllerPhoneInput = <TFieldValues extends FieldValues>({
  control,
  rules = {},
  name,
  textInputStyle = null,
  autoFocus = false,
}: ControllerPhoneInputProps<TFieldValues>) => {
  const [mask, setMask] = useState<(string | RegExp)[]>([
    "+",
    "1",
    " ",
    /\d/,
    /\d/,
    /\d/,
    " ",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ]);
  const [maskedValue, setMaskedValue] = useState("");
  const [placeholder, setPlaceholder] = useState<string | undefined>("");
  const country = useCountry();

  // Generate a dynamic mask from libphonenumber-js
  useEffect(() => {
    try {
      const example = getExampleNumber(
        country.code,
        examples
      )?.formatNational();
      setPlaceholder(example);
      if (example) {
        const dynamicMask = generateMaskFromExample(example);
        setMask(dynamicMask);
      }
    } catch (e) {
      console.warn("Could not generate phone mask:", e);
    }
  }, [country.code]);

  return (
    <Controller
      control={control}
      rules={{
        ...rules,
        validate: (val) => {
          if (!val) return true;

          const phone = parsePhoneNumberFromString(val, country.code);
          return phone?.isValid() || "Phone number is invalid";
        },
      }}
      name={name}
      render={({ field: { onChange, onBlur }, fieldState: { error } }) => (
        <View style={styles.container}>
          <View style={styles.labelContainer}>
            <TextSemiBold style={styles.label}>Phone Number</TextSemiBold>
            <TextSemiBold style={styles.error}>{error?.message}</TextSemiBold>
          </View>

          <View style={styles.formInputContainer}>
            <CountryPicker emoji={country.emoji} />

            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: error ? Colors.pink : Colors.faintGrey,
                },
              ]}
            >
              <MaskInput
                autoFocus={autoFocus}
                keyboardType="phone-pad"
                placeholder={placeholder}
                mask={mask}
                style={[styles.input, textInputStyle]}
                value={maskedValue}
                onBlur={onBlur}
                onChangeText={(masked, unmasked) => {
                  setMaskedValue(masked);
                  onChange(unmasked);
                }}
              />
            </View>
          </View>
        </View>
      )}
    />
  );
};

function generateMaskFromExample(example: string): (string | RegExp)[] {
  const mask: (string | RegExp)[] = [];

  for (const char of example) {
    if (/\d/.test(char)) {
      mask.push(/\d/);
    } else {
      mask.push(char);
    }
  }

  return mask;
}

export default ControllerPhoneInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.black,
  },
  error: {
    fontSize: 12,
    color: Colors.pink,
  },
  formInputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
  },
  iconRightContainer: {
    marginRight: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
    fontFamily: "DMSans_400Regular",
  },
});
