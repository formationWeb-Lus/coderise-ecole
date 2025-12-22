import { prisma } from "@/lib/prisma";
import ModulesAccordion from "@/components/ModulesAccordionClient";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";


export default async function StudentDashboard() {
  // 🔹 Récupérer la session
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div className="p-4 text-red-600">Veuillez vous connecter pour accéder au dashboard.</div>;
  }

  // 🔹 Récupérer l'étudiant et ses cours
  const student = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      studentCourses: {
        include: {
          course: {
            include: {
              modules: {
                orderBy: { order: "asc" },
                include: { lessons: { orderBy: { order: "asc" } } },
              },
            },
          },
          completedLessons: true, // pour suivre progression
        },
      },
    },
  });

  if (!student || student.studentCourses.length === 0) {
    return <div className="p-4">Aucun cours trouvé pour cet étudiant.</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mon parcours étudiant</h1>

      {student.studentCourses.map((sc) => (
        <div key={sc.course.id} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{sc.course.title}</h2>
          <p className="mb-4">{sc.course.description}</p>

          {sc.course.modules.length === 0 ? (
            <div>Aucun module pour ce cours.</div>
          ) : (
            <ModulesAccordion
              courseId={sc.course.id}
              modules={sc.course.modules}
              completedLessons={sc.completedLessons.map((cl) => cl.lessonId)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
