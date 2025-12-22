import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = Number(session.user.id);

  // 1️⃣ Cours de l'étudiant connecté
  const myCourses = await prisma.studentCourse.findMany({
    where: { userId },
    select: { courseId: true },
  });

  const courseIds = myCourses.map(sc => sc.courseId);

  if (courseIds.length === 0) {
    return NextResponse.json([]);
  }

  // 2️⃣ Étudiants inscrits aux mêmes cours
  const studentCourses = await prisma.studentCourse.findMany({
    where: {
      courseId: { in: courseIds },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      course: {
        select: {
          title: true,
        },
      },
    },
  });

  // 3️⃣ REGROUPEMENT par étudiant
  const grouped = Object.values(
    studentCourses.reduce((acc: any, sc) => {
      const userId = sc.user.id;

      if (!acc[userId]) {
        acc[userId] = {
          id: sc.user.id,
          name: sc.user.name,
          courses: [],
        };
      }

      acc[userId].courses.push(sc.course.title);

      return acc;
    }, {})
  );

  return NextResponse.json(grouped);
}
