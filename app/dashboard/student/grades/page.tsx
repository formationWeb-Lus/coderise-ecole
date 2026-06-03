import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function GradesPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/auth/signin");
  if (session.user.role !== "STUDENT") redirect("/dashboard");

  const userId = Number(session.user.id);

  // ✅ FIX NEXT 15
  const sp = await searchParams;

  const selectedCourseId = sp?.courseId
    ? Number(sp.courseId)
    : null;

  const studentCourses = await prisma.studentCourse.findMany({
    where: { userId },
    include: {
      course: true,
    },
  });

  if (!studentCourses.length) {
    return (
      <div className="p-6">
        Aucun cours
      </div>
    );
  }

  const activeCourseId =
    selectedCourseId || studentCourses[0].course.id;

  const courseData = await prisma.course.findUnique({
    where: { id: activeCourseId },
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
              quizzes: {
                include: {
                  questions: true,
                  submissions: {
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

  if (!courseData) {
    return <div className="p-6">Cours introuvable</div>;
  }

  const lessonGrades = courseData.modules
    .flatMap((m) => m.lessons)
    .map((lesson) => {
      let obtained = 0;
      let max = 0;

      lesson.exercises.forEach((ex: any) => {
        max += ex.points || 0;

        const sub = ex.submissions?.[0];
        if (sub && sub.answer === ex.answer) {
          obtained += ex.points || 0;
        }
      });

      lesson.assignmentSubmissions.forEach((a: any) => {
        max += 100;
        obtained += a.score || 0;
      });

      lesson.quizzes.forEach((q: any) => {
        const quizMax = q.questions.reduce(
          (s: number, qu: any) => s + (qu.points || 0),
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
        obtained,
        max,
        percent: Math.round((obtained / max) * 100),
      };
    })
    .filter(Boolean) as any[];

  const totalObtained = lessonGrades.reduce(
    (a, l) => a + l.obtained,
    0
  );

  const totalMax = lessonGrades.reduce(
    (a, l) => a + l.max,
    0
  );

  const globalPercent =
    totalMax > 0
      ? Math.round((totalObtained / totalMax) * 100)
      : 0;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">
        Mes résultats
      </h1>

      {/* ✅ FILTER (NO onChange → FIX SERVER COMPONENT) */}
      <div className="border p-4 rounded bg-gray-50">
        <p className="font-semibold mb-2">
          Filtrer par cours :
        </p>

        <div className="flex flex-col gap-2">
          {studentCourses.map((sc) => (
            <Link
              key={sc.course.id}
              href={`/dashboard/student/grades?courseId=${sc.course.id}`}
              className={`p-2 border rounded ${
                activeCourseId === sc.course.id
                  ? "bg-yellow-200"
                  : "bg-white"
              }`}
            >
              {sc.course.title}
            </Link>
          ))}
        </div>
      </div>

      {/* GLOBAL */}
      <div className="p-6 border rounded bg-gray-50 text-center">
        <p className="text-4xl font-bold text-green-600">
          {globalPercent}%
        </p>
        <p>
          {totalObtained} / {totalMax}
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
            <div className="flex justify-between">
              <p className="font-bold">{l.title}</p>
              <p className="font-bold">{l.percent}%</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}