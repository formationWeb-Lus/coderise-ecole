import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: {
    params: Promise<{ courseId: string; moduleId: string }>;
  }
) {
  try {
    // 🔑 Next 15+ → params = Promise
    const { moduleId } = await context.params;

    const lessons = await prisma.lesson.findMany({
      where: {
        moduleId: Number(moduleId),
      },
      orderBy: {
        order: "asc",
      },
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

export async function POST(
  req: Request,
  context: {
    params: Promise<{ courseId: string; moduleId: string }>;
  }
) {
  try {
    const { courseId, moduleId } = await context.params;

    const {
      title,
      content,
      description,
      videoUrl,
      pdfUrl,
      order,
    } = await req.json();

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
        description: description ?? null,
        videoUrl: videoUrl ?? null,
        pdfUrl: pdfUrl ?? null,
        order: order ?? 1,
        moduleId: Number(moduleId),
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

