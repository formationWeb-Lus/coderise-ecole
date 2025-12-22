import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log("session.user.id:", session.user.id);

  const userId = Number(session.user.id);
  if (isNaN(userId)) {
    return new Response("Invalid user ID", { status: 400 });
  }

  const { lessonId } = await req.json();
  if (!lessonId) return new Response("Missing lessonId", { status: 400 });

  const numericLessonId = Number(lessonId);
  if (isNaN(numericLessonId)) return new Response("Invalid lesson ID", { status: 400 });

  const studentCourse = await prisma.studentCourse.findFirst({
    where: { userId },
  });

  if (!studentCourse) return new Response("Not enrolled", { status: 404 });

  const already = await prisma.completedLesson.findFirst({
    where: {
      studentCourseId: studentCourse.id,
      lessonId: numericLessonId,
    },
  });

  if (already) return new Response("Already completed", { status: 200 });

  await prisma.completedLesson.create({
    data: {
      studentCourseId: studentCourse.id,
      lessonId: numericLessonId,
    },
  });

  return new Response("OK", { status: 200 });
}
