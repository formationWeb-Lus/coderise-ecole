import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface CoursePageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  // 🔹 Déstructuration avec await
  const { courseId: courseIdStr } = await params;

  if (!courseIdStr) {
    return <div className="p-4 text-red-600">Course ID manquant.</div>;
  }

  const courseId = Number(courseIdStr);
  if (isNaN(courseId)) {
    return <div className="p-4 text-red-600">Course ID invalide.</div>;
  }

  // 🔹 Récupération du cours avec Prisma
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course) {
    return <div className="p-4 text-red-600">Cours introuvable.</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="mb-6">{course.description}</p>

      {course.modules.map((module, idx) => (
        <div key={module.id} className="border rounded-lg shadow-sm bg-white mb-4">
          <div className="bg-gray-100 px-4 py-3 font-semibold rounded-t-lg">
            {`Semaine ${idx + 1} - ${module.title}`}
          </div>
          <ul className="p-4">
            {module.lessons.map((lesson) => (
              <li key={lesson.id} className="mb-2">
                <a
                  href={`/dashboard/courses/${courseId}/modules/week-${idx + 1}/lesson/${lesson.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {lesson.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
