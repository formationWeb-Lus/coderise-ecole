import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des cours" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { title, description, imageUrl, duration } = await req.json();

  if (!title || !description || !duration) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const course = await prisma.course.create({
    data: {
      title,
      description,
      imageUrl: imageUrl || null,
      duration: Number(duration),
    },
  });

  return NextResponse.json(course);
}
