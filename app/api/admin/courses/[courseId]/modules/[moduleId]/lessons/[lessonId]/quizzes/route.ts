import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 🔹 GET → Récupérer tous les quizzes d'une leçon
export async function GET(
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

    const quizzes = await prisma.quiz.findMany({
      where: { lessonId: Number(lessonId) },
      orderBy: { createdAt: "asc" },
      include: {
        questions: true,
        exercises: true,
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
    const body = await req.json();

    const { title, questions } = body;

    // Validation
    if (!title) {
      return NextResponse.json(
        { error: "Le champ title est requis" },
        { status: 400 }
      );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Le quiz doit contenir au moins une question" },
        { status: 400 }
      );
    }

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
    return NextResponse.json(
      { error: "Erreur création du quiz" },
      { status: 500 }
    );
  }
}