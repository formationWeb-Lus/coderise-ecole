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
      course: true, // récupère les infos du cours
    },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mes cours</h1>

      {studentCourses.length === 0 ? (
        <p className="text-gray-500">
          Vous n’êtes inscrit à aucun cours pour le moment.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentCourses.map((sc) => (
            <li
              key={sc.id}
              className="border rounded-lg p-4 hover:shadow"
            >
              <h2 className="text-lg font-semibold">
                {sc.course.title}
              </h2>

              <p className="text-sm text-gray-600">
                {sc.course.description}
              </p>

              <a
                href={`/dashboard/student/courses/${sc.courseId}`}
                className="inline-block mt-3 text-blue-600 hover:underline"
              >
                Accéder au cours →
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
