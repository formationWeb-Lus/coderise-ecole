import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Params {
  courseId: string;
  moduleId: string;
  lessonId: string;
}

export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const courseId = Number(params.courseId);
    const moduleId = Number(params.moduleId);
    const lessonId = Number(params.lessonId);

    if (isNaN(courseId) || isNaN(moduleId) || isNaN(lessonId)) {
      return NextResponse.json(
        { error: "Paramètres invalides" },
        { status: 400 }
      );
    }

    const exercises = await prisma.exercise.findMany({
      where: {
        lessonId,
        lesson: {
          moduleId,
          module: { courseId },
        },
      },
      orderBy: { order: "asc" },
      select: {
        id: true,
        question: true,
        type: true,
      },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des exercices" },
      { status: 500 }
    );
  }
}
