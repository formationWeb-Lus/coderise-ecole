// app/api/register/route.ts
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // 📥 Récupérer les données envoyées
    const body = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const password = body.password;
    const role = body.role || "STUDENT";

    // ✅ VALIDATION SERVEUR
    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Nom invalide (minimum 2 caractères)." }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Mot de passe minimum 6 caractères." }, { status: 400 });
    }

    // ⚠️ Email et téléphone obligatoires
    if (!email || !phone) {
      return NextResponse.json({ error: "Email et téléphone sont requis." }, { status: 400 });
    }

    // Validation email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }

    // Validation téléphone
    if (phone.length < 8) {
      return NextResponse.json({ error: "Téléphone invalide (minimum 8 caractères)." }, { status: 400 });
    }

    // 🔎 Vérifier doublons
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Email ou téléphone déjà utilisé." }, { status: 400 });
    }

    // 🔐 Hasher le mot de passe
    const hashed = await hash(password, 10);

    // 👤 Créer l’utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashed,
        role,
      },
    });

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });

  } catch (e: any) {
    console.error("REGISTER ERROR:", e);

    // Gestion des doublons Prisma
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Email ou téléphone déjà utilisé." }, { status: 400 });
    }

    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}