import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function EnrollmentPage() {
  const courses = await prisma.course.findMany({
    include: {
      studentCourses: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
          Pour vous inscrire à un cours, cliquez sur le cours de votre choix.
        </h1>

        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Découvrez nos cours disponibles et choisissez votre parcours.
        </p>
      </div>

      {/* Cartes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/enrollment/${course.id}/pricing`}
           className="group bg-white border rounded-lg overflow-hidden
hover:shadow-xl
hover:border-blue-500
transition-all
duration-300
hover:-translate-y-1
active:scale-95"
          >
            {/* Image */}
            {course.imageUrl ? (
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-24 sm:h-28 md:h-32 lg:h-36 object-cover"
              />
            ) : (
              <div className="w-full h-24 sm:h-28 md:h-32 lg:h-36 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                Pas d'image
              </div>
            )}

            {/* Contenu */}
            <div className="p-3">
              <h2 className="font-semibold text-sm md:text-base text-blue-600 underline underline-offset-2 group-hover:text-blue-700 transition-colors">

📘 {course.title}

</h2>

              <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">
                {course.description}
              </p>

              <div className="mt-3 flex justify-between text-[11px] md:text-xs text-gray-700">
                <span>⏱ {course.duration} h</span>
                <span>👥 {course.studentCourses.length}</span>
              </div>

              <div className="mt-3 text-xs md:text-sm text-blue-600 font-medium">
                Voir →
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