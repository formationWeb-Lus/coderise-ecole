import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = Number(searchParams.get("studentId"));
    const courseId = Number(params.courseId);

    // =========================
    // 1. QUIZ SUBMISSIONS
    // =========================
    const quizGrades = await prisma.quizSubmission.findMany({
      where: {
        userId: studentId,
        quiz: {
          lesson: {
            module: {
              courseId,
            },
          },
        },
      },
      include: {
        quiz: {
          include: {
            questions: true,
          },
        },
      },
    });

    // =========================
    // 2. EXERCISE SUBMISSIONS
    // =========================
    const exerciseGrades = await prisma.exerciseSubmission.findMany({
      where: {
        userId: studentId,
        exercise: {
          lesson: {
            module: {
              courseId,
            },
          },
        },
      },
      include: {
        exercise: true,
      },
    });

    // =========================
    // 3. ASSIGNMENT SUBMISSIONS
    // =========================
    const assignmentGrades = await prisma.assignmentSubmission.findMany({
      where: {
        userId: studentId,
        lesson: {
          module: {
            courseId,
          },
        },
      },
      include: {
        lesson: true,
      },
    });

    // =========================
    // NORMALISATION QUIZ
    // =========================
    const quizMapped = quizGrades.map((q) => ({
      type: "QUIZ",
      id: q.quizId,
      title: q.quiz.title,
      score: q.score ?? 0,
      maxPoints: q.quiz.questions.reduce(
        (acc, x) => acc + x.points,
        0
      ),
      status: q.score !== null ? "GRADED" : "PENDING",
    }));

    // =========================
    // NORMALISATION EXERCISE
    // =========================
    const exerciseMapped = exerciseGrades.map((e) => ({
      type: "EXERCISE",
      id: e.exerciseId,
      title: e.exercise.question,
      score: e.score ?? 0,
      maxPoints: e.exercise.points,
      status: e.status,
    }));

    // =========================
    // NORMALISATION ASSIGNMENT
    // =========================
    const assignmentMapped = assignmentGrades.map((a) => ({
      type: "ASSIGNMENT",
      id: a.lessonId,
      title: a.lesson.title,
      score: a.score ?? 0,
      maxPoints: 100, // ou règle fixe si tu veux
      status: a.status,
    }));

    // =========================
    // FINAL OUTPUT
    // =========================
    return NextResponse.json([
      ...quizMapped,
      ...exerciseMapped,
      ...assignmentMapped,
    ]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur chargement grades" },
      { status: 500 }
    );
  }
}