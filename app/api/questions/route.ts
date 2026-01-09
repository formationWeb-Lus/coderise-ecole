import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const quizId = url.searchParams.get("quizId");

    if (!quizId) {
      return NextResponse.json({ error: "quizId manquant" }, { status: 400 });
    }

    // ⚡ Récupérer toutes les questions pour ce quiz
    const questions = await prisma.question.findMany({
      where: { quizId: Number(quizId) },
      orderBy: { id: "asc" },
    });

    // Convertir options JSON string en tableau
    const formatted = questions.map((q) => ({
      id: q.id,
      quizId: q.quizId,
      question: q.question,
      type: q.type,
      options: q.options ? JSON.parse(q.options) : [],
      answer: q.answer,
      points: q.points,
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des questions" },
      { status: 500 }
    );
  }
}
