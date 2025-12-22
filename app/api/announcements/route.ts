import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { title, content, courseId, videoUrl } = await req.json();

    if (!title || !content || !courseId) {
      return NextResponse.json({ error: "Tous les champs obligatoires ne sont pas remplis" }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        courseId,
        videoUrl: videoUrl || null,
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

