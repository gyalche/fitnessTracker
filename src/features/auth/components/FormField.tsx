import { Ionicons } from "@expo/vector-icons";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Platform, Pressable, TextInput, View } from "react-native";
import { useState } from "react";

import { AppText } from "@/shared/ui/AppText";
import { colors } from "@/theme/colors";

interface FormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric";
}

export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  secureTextEntry,
  autoCapitalize = "none",
  keyboardType = "default"
}: FormFieldProps<TFieldValues>) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
        <View style={{ gap: 8 }}>
          <AppText variant="caption" style={{ color: colors.mutedText }}>
            {label}
          </AppText>
          <View
            style={{
              backgroundColor: isFocused ? colors.surfaceElevated : colors.surface,
              borderColor: error ? colors.danger : colors.border,
              borderRadius: 22,
              borderWidth: 1,
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <TextInput
              autoCapitalize={autoCapitalize}
              keyboardType={keyboardType}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
              onChangeText={onChange}
              onFocus={() => setIsFocused(true)}
              placeholder={label}
              placeholderTextColor={colors.mutedText}
              secureTextEntry={secureTextEntry && !isVisible}
              style={{
                color: colors.text,
                paddingVertical: 16,
                flex: 1,
                ...(Platform.OS === "web"
                  ? ({
                      outlineWidth: 0,
                      outlineStyle: "none"
                    } as const)
                  : {})
              }}
              value={value ? String(value) : ""}
            />
            {secureTextEntry ? (
              <Pressable
                onPress={() => setIsVisible((current) => !current)}
                style={{ paddingLeft: 12, paddingVertical: 8 }}
                accessibilityRole="button"
                accessibilityLabel={isVisible ? "Hide password" : "Show password"}
              >
                <Ionicons
                  color={colors.primary}
                  name={isVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                />
              </Pressable>
            ) : null}
          </View>
          {error?.message ? (
            <AppText variant="caption" style={{ color: colors.danger }}>
              {error.message}
            </AppText>
          ) : null}
        </View>
      )}
    />
  );
}
