import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { FormField } from "@/features/auth/components/FormField";
import { useSignUp } from "@/features/auth/hooks/useAuthMutations";
import { formatAuthError } from "@/features/auth/utils/formatAuthError";
import { signUpSchema } from "@/features/auth/validation";
import { AuthStackParamList } from "@/navigation/types";
import { AppText } from "@/shared/ui/AppText";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { api } from "@/shared/services/api";
import { colors } from "@/theme/colors";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;
type FormValues = z.infer<typeof signUpSchema>;

export function SignUpScreen({ navigation }: Props) {
  const { mutateAsync, isPending } = useSignUp();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(signUpSchema)
  });

  return (
    <AuthLayout
      eyebrow="Create your account"
      title="Start your training graph"
      subtitle="Create your account, then sign in to continue into onboarding and your private training graph."
      footer={<Button label="Already have an account" variant="ghost" onPress={() => navigation.navigate("SignIn")} />}
    >
      <Card style={{ gap: 10 }}>
        <AppText variant="subtitle">Membership</AppText>
        <AppText style={{ color: colors.mutedText }}>
          A quieter, more refined training space for runs, rides, and walks.
        </AppText>
      </Card>
      {errorMessage ? (
        <Card style={{ gap: 8, borderColor: "rgba(241,113,113,0.35)" }}>
          <AppText variant="subtitle">Signup unavailable</AppText>
          <AppText style={{ color: colors.mutedText }}>{errorMessage}</AppText>
        </Card>
      ) : null}
      <FormField control={control} name="displayName" label="Display name" autoCapitalize="words" />
      <FormField control={control} name="email" label="Email" keyboardType="email-address" />
      <FormField control={control} name="password" label="Password" secureTextEntry />
      <Button
        label={isPending ? "Creating..." : "Create account"}
        onPress={handleSubmit(async (values) => {
          try {
            setErrorMessage(null);
            await mutateAsync(values);
            await api.auth.signOut();
            navigation.replace("SignIn", { justSignedUp: true });
          } catch (error) {
            setErrorMessage(formatAuthError(error instanceof Error ? error.message : "Unable to create account."));
          }
        })}
      />
    </AuthLayout>
  );
}
