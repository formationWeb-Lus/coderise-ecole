import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Récupère toutes les soumissions non rendues dont la date limite est dépassée
    const lateSubmissions = await prisma.exerciseSubmission.findMany({
      where: {
        submittedAt: null,
        exercise: {
          deadline: { lt: new Date() },
        },
      },
      include: {
        exercise: true, // nécessaire pour filtrer par deadline
      },
    });

    // Met à jour chaque soumission tardive
    const updatePromises = lateSubmissions.map(submission =>
      prisma.exerciseSubmission.update({
        where: { id: submission.id },
        data: {
          status: "LATE",
          score: 0,
        },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ updated: lateSubmissions.length });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des soumissions tardives :", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour les soumissions" },
      { status: 500 }
    );
  }
}
