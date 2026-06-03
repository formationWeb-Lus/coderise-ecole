import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const enrollments = await prisma.studentCourse.findMany({
      where: {
        userId,
      },
      include: {
        course: true,
      },
    });

    const courses = enrollments.map((e) => e.course);

    return NextResponse.json(courses);
  } catch (error) {
    console.error("ERROR student courses:", error);
    return NextResponse.json(
      { error: "Erreur chargement cours étudiant" },
      { status: 500 }
    );
  }
}