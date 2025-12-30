// ✅ Exporter le type Role pour pouvoir l'importer
export type Role = "STUDENT" | "TEACHER" | "ADMIN";

import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;       // maintenant utilisable partout
      phone?: string;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    phone?: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    phone?: string;
    image?: string | null;
  }
}
