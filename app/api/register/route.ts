import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 📥 Récupérer les données envoyées
    const body = await req.json();
    const { name, email, password, phone, role } = body;

    // 🛑 Vérification des champs obligatoires
    if (!name || !password || (!email && !phone)) {
      return NextResponse.json(
        { error: "Nom, mot de passe et (email ou téléphone) sont requis." },
        { status: 400 }
      );
    }

    // 🔍 Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          phone ? { phone } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email ou téléphone déjà utilisé." },
        { status: 400 }
      );
    }

    // 🔐 Hasher le mot de passe
    const hashedPassword = await hash(password, 10);

    // 👤 Créer l'utilisateur
    await prisma.user.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
        role: role || "STUDENT",
      },
    });

    return NextResponse.json(
      { message: "Compte créé avec succès." },
      { status: 201 }
    );

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
