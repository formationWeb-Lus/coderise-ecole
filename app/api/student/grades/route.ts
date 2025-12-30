import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ✅ Correct

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = Number(session.user.id);

  const submissions = await prisma.assignmentSubmission.findMany({
    where: { userId },
    include: {
      lesson: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(submissions);
}
