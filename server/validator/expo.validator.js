import { z } from "zod";

const expoSchema = z.object({
  title: z
    .string("Title is required")
    .trim()
    .min(3, "Title must be at least 3 characters"),

  description: z
    .string("Description is required")
    .trim()
    .min(10, "Description must be at least 10 characters"),

  date: z
    .coerce
    .date("Date is required"),

  location: z
    .string("Location is required")
    .trim()
    .min(3, "Location must be at least 3 characters"),

  theme: z
    .string("Theme is required")
    .trim()
    .min(3, "Theme must be at least 3 characters")
});

export default expoSchema;