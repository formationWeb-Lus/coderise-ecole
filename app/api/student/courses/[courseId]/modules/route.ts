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
    const courseId = Number(params.courseId);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "courseId invalide" },
        { status: 400 }
      );
    }

    const modules = await prisma.module.findMany({
  where: { courseId },
  select: {
    id: true,
    title: true,
    order: true,
  },
  orderBy: { order: "asc" },
});


    return NextResponse.json(modules);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des modules" },
      { status: 500 }
    );
  }
}
