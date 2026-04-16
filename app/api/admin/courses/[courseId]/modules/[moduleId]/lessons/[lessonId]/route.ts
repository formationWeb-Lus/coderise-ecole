import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 🔹 GET
export async function GET(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: Number(lessonId) },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("GET LESSON ERROR:", error);
    return NextResponse.json(
      { error: "Erreur récupération leçon" },
      { status: 500 }
    );
  }
}

// 🔹 PUT
export async function PUT(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = params;
    const body = await req.json();

    const updated = await prisma.lesson.update({
      where: { id: Number(lessonId) },
      data: {
        title: body.title,
        order: body.order,
        content: body.content,
        videoUrl: body.videoUrl,
        pdfUrl: body.pdfUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("UPDATE LESSON ERROR:", error);
    return NextResponse.json(
      { error: "Erreur mise à jour leçon" },
      { status: 500 }
    );
  }
}

// 🔹 DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = params;

    await prisma.lesson.delete({
      where: { id: Number(lessonId) },
    });

    return NextResponse.json({ message: "Leçon supprimée" });
  } catch (error) {
    console.error("DELETE LESSON ERROR:", error);
    return NextResponse.json(
      { error: "Erreur suppression leçon" },
      { status: 500 }
    );
  }
}