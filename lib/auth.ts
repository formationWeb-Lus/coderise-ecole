import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import { Role } from "@/types/next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Identifiants",

      credentials: {
        identifier: { label: "Email ou Téléphone", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },

      async authorize(credentials) {
        // 🔴 Vérification des champs
        if (!credentials?.identifier || !credentials?.password) {
          console.log("❌ Champs manquants");
          return null;
        }

        console.log("🟡 IDENTIFIER:", credentials.identifier);

        // 🔍 Recherche utilisateur (email OU téléphone)
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { phone: credentials.identifier },
            ],
          },
        });

        console.log("🟢 USER TROUVÉ:", user);

        // ❌ utilisateur introuvable
        if (!user || !user.password) {
          console.log("❌ Utilisateur non trouvé");
          return null;
        }

        // 🔐 Vérification mot de passe
        const isValid = await compare(
          credentials.password,
          user.password
        );

        console.log("🔐 PASSWORD MATCH:", isValid);

        if (!isValid) {
          console.log("❌ Mot de passe incorrect");
          return null;
        }

        // ✅ utilisateur valide
        return {
          id: String(user.id),
          name: user.name,
          email: user.email ?? "",
          phone: user.phone ?? "",
          role: (user.role as Role) || "STUDENT",
          image: user.image ?? null,
        };
      },
    }),
  ],

  // 🔐 SESSION
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 heure
    updateAge: 60,
  },

  jwt: {
    maxAge: 60 * 60,
  },

  // 🔁 CALLBACKS
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.email = user.email;
        token.phone = user.phone;
        token.image = user.image;
      }

      if (!token.role) token.role = "STUDENT";

      return token;
    },

    async session({ session, token }) {
      if (!session.user) return session;

      session.user.id = String(token.sub);
      session.user.role = token.role as Role;
      session.user.email = token.email ?? "";
      session.user.phone = token.phone ?? "";
      session.user.image = token.image ?? null;

      return session;
    },
  },

  // 📄 PAGES
  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
};