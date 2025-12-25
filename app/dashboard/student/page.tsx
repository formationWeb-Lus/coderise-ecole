import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/auth/signin");
  if (session.user.role !== "STUDENT") redirect("/dashboard");

  const userId = Number(session.user.id);

  const studentCourses = await prisma.studentCourse.findMany({
    where: { userId },
    include: { course: true },
  });

  // Si l'étudiant n'est inscrit à aucun cours
  if (!studentCourses.length) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold text-yellow-800">
          Bienvenue sur votre Dashboard
        </h1>
        <p className="text-gray-500 mt-4 mb-6">
          Vous n’êtes inscrit à aucun cours pour le moment.
        </p>

        {/* Bouton pour voir tous les cours disponibles et s'inscrire */}
        <Link href="/dashboard/enrollment">
          <button className="bg-red-600 text-white font-bold text-lg py-2 px-6 
                             hover:bg-red-700 transition">
            Cliquez ici pour voir tous les cours disponibles et vous inscrire
          </button>
        </Link>
      </div>
    );
  }

  // Si l'étudiant a déjà des cours
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold mb-6 text-yellow-700">
        Vos cours dont vous êtes inscrit
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {studentCourses.map((sc, index) => (
          <a
            key={sc.id}
            href={`/dashboard/courses/${sc.courseId}`}
            className={`
              block border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-200
              ${index === 0 ? "bg-yellow-100" : "bg-white"}
            `}
          >
            {sc.course.imageUrl ? (
              <div className="relative w-full h-40">
                <Image
                  src={sc.course.imageUrl}
                  alt={sc.course.title}
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                Image du cours
              </div>
            )}

            <div className="p-4">
              <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                {sc.course.title}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {sc.course.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}


