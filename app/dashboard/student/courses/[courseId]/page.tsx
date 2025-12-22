import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: PageProps) {
  // ✅ OBLIGATOIRE en Next 15/16
  const { courseId } = await params;

  const courseIdNum = Number(courseId);
  if (isNaN(courseIdNum)) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userId = Number(session.user.id);

  const studentCourse = await prisma.studentCourse.findFirst({
    where: {
      userId,
      courseId: courseIdNum,
    },
  });

  if (!studentCourse) {
    return (
      <div className="p-4 text-red-600">
        Vous n'êtes pas inscrit à ce cours.
      </div>
    );
  }

  const course = await prisma.course.findUnique({
    where: { id: courseIdNum },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="mb-6">{course.description}</p>

      {course.modules.map((module, idx) => (
        <div key={module.id} className="border rounded mb-4">
          <div className="bg-gray-100 px-4 py-2 font-semibold">
            Semaine {idx + 1} – {module.title}
          </div>

          <ul className="p-4">
            {module.lessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  href={`/dashboard/courses/${courseIdNum}/modules/week-${idx + 1}/lesson/${lesson.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
