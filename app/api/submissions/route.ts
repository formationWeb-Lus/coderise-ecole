import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const userId = Number(formData.get("userId"));
    const lessonId = Number(formData.get("lessonId"));
    const file = formData.get("file") as File | null;

    if (!userId || !lessonId || !file) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Lecture du fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Création du chemin
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, `${userId}_${lessonId}_${file.name}`);

    // Sauvegarde du fichier
    await writeFile(filePath, buffer);

    // URL accessible publiquement
    const fileUrl = `/uploads/${userId}_${lessonId}_${file.name}`;

    // Sauvegarde DB
    const submission = await prisma.assignmentSubmission.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { fileUrl, status: "PENDING" },
      create: { userId, lessonId, fileUrl },
    });

    return NextResponse.json({ submission });
  } catch (err) {
    console.error("UPLOAD ERROR :", err);
    return NextResponse.json({ error: "Upload error" }, { status: 500 });
  }
}
