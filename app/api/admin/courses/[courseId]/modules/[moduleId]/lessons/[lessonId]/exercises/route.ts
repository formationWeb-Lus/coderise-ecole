import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: {
    params: {
      courseId: string;
      moduleId: string;
      lessonId: string;
    };
  }
) {
  try {
    const { lessonId } = params;

    const {
      question,
      answer,
      type,
      points,
      deadline,
      quizId,
      choices,
    } = await req.json();

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