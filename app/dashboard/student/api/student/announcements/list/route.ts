import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  // Vérifier la session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = Number(session.user.id);

  try {
    // Récupérer toutes les annonces liées aux cours de l'étudiant
    const studentCourses = await prisma.studentCourse.findMany({
      where: { userId },
      select: { courseId: true },
    });

    const courseIds = studentCourses.map(sc => sc.courseId);

    const announcements = await prisma.announcement.findMany({
      where: { courseId: { in: courseIds } },
      orderBy: { createdAt: "desc" },
      include: {
        reads: {
          where: { userId }, // Vérifie si l'étudiant a déjà lu
          select: { id: true },
        },
      },
    });

    // Ajouter l'état isRead
    const result = announcements.map(a => ({
      id: a.id,
      title: a.title,
      content: a.content,
      videoUrl: a.videoUrl,
      isRead: a.reads.length > 0,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
