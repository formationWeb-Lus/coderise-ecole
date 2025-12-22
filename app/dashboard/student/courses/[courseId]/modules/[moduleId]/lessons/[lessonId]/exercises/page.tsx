// courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/exercises/page.tsx - Next.js page
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: {
    courseId: string;
    moduleId: string;
    lessonId: string;
  };
}

export default async function ExercisesPage({ params }: PageProps) {
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

  // Vérifier inscription
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
                  exercises: true, // tes exercises ici
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

  // ✅ Récupérer les submissions correctement
  const submissions = await prisma.exerciseSubmission.findMany({
    where: {
      userId,
      exerciseId: { in: lesson.exercises.map((e) => e.id) }, // corrige l'erreur
    },
  });

  const submittedExerciseIds = new Set(submissions.map((s) => s.exerciseId));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Exercices : {`Leçon ${lesson.id}`}</h1>

      {lesson.exercises.length === 0 ? (
        <p className="text-gray-500">Aucun exercice pour cette leçon.</p>
      ) : (
        <ul className="space-y-3">
          {lesson.exercises
            .sort((a, b) => a.order - b.order) // trier par ordre
            .map((exercise) => {
              const isSubmitted = submittedExerciseIds.has(exercise.id);

              return (
                <li
                  key={exercise.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <span>{exercise.question}</span>
                  {isSubmitted ? (
                    <span className="text-green-600 text-sm">✔ Soumis</span>
                  ) : (
                    <a
                      href={`/dashboard/student/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/${exercise.id}`}
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
