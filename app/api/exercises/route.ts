// app/api/exercises/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // 🔹 Récupérer la session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // 🔹 Récupérer lessonId depuis la query
    const url = new URL(req.url);
    const lessonId = Number(url.searchParams.get("lessonId"));
    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lessonId" }, { status: 400 });
    }

    // 🔹 Vérifier que la leçon existe et récupérer courseId
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // 🔹 Vérifier que l'utilisateur est inscrit au cours
    const studentCourse = await prisma.studentCourse.findFirst({
      where: { userId, courseId: lesson.module.courseId },
    });

    if (!studentCourse) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });
    }

    // 🔹 Récupérer tous les exercices de la leçon
    const exercises = await prisma.exercise.findMany({
      where: { lessonId },
      select: { id: true, question: true, type: true, points: true },
      orderBy: { order: "asc" },
    });

    // 🔹 Récupérer la dernière tentative pour chaque exercice
    const results = await Promise.all(
      exercises.map(async (ex) => {
        const lastAttempt = await prisma.exerciseAttempt.findFirst({
          where: { exerciseId: ex.id, studentId: userId },
          orderBy: { createdAt: "desc" },
        });

        return {
          ...ex,
          score: lastAttempt?.score ?? 0,
          status: lastAttempt ? "GRADED" : "PENDING",
        };
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Erreur GET /api/exercises :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
