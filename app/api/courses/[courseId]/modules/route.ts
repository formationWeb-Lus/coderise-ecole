import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: { courseId: string } | Promise<{ courseId: string }> }
) {
  // Déstructurer après await si params est un Promise
  const { courseId } = await context.params;

  if (!courseId) {
    return NextResponse.json({ error: "courseId manquant" }, { status: 400 });
  }

  try {
    const modules = await prisma.module.findMany({
      where: { courseId: parseInt(courseId, 10) },
      orderBy: { order: "asc" },
      include: { lessons: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(modules);
  } catch (err) {
    console.error("Erreur serveur:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

