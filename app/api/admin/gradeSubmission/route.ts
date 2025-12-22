import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { submissionId, score, feedback } = await req.json();

    if (!submissionId || score === undefined) {
      return NextResponse.json(
        { error: "submissionId et score requis" },
        { status: 400 }
      );
    }

    // ✅ TRANSACTION = GARANTIE
    const result = await prisma.$transaction(async (tx) => {

      // 1️⃣ Update submission
      const submission = await tx.assignmentSubmission.update({
        where: { id: submissionId },
        data: {
          score,
          feedback,
          status: "GRADED",
        },
        include: {
          lesson: true,
        },
      });

      // 2️⃣ Create notification
      await tx.notification.create({
        data: {
          userId: submission.userId,
          title: "📘 Devoir noté",
          message: `Votre devoir "${submission.lesson.title}" a été corrigé.
Score : ${score}/100.
Vous pouvez consulter vos notes dans votre portail.`,
        },
      });

      return submission;
    });

    return NextResponse.json({ success: true, submission: result });

  } catch (error) {
    console.error("GRADE ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
