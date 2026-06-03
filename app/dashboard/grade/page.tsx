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

  // ✅ 1. Récupérer les cours de l'utilisateur
  const studentCourses = await prisma.studentCourse.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  // EXERCICES
                  exercises: {
                    include: {
                      submissions: {
                        where: { userId }, // ✅ FIX
                      },
                    },
                  },

                  // ASSIGNMENTS
                  assignmentSubmissions: {
                    where: { userId }, // ✅ FIX
                  },

                  // QUIZZES
                  quizzes: {
                    include: {
                      questions: true,
                      submissions: {
                        where: { userId }, // ✅ FIX
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // ❌ Aucun cours
  if (!studentCourses || studentCourses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Mes résultats</h1>
        <p className="mt-4 text-gray-600">
          Vous n’êtes inscrit à aucun cours.
        </p>
      </div>
    );
  }

  // ✅ 2. Calcul des notes
  const lessonGrades = studentCourses
    .flatMap((sc) => sc.course.modules)
    .flatMap((m) => m.lessons)
    .map((lesson) => {
      let obtained = 0;
      let max = 0;

      // 🟢 EXERCICES
      lesson.exercises.forEach((ex: any) => {
        max += ex.points || 0;

        const sub = ex.submissions?.[0];
        if (sub && sub.answer === ex.answer) {
          obtained += ex.points || 0;
        }
      });

      // 🟡 ASSIGNMENTS
      lesson.assignmentSubmissions.forEach((a: any) => {
        max += 100;
        obtained += a.score || 0;
      });

      // 🔵 QUIZZES
      lesson.quizzes.forEach((q: any) => {
        const quizMax = q.questions.reduce(
          (sum: number, qu: any) => sum + (qu.points || 0),
          0
        );

        max += quizMax;

        const sub = q.submissions?.[0];
        if (sub?.score != null) {
          obtained += sub.score;
        }
      });

      if (max === 0) return null;

      return {
        lessonId: lesson.id,
        title: lesson.title,
        order: lesson.order,
        obtained,
        max,
        percent: Math.round((obtained / max) * 100),
      };
    })
    .filter(Boolean) as {
    lessonId: number;
    title: string;
    order: number;
    obtained: number;
    max: number;
    percent: number;
  }[];

  // ✅ 3. Totaux globaux
  const totalObtained = lessonGrades.reduce((a, l) => a + l.obtained, 0);
  const totalMax = lessonGrades.reduce((a, l) => a + l.max, 0);
  const globalPercent =
    totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Mes résultats</h1>

      {/* GLOBAL SCORE */}
      <div className="p-6 border rounded-xl bg-gray-50 text-center">
        <p className="text-lg font-semibold">Performance globale</p>
        <p className="text-4xl font-bold text-green-600">
          {globalPercent}%
        </p>
        <p className="text-gray-600">
          {totalObtained} / {totalMax} points
        </p>
      </div>

      {/* LESSONS */}
      <div className="space-y-4">
        {lessonGrades.map((l) => (
          <Link
            key={l.lessonId}
            href={`/dashboard/student/grades/${l.lessonId}`}
            className="block p-4 border rounded hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{l.title}</p>
                <p className="text-sm text-gray-500">
                  {l.obtained} / {l.max} points
                </p>
              </div>

              <p className="text-xl font-bold">{l.percent}%</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}