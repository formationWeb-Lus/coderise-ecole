// courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/quizzes/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: {
    courseId: string;
    moduleId: string;
    lessonId: string;
  };
}

export default async function QuizzesPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "STUDENT") {
    redirect("/dashboard");
  }

  const courseId = Number(params.courseId);
  const moduleId = Number(params.moduleId);
  const lessonId = Number(params.lessonId);
  const userId = Number(session.user.id);

  // Vérifier inscription de l'étudiant au cours
  const studentCourse = await prisma.studentCourse.findFirst({
    where: { userId, courseId },
    include: {
      course: {
        include: {
          modules: {
            where: { id: moduleId },
            include: {
              lessons: {
                where: { id: lessonId },
                include: {
                  quizzes: true, // 🔹 récupérer les quizzes
                },
              },
            },
          },
        },
      },
    },
  });

  if (!studentCourse) {
    redirect("/dashboard/student/courses");
  }

  const module = studentCourse.course?.modules[0];
  if (!module) notFound();

  const lesson = module.lessons[0];
  if (!lesson) notFound();

  // 🔹 Récupérer les soumissions pour les quizzes
  const submissions = await prisma.quizSubmission.findMany({
    where: {
      userId,
      quizId: { in: lesson.quizzes.map((q) => q.id) },
    },
  });

  const submittedQuizIds = new Set(submissions.map((s) => s.quizId));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Quizzes : {`Leçon ${lesson.id}`}
      </h1>

      {lesson.quizzes.length === 0 ? (
        <p className="text-gray-500">Aucun quiz pour cette leçon.</p>
      ) : (
        <ul className="space-y-3">
          {lesson.quizzes
            .sort((a, b) => a.order - b.order)
            .map((quiz) => {
              const isSubmitted = submittedQuizIds.has(quiz.id);

              return (
                <li
                  key={quiz.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <span>{quiz.title}</span>
                  {isSubmitted ? (
                    <span className="text-green-600 text-sm">✔ Soumis</span>
                  ) : (
                    <a
                      href={`/dashboard/student/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes/${quiz.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Commencer
                    </a>
                  )}
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
