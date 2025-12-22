import { prisma } from "@/lib/prisma";

export default async function AdminSubmissionsPage() {
  const submissions = await prisma.assignmentSubmission.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      lesson: { select: { title: true } },
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Soumissions des étudiants</h1>

      <table className="w-full border text-left">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2">Étudiant</th>
            <th className="p-2">Leçon</th>
            <th className="p-2">Fichier</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s.id} className="border-b">
              <td className="p-2">{s.user.name || s.user.email}</td>
              <td className="p-2">{s.lesson.title}</td>
              <td className="p-2">
                <a href={s.fileUrl} target="_blank" className="text-blue-600 underline">
                  Télécharger
                </a>
              </td>
              <td className="p-2">{s.status}</td>
              <td className="p-2">{new Date(s.createdAt).toLocaleString()}</td>
              <td className="p-2">
                <a
                  href={`/dashboard/admin/submissions/${s.id}`}
                  className="text-purple-600 underline"
                >
                  Ouvrir
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
