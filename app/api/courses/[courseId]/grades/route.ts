import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: any }) {
  try {
    // Si params est une Promise, on la résout
    const resolvedParams = await params;
    const courseId = Number(resolvedParams.courseId);

    if (!courseId || isNaN(courseId)) {
      return NextResponse.json({ error: "courseId invalide" }, { status: 400 });
    }

    const url = new URL(req.url);
    const studentId = Number(url.searchParams.get("studentId"));

    if (!studentId || isNaN(studentId)) {
      return NextResponse.json({ error: "studentId invalide" }, { status: 400 });
    }

    // Récupérer tous les modules + leçons + exercices du cours
    const modules = await prisma.module.findMany({
      where: { courseId },
      include: { lessons: { include: { exercises: true } } },
    });

    const grades: { exerciseId: number; score: number; maxPoints: number; status: string }[] = [];

    for (const module of modules) {
      for (const lesson of module.lessons) {
        for (const exercise of lesson.exercises) {
          // Récupérer toutes les tentatives
          const attempts = await prisma.exerciseAttempt.findMany({
            where: { exerciseId: exercise.id, studentId },
            orderBy: { createdAt: "desc" },
          });

          let status: string = "PENDING";
          let score = 0;

          if (attempts.length >= 2) {
            status = "LOCKED"; // trop de tentatives
            score = attempts[0]?.score ?? 0;
          } else if (attempts.length === 1) {
            const attempt = attempts[0];
            const now = new Date();
            if (exercise.deadline < now) {
              status = "LATE";
              score = attempt.score ?? 0;
            } else {
              status = "GRADED";
              score = attempt.score ?? 0;
            }
          }

          grades.push({
            exerciseId: exercise.id,
            score,
            maxPoints: exercise.points,
            status,
          });
        }
      }
    }

    return NextResponse.json(grades);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

