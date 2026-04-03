import { z } from "zod";

export const createActivitySchema = z.object({
  type: z.enum(["run", "ride", "walk"]),
  title: z.string().min(3),
  description: z.string().optional(),
  distanceMeters: z.coerce.number().min(100),
  movingTimeSeconds: z.coerce.number().min(60),
  elevationGainMeters: z.coerce.number().min(0),
  visibility: z.enum(["public", "followers", "private"])
});
