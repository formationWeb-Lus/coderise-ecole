import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = Number(params.courseId);

    if (isNaN(courseId)) {
      return NextResponse.json({ error: "courseId invalide" }, { status: 400 });
    }

    const url = new URL(req.url);
    const studentId = Number(url.searchParams.get("studentId"));

    if (isNaN(studentId)) {
      return NextResponse.json({ error: "studentId invalide" }, { status: 400 });
    }

    // 🔥 1. EXERCISES GRADES
    const modules = await prisma.module.findMany({
      where: { courseId },
      include: {
        lessons: {
          include: {
            exercises: true,
          },
        },
      },
    });

    const exerciseGrades: any[] = [];

    for (const module of modules) {
      for (const lesson of module.lessons) {
        for (const exercise of lesson.exercises) {
          const attempts = await prisma.exerciseAttempt.findMany({
            where: {
              exerciseId: exercise.id,
              studentId,
            },
            orderBy: { createdAt: "desc" },
          });

          let score = attempts[0]?.score ?? 0;

          let status = "PENDING";

          if (attempts.length >= 2) {
            status = "LOCKED";
          } else if (attempts.length === 1) {
            status = exercise.deadline < new Date() ? "LATE" : "GRADED";
          }

          exerciseGrades.push({
            type: "EXERCISE",
            id: exercise.id,
            title: exercise.question,
            score,
            maxPoints: exercise.points,
            status,
          });
        }
      }
    }

    // 🔥 2. QUIZ GRADES
    const quizGrades = await prisma.quizSubmission.findMany({
      where: { userId: studentId },
      include: { quiz: true },
    });

    const quizFormatted = quizGrades.map((q) => ({
      type: "QUIZ",
      id: q.id,
      title: q.quiz.title,
      score: q.score ?? 0,
      maxPoints: 100,
      status: "GRADED",
    }));

    // 🔥 3. ASSIGNMENTS GRADES
    const assignments = await prisma.assignmentSubmission.findMany({
      where: { userId: studentId },
      include: { lesson: true },
    });

    const assignmentFormatted = assignments.map((a) => ({
      type: "ASSIGNMENT",
      id: a.id,
      title: a.lesson.title,
      score: a.score ?? 0,
      maxPoints: 100,
      status: a.status,
    }));

    // 🔥 FINAL RESULT
    return NextResponse.json([
      ...exerciseGrades,
      ...quizFormatted,
      ...assignmentFormatted,
    ]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

