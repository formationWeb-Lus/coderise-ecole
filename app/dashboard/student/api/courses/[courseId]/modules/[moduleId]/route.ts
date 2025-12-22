import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courseId = Number(params.courseId);
  const moduleId = Number(params.moduleId);

  if (isNaN(courseId) || isNaN(moduleId)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  // 📦 Module + lessons
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      course: true,
      lessons: { orderBy: { order: "asc" } },
    },
  });

  if (!module || module.courseId !== courseId) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  // 🔐 Vérifier inscription
  const studentCourse = await prisma.studentCourse.findFirst({
    where: {
      userId: Number(session.user.id),
      courseId,
    },
  });

  if (!studentCourse) {
    return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
  }

  return NextResponse.json(module);
}
