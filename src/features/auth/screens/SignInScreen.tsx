import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { View } from "react-native";
import { z } from "zod";

import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { FormField } from "@/features/auth/components/FormField";
import { useSignIn } from "@/features/auth/hooks/useAuthMutations";
import { formatAuthError } from "@/features/auth/utils/formatAuthError";
import { signInSchema } from "@/features/auth/validation";
import { AuthStackParamList } from "@/navigation/types";
import { AppText } from "@/shared/ui/AppText";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { colors } from "@/theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;
type FormValues = z.infer<typeof signInSchema>;

export function SignInScreen({ navigation, route }: Props) {
  const { mutateAsync, isPending } = useSignIn();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Your account, onboarding state, and activities are backed by Supabase now."
    >
      {route.params?.justSignedUp ? (
        <Card style={{ gap: 8, borderColor: "rgba(215,180,122,0.34)" }}>
          <AppText variant="subtitle">Account created</AppText>
          <AppText style={{ color: colors.mutedText }}>
            Sign in with your new credentials to continue into onboarding.
          </AppText>
        </Card>
      ) : null}
      {errorMessage ? (
        <Card style={{ gap: 8, borderColor: "rgba(241,113,113,0.35)" }}>
          <AppText variant="subtitle">Sign-in failed</AppText>
          <AppText style={{ color: colors.mutedText }}>{errorMessage}</AppText>
        </Card>
      ) : null}
      <FormField control={control} name="email" label="Email" keyboardType="email-address" />
      <FormField control={control} name="password" label="Password" secureTextEntry />
      <Button
        label={isPending ? "Signing in..." : "Continue"}
        onPress={handleSubmit(async (values) => {
          try {
            setErrorMessage(null);
            await mutateAsync(values);
          } catch (error) {
            setErrorMessage(formatAuthError(error instanceof Error ? error.message : "Unable to sign in."));
          }
        })}
      />
      <View style={{ gap: 8 }}>
        <AppText style={{ opacity: 0.8 }} onPress={() => navigation.navigate("ForgotPassword")}>
          Forgot password
        </AppText>
        <AppText style={{ opacity: 0.8 }} onPress={() => navigation.navigate("SignUp")}>
          Need an account? Sign up
        </AppText>
      </View>
    </AuthLayout>
  );
}
