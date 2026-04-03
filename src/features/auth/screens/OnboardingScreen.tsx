import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { z } from "zod";

import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { FormField } from "@/features/auth/components/FormField";
import { useCompleteOnboarding } from "@/features/auth/hooks/useAuthMutations";
import { onboardingSchema } from "@/features/auth/validation";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { AppText } from "@/shared/ui/AppText";
import { colors } from "@/theme/colors";

type FormValues = z.infer<typeof onboardingSchema>;
const sportOptions: FormValues["preferredSports"] = ["run", "ride", "walk"];

export function OnboardingScreen() {
  const { mutateAsync, isPending } = useCompleteOnboarding();
  const { control, handleSubmit, setValue, watch, formState } = useForm<FormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      preferredSports: ["run"],
      weeklyGoalMinutes: 240
    }
  });
  const selectedSports = watch("preferredSports");

  function toggleSport(sport: FormValues["preferredSports"][number]) {
    const nextSports = selectedSports.includes(sport)
      ? selectedSports.filter((entry) => entry !== sport)
      : [...selectedSports, sport];

    setValue("preferredSports", nextSports, {
      shouldTouch: true,
      shouldValidate: true
    });
  }

  return (
    <AuthLayout
      eyebrow="Onboarding"
      title="Goals and sport preferences"
      subtitle="Finish setup so your profile, feed, and future activities all share real backend state."
    >
      <Card>
        <AppText variant="subtitle">Preferred sports</AppText>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
          {sportOptions.map((sport) => {
            const isSelected = selectedSports.includes(sport);

            return (
              <Pressable
                key={sport}
                onPress={() => toggleSport(sport)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.primary : colors.border,
                  backgroundColor: isSelected ? colors.primaryMuted : colors.surfaceElevated
                }}
              >
                <AppText style={{ color: isSelected ? colors.text : colors.mutedText }}>{sport.toUpperCase()}</AppText>
              </Pressable>
            );
          })}
        </View>
        {formState.errors.preferredSports?.message ? (
          <AppText variant="caption" style={{ color: colors.danger, marginTop: 10 }}>
            {formState.errors.preferredSports.message}
          </AppText>
        ) : null}
      </Card>
      <FormField control={control} name="weeklyGoalMinutes" label="Weekly goal minutes" keyboardType="numeric" />
      <Button label={isPending ? "Saving..." : "Complete setup"} onPress={handleSubmit((values) => mutateAsync(values))} />
    </AuthLayout>
  );
}
