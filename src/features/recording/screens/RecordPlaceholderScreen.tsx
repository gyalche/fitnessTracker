import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { z } from "zod";

import { FormField } from "@/features/auth/components/FormField";
import { useCreateActivity } from "@/features/recording/hooks/useCreateActivity";
import { createActivitySchema } from "@/features/recording/validation";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Screen } from "@/shared/ui/Screen";
import { AppText } from "@/shared/ui/AppText";
import { colors } from "@/theme/colors";

type FormValues = z.infer<typeof createActivitySchema>;
const sportOptions: FormValues["type"][] = ["run", "ride", "walk"];
const visibilityOptions: FormValues["visibility"][] = ["public", "followers", "private"];

export function RecordPlaceholderScreen() {
  const navigation = useNavigation<any>();
  const { mutateAsync, isPending, isSuccess } = useCreateActivity();
  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      type: "run",
      title: "Evening Progress Run",
      description: "Steady effort with a controlled final kilometer.",
      distanceMeters: 6200,
      movingTimeSeconds: 1860,
      elevationGainMeters: 54,
      visibility: "followers"
    }
  });
  const selectedType = watch("type");
  const selectedVisibility = watch("visibility");

  return (
    <Screen scrollable>
      <View style={{ marginTop: 8, gap: 20 }}>
        <View>
          <AppText variant="title">Record</AppText>
          <AppText style={{ color: colors.mutedText, marginTop: 6 }}>
            Phase 1 now supports posting a completed activity through the backend API.
          </AppText>
        </View>
        <Card>
          <AppText variant="subtitle">Sport</AppText>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
            {sportOptions.map((sport) => {
              const isSelected = selectedType === sport;

              return (
                <Pressable
                  key={sport}
                  onPress={() => setValue("type", sport)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primaryMuted : colors.surfaceElevated
                  }}
                >
                  <AppText>{sport.toUpperCase()}</AppText>
                </Pressable>
              );
            })}
          </View>
        </Card>
        <FormField control={control} name="title" label="Title" autoCapitalize="words" />
        <FormField control={control} name="description" label="Description" autoCapitalize="sentences" />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField control={control} name="distanceMeters" label="Distance meters" keyboardType="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <FormField control={control} name="movingTimeSeconds" label="Moving time seconds" keyboardType="numeric" />
          </View>
        </View>
        <FormField control={control} name="elevationGainMeters" label="Elevation gain meters" keyboardType="numeric" />
        <Card>
          <AppText variant="subtitle">Visibility</AppText>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
            {visibilityOptions.map((visibility) => {
              const isSelected = selectedVisibility === visibility;

              return (
                <Pressable
                  key={visibility}
                  onPress={() => setValue("visibility", visibility)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primaryMuted : colors.surfaceElevated
                  }}
                >
                  <AppText>{visibility}</AppText>
                </Pressable>
              );
            })}
          </View>
        </Card>
        {isSuccess ? (
          <Card>
            <AppText style={{ color: colors.primary }}>
              Activity saved. The feed will refresh from backend data.
            </AppText>
          </Card>
        ) : null}
        <Button
          label={isPending ? "Saving..." : "Save activity"}
          onPress={handleSubmit(async (values) => {
            const activity = await mutateAsync(values);
            navigation.navigate("FeedTab", {
              screen: "ActivityDetail",
              params: { activityId: activity.id }
            });
          })}
        />
      </View>
    </Screen>
  );
}
