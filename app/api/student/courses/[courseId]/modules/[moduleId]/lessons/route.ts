import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  courseId: string;
  moduleId: string;
}

export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const courseId = Number(params.courseId);
    const moduleId = Number(params.moduleId);

    if (isNaN(courseId) || isNaN(moduleId)) {
      return NextResponse.json(
        { error: "courseId ou moduleId invalide" },
        { status: 400 }
      );
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        moduleId,
        module: { courseId },
      },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des leçons" },
      { status: 500 }
    );
  }
}
