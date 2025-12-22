import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const getUserId = () => 1; // remplacer par l'utilisateur connecté

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json(); // { exerciseId: answer }
    const userId = getUserId();

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const exerciseIds = Object.keys(answers).map(Number);

    // 🔹 Récupérer les exercices correspondants depuis la table Exercise
    const exercises = await prisma.exercise.findMany({
      where: { id: { in: exerciseIds } },
      select: { id: true, answer: true, points: true },
    });

    let totalPoints = 0;
    let earnedPoints = 0;
    const results: Record<number, { correct: boolean; earnedPoints: number; maxPoints: number }> = {};

    for (const ex of exercises) {
      totalPoints += ex.points;
      const submittedAnswer = String(answers[ex.id]).trim();

      const correct = submittedAnswer === String(ex.answer).trim();
      const pointsEarned = correct ? ex.points : 0;
      earnedPoints += pointsEarned;

      results[ex.id] = {
        correct,
        earnedPoints: pointsEarned,
        maxPoints: ex.points,
      };
    }

    // 🔹 Enregistrer les soumissions dans ExerciseSubmission
    for (const [exerciseIdStr, answer] of Object.entries(answers)) {
      const exerciseId = Number(exerciseIdStr);
      await prisma.exerciseSubmission.upsert({
        where: { exerciseId_userId: { exerciseId, userId } },
        update: {
          answer: String(answer),
          submittedAt: new Date(),
          score: results[exerciseId].earnedPoints,
          status: "GRADED",
        },
        create: {
          exerciseId,
          userId,
          answer: String(answer),
          submittedAt: new Date(),
          score: results[exerciseId].earnedPoints,
          status: "GRADED",
        },
      });
    }

    return NextResponse.json({
      success: true,
      totalPoints,
      earnedPoints,
      results, // montre question par question correct/incorrect
    });
  } catch (err) {
    console.error("Erreur grading exercices:", err);
    return NextResponse.json(
      { error: "Erreur lors de la correction des exercices" },
      { status: 500 }
    );
  }
}
