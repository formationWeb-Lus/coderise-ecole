// app/api/student/courses/[courseId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  courseId: string;
}

export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const { courseId } = params;
    const id = Number(courseId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "courseId invalide" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
