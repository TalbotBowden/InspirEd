import ControllerInput from "@/components/ControllerInput";
import OrDivider from "@/components/OrDivider";
import { TextRegular } from "@/components/StyledText";
import SubmitButton from "@/components/SubmitButton";
import { Colors } from "@/CONST/Colors";
import { useSession } from "@/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function Login() {
  const { signIn } = useSession();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
    } catch (error: any) {
      alert("Login error:" + error);
      // setError("other", {
      //   type: "custom",
      //   message: getErrorMessage(error, t),
      // });
    } finally {
      setLoading(false);
    }
  };
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
    <KeyboardAwareScrollView
      bottomOffset={62}
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      contentContainerStyle={styles.keyboardAwareScrollView}
    >
      <TextRegular style={styles.greeting}>Have an account?</TextRegular>
      <View style={styles.loginFormContainer}>
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

        <View style={styles.loginButtonContainer}>
          {typeof errors.other?.message === "string" && (
            <TextRegular style={styles.error}>
              {errors.other.message}
            </TextRegular>
          )}
          <SubmitButton
            text="Sign in"
            loading={loading}
            disabled={loading}
            onPress={() => {
              clearErrors("other");
              handleSubmit(onSubmit)();
            }}
            style={{ backgroundColor: "#8AB84A" }}
          />
        </View>
      </View>

      <OrDivider />

      <SubmitButton
        text={"Sign up"}
        variant="secondary"
        disabled={loading}
        onPress={() => router.navigate("/signup")}
      />
    </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  keyboardAwareScrollView: {
    padding: 16,
    flexDirection: "column",
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
  loginButtonContainer: {
    position: "relative",
    marginTop: 16,
  },
  error: {
    position: "absolute",
    top: -24,
    left: 0,
    color: Colors.pink,
    fontSize: 12,
  },
  gradient: {
    flex: 1,
  },
});
