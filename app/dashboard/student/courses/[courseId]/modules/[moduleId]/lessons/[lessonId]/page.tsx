import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    courseId: string;
    moduleId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { courseId, moduleId, lessonId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userId = Number(session.user.id);

  const studentCourse = await prisma.studentCourse.findFirst({
    where: {
      userId,
      courseId: Number(courseId),
    },
  });

  if (!studentCourse) {
    redirect("/dashboard/student/courses");
  }

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: Number(lessonId),
      moduleId: Number(moduleId),
    },
  });

  if (!lesson) {
    notFound();
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      <div className="prose">{lesson.content}</div>
    </div>
  );
}
