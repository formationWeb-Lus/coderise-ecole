import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { identifier } = await req.json();

  if (!identifier) {
    return NextResponse.json(
      { message: "Identifiant requis" },
      { status: 400 }
    );
  }

  const clean = identifier.trim();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: clean },
        { phone: clean },
        { name: clean }
      ]
    }
  });

  if (!user) {
    return NextResponse.json(
      { message: "Utilisateur introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
