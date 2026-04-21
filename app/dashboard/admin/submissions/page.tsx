import { prisma } from "@/lib/prisma";
import { SubmissionStatus } from "@prisma/client";

export default async function AdminSubmissionsPage() {
  const submissions = await prisma.assignmentSubmission.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      lesson: true,
    },
  });

  const statusColors: Record<SubmissionStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    SUBMITTED: "bg-blue-100 text-blue-700",
    GRADED: "bg-green-100 text-green-700",
    LATE: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<SubmissionStatus, string> = {
    PENDING: "En attente",
    SUBMITTED: "Soumis",
    GRADED: "Noté",
    LATE: "En retard",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Soumissions des étudiants
      </h1>

      <p className="text-sm text-gray-500 mb-4">
        Total: {submissions.length}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border text-left text-sm">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-3">Étudiant</th>
              <th className="p-3">Leçon</th>
              <th className="p-3">Fichier</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Aucune soumission trouvée
                </td>
              </tr>
            ) : (
              submissions.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">

                  {/* 👤 USER */}
                  <td className="p-3">
                    {s.user?.name || s.user?.email || "Utilisateur inconnu"}
                  </td>

                  {/* 📘 LESSON */}
                  <td className="p-3">
                    {s.lesson?.title || "Leçon supprimée"}
                  </td>

                  {/* 📎 FILE */}
                  <td className="p-3">
                    {s.fileUrl ? (
                      <a
                        href={s.fileUrl}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Télécharger
                      </a>
                    ) : (
                      <span className="text-gray-400">
                        Aucun fichier
                      </span>
                    )}
                    


                  
                  
                  </td>

                  {/* 🔥 STATUS (PRO PRETTY) */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        statusColors[s.status]
                      }`}
                    >
                      {statusLabels[s.status]}
                    </span>
                  </td>

                  {/* 📅 DATE */}
                  <td className="p-3 text-gray-600">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>

                  {/* 🔗 ACTION */}
                  <td className="p-3">
                    <a
                      href={`/dashboard/admin/submissions/${s.id}`}
                      className="text-purple-600 underline"
                    >
                      Ouvrir
                    </a>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
