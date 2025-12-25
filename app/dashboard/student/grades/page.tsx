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

  const lessonGrades = studentCourses
    .flatMap((sc) => sc.course.modules)
    .flatMap((m) => m.lessons)
    .map((lesson) => {
      let obtained = 0;
      let max = 0;

      lesson.exercises.forEach((ex) => {
        max += ex.points;
        const sub = ex.submissions[0];
        if (sub && sub.answer === ex.answer) {
          obtained += ex.points;
        }
      });

      lesson.assignmentSubmissions.forEach((a) => {
        max += 100;
        obtained += a.score ?? 0;
      });

      if (max === 0) return null;

      return {
        lessonId: lesson.id,
        title: lesson.title,
        order: lesson.order, // 👈 IMPORTANT pour le style
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

  const totalObtained = lessonGrades.reduce((a, l) => a + l.obtained, 0);
  const totalMax = lessonGrades.reduce((a, l) => a + l.max, 0);
  const globalPercent =
    totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-yellow-900">
        Mes résultats
      </h1>

      {/* Score global */}
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl text-center shadow">
        <p className="text-xl font-semibold text-gray-700">
          Performance globale
        </p>
        <p className="text-4xl font-bold text-green-700">
          {globalPercent}%
        </p>
        <p className="text-gray-600">
          {totalObtained} / {totalMax} points
        </p>
      </div>

      {/* Résultats par leçon */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-yellow-900">
          Résultats par leçon
        </h2>

        {lessonGrades.map((l) => {
          const isGreenLesson = l.order === 1 || l.order === 5;

          return (
            <Link
              key={l.lessonId}
              href={`/dashboard/student/grades/${l.lessonId}`}
              className={`block p-5 rounded-xl border shadow-sm transition
                ${
                  isGreenLesson
                    ? "bg-green-50 border-green-300 hover:bg-green-100"
                    : "bg-yellow-50 border-yellow-300 hover:bg-yellow-100"
                }
              `}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p
                    className={`text-lg font-bold underline
                      ${
                        isGreenLesson
                          ? "text-green-700 hover:text-green-900"
                          : "text-yellow-800 hover:text-yellow-900"
                      }
                    `}
                  >
                    {l.title}
                  </p>

                  <p className="text-sm text-gray-600">
                    {l.obtained} / {l.max} points
                  </p>
                </div>

                <p
                  className={`text-2xl font-bold
                    ${
                      isGreenLesson
                        ? "text-green-700"
                        : "text-yellow-800"
                    }
                  `}
                >
                  {l.percent}%
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

