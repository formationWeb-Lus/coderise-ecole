import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  moduleId: string;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { moduleId } = await params;

    const moduleIdNumber = parseInt(moduleId, 10);

    if (isNaN(moduleIdNumber)) {
      return NextResponse.json(
        { error: "moduleId invalide" },
        { status: 400 }
      );
    }

    const lessons = await prisma.lesson.findMany({
      where: { moduleId: moduleIdNumber },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(lessons);
  } catch (err) {
    console.error("GET lessons error:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { moduleId } = await params;

    const moduleIdNumber = parseInt(moduleId, 10);

    if (isNaN(moduleIdNumber)) {
      return NextResponse.json(
        { error: "moduleId invalide" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // ✅ AJOUT DES CHAMPS MANQUANTS
    const { title, content, order, videoUrl, pdfUrl } = body;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        moduleId: moduleIdNumber,
        order: order ?? 1,
        videoUrl: videoUrl || null,
        pdfUrl: pdfUrl || null,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (err) {
    console.error("POST lesson error:", err);
    return NextResponse.json(
      { error: "Erreur création lesson" },
      { status: 500 }
    );
  }
}