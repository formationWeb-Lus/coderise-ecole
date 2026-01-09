import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 🔐 Vérifier la session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // 🔍 Récupérer l'utilisateur réel en base
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable en base" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const lessonId = Number(formData.get("lessonId"));

    if (!file) {
      return NextResponse.json(
        { error: "Fichier manquant" },
        { status: 400 }
      );
    }

    if (isNaN(lessonId)) {
      return NextResponse.json(
        { error: "lessonId invalide" },
        { status: 400 }
      );
    }

    // 📁 Créer le nom unique du fichier
    const fileName = `${user.id}_${lessonId}_${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);

    // 💾 Sauvegarde fichier
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

    const fileUrl = `/uploads/${fileName}`;

    // 🧠 Enregistrement DB
    const submission = await prisma.assignmentSubmission.create({
      data: {
        lessonId,
        userId: user.id, // ✅ ID garanti valide
        fileUrl,
      },
    });

    return NextResponse.json({ success: true, submission });
  } catch (err: any) {
    console.error("Erreur lors de la soumission :", err);

    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Vous avez déjà soumis ce devoir pour cette leçon" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
