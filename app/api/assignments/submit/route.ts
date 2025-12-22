import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const lessonId = Number(formData.get("lessonId"));
    const userId = Number(formData.get("userId"));

    if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    if (isNaN(lessonId) || isNaN(userId)) {
      return NextResponse.json({ error: "lessonId ou userId invalide" }, { status: 400 });
    }

    // Créer le nom unique du fichier
    const fileName = `${userId}_${lessonId}_${file.name}`;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    // Sauvegarder le fichier dans public/uploads
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

    const fileUrl = `/uploads/${fileName}`; // chemin accessible depuis le navigateur

    // Créer la soumission en base
    const submission = await prisma.assignmentSubmission.create({
      data: {
        lessonId,
        userId,
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

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
