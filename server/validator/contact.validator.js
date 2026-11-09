import { z } from "zod";

const contactSchema = z.object({
  username: z
    .string("Name is required")
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters"),

  email: z
    .string("Email is required")
    .trim()
    .email("Please enter a valid email"),

  message: z
    .string("Message is required")
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must not exceed 1000 characters"),
});

export default contactSchema;