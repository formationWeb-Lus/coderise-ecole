import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { submissionId, score, feedback } = await req.json();

    if (!submissionId || score === undefined) {
      return NextResponse.json(
        { error: "submissionId et score requis" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
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

      await tx.notification.create({
        data: {
          userId: submission.userId,
          title: "📘 Devoir noté",
          message: `Votre devoir "${submission.lesson.title}" a été corrigé. Score : ${score}/100.`,
        },
      });

      return submission;
    });

    return NextResponse.json({ success: true, submission: result });
  } catch (error) {
    console.error("GRADE ERROR:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}