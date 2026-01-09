import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 GET → Récupérer tous les quizzes d'une leçon
export async function GET(
  req: Request,
  context: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;

    const quizzes = await prisma.quiz.findMany({
      where: { lessonId: Number(lessonId) },
      orderBy: { createdAt: "asc" },
      include: {
        questions: true,   // Inclut les questions du quiz
        exercises: true,   // Inclut les exercices liés si tu veux
      },
    });

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error("GET QUIZZES ERROR:", error);
    return NextResponse.json(
      { error: "Erreur récupération des quizzes" },
      { status: 500 }
    );
  }
}

// 🔹 POST → Créer un nouveau quiz pour une leçon
export async function POST(
  req: Request,
  context: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;
    const body = await req.json();

    const { title, questions } = body;

    // Validation minimale
    if (!title) {
      return NextResponse.json({ error: "Le champ title est requis" }, { status: 400 });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "Le quiz doit contenir au moins une question" }, { status: 400 });
    }

    // Création du quiz avec les questions en cascade
    const quiz = await prisma.quiz.create({
      data: {
        title,
        lessonId: Number(lessonId),
        questions: {
          create: questions.map((q: any) => ({
            question: q.question,
            type: q.type || "TEXT",
            options: q.options ? JSON.stringify(q.options) : null,
            answer: q.answer,
            points: q.points ?? 10,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("CREATE QUIZ ERROR:", error);
    return NextResponse.json({ error: "Erreur création du quiz" }, { status: 500 });
  }
}
