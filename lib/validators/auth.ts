import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  password: z.string().min(6, "Mot de passe min 6 caractères"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().min(8, "Téléphone invalide").optional().or(z.literal("")),
  role: z.enum(["STUDENT", "ADMIN"]),
}).refine(data => data.email || data.phone, {
  message: "Email ou téléphone requis",
  path: ["email"],
});

export const loginSchema = z.object({
  identifier: z.string().min(3, "Email ou téléphone requis"),
  password: z.string().min(1, "Mot de passe requis"),
});