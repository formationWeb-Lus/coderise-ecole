import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password, phone } = body;

  if (!name || !(email || phone) || !password) {
    return NextResponse.json(
      { message: "Tous les champs sont requis" },
      { status: 400 }
    );
  }

  // Vérifier si l'utilisateur existe déjà (email ou phone)
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email || undefined },
        { phone: phone || undefined },
      ],
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "Email ou téléphone déjà utilisé" },
      { status: 400 }
    );
  }

  // Hasher le mot de passe
  const hashedPassword = await hash(password, 10);

  // Créer l'utilisateur
  const user = await prisma.user.create({
    data: {
      name,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
      role: "STUDENT",
    },
  });

  return NextResponse.json({ message: "Utilisateur créé", user });
}
