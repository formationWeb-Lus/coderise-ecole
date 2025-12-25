import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function EnrollmentPage() {
  const courses = await prisma.course.findMany({
    include: {
      studentCourses: true, // 👥 pour compter les étudiants
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Pour vous inscrire à un cours, cliquez sur le cours de votre choix.</h1>
        <p className="text-gray-600 mt-2">
          Découvrez nos cours disponibles et choisissez votre parcours.
        </p>
      </div>

      {/* Cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/dashboard/enrollment/${course.id}/pricing`}
            className="group rounded-xl border bg-white overflow-hidden
                       hover:shadow-lg transition hover:-translate-y-1"
          >
            {/* Image */}
            {course.imageUrl ? (
              <img
                src={course.imageUrl}
                alt={course.title}
                className="h-44 w-full object-cover"
              />
            ) : (
              <div className="h-44 bg-gray-100 flex items-center justify-center text-gray-400">
                Pas d’image
              </div>
            )}

            {/* Contenu */}
            <div className="p-5">
              <h2 className="text-xl font-semibold group-hover:text-blue-600">
                {course.title}
              </h2>

              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {course.description}
              </p>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
                <span>⏱ {course.duration} h</span>
                <span>👥 {course.studentCourses.length} étudiants</span>
              </div>

              <div className="mt-4 text-blue-600 font-medium">
                Voir la tarification →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {courses.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          Aucun cours disponible pour le moment.
        </p>
      )}
    </div>
  );
}
