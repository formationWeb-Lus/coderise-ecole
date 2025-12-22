import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function GradesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/auth/signin");
  if (session.user.role !== "STUDENT") redirect("/dashboard");

  const userId = Number(session.user.id);

  // 🔒 1️⃣ Récupérer UNIQUEMENT les cours où l'étudiant est inscrit
  const studentCourses = await prisma.studentCourse.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  exercises: {
                    include: {
                      submissions: {
                        where: { userId },
                      },
                    },
                  },
                  assignmentSubmissions: {
                    where: { userId },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // ❌ Aucun cours → aucun résultat
  if (studentCourses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Mes résultats</h1>
        <p className="mt-4 text-gray-600">
          Vous n’êtes inscrit à aucun cours.
        </p>
      </div>
    );
  }

  // 🔹 2️⃣ Calcul des notes par leçon
  const lessonGrades = studentCourses
    .flatMap((sc) => sc.course.modules)
    .flatMap((m) => m.lessons)
    .map((lesson) => {
      let obtained = 0;
      let max = 0;

      // Exercices
      lesson.exercises.forEach((ex) => {
        max += ex.points;
        const sub = ex.submissions[0];
        if (sub && sub.answer === ex.answer) {
          obtained += ex.points;
        }
      });

      // Devoirs
      lesson.assignmentSubmissions.forEach((a) => {
        max += 100;
        obtained += a.score ?? 0;
      });

      if (max === 0) return null;

      return {
        lessonId: lesson.id,
        title: lesson.title,
        obtained,
        max,
        percent: Math.round((obtained / max) * 100),
      };
    })
    .filter(Boolean) as {
      lessonId: number;
      title: string;
      obtained: number;
      max: number;
      percent: number;
    }[];

  // 🔹 3️⃣ Score global
  const totalObtained = lessonGrades.reduce((a, l) => a + l.obtained, 0);
  const totalMax = lessonGrades.reduce((a, l) => a + l.max, 0);
  const globalPercent =
    totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Mes résultats</h1>

      {/* Score global */}
      <div className="bg-blue-50 p-6 rounded-lg text-center">
        <p className="text-xl font-semibold">Performance globale</p>
        <p className="text-4xl font-bold text-blue-700">{globalPercent}%</p>
        <p className="text-gray-600">
          {totalObtained} / {totalMax} points
        </p>
      </div>

      {/* Résultats par leçon */}
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">Par leçon</h2>

        {lessonGrades.map((l) => (
          <Link
            key={l.lessonId}
            href={`/dashboard/student/grades/${l.lessonId}`}
            className="block p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{l.title}</p>
                <p className="text-sm text-gray-500">
                  {l.obtained} / {l.max} points
                </p>
              </div>
              <p className="text-xl font-bold text-blue-600">
                {l.percent}%
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
