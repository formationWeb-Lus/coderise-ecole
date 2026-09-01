import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Context {
  params: Promise<{
    courseId: string;
    moduleId: string;
    lessonId: string;
  }>;
}

// ==========================================
// 1. GET : Récupérer les quiz d'une leçon
// ==========================================
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

// ==========================================
// 2. POST : Créer un nouveau quiz
// ==========================================
export async function POST(request: Request, context: Context) {
  try {
    const { lessonId } = await context.params;
    const body = await request.json();
    const { title, questions } = body;
    const parsedLessonId = Number(lessonId);

    if (!parsedLessonId || isNaN(parsedLessonId)) {
      return NextResponse.json({ error: "lessonId invalide" }, { status: 400 });
    }

    if (!title || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Données de quiz invalides" }, { status: 400 });
    }

    const createdQuiz = await prisma.$transaction(async (tx) => {
      // 1. Création de l'entrée Quiz
      const newQuiz = await tx.quiz.create({
        data: {
          title: title.trim(),
          lessonId: parsedLessonId,
        },
      });

      // 2. Formatage et insertion des questions
      const questionsData = questions.map((q: any) => {
        let optionsJson = "";

        if (q.type === "BOOLEAN") {
          optionsJson = JSON.stringify(["Vrai", "Faux"]);
        } else if (Array.isArray(q.options)) {
          const rawOptionsArray = q.options.map((opt: any) =>
            typeof opt === "string" ? opt.trim() : opt.text?.trim() || ""
          );
          optionsJson = JSON.stringify(rawOptionsArray);
        }

        return {
          quizId: newQuiz.id,
          question: q.question.trim(),
          type: q.type || "QCM",
          options: optionsJson,
          answer: q.answer ? q.answer.trim() : "",
          points: Number(q.points) || 10,
        };
      });

      await tx.question.createMany({
        data: questionsData,
      });

      return await tx.quiz.findUnique({
        where: { id: newQuiz.id },
        include: { questions: true },
      });
    });

    return NextResponse.json({ message: "Quiz créé avec succès", quiz: createdQuiz }, { status: 201 });
  } catch (error: any) {
    console.error("POST Quiz Error:", error);
    return NextResponse.json({ error: "Erreur lors de la création du quiz" }, { status: 500 });
  }
}

// ==========================================
// 3. PUT : Mettre à jour un quiz existant
// ==========================================
export async function PUT(request: Request, context: Context) {
  try {
    const { lessonId } = await context.params;
    const body = await request.json();
    const { quizId, title, questions } = body;

    const parsedQuizId = Number(quizId);
    const parsedLessonId = Number(lessonId);

    if (!parsedQuizId || isNaN(parsedQuizId)) {
      return NextResponse.json({ error: "quizId requis et valide" }, { status: 400 });
    }

    const updatedQuiz = await prisma.$transaction(async (tx) => {
      // 1. Mise à jour du titre
      await tx.quiz.update({
        where: { id: parsedQuizId },
        data: {
          title: title?.trim() || "",
          lessonId: parsedLessonId,
        },
      });

      // 2. Suppression des anciennes questions
      await tx.question.deleteMany({
        where: { quizId: parsedQuizId },
      });

      // 3. Recréation des questions mises à jour
      if (questions && questions.length > 0) {
        const questionsData = questions.map((q: any) => {
          let optionsJson = "";

          if (q.type === "BOOLEAN") {
            optionsJson = JSON.stringify(["Vrai", "Faux"]);
          } else if (Array.isArray(q.options)) {
            const rawOptionsArray = q.options.map((opt: any) =>
              typeof opt === "string" ? opt.trim() : opt.text?.trim() || ""
            );
            optionsJson = JSON.stringify(rawOptionsArray);
          }

          return {
            quizId: parsedQuizId,
            question: q.question.trim(),
            type: q.type || "QCM",
            options: optionsJson,
            answer: q.answer ? q.answer.trim() : "",
            points: Number(q.points) || 10,
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

    return NextResponse.json({ message: "Quiz mis à jour", quiz: updatedQuiz }, { status: 200 });
  } catch (error: any) {
    console.error("PUT Quiz Error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

// ==========================================
// 4. DELETE : Supprimer un quiz
// ==========================================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get("quizId");
    const parsedQuizId = Number(quizId);

    if (!parsedQuizId || isNaN(parsedQuizId)) {
      return NextResponse.json({ error: "quizId requis dans la query URL" }, { status: 400 });
    }

    // Suppression en cascade (Prisma supprime les questions si la relation onDelete: Cascade est configurée, sinon on le fait manuellement via transaction)
    await prisma.$transaction([
      prisma.question.deleteMany({ where: { quizId: parsedQuizId } }),
      prisma.quiz.delete({ where: { id: parsedQuizId } }),
    ]);

    return NextResponse.json({ message: "Quiz supprimé avec succès" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Quiz Error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}