import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { FormField } from "@/features/auth/components/FormField";
import { useForgotPassword } from "@/features/auth/hooks/useAuthMutations";
import { formatAuthError } from "@/features/auth/utils/formatAuthError";
import { forgotPasswordSchema } from "@/features/auth/validation";
import { AppText } from "@/shared/ui/AppText";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { colors } from "@/theme/colors";

type FormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordScreen() {
  const { mutateAsync, isPending } = useForgotPassword();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "athlete@pacesocial.app"
    }
  });

  return (
    <AuthLayout
      eyebrow="Recover access"
      title="Reset password"
      subtitle="Password reset is routed through Supabase email auth."
    >
      {errorMessage ? (
        <Card style={{ gap: 8, borderColor: "rgba(241,113,113,0.35)" }}>
          <AppText variant="subtitle">Reset unavailable</AppText>
          <AppText style={{ color: colors.mutedText }}>{errorMessage}</AppText>
        </Card>
      ) : null}
      <FormField control={control} name="email" label="Email" keyboardType="email-address" />
      <Button
        label={isPending ? "Sending..." : "Send reset link"}
        onPress={handleSubmit(async (values) => {
          try {
            setErrorMessage(null);
            await mutateAsync(values);
          } catch (error) {
            setErrorMessage(formatAuthError(error instanceof Error ? error.message : "Unable to send reset email."));
          }
        })}
      />
    </AuthLayout>
  );
}
