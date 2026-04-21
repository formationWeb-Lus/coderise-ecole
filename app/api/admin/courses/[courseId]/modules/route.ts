import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 🔹 GET modules by courseId
export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params; // ✅ IMPORTANT

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId manquant" },
        { status: 400 }
      );
    }

    const courseIdNumber = Number(courseId);

    if (isNaN(courseIdNumber)) {
      return NextResponse.json(
        { error: "courseId invalide" },
        { status: 400 }
      );
    }

    const modules = await prisma.module.findMany({
      where: { courseId: courseIdNumber },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error("GET MODULES ERROR:", error);
    return NextResponse.json(
      { error: "Erreur récupération modules" },
      { status: 500 }
    );
  }
}

// 🔹 CREATE module
export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params; // ✅ IMPORTANT

    const courseIdNumber = Number(courseId);

    if (isNaN(courseIdNumber)) {
      return NextResponse.json(
        { error: "courseId invalide" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { title, order } = body;

    const newModule = await prisma.module.create({
      data: {
        courseId: courseIdNumber,
        title,
        order,
      },
    });

    return NextResponse.json(newModule, { status: 201 });
  } catch (error) {
    console.error("CREATE MODULE ERROR:", error);
    return NextResponse.json(
      { error: "Erreur création module" },
      { status: 500 }
    );
  }
}