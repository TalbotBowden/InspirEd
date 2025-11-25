import ControllerInput from "@/components/ControllerInput";
import ControllerPhoneInput from "@/components/ControllerPhoneInput";
import { Divider } from "@/components/Dividers";
import { TextRegular } from "@/components/StyledText";
import SubmitButton from "@/components/SubmitButton";
import { useSession } from "@/contexts/AuthContext";
import { useCountry } from "@/stores/useCountryStore";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Signup() {
  const { signUp } = useSession();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const country = useCountry();
  const { control, handleSubmit, formState, clearErrors, getValues } =
    useForm();

  const { isValid } = formState;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    try {
      await signUp(data.email, data.password, {
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phone,
        dial_code: country.dial_code,
        email: data.email,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      // setError("other", {
      //   type: "custom",
      //   message: getErrorMessage(error, t),
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      bottomOffset={62}
      style={[styles.container, { paddingBottom: insets.bottom }]}
      contentContainerStyle={styles.keyboardAwareScrollView}
    >
      <TextRegular style={styles.greeting}>Create account</TextRegular>
      <View style={styles.loginFormContainer}>
        {/* First Name */}
        <ControllerInput
          control={control}
          name="firstName"
          label={"First Name"}
          rules={{
            required: "First Name is required",
          }}
          placeholder={"John"}
        />
        {/* Last Name */}
        <ControllerInput
          control={control}
          name="lastName"
          label={"Last Name"}
          rules={{
            required: "Last Name is required",
          }}
          placeholder={"Doe"}
        />

        <Divider />

        <ControllerPhoneInput
          control={control}
          name="phone"
          label={"Phone Number"}
        />

        {/* Email */}
        <ControllerInput
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Format is invalid",
            },
          }}
          label={"Email"}
          iconLeft="mail-outline"
          name="email"
          placeholder={"Enter your email"}
        />

        <Divider />

        {/* Password */}
        <ControllerInput
          control={control}
          name="password"
          label={"Password"}
          placeholder={"Enter your password"}
          iconLeft="lock-closed-outline"
          sensitive
          rules={{
            required: "Password is required",
          }}
        />

        {/* Confirm password */}
        <ControllerInput
          control={control}
          name="confirmPassword"
          label={"Confirm Password"}
          placeholder={"Confirm your password"}
          iconLeft="lock-closed-outline"
          sensitive
          rules={{
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          }}
        />

        <SubmitButton
          text="Start using InspirEd!"
          loading={loading}
          disabled={loading || !isValid}
          onPress={() => {
            clearErrors("other");
            handleSubmit(onSubmit)();
          }}
          style={styles.submitButton}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAwareScrollView: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 16,
    position: "relative",
  },
  loginFormContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 28,
    justifyContent: "center",
    alignItems: "stretch",
  },
  greeting: {
    fontSize: 40,
  },
  submitButton: {
    position: "relative",
    marginTop: 28,
  },
});
