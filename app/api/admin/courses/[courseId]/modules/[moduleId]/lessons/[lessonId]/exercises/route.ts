import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  context: { params: { courseId: string; moduleId: string; lessonId: string } }
) {
  try {
    const lessonId = Number(context.params.lessonId);

    if (isNaN(lessonId)) {
      return NextResponse.json(
        { error: "lessonId invalide" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      question,
      answer,
      type,
      points,
      deadline,
      quizId,
      choices,
    } = body;

    if (!question || !type) {
      return NextResponse.json(
        { error: "question et type requis" },
        { status: 400 }
      );
    }

    const exercise = await prisma.exercise.create({
      data: {
        lessonId,
        question,
        answer,
        type,
        points: points ?? 10,
        deadline: deadline ? new Date(deadline) : new Date(),
        quizId: quizId ? Number(quizId) : null,
        choices: choices || null,
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