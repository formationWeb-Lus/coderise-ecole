import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { announcementId } = await req.json();
  const userId = Number(session.user.id);

  // Créer un enregistrement si inexistant
  await prisma.announcementRead.upsert({
    where: { userId_announcementId: { userId, announcementId } },
    update: {},
    create: { userId, announcementId },
  });

  return NextResponse.json({ success: true });
}
