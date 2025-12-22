import "next-auth";

// 🔥 PAS d'import ici !
// Tu déclares l'enum directement dans le fichier .d.ts

export enum Role {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
}

declare module "next-auth" {
  interface User {
    role?: Role;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: Role;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}
