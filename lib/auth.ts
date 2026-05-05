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
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { phone: credentials.identifier },
            ],
          },
        });

        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) return null;

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

  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 60,
  },

  jwt: {
    maxAge: 60 * 60,
  },

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

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
};