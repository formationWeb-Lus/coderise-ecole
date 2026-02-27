import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, role } = await req.json();

    if (!name || !password || (!email && !phone)) {
      return NextResponse.json(
        { error: "Nom, mot de passe et (email ou téléphone) requis." },
        { status: 400 }
      );
    }

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

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
        role: role || "STUDENT",
      },
    });

    return NextResponse.json(user, { status: 201 });

  } catch (error: any) {
    console.error("REGISTER ERROR:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email ou téléphone déjà utilisé." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}