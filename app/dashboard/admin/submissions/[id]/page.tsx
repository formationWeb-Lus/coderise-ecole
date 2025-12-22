import { prisma } from "@/lib/prisma";
import SubmissionCorrectionForm from "./SubmissionCorrectionForm";

export default async function SubmissionDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const submissionId = Number(id);

  if (isNaN(submissionId)) {
    return <div className="p-6 text-red-600">ID de soumission invalide</div>;
  }

  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
    include: {
      user: { select: { name: true, email: true } },
      lesson: { select: { title: true } },
    },
  });

  if (!submission) {
    return <div className="p-6 text-red-600">Soumission introuvable</div>;
  }

  // ---------- FIX ICI ----------
  const fileUrl = submission.fileUrl.startsWith("/")
    ? submission.fileUrl
    : `/${submission.fileUrl}`;
  // ------------------------------

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Détail de la soumission #{submission.id}</h1>

      <div className="space-y-3 mb-6">
        <p><strong>Étudiant :</strong> {submission.user.name || submission.user.email}</p>
        <p><strong>Leçon :</strong> {submission.lesson.title}</p>
        <p><strong>Status actuel :</strong> {submission.status}</p>
        <p><strong>Envoyé le :</strong> {new Date(submission.createdAt).toLocaleString()}</p>
      </div>

      {fileUrl.endsWith(".pdf") && (
        <div className="mb-6 border p-2 rounded">
          <iframe
            src={fileUrl}
            width="100%"
            height="600px"
            className="border rounded"
          />
        </div>
      )}

      {/* ---------- FORMULAIRE DE CORRECTION ---------- */}
      <SubmissionCorrectionForm
        submissionId={submission.id}
        currentStatus={submission.status}
      />
    </div>
  );
}
