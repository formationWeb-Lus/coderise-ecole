// app/api/admin/submissions/update/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, score, feedback, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID de soumission manquant" },
        { status: 400 }
      );
    }

    // 1️⃣ Récupérer la soumission
    const submission = await prisma.assignmentSubmission.findUnique({
      where: { id },
      include: {
        user: true,
        lesson: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Soumission introuvable" },
        { status: 404 }
      );
    }

    // 2️⃣ Mettre à jour la soumission (sans gradedAt)
    await prisma.assignmentSubmission.update({
      where: { id },
      data: {
        score,
        feedback,
        status,
      },
    });

    // 3️⃣ Créer la notification pour l'étudiant
    await prisma.notification.create({
  data: {
    userId: submission.userId,
    title: "Devoir corrigé",
    message: `Votre devoir "${submission.lesson.title}" a été corrigé. Note : ${score ?? "N/A"}. Vous pouvez aller dans "Notes" pour voir votre progression.`,
  },
});


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur correction :", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
