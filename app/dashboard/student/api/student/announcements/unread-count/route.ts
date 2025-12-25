import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ unreadCount: 0 }, { status: 401 });
  }

  const userId = Number(session.user.id);

  const unreadCount = await prisma.announcement.count({
    where: {
      reads: {
        none: {
          userId,
        },
      },
    },
  });

  return NextResponse.json({ unreadCount });
}
