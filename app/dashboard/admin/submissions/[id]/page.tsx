import { prisma } from "@/lib/prisma";
import SubmissionCorrectionForm from "./SubmissionCorrectionForm";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const BUCKET = "assignment"; // 🔴 nom exact du bucket

export default async function SubmissionDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
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

  // ============================
  // 📎 URL SUPABASE PUBLIQUE DU FICHIER
  // ============================
  const fileUrl = submission.filePath
    ? `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${submission.filePath}`
    : null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Détail de la soumission #{submission.id}
      </h1>

      <div className="space-y-3 mb-6">
        <p>
          <strong>Étudiant :</strong>{" "}
          {submission.user.name || submission.user.email}
        </p>
        <p>
          <strong>Leçon :</strong> {submission.lesson.title}
        </p>
        <p>
          <strong>Status actuel :</strong> {submission.status}
        </p>
        <p>
          <strong>Envoyé le :</strong>{" "}
          {new Date(submission.createdAt).toLocaleString()}
        </p>
      </div>

      {/* 📄 APERÇU DU FICHIER PDF */}
      {fileUrl ? (
        <div className="mb-6 border p-2 rounded">
          <iframe
            src={fileUrl}
            width="100%"
            height="600px"
            className="border rounded"
          />
          <a
            href={fileUrl}
            target="_blank"
            className="block mt-2 text-blue-600 underline"
          >
            Télécharger le fichier
          </a>
        </div>
      ) : (
        <p className="text-red-500 mb-6">Aucun fichier soumis pour cette leçon.</p>
      )}

      {/* 📝 FORMULAIRE DE CORRECTION */}
      <SubmissionCorrectionForm
        submissionId={submission.id}
        currentStatus={submission.status}
      />
    </div>
  );
}
