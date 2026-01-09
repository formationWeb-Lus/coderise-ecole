import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // <- assure-toi d'importer tes options NextAuth

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { quizId, score } = await req.json();

    if (!quizId || typeof score !== "number") {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const submission = await prisma.quizSubmission.upsert({
      where: {
        quizId_userId: {
          quizId: Number(quizId),
          userId: Number(session.user.id),
        },
      },
      update: { score, submittedAt: new Date() },
      create: { quizId: Number(quizId), userId: Number(session.user.id), score, submittedAt: new Date() },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la soumission" }, { status: 500 });
  }
}
