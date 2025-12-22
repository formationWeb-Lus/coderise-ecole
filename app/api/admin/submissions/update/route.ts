// /api/admin/submissions/update.route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // ← JSON côté client
    const { id, score, feedback, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID ou status manquant" },
        { status: 400 }
      );
    }

    // Mise à jour Prisma
    await prisma.assignmentSubmission.update({
      where: { id },
      data: {
        score,
        feedback,
        status, // SubmissionStatus enum
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur update submission:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
