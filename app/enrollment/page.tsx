import { prisma } from "@/lib/prisma";
import CourseCard from "@/components/CourseCard";

export const dynamic = "force-dynamic";

export default async function EnrollmentPage() {
  const courses = await prisma.course.findMany({
    include: {
      studentCourses: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Enrôlement aux cours</h1>
        <p className="text-gray-600 mt-2">
          Découvrez nos cours disponibles et choisissez votre parcours.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* EMPTY STATE */}
      {courses.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          Aucun cours disponible pour le moment.
        </p>
      )}
    </div>
  );
}