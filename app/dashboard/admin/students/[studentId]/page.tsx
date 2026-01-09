import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface LessonGrade {
  lessonId: number;
  title: string;
  obtained: number;
  max: number;
  percent: number;
}

interface StudentProgressPageProps {
  params: Promise<{ studentId: string }>; // 👈 App Router : params est une Promise
}

export default async function StudentProgressPage({ params }: StudentProgressPageProps) {
  // 🔹 await params
  const { studentId: studentIdStr } = await params;
  const studentId = parseInt(studentIdStr, 10);

  if (isNaN(studentId)) {
    return <div className="p-6 text-red-600">ID étudiant invalide.</div>;
  }

  // 🔹 Récupérer l'étudiant
  const student = await prisma.user.findUnique({ where: { id: studentId } });
  if (!student) {
    return <div className="p-6 text-red-600">Étudiant non trouvé.</div>;
  }

  // 🔹 Récupérer tous les cours + modules + leçons avec exercises, assignments et quizzes
  const studentCourses = await prisma.studentCourse.findMany({
    where: { userId: studentId },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  exercises: {
                    include: { submissions: { where: { userId: studentId } } },
                  },
                  assignmentSubmissions: { where: { userId: studentId } },
                  quizzes: {
                    include: {
                      submissions: { where: { userId: studentId } },
                      questions: true,
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

  // 🔹 Calculer les grades par leçon
  const lessonGrades: LessonGrade[] = studentCourses
    .flatMap((sc) => sc.course.modules)
    .flatMap((m) => m.lessons)
    .map((lesson) => {
      let obtained = 0;
      let max = 0;

      // Exercises
      lesson.exercises.forEach((ex) => {
        max += ex.points;
        const sub = ex.submissions[0];
        if (sub && sub.answer === ex.answer) obtained += ex.points;
      });

      // Assignments
      lesson.assignmentSubmissions.forEach((a) => {
        max += 100;
        obtained += a.score ?? 0;
      });

      // Quizzes
      lesson.quizzes.forEach((q) => {
        const totalQuizPoints = q.questions.reduce((sum, q) => sum + q.points, 0);
        max += totalQuizPoints;

        const sub = q.submissions[0];
        if (sub?.score != null) obtained += sub.score;
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
    .filter(Boolean) as LessonGrade[];

  const totalObtained = lessonGrades.reduce((a, l) => a + l.obtained, 0);
  const totalMax = lessonGrades.reduce((a, l) => a + l.max, 0);
  const globalPercent = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-yellow-900">
        Progression de {student.name}
      </h1>

      {/* Score global */}
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl text-center shadow">
        <p className="text-xl font-semibold text-gray-700">Score global</p>
        <p className="text-4xl font-bold text-green-700">{globalPercent}%</p>
        <p className="text-gray-600">{totalObtained} / {totalMax} points</p>
      </div>

      {/* Détails par leçon */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-yellow-900">Détails par leçon</h2>

        {lessonGrades.map((l) => (
          <div
            key={l.lessonId}
            className="p-5 rounded-xl border bg-yellow-50 shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-bold underline">{l.title}</p>
              <p className="text-sm text-gray-600">
                {l.obtained} / {l.max} points
              </p>
            </div>
            <p className="text-2xl font-bold text-yellow-800">{l.percent}%</p>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard/admin/students"
        className="inline-block mt-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Retour à la liste des étudiants
      </Link>
    </div>
  );
}

