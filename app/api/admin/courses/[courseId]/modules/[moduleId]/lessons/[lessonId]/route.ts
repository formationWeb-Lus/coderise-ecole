import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  lessonId: string;
};

// 🔹 GET (Accéder à une leçon spécifique)
export async function GET(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { lessonId } = await params;
    const idNumber = parseInt(lessonId, 10);

    if (isNaN(idNumber)) {
      return NextResponse.json({ error: "lessonId invalide" }, { status: 400 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: idNumber },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Leçon non trouvée" }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("GET LESSON ERROR:", error);
    return NextResponse.json(
      { error: "Erreur récupération leçon" },
      { status: 500 }
    );
  }
}

// 🔹 PUT (Mettre à jour une leçon)
export async function PUT(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { lessonId } = await params;
    const idNumber = parseInt(lessonId, 10);

    if (isNaN(idNumber)) {
      return NextResponse.json({ error: "lessonId invalide" }, { status: 400 });
    }

    const body = await req.json();

    const updated = await prisma.lesson.update({
      where: { id: idNumber },
      data: {
        title: body.title,
        order: body.order ? Number(body.order) : undefined,
        content: body.content,
        videoUrl: body.videoUrl || null,
        pdfUrl: body.pdfUrl || null,
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

// 🔹 DELETE (Supprimer une leçon)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { lessonId } = await params;
    const idNumber = parseInt(lessonId, 10);

    if (isNaN(idNumber)) {
      return NextResponse.json({ error: "lessonId invalide" }, { status: 400 });
    }

    await prisma.lesson.delete({
      where: { id: idNumber },
    });

    return NextResponse.json({ message: "Leçon supprimée avec succès" });
  } catch (error) {
    console.error("DELETE LESSON ERROR:", error);
    return NextResponse.json(
      { error: "Erreur suppression leçon" },
      { status: 500 }
    );
  }
}