import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string("Name is required")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .trim()
    .toLowerCase(),

  email: z
    .string("Email is required")
    .email("Please enter a valid email")
    .trim()
    .toLowerCase(),

  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must not exceed 50 characters"),

  role: z
    .enum(["admin", "exhibitor", "attendee"])
    .optional()
    .default("attendee"),
});

const loginSchema = z.object({
  email: z
    .string("Email is required")
    .email("Please enter a valid email")
    .trim()
    .toLowerCase(),

  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const authValidator={
   registerSchema,
   loginSchema 
}

export default authValidator;