import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET lessons by module
export async function GET(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const moduleId = Number(params.moduleId);

    if (isNaN(moduleId)) {
      return NextResponse.json(
        { error: "moduleId invalide" },
        { status: 400 }
      );
    }

    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("GET LESSONS ERROR:", error);
    return NextResponse.json(
      { error: "Erreur récupération lessons" },
      { status: 500 }
    );
  }
}

// POST lesson
export async function POST(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const moduleId = Number(params.moduleId);
    const body = await req.json();

    const { title, content, order } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "title et content requis" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        moduleId,
        order: order ?? 1,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);
    return NextResponse.json(
      { error: "Erreur création lesson" },
      { status: 500 }
    );
  }
}
