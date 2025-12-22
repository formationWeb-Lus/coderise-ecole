export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function ModulesPage(props: PageProps) {
  // ✅ SEULE FAÇON STABLE
  const { courseId } = await props.params;

  const courseIdNum = Number(courseId);
  if (isNaN(courseIdNum)) notFound();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");
  if (session.user.role !== "STUDENT") redirect("/dashboard");

  const userId = Number(session.user.id);

  // Vérifier inscription
  const studentCourse = await prisma.studentCourse.findFirst({
    where: {
      userId,
      courseId: courseIdNum,
    },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: true,
            },
          },
        },
      },
    },
  });

  if (!studentCourse) redirect("/dashboard/student/courses");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Modules – {studentCourse.course.title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentCourse.course.modules.map((module) => (
          <a
            key={module.id}
            href={`/dashboard/student/modules/${module.id}`}
            className="block rounded-lg border p-4 hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold mb-2">
              {module.title}
            </h2>
            <p className="text-sm text-gray-500">
              {module.lessons.length} leçon(s)
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

