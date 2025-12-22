import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password } = body;

  if (!email || !password || !name) {
    return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 });
  }

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ message: "Email déjà utilisé" }, { status: 400 });
  }

  // Hasher le mot de passe
  const hashedPassword = await hash(password, 10);

  // Créer l'utilisateur
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "STUDENT", // Par défaut
    },
  });

  return NextResponse.json({ message: "Utilisateur créé", user });
}
