import { prisma } from "@/lib/prisma";
import GradeAssignment from "@/components/GradeAssignment";

export default async function AdminSubmissionsPage() {
  const submissions = await prisma.assignmentSubmission.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      lesson: true,
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Toutes les soumissions</h1>

      {submissions.map((s) => (
        <div
          key={s.id}
          className="border rounded-lg p-4 mb-6 bg-white shadow"
        >
          <div className="mb-3">
            <p>
              <strong>Étudiant :</strong> {s.user.name}
            </p>
            <p>
              <strong>Leçon :</strong> {s.lesson.title}
            </p>
            <p>
              <strong>Date :</strong>{" "}
              {s.createdAt.toLocaleString()}
            </p>
            <p>
              <strong>Statut :</strong> {s.status}
            </p>

            <a
              href={s.fileUrl}
              target="_blank"
              className="text-blue-600 underline block mt-2"
            >
              📄 Voir le fichier
            </a>
          </div>

          {/* 🔔 FORMULAIRE DE NOTATION + NOTIFICATION */}
          <GradeAssignment
            submissionId={s.id}
            studentName={s.user.name ?? "Étudiant"}
            lessonName={s.lesson.title}
          />
        </div>
      ))}
    </div>
  );
}
