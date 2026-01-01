import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { identifier, newPassword } = await req.json();

  if (!identifier || !newPassword) {
    return NextResponse.json(
      { message: "Données manquantes" },
      { status: 400 }
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { message: "Mot de passe trop court" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { phone: identifier },
        { name: identifier }
      ]
    }
  });

  if (!user) {
    return NextResponse.json(
      { message: "Utilisateur introuvable" },
      { status: 404 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  return NextResponse.json({ success: true });
}
