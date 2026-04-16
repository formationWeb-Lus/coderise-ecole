import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 🔹 GET all courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("GET COURSES ERROR:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des cours" },
      { status: 500 }
    );
  }
}

// 🔹 CREATE course
export async function POST(req: Request) {
  try {
    const { title, description, imageUrl, duration } = await req.json();

    if (!title || !description || !duration) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
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
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    return NextResponse.json(
      { error: "Erreur création cours" },
      { status: 500 }
    );
  }
}