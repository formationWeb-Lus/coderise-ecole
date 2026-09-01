import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Context {
  params: Promise<{
    courseId: string;
    moduleId: string;
    lessonId: string;
  }>;
}

export async function GET(request: Request, context: Context) {
  try {
    const { lessonId } = await context.params;
    const parsedLessonId = Number(lessonId);

    if (isNaN(parsedLessonId)) {
      return NextResponse.json({ error: "lessonId invalide" }, { status: 400 });
    }

    const quizzes = await prisma.quiz.findMany({
      where: { lessonId: parsedLessonId },
      include: {
        questions: {
          orderBy: { id: "asc" },
        },
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error: any) {
    console.error("GET Quiz Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    const { lessonId } = await context.params;
    const body = await request.json();
    const { quizId, title, questions } = body;

    const parsedQuizId = Number(quizId);
    const parsedLessonId = Number(lessonId);

    if (!parsedQuizId || isNaN(parsedQuizId)) {
      return NextResponse.json({ error: "quizId requis et doit être un nombre" }, { status: 400 });
    }

    const updatedQuiz = await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour le titre du Quiz
      await tx.quiz.update({
        where: { id: parsedQuizId },
        data: {
          title: title?.trim() || "",
          lessonId: parsedLessonId,
        },
      });

      // 2. Supprimer les anciennes questions
      await tx.question.deleteMany({
        where: { quizId: parsedQuizId },
      });

      // 3. Re-créer les questions
      if (questions && questions.length > 0) {
        const questionsData = questions.map((q: any) => {
          const correctOption = q.options?.find((opt: any) => opt.isCorrect);
          const answerText = correctOption ? correctOption.text.trim() : "";

          let optionsJson = "";

          if (q.type === "BOOLEAN") {
            optionsJson = JSON.stringify(["Vrai", "Faux"]);
          } else {
            const rawOptionsArray = q.options ? q.options.map((opt: any) => opt.text.trim()) : [];
            optionsJson = JSON.stringify(rawOptionsArray);
          }

          return {
            quizId: parsedQuizId,
            question: q.question.trim(),
            type: q.type || "QCM",
            options: optionsJson,
            answer: answerText,
            points: Number(q.points) || 5,
          };
        });

        await tx.question.createMany({
          data: questionsData,
        });
      }

      return await tx.quiz.findUnique({
        where: { id: parsedQuizId },
        include: { questions: true },
      });
    });

    return NextResponse.json({ message: "Succès", quiz: updatedQuiz }, { status: 200 });
  } catch (error: any) {
    console.error("PUT Quiz Error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}