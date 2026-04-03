import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const signUpSchema = z.object({
  displayName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const onboardingSchema = z.object({
  preferredSports: z.array(z.enum(["run", "ride", "walk"])).min(1, "Choose at least one sport."),
  weeklyGoalMinutes: z.coerce.number().min(30, "Weekly goal must be at least 30 minutes.")
});
