import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  // 🔐 Auth obligatoire
  if (!session?.user?.id) redirect("/auth/signin");
  if (session.user.role !== "STUDENT") redirect("/dashboard");

  const userId = Number(session.user.id);

  // Récupérer les cours où l'étudiant est inscrit
  const studentCourses = await prisma.studentCourse.findMany({
    where: { userId },
    include: {
      course: true, // on récupère juste les infos du cours
    },
  });

  if (!studentCourses.length) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Bienvenue sur votre Dashboard</h1>
        <p className="text-gray-500 mt-4">
          Vous n’êtes inscrit à aucun cours pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold mb-6">Mes cours</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {studentCourses.map((sc) => (
          <a
            key={sc.id}
            href={`/dashboard/courses/${sc.courseId}`} // 🔹 redirection vers la page du cours
            className="block border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-200"
          >
            {sc.course.imageUrl ? (
              <img
                src={sc.course.imageUrl}
                alt={sc.course.title}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                Image du cours
              </div>
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">
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

