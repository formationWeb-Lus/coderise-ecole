import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = Number(session.user.id);

  const total = await prisma.announcement.count({
    where: {
      course: {
        studentCourses: {
          some: { userId },
        },
      },
    },
  });

  const read = await prisma.announcementRead.count({
    where: { userId },
  });

  return NextResponse.json({
    unreadCount: total - read,
  });
}

