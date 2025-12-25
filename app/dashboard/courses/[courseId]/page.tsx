import { prisma } from "@/lib/prisma";
import CoursePageClient from "./CoursePageClient";

interface CoursePageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId: courseIdStr } = await params;

  const courseId = Number(courseIdStr);
  if (isNaN(courseId)) {
    return <div className="p-4 text-red-600">Course ID invalide.</div>;
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
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
    return <div className="p-4 text-red-600">Cours introuvable.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 🔹 TITRE */}
      <h1 className="text-4xl font-extrabold text-yellow-900 mb-4">
        {course.title}
      </h1>

      {/* 🔹 DESCRIPTION */}
      <p className="text-xl text-gray-700 mb-8">
        {course.description}
      </p>

      {/* 🔹 COMPOSANT CLIENT */}
      <CoursePageClient
        courseId={courseId}
        modules={course.modules}
      />
    </div>
  );
}
