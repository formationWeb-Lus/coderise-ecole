import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 🔹 GET → Récupérer toutes les leçons d'un module
export async function GET(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { moduleId } = params;

    const lessons = await prisma.lesson.findMany({
      where: { moduleId: Number(moduleId) },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        videoUrl: true,
        pdfUrl: true,
        order: true,
      },
    });

    return NextResponse.json(lessons, { status: 200 });
  } catch (error) {
    console.error("GET LESSONS ERROR:", error);
    return NextResponse.json(
      { error: "Erreur récupération des lessons" },
      { status: 500 }
    );
  }
}

// 🔹 POST → Créer une nouvelle leçon
export async function POST(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const { moduleId } = params;
    const body = await req.json();

    const { title, content, description, videoUrl, pdfUrl, order } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "title et content sont requis" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        description: description ?? null,
        videoUrl: videoUrl ?? null,
        pdfUrl: pdfUrl ?? null,
        order: typeof order === "number" ? order : 1,
        moduleId: Number(moduleId),
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);
    return NextResponse.json(
      { error: "Erreur création de la lesson" },
      { status: 500 }
    );
  }
}
