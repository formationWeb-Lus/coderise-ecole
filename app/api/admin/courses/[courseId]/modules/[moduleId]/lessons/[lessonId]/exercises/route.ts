import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: {
    params: Promise<{
      courseId: string;
      moduleId: string;
      lessonId: string;
    }>;
  }
) {
  try {
    const { lessonId } = await context.params;
    const { question, answer, type, points, deadline, quizId, choices } = await req.json();

    if (!question || !type) {
      return NextResponse.json(
        { error: "question et type requis" },
        { status: 400 }
      );
    }

    const exercise = await prisma.exercise.create({
      data: {
        lessonId: Number(lessonId),
        question,
        answer,
        type, // TEXT | QCM | BOOLEAN
        points: points ?? 10,
        deadline: deadline ? new Date(deadline) : new Date(),
        quizId: quizId ? Number(quizId) : null, // 🔹 ici on associe à un quiz si sélectionné
        choices: choices || null,               // 🔹 pour les QCM
      },
    });

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    console.error("CREATE EXERCISE ERROR:", error);
    return NextResponse.json(
      { error: "Erreur création exercice" },
      { status: 500 }
    );
  }
}
