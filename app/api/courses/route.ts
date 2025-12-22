import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth"; // si tu utilises next-auth

export async function GET() {
  try {
    // ⚠️ PLUS TARD : filtrer par étudiant connecté
    // const session = await getServerSession(authOptions);

    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Erreur API student courses:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des cours" },
      { status: 500 }
    );
  }
}
