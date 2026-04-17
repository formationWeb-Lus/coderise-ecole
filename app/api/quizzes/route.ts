// app/api/quizzes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lessonId = url.searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json(
        { error: "Paramètre lessonId manquant" },
        { status: 400 }
      );
    }

    // 🔹 Récupérer tous les quizzes pour la leçon avec leurs questions
    const quizzes = await prisma.quiz.findMany({
      where: { lessonId: Number(lessonId) },
      include: {
        questions: true, // Inclure toutes les questions
      },
      orderBy: { createdAt: "asc" }, // Trier par date de création
    });

    return NextResponse.json(quizzes);
  } catch (err: any) {
    console.error("Erreur API /quizzes :", err);
    return NextResponse.json(
      { error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
