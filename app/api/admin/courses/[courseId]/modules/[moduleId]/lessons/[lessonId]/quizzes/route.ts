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
    const { quizId, title, questions } = await request.json();

    const parsedQuizId = Number(quizId);
    const parsedLessonId = Number(lessonId);

    const updatedQuiz = await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour le titre du Quiz
      await tx.quiz.update({
        where: { id: parsedQuizId },
        data: {
          title: title.trim(),
          lessonId: parsedLessonId,
        },
      });

      // 2. Supprimer les anciennes questions
      await tx.question.deleteMany({
        where: { quizId: parsedQuizId },
      });

      // 3. Re-créer les questions avec le format exact attendu en BDD
      if (questions && questions.length > 0) {
        const questionsData = questions.map((q: any) => {
          // Extraire l'option cochée comme réponse correcte
          const correctOption = q.options.find((opt: any) => opt.isCorrect);
          const answerText = correctOption ? correctOption.text.trim() : "";

          let optionsJson = "";

          // FIX DU BUG BOOLEAN:
          // Pour les questions BOOLEAN, on écrit obligatoirement ["Vrai", "Faux"]
          if (q.type === "BOOLEAN") {
            optionsJson = JSON.stringify(["Vrai", "Faux"]);
          } else {
            const rawOptionsArray = q.options.map((opt: any) => opt.text.trim());
            optionsJson = JSON.stringify(rawOptionsArray);
          }

          return {
            quizId: parsedQuizId,
            question: q.question.trim(),
            type: q.type || "QCM",
            options: optionsJson, // ["Vrai", "Faux"] au lieu de ["","","",""]
            answer: answerText,   // Contient "Vrai" ou "Faux"
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