// courses/page.tsx - Next.js page
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function StudentCoursesPage() {
  const session = await getServerSession(authOptions);

  // 🔐 Auth obligatoire
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // 🎓 Seulement STUDENT
  if (session.user.role !== "STUDENT") {
    redirect("/dashboard");
  }

  // 🎯 Charger UNIQUEMENT les cours inscrits
  const studentCourses = await prisma.studentCourse.findMany({
    where: {
      userId: Number(session.user.id),
    },
    include: {
      course: true,
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* 🧠 Titre */}
      <div>
        <h1 className="text-3xl font-bold text-yellow-900">
          Mes cours
        </h1>
        <p className="text-gray-600 mt-1">
          Retrouvez ici tous les cours auxquels vous êtes inscrit
        </p>
      </div>

      {/* ❌ Aucun cours */}
      {studentCourses.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-lg text-gray-700">
            Vous n’êtes inscrit à aucun cours pour le moment.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentCourses.map((sc) => (
            <li
              key={sc.id}
              className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col"
            >
              {/* 🟡 En-tête */}
              <div className="bg-yellow-50 border-b border-yellow-200 p-4 rounded-t-xl">
                <h2 className="text-xl font-bold text-yellow-900">
                  {sc.course.title}
                </h2>
              </div>

              {/* 📄 Contenu */}
              <div className="p-4 flex flex-col flex-grow">
                <p className="text-gray-700 text-sm flex-grow">
                  {sc.course.description ||
                    "Aucune description disponible pour ce cours."}
                </p>

                {/* 👉 Action */}
                <a
                  href={`/dashboard/student/courses/${sc.courseId}`}
                  className="mt-4 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Accéder au cours
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
