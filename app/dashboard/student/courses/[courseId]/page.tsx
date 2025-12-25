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
  const { courseId } = await params;
  const courseIdNum = Number(courseId);
  if (isNaN(courseIdNum)) notFound();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const userId = Number(session.user.id);

  const studentCourse = await prisma.studentCourse.findFirst({
    where: { userId, courseId: courseIdNum },
  });

  if (!studentCourse) {
    return (
      <div className="p-6 max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl text-center">
        <p className="text-red-700 font-semibold">
          Vous n'êtes pas inscrit à ce cours.
        </p>
      </div>
    );
  }

  const course = await prisma.course.findUnique({
    where: { id: courseIdNum },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course) notFound();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Titre du cours */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-yellow-900">{course.title}</h1>
        <p className="text-gray-600 mt-1">{course.description}</p>
      </div>

      {/* Modules */}
      {course.modules.map((module, idx) => (
        <div
          key={module.id}
          className="bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm hover:shadow-md transition p-4"
        >
          {/* Header Module */}
          <div className="bg-yellow-100 px-4 py-2 rounded-lg font-semibold text-yellow-900 mb-3">
            Semaine {idx + 1} – {module.title}
          </div>

          {/* Leçons */}
          <ul className="space-y-2">
            {module.lessons.map((lesson, lessonIdx) => (
              <li key={lesson.id}>
                <Link
                  href={`/dashboard/courses/${courseIdNum}/modules/week-${idx + 1}/lesson/${lesson.id}`}
                  className={`font-medium text-lg hover:underline transition ${
                    lessonIdx < 5
                      ? "text-green-600" // Les 5 premières leçons en vert
                      : "text-yellow-800" // Autres leçons en jaune foncé
                  }`}
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
